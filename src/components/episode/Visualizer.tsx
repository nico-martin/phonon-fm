import { useEffect, useRef } from "react";

interface VisualizerProps {
  getAnalyser: () => AnalyserNode | null;
  color: string;
  active: boolean;
  className?: string;
}

const BARS = 72;
// Speech energy sits in the lower part of the spectrum.
const USED_BINS = 40;

export default function Visualizer({
  getAnalyser,
  color,
  active,
  className = "",
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const data = new Uint8Array(128);
    const levels = new Float32Array(BARS);
    let frame = 0;

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio;
      if (canvas.width !== Math.round(width * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const analyser = getAnalyser();
      if (analyser && active) analyser.getByteFrequencyData(data);
      else data.fill(0);

      const gap = 3;
      const barWidth = (width - gap * (BARS - 1)) / BARS;
      context.fillStyle = color;
      for (let i = 0; i < BARS; i++) {
        // Mirror around the center: low frequencies in the middle.
        const distance = Math.abs(i - (BARS - 1) / 2) / (BARS / 2);
        const target = data[Math.floor(distance * USED_BINS)] / 255;
        levels[i] += (target - levels[i]) * 0.35;
        const barHeight = Math.max(3, levels[i] * height);
        context.globalAlpha = 0.25 + levels[i] * 0.75;
        context.beginPath();
        context.roundRect(
          i * (barWidth + gap),
          (height - barHeight) / 2,
          barWidth,
          barHeight,
          barWidth / 2
        );
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [getAnalyser, color, active]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
