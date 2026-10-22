import type { Sentence } from "../utils/transcript";
import { type PhononTTS, SAMPLE_RATE, loadVoice, streamSpeech } from "./phonon";

export type PlayerStatus = "idle" | "playing" | "paused" | "ended";

export interface PlayerState {
  status: PlayerStatus;
  // Sentence currently audible.
  playingSentence: number | null;
  // Sentences before this index (and from playingSentence on) have audio ready.
  generatedUntil: number;
  generatingSentence: number | null;
  bufferedSeconds: number;
  // Seconds of compute per second of audio; below 1 is faster than real time.
  realtimeFactor: number | null;
  error: string | null;
  voices: Record<string, string>;
  // Voice each sentence was actually spoken in, by sentence index.
  spokenVoices: Record<number, string>;
}

interface Segment {
  sentence: Sentence;
  voiceId: string;
  chunks: Array<Float32Array>;
  scheduled: number;
  done: boolean;
  cancelled: boolean;
}

// Audio handed to the Web Audio graph can't be taken back, so keep that short
// and hold the rest in the queue, where a voice change can still replace it.
const SCHEDULE_AHEAD = 0.3;
const GENERATE_AHEAD = 5;
const TURN_GAP = 0.3;
const TICK_MS = 100;

const INITIAL_STATE: PlayerState = {
  status: "idle",
  playingSentence: null,
  generatedUntil: 0,
  generatingSentence: null,
  bufferedSeconds: 0,
  realtimeFactor: null,
  error: null,
  voices: {},
  spokenVoices: {},
};

export default class PodcastPlayer {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private queue: Array<Segment> = [];
  private sources = new Set<AudioBufferSourceNode>();
  private markers: Array<{
    time: number;
    sentence: number;
    voiceId: string;
    spoken: boolean;
  }> = [];
  private nextTime = 0;
  private lastSpeaker: string | null = null;
  private cursor = 0;
  private pumping = false;
  private timer: number | null = null;
  private listeners = new Set<() => void>();
  private state: PlayerState;

  constructor(
    private tts: PhononTTS,
    private sentences: Array<Sentence>,
    voices: Record<string, string>
  ) {
    this.state = { ...INITIAL_STATE, voices };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  getAnalyser = () => this.analyser;

  play = async () => {
    if (this.state.status === "ended") this.reset(0);
    if (!this.ctx) {
      this.ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.75;
      this.analyser.connect(this.ctx.destination);
    }
    await this.ctx.resume();
    this.timer ??= window.setInterval(this.tick, TICK_MS);
    this.update({ status: "playing", error: null });
    void this.pump();
  };

  pause = async () => {
    await this.ctx?.suspend();
    this.update({ status: "paused" });
  };

  seek = (sentenceIndex: number) => {
    this.reset(sentenceIndex);
    void this.play();
  };

  // Drop queued audio for this speaker that hasn't started playing, so their
  // next sentence is generated with the new voice.
  setVoice = (speaker: string, voiceId: string) => {
    this.update({ voices: { ...this.state.voices, [speaker]: voiceId } });
    void loadVoice(this.tts, voiceId).catch(console.error);
    const index = this.queue.findIndex(
      (segment) =>
        segment.sentence.speaker === speaker && segment.scheduled === 0
    );
    if (index === -1) return;
    const dropped = this.queue.splice(index);
    dropped.forEach((segment) => (segment.cancelled = true));
    this.cursor = dropped[0].sentence.index;
    this.update({ generatedUntil: this.cursor });
    void this.pump();
  };

  stop = () => {
    this.reset(0);
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    void this.ctx?.close();
    this.ctx = null;
    this.analyser = null;
    this.update({
      ...INITIAL_STATE,
      realtimeFactor: this.state.realtimeFactor,
      voices: this.state.voices,
    });
  };

  private reset(sentenceIndex: number) {
    this.queue.forEach((segment) => (segment.cancelled = true));
    this.queue = [];
    this.sources.forEach((source) => {
      source.onended = null;
      source.stop();
    });
    this.sources.clear();
    this.markers = [];
    this.nextTime = 0;
    this.lastSpeaker = null;
    this.cursor = sentenceIndex;
    this.update({
      playingSentence: null,
      generatedUntil: sentenceIndex,
      bufferedSeconds: 0,
    });
  }

  private update(partial: Partial<PlayerState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener());
  }

  private get active() {
    return this.state.status === "playing" || this.state.status === "paused";
  }

