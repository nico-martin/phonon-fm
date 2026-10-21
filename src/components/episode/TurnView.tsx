import { memo } from "react";

import { Avatar } from "../../theme";
import cn from "../../utils/classnames";
import type { SpeakerStyle } from "../../utils/speakers";
import type { Turn } from "../../utils/transcript";

interface TurnViewProps {
  turn: Turn;
  style: SpeakerStyle;
  voiceName: string;
  played: boolean;
  playingSentence: number | null;
  readyUntil: number;
  generatingSentence: number | null;
  onSeek: (sentenceIndex: number) => void;
  className?: string;
}

function TurnView({
  turn,
  style,
  voiceName,
  played,
  playingSentence,
  readyUntil,
  generatingSentence,
  onSeek,
  className = "",
}: TurnViewProps) {
  const active = turn.sentences.some((s) => s.index === playingSentence);

  return (
    <article
      className={cn(
        "flex gap-3 rounded-2xl border px-3 py-3 transition duration-300 sm:gap-4 sm:px-4",
        {
          "border-line bg-surface/80 shadow-xl shadow-black/30 backdrop-blur-xl":
            active,
          "border-transparent": !active,
          "opacity-50 hover:opacity-100": played && !active,
        },
        className
      )}
    >
      <Avatar
        name={turn.speaker}
        color={style.bg}
        ring={style.ring}
        active={active}
        size="sm"
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <header className="mb-1 flex flex-wrap items-baseline gap-x-2">
          <h3 className={cn("text-sm font-semibold", style.text)}>
            {turn.speaker}
          </h3>
          <span className="text-xs text-muted">as {voiceName}</span>
        </header>
        <p className="leading-relaxed text-zinc-400">
          {turn.sentences.map((sentence) => {
            const playing = sentence.index === playingSentence;
            const ready =
              playingSentence !== null &&
              sentence.index > playingSentence &&
              sentence.index < readyUntil;
            const generating = sentence.index === generatingSentence;
            return (
              <span
                key={sentence.index}
                onClick={() => onSeek(sentence.index)}
                title="Play from here"
                className={cn(
                  "cursor-pointer rounded-md decoration-accent/70 decoration-2 underline-offset-4 transition-colors box-decoration-clone hover:text-white",
                  {
                    "bg-accent/20 text-white": playing,
                    "text-zinc-200": ready,
                    "underline decoration-dotted": generating,
                  }
                )}
              >
                {sentence.text}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </article>
  );
}

export default memo(TurnView);
