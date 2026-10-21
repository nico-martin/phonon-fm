import { use } from "react";

import { type Episode, getTranscript } from "../../data/episodes";
import usePodcastPlayer from "../../hooks/usePodcastPlayer";
import type { PhononTTS } from "../../tts/phonon";
import cn from "../../utils/classnames";
import { speakerStyle } from "../../utils/speakers";
import Cast from "./Cast";
import NowPlaying from "./NowPlaying";
import TranscriptView from "./TranscriptView";

interface EpisodePlayerProps {
  tts: PhononTTS;
  episode: Episode;
  className?: string;
}

export default function EpisodePlayer({
  tts,
  episode,
  className = "",
}: EpisodePlayerProps) {
  const transcript = use(getTranscript(episode));
  const { player, state } = usePodcastPlayer(tts, transcript);
  const speaker =
    state.playingSentence === null
      ? null
      : transcript.sentences[state.playingSentence].speaker;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-6 xl:grid-cols-[minmax(0,1fr)_300px]",
        className
      )}
    >
      <div className="sticky top-0 z-10 -mx-2 bg-linear-to-b from-bg via-bg/95 to-transparent px-2 pt-4 pb-6 xl:col-start-1">
        <NowPlaying
          episode={episode}
          state={state}
          speaker={speaker}
          speakerStyle={
            speaker ? speakerStyle(transcript.speakers, speaker) : null
          }
          getAnalyser={player.getAnalyser}
          onPlay={player.play}
          onPause={player.pause}
          onRestart={() => player.seek(0)}
        />
      </div>

      <div className="xl:col-start-2 xl:row-span-2 xl:row-start-1">
        <Cast
          className="pt-4 pb-6 xl:sticky xl:top-0"
          speakers={transcript.speakers}
          voices={state.voices}
          speakingNow={speaker}
          onVoiceChange={player.setVoice}
        />
      </div>

      <TranscriptView
        className="space-y-1 pb-32 xl:col-start-1"
        transcript={transcript}
        state={state}
        onSeek={player.seek}
      />
    </div>
  );
}
