const SPEAKER_STYLES = [
  {
    text: "text-amber-300",
    bg: "bg-amber-300",
    border: "border-amber-300",
    ring: "ring-amber-300/60",
    hex: "#fcd34d",
  },
  {
    text: "text-sky-300",
    bg: "bg-sky-300",
    border: "border-sky-300",
    ring: "ring-sky-300/60",
    hex: "#7dd3fc",
  },
  {
    text: "text-emerald-300",
    bg: "bg-emerald-300",
    border: "border-emerald-300",
    ring: "ring-emerald-300/60",
    hex: "#6ee7b7",
  },
  {
    text: "text-rose-300",
    bg: "bg-rose-300",
    border: "border-rose-300",
    ring: "ring-rose-300/60",
    hex: "#fda4af",
  },
  {
    text: "text-violet-300",
    bg: "bg-violet-300",
    border: "border-violet-300",
    ring: "ring-violet-300/60",
    hex: "#c4b5fd",
  },
] as const;

export type SpeakerStyle = (typeof SPEAKER_STYLES)[number];

export const speakerStyle = (
  speakers: Array<string>,
  speaker: string
): SpeakerStyle =>
  SPEAKER_STYLES[
    Math.max(0, speakers.indexOf(speaker)) % SPEAKER_STYLES.length
  ];

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
