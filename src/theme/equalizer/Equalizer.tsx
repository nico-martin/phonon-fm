import cn from "../../utils/classnames";

interface EqualizerProps {
  color?: string;
  bars?: number;
  className?: string;
}

export default function Equalizer({
  color = "bg-accent",
  bars = 3,
  className = "",
}: EqualizerProps) {
  return (
    <span className={cn("flex h-3.5 items-end gap-0.5", className)} aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-full w-0.5 origin-bottom animate-pulse-bar rounded-full",
            color
          )}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