  private bufferedSeconds() {
    const now = this.ctx?.currentTime ?? 0;
    const unscheduled = this.queue.reduce(
      (sum, segment) =>
        sum +
        segment.chunks
          .slice(segment.scheduled)
          .reduce((n, chunk) => n + chunk.length, 0),
      0
    );
    return Math.max(0, this.nextTime - now) + unscheduled / SAMPLE_RATE;
  }

  private async pump() {
    if (this.pumping) return;
    this.pumping = true;
    try {
      while (
        this.active &&
        this.cursor < this.sentences.length &&
        this.bufferedSeconds() < GENERATE_AHEAD
      ) {
        const sentence = this.sentences[this.cursor++];
        const segment: Segment = {
          sentence,
          voiceId: this.state.voices[sentence.speaker],
          chunks: [],
          scheduled: 0,
          done: false,
          cancelled: false,
        };
        this.queue.push(segment);
        this.update({ generatingSentence: sentence.index });

        const start = performance.now();
        for await (const frame of streamSpeech(
          this.tts,
          sentence.text,
          segment.voiceId
        )) {
          // Leaving the loop stops generation of a sentence no longer wanted.
          if (segment.cancelled) break;
          segment.chunks.push(frame);
          this.schedule();
        }
        segment.done = true;
        if (segment.cancelled) continue;

        const audioSeconds =
          segment.chunks.reduce((n, chunk) => n + chunk.length, 0) /
          SAMPLE_RATE;
        const factor = (performance.now() - start) / 1000 / audioSeconds;
        const previous = this.state.realtimeFactor;
        this.update({
          generatedUntil: this.cursor,
          realtimeFactor:
            previous === null ? factor : previous * 0.8 + factor * 0.2,
        });
        this.schedule();
      }
    } catch (error) {
      console.error(error);
      this.update({
        status: "paused",
        error: error instanceof Error ? error.message : String(error),
      });
      await this.ctx?.suspend();
    } finally {
      this.pumping = false;
      this.update({ generatingSentence: null });
    }
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    while (
      this.queue[0]?.done &&
      this.queue[0].scheduled === this.queue[0].chunks.length
    ) {
      this.queue.shift();
    }

    for (const segment of this.queue) {
      while (segment.scheduled < segment.chunks.length) {
        if (this.nextTime - now > SCHEDULE_AHEAD) return;
        if (segment.scheduled === 0) {
          const gap =
            this.lastSpeaker && this.lastSpeaker !== segment.sentence.speaker
              ? TURN_GAP
              : 0;
          this.nextTime = Math.max(this.nextTime, now + 0.05) + gap;
          this.markers.push({
            time: this.nextTime,
            sentence: segment.sentence.index,
            voiceId: segment.voiceId,
            spoken: false,
          });
          this.lastSpeaker = segment.sentence.speaker;
        } else if (this.nextTime < now) {
          // Generation fell behind playback; resume as soon as possible.
          this.nextTime = now + 0.02;
        }

        const chunk = segment.chunks[segment.scheduled++];
        const buffer = ctx.createBuffer(1, chunk.length, SAMPLE_RATE);
        buffer.copyToChannel(chunk as Float32Array<ArrayBuffer>, 0);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.analyser ?? ctx.destination);
        source.start(this.nextTime);
        source.onended = () => this.sources.delete(source);
        this.sources.add(source);
        this.nextTime += buffer.duration;
      }
      if (!segment.done) return;
    }
  }

  private tick = () => {
    if (!this.ctx || !this.active) return;
    this.schedule();
    void this.pump();

    const now = this.ctx.currentTime;
    const started = this.markers.filter((marker) => marker.time <= now);
    const current = started[started.length - 1];
    if (current) this.markers = this.markers.slice(started.length - 1);
    const newlySpoken = started.filter((marker) => !marker.spoken);
    newlySpoken.forEach((marker) => (marker.spoken = true));

    const finished =
      this.cursor >= this.sentences.length &&
      this.queue.length === 0 &&
      !this.pumping &&
      now >= this.nextTime;

    this.update({
      playingSentence: current?.sentence ?? this.state.playingSentence,
      bufferedSeconds: Math.round(this.bufferedSeconds() * 10) / 10,
      ...(newlySpoken.length > 0
        ? {
            spokenVoices: {
              ...this.state.spokenVoices,
              ...Object.fromEntries(
                newlySpoken.map((marker) => [marker.sentence, marker.voiceId])
              ),
            },
          }
        : {}),
      ...(finished ? { status: "ended", playingSentence: null } : {}),
    });
  };
}
