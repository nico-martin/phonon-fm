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
  const activeSentence = state.playingSentence;
  const activeTurn =
    activeSentence === null
      ? null
      : transcript.sentences[activeSentence].turnIndex;

  useEffect(() => {
    if (activeSentence === null) return;
    container.current
      ?.querySelector(`[data-sentence="${activeSentence}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeSentence]);

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
        // The voice can change mid-turn; show the one playing now.
        const voiceId =
          state.spokenVoices[playing ?? first] ?? state.voices[turn.speaker];
        return (
          <div key={turn.index}>
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
