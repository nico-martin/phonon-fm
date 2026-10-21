import { Sparkles } from "lucide-react";

import { speakerStyle } from "../../utils/speakers";
import CastCard from "./CastCard";

interface CastProps {
  speakers: Array<string>;
  voices: Record<string, string>;
  speakingNow: string | null;
  onVoiceChange: (speaker: string, voiceId: string) => void;
  className?: string;
}

export default function Cast({
  speakers,
  voices,
  speakingNow,
  onVoiceChange,
  className = "",
}: CastProps) {
  return (
    <section className={className} aria-label="Cast">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="font-display text-sm font-semibold tracking-wider text-muted uppercase">
          Cast
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {speakers.map((speaker) => (
          <CastCard
            key={speaker}
            speaker={speaker}
            style={speakerStyle(speakers, speaker)}
            voiceId={voices[speaker]}
            speaking={speaker === speakingNow}
            onVoiceChange={(voiceId) => onVoiceChange(speaker, voiceId)}
          />
        ))}
      </div>
      <p className="mt-3 flex gap-2 px-1 text-xs leading-relaxed text-muted">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
        Recast anyone, any time. The new voice takes over from that speaker's
        next sentence, generated on the fly.
      </p>
    </section>
  );
}
