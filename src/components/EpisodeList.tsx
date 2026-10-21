import type { Episode } from "../data/episodes";
import cn from "../utils/classnames";
import CoverArt from "./CoverArt";

interface EpisodeListProps {
  episodes: Array<Episode>;
  selectedId: string | null;
  onSelect: (episode: Episode) => void;
  className?: string;
}

export default function EpisodeList({
  episodes,
  selectedId,
  onSelect,
  className = "",
}: EpisodeListProps) {
  return (
    <nav className={className} aria-label="Episodes">
      <h2 className="mb-3 px-1 font-display text-sm font-semibold tracking-wider text-muted uppercase">
        Episodes
      </h2>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {episodes.map((episode) => {
          const selected = episode.id === selectedId;
          return (
            <li key={episode.id} className="w-64 shrink-0 lg:w-auto">
              <button
                onClick={() => onSelect(episode)}
                aria-current={selected}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-2.5 text-left transition",
                  {
                    "border-accent/40 bg-accent/10 shadow-lg shadow-accent/5":
                      selected,
                    "border-transparent hover:border-line hover:bg-white/[0.03]":
                      !selected,
                  }
                )}
              >
                <CoverArt episode={episode} />
                <span className="min-w-0">
                  <span className="block text-xs text-muted">
                    {episode.show}
                  </span>
                  <span className="line-clamp-2 text-sm leading-snug font-medium">
                    {episode.title}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
