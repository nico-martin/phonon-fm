import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

import cn from "../../utils/classnames";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export default function Select({
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        className="w-full cursor-pointer appearance-none rounded-lg border border-line bg-surface-raised py-2 pr-9 pl-3 text-sm transition hover:border-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
