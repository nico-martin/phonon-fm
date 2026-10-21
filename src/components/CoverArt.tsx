import type { Episode } from "../data/episodes";
import cn from "../utils/classnames";

interface CoverArtProps {
  episode: Episode;
  size?: "sm" | "lg";
  className?: string;
}

const SHOW_ART: Record<string, { gradient: string; label: string }> = {
  Syntax: {
    gradient: "from-yellow-200 via-yellow-300 to-yellow-500",
    label: "SX",
  },
  "JS Party": {
    gradient: "from-yellow-200 via-amber-400 to-orange-600",
    label: "JS",
  },
  "Practical AI": {
    gradient: "from-emerald-200 via-teal-400 to-cyan-700",
    label: "AI",
  },
  "The Changelog": {
    gradient: "from-lime-200 via-green-400 to-emerald-700",
    label: "CL",
  },
};

export default function CoverArt({
  episode,
  size = "sm",
  className = "",
}: CoverArtProps) {
  const art = SHOW_ART[episode.show] ?? SHOW_ART["The Changelog"];
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-end overflow-hidden bg-linear-to-br text-black shadow-lg",
        art.gradient,
        {
          "size-12 rounded-lg p-1.5": size === "sm",
          "size-20 rounded-2xl p-2.5 sm:size-24": size === "lg",
        },
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute -top-6 -right-6 size-[120%] opacity-25"
      >
        {[14, 26, 38, 50].map((r) => (
          <circle
            key={r}
            cx="70"
            cy="30"
            r={r}
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        ))}
      </svg>
      <span
        className={cn("relative font-display leading-none font-bold", {
          "text-sm": size === "sm",
          "text-3xl": size === "lg",
        })}
      >
        {art.label}
      </span>
      <span
        className={cn(
          "absolute top-1 right-1.5 font-display font-semibold opacity-70",
          { "text-[9px]": size === "sm", "text-xs": size === "lg" }
        )}
      >
        #{episode.number}
      </span>
    </div>
  );
}
