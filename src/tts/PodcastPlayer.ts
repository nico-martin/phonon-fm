import type { Sentence } from "../utils/transcript";
import {
  type PhononTTS,
  SAMPLE_RATE,
  loadVoice,
  synthesizeSentence,
} from "./phonon";

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

// One transcript sentence and its audio, until playback starts.
interface Segment {
  sentence: Sentence;
  voiceId: string;
  audio: Float32Array | null;
  playback: {
    start: number;
    previousEnd: number;
    previousSpeaker: string | null;
  } | null;
  cancelled: boolean;
}

// Schedule near playback time, but keep future starts cancellable.
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
  private sources = new Map<AudioBufferSourceNode, number>();
  private markers: Array<{
    time: number;
    sentence: number;
    voiceId: string;
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

  // Rewind to this speaker's next unplayed sentence, even if it was scheduled.
  setVoice = (speaker: string, voiceId: string) => {
    if (this.state.voices[speaker] === voiceId) return;
    const voices = { ...this.state.voices, [speaker]: voiceId };
    void loadVoice(voiceId).catch(console.error);
    const now = this.ctx?.currentTime ?? 0;
    const index = this.queue.findIndex(
      (segment) =>
        segment.sentence.speaker === speaker &&
        (!segment.playback || segment.playback.start > now)
    );
    if (index === -1) {
      this.update({ voices });
      return;
    }
    const dropped = this.queue.splice(index);
    dropped.forEach((segment) => (segment.cancelled = true));
    const { sentence, playback } = dropped[0];
    if (playback) {
      this.stopSourcesFrom(sentence.index);
      this.markers = this.markers.filter(
        (marker) => marker.sentence < sentence.index
      );
      this.nextTime = playback.previousEnd;
      this.lastSpeaker = playback.previousSpeaker;
    }
    this.cursor = sentence.index;
    this.update({
      voices,
      generatedUntil: Math.min(this.state.generatedUntil, this.cursor),
      bufferedSeconds: Math.round(this.bufferedSeconds() * 10) / 10,
    });
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

  private stopSourcesFrom(sentenceIndex: number) {
    for (const [source, index] of this.sources) {
      if (index < sentenceIndex) continue;
      source.onended = null;
      source.stop();
      this.sources.delete(source);
    }
  }

  private reset(sentenceIndex: number) {
    this.queue.forEach((segment) => (segment.cancelled = true));
    this.queue = [];
    this.stopSourcesFrom(0);
    this.markers = [];
    this.nextTime = 0;
    this.lastSpeaker = null;
    this.cursor = sentenceIndex;
    this.update({
      playingSentence: null,
      generatedUntil: sentenceIndex,
      generatingSentence: null,
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
      (sum, segment) => sum + (segment.audio?.length ?? 0),
      0
    );
    return Math.max(0, this.nextTime - now) + unscheduled / SAMPLE_RATE;
  }

  private async pump() {
    if (this.pumping || this.state.error) return;
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
          audio: null,
          playback: null,
          cancelled: false,
        };
        this.queue.push(segment);
        this.update({ generatingSentence: sentence.index });

        const start = performance.now();
        let audio: Float32Array;
        try {
          audio = await synthesizeSentence(
            this.tts,
            sentence.text,
            segment.voiceId
          );
        } catch (error) {
          if (segment.cancelled) continue;
          this.queue.pop();
          this.cursor = sentence.index;
          throw error;
        }
        if (segment.cancelled) continue;

        segment.audio = audio;
        const audioSeconds = audio.length / SAMPLE_RATE;
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

    while (this.queue[0]?.playback && this.queue[0].playback.start <= now) {
      this.queue.shift();
    }

    for (const segment of this.queue) {
      if (segment.playback) continue;
      if (!segment.audio || this.nextTime - now > SCHEDULE_AHEAD) return;

      const { speaker, index } = segment.sentence;
      const gap =
        this.lastSpeaker && this.lastSpeaker !== speaker ? TURN_GAP : 0;
      const start = Math.max(this.nextTime, now + 0.05) + gap;
      const buffer = ctx.createBuffer(1, segment.audio.length, SAMPLE_RATE);
      buffer.copyToChannel(segment.audio as Float32Array<ArrayBuffer>, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.analyser ?? ctx.destination);
      source.start(start);
      source.onended = () => this.sources.delete(source);
      this.sources.set(source, index);

      segment.playback = {
        start,
        previousEnd: this.nextTime,
        previousSpeaker: this.lastSpeaker,
      };
      segment.audio = null;
      this.markers.push({
        time: start,
        sentence: index,
        voiceId: segment.voiceId,
      });
      this.lastSpeaker = speaker;
      this.nextTime = start + buffer.duration;
    }
  }

  private tick = () => {
    if (!this.ctx || !this.active) return;
    this.schedule();
    void this.pump();

    const now = this.ctx.currentTime;
    const started = this.markers.filter((marker) => marker.time <= now);
    const current = started[started.length - 1];
    if (current) this.markers = this.markers.slice(started.length);

    const finished =
      this.cursor >= this.sentences.length &&
      this.queue.length === 0 &&
      !this.pumping &&
      now >= this.nextTime;

    this.update({
      playingSentence: current?.sentence ?? this.state.playingSentence,
      bufferedSeconds: Math.round(this.bufferedSeconds() * 10) / 10,
      ...(started.length > 0
        ? {
            spokenVoices: {
              ...this.state.spokenVoices,
              ...Object.fromEntries(
                started.map((marker) => [marker.sentence, marker.voiceId])
              ),
            },
          }
        : {}),
      ...(finished ? { status: "ended", playingSentence: null } : {}),
    });
  };
}
