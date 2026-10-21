import { getVoice } from "../../data/voices";
import { Avatar, Equalizer } from "../../theme";
import cn from "../../utils/classnames";
import type { SpeakerStyle } from "../../utils/speakers";
import VoiceSelect from "./VoiceSelect";

interface CastCardProps {
  speaker: string;
  style: SpeakerStyle;
  voiceId: string;
  speaking: boolean;
  onVoiceChange: (voiceId: string) => void;
  className?: string;
}

export default function CastCard({
  speaker,
  style,
  voiceId,
  speaking,
  onVoiceChange,
  className = "",
}: CastCardProps) {
  const voice = getVoice(voiceId);

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-surface/80 p-3.5 backdrop-blur-xl transition duration-300",
        {
          [`${style.border} shadow-lg`]: speaking,
          "border-line": !speaking,
        },
        className
      )}
      style={speaking ? { boxShadow: `0 8px 32px -12px ${style.hex}` } : {}}
    >
      <div className="mb-3 flex items-center gap-3">
        <Avatar
          name={speaker}
          color={style.bg}
          ring={style.ring}
          active={speaking}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{speaker}</p>
          <p
            className={cn("flex h-4 items-center gap-1.5 text-xs", {
              [style.text]: speaking,
              "text-muted": !speaking,
            })}
          >
            {speaking && <Equalizer color={style.bg} />}
            {speaking ? "Speaking" : "Waiting for their turn"}
          </p>
        </div>
      </div>
      {/* Keyed by voice so the flash replays on every change. */}
      <div key={voiceId} className="animate-voice-swap rounded-lg">
        <VoiceSelect
          label={`Voice for ${speaker}`}
          value={voiceId}
          onChange={onVoiceChange}
        />
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
        {voice?.description}
      </p>
    </div>
  );
}
