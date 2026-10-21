import { Cpu, Download, Radio, Zap } from "lucide-react";
import { useState } from "react";

import { Button, ProgressBar } from "../theme";
import { type LoadProgress, type PhononTTS, loadPhonon } from "../tts/phonon";

interface ModelLoaderProps {
  onLoaded: (tts: PhononTTS) => void;
  className?: string;
}

const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;

const FEATURES = [
  { icon: Radio, label: "Streams in 80 ms frames" },
  { icon: Zap, label: "WebGPU · fp32" },
  { icon: Cpu, label: "100% on device" },
];

// Deterministic pseudo-random bar heights for the hero waveform.
const WAVE = Array.from(
  { length: 48 },
  (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))
);

export default function ModelLoader({
  onLoaded,
  className = "",
}: ModelLoaderProps) {
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasWebGPU = "gpu" in navigator;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      onLoaded(await loadPhonon(setProgress));
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="mx-auto max-w-2xl animate-fade-up text-center">
        <div className="mx-auto mb-8 flex h-20 items-center justify-center gap-1">
          {WAVE.map((height, i) => (
            <span
              key={i}
              className="w-1 animate-pulse-bar rounded-full bg-linear-to-t from-accent to-amber-200"
              style={{
                height: `${height * 100}%`,
                animationDuration: `${0.8 + (i % 5) * 0.15}s`,
                animationDelay: `${(i % 7) * -0.13}s`,
              }}
            />
          ))}
        </div>

        <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
          Every voice,{" "}
          <span className="bg-linear-to-r from-accent via-amber-200 to-orange-400 bg-clip-text text-transparent">
            on your device.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted">
          Tech podcasts read aloud by Phonon, a 31M parameter text-to-speech
          model running in your browser. Recast any host or guest mid-episode
          and hear the new voice the next time they speak.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {FEATURES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-muted"
            >
              <Icon className="size-3.5 text-accent" />
              {label}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-sm">
          {!hasWebGPU && (
            <p className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-300">
              This browser does not support WebGPU. Try a recent Chrome, Edge or
              Safari.
            </p>
          )}

          {loading ? (
            <div className="space-y-2">
              <ProgressBar
                value={progress ? (progress.loaded / progress.total) * 100 : 0}
              />
              <p className="text-xs text-muted tabular-nums">
                {progress && progress.loaded < progress.total
                  ? `Downloading ${formatMb(progress.loaded)} of ${formatMb(progress.total)}`
                  : "Warming up the model on your GPU…"}
              </p>
            </div>
          ) : (
            <Button
              className="px-6 py-3 text-base shadow-xl shadow-accent/20"
              onClick={load}
              disabled={!hasWebGPU}
            >
              <Download className="size-4" />
              Load model · 165 MB
            </Button>
          )}

          {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
          <p className="mt-4 text-xs text-muted">
            Downloaded once, then cached by your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
