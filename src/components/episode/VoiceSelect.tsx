import { ENGLISH_LOCALES, LOCALE_LABELS, VOICES } from "../../data/voices";
import { Select } from "../../theme";

interface VoiceSelectProps {
  value: string;
  onChange: (voiceId: string) => void;
  label: string;
  className?: string;
}

const groups = Object.entries(LOCALE_LABELS).map(([locale, label]) => ({
  label: ENGLISH_LOCALES.includes(locale as keyof typeof LOCALE_LABELS)
    ? label
    : `${label} (experimental)`,
  voices: VOICES.filter((voice) => voice.locale === locale),
}));

export default function VoiceSelect({
  value,
  onChange,
  label,
  className = "",
}: VoiceSelectProps) {
  return (
    <Select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={className}
    >
      {groups.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.gender ? `${voice.name} · ${voice.gender}` : voice.name}
            </option>
          ))}
        </optgroup>
      ))}
    </Select>
  );
}
