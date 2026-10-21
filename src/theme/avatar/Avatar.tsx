import cn from "../../utils/classnames";
import { initials } from "../../utils/speakers";

interface AvatarProps {
  name: string;
  color: string;
  ring?: string;
  active?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function Avatar({
  name,
  color,
  ring = "",
  active = false,
  size = "md",
  className = "",
}: AvatarProps) {
  return (
    // Fixed size on the wrapper: as a flex item it would otherwise stretch to
    // its row's height, and the ping ring with it.
    <span
      className={cn(
        "relative inline-flex shrink-0 self-start",
        {
          "size-8 text-[11px]": size === "sm",
          "size-10 text-xs": size === "md",
        },
        className
      )}
    >
      {active && (
        <span
          className={cn(
            "absolute inset-0 animate-ping rounded-full opacity-40",
            color
          )}
        />
      )}
      <span
        className={cn(
          "relative flex size-full items-center justify-center rounded-full font-display font-bold text-black ring-offset-2 ring-offset-surface transition",
          color,
          { [`ring-2 ${ring}`]: active }
        )}
      >
        {initials(name)}
      </span>
    </span>
  );
}
