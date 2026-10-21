import { ExternalLink, Gauge, Pause, Play, RotateCcw } from "lucide-react";

import type { Episode } from "../../data/episodes";
import { getVoice } from "../../data/voices";
import type { PlayerState } from "../../tts/PodcastPlayer";
import cn from "../../utils/classnames";
import type { SpeakerStyle } from "../../utils/speakers";
import CoverArt from "../CoverArt";
import Visualizer from "./Visualizer";

interface NowPlayingProps {
  episode: Episode;
  state: PlayerState;
  speaker: string | null;
  speakerStyle: SpeakerStyle | null;
  getAnalyser: () => AnalyserNode | null;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  className?: string;
}

const MAX_BUFFER = 5;

export default function NowPlaying({
  episode,
  state,
  speaker,
  speakerStyle,
  getAnalyser,
  onPlay,
  onPause,
  onRestart,
  className = "",
}: NowPlayingProps) {
  const playing = state.status === "playing";
  const live = state.status === "playing" || state.status === "paused";
  const voice = speaker ? getVoice(state.voices[speaker]) : undefined;
  const color = speakerStyle?.hex ?? "#f5a524";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-5",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full opacity-20 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: color }}
        aria-hidden
      />

      <div className="relative flex items-center gap-4 sm:gap-5">
        <CoverArt episode={episode} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-display font-semibold tracking-wider uppercase transition",
                {
                  "bg-red-500/15 text-red-400": playing,
                  "bg-white/5 text-muted": !playing,
                }
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", {
                  "animate-pulse bg-red-500": playing,
                  "bg-muted": !playing,
                })}
              />
              On air
            </span>
            <a
              href={episode.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 text-muted hover:text-white"
            >
              {episode.show} #{episode.number}
              <ExternalLink className="size-3 opacity-0 transition group-hover:opacity-100" />
            </a>
          </div>
          <h1 className="mt-1 line-clamp-2 font-display text-lg leading-tight font-semibold sm:text-2xl">
            {episode.title}
          </h1>
          <p className="mt-1 truncate text-sm text-muted">
            {speaker && speakerStyle ? (
              <>
                <span className={speakerStyle.text}>{speaker}</span>
                {voice && <> speaking as {voice.name}</>}
              </>
            ) : state.status === "ended" ? (
              "That's the episode. Thanks for listening!"
            ) : (
              "Press play: speech starts streaming within a moment."
            )}
          </p>
        </div>
      </div>

      <Visualizer
        className="relative mt-4 h-14 w-full"
        getAnalyser={getAnalyser}
        color={color}
        active={playing}
      />

      <div className="relative mt-4 flex items-center gap-3">
        <button
          onClick={playing ? onPause : onPlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-black shadow-lg shadow-accent/30 transition hover:scale-105 hover:bg-accent-strong active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
        >
          {playing ? (
            <Pause className="size-6 fill-current" />
          ) : (
            <Play className="ml-0.5 size-6 fill-current" />
          )}
        </button>
        <button
          onClick={onRestart}
          aria-label="Restart episode"
          title="Restart episode"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-white/5 text-muted transition hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <RotateCcw className="size-5" />
        </button>

        <div className="ml-auto flex items-center gap-5 text-xs text-muted tabular-nums">
          <div className="hidden w-36 sm:block">
            <div className="mb-1 flex justify-between">
              <span>Generated ahead</span>
              <span className="text-white">
                {live ? `${state.bufferedSeconds.toFixed(1)}s` : "–"}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-accent to-amber-200 transition-[width] duration-150"
                style={{
                  width: `${live ? Math.min(100, (state.bufferedSeconds / MAX_BUFFER) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4" />
            <div>
              <div className="font-display text-base leading-none font-semibold text-white">
                {state.realtimeFactor === null
                  ? "–"
                  : `${(1 / state.realtimeFactor).toFixed(1)}×`}
              </div>
              <div>real time</div>
            </div>
          </div>
        </div>
      </div>

      {state.error && (
        <p className="relative mt-3 rounded-lg bg-rose-500/10 p-2 text-sm text-rose-300">
          {state.error}
        </p>
      )}
    </section>
  );
}
