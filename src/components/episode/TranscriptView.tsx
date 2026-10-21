import { useEffect, useRef } from "react";

import { getVoice } from "../../data/voices";
import type { PlayerState } from "../../tts/PodcastPlayer";
import { speakerStyle } from "../../utils/speakers";
import type { Transcript } from "../../utils/transcript";
import TurnView from "./TurnView";

interface TranscriptViewProps {
  transcript: Transcript;
  state: PlayerState;
  onSeek: (sentenceIndex: number) => void;
  className?: string;
}

const inTurn = (sentenceIndex: number | null, first: number, last: number) =>
  sentenceIndex !== null && sentenceIndex >= first && sentenceIndex <= last
    ? sentenceIndex
    : null;

export default function TranscriptView({
  transcript,
  state,
  onSeek,
  className = "",
}: TranscriptViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const activeTurn =
    state.playingSentence === null
      ? null
      : transcript.sentences[state.playingSentence].turnIndex;

  useEffect(() => {
    if (activeTurn === null) return;
    container.current
      ?.querySelector(`[data-turn="${activeTurn}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeTurn]);

  return (
    <div ref={container} className={className}>
      {transcript.turns.map((turn) => {
        const first = turn.sentences[0].index;
        const last = turn.sentences[turn.sentences.length - 1].index;
        // Only pass sentence indices that touch this turn, so memoized turns
        // elsewhere in the transcript skip re-rendering.
        const playing = inTurn(state.playingSentence, first, last);
        const ready =
          state.playingSentence !== null &&
          state.playingSentence <= last &&
          state.generatedUntil > first
            ? Math.min(state.generatedUntil, last + 1)
            : 0;
        // Show the voice the turn was actually spoken in, once it has played.
        const voiceId = state.spokenVoices[first] ?? state.voices[turn.speaker];
        return (
          <div key={turn.index} data-turn={turn.index}>
            <TurnView
              turn={turn}
              style={speakerStyle(transcript.speakers, turn.speaker)}
              voiceName={getVoice(voiceId)?.name ?? ""}
              played={
                activeTurn !== null &&
                turn.index < activeTurn &&
                first in state.spokenVoices
              }
              playingSentence={
                playing ?? (ready ? state.playingSentence : null)
              }
              readyUntil={ready}
              generatingSentence={inTurn(state.generatingSentence, first, last)}
              onSeek={onSeek}
            />
          </div>
        );
      })}
    </div>
  );
}
