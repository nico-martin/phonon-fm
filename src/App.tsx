import { AudioLines } from "lucide-react";
import { Suspense, useState } from "react";

import EpisodeList from "./components/EpisodeList";
import ModelLoader from "./components/ModelLoader";
import EpisodePlayer from "./components/episode/EpisodePlayer";
import { EPISODES } from "./data/episodes";
import { GithubIcon } from "./theme";
import type { PhononTTS } from "./tts/phonon";

const GITHUB_URL = "https://github.com/nico-martin/phonon-fm";

const Backdrop = () => (
  <div
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    aria-hidden
  >
    <div className="absolute -top-48 -left-40 size-[38rem] rounded-full bg-amber-500/10 blur-3xl" />
    <div className="absolute top-1/3 -right-48 size-[34rem] rounded-full bg-violet-600/10 blur-3xl" />
    <div className="absolute -bottom-48 left-1/3 size-[30rem] rounded-full bg-sky-500/[0.07] blur-3xl" />
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_70%)] bg-size-[24px_24px]" />
  </div>
);

export default function App() {
  const [tts, setTts] = useState<PhononTTS | null>(null);
  const [episode, setEpisode] = useState(EPISODES[0]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 sm:px-6">
      <Backdrop />
      <header className="flex items-center gap-3 py-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-300 to-orange-500 text-black shadow-lg shadow-accent/20">
          <AudioLines className="size-5" />
        </span>
        <div>
          <p className="font-display text-lg leading-none font-bold tracking-tight">
            Phonon FM
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Tech podcasts, recast live in your browser
          </p>
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-sm text-muted transition hover:border-white/20 hover:text-white"
        >
          <GithubIcon className="size-4" />
          <span className="hidden sm:inline">Source on GitHub</span>
        </a>
      </header>

      {tts ? (
        <main className="flex flex-1 animate-fade-up flex-col gap-x-8 lg:flex-row">
          <EpisodeList
            className="pt-4 lg:sticky lg:top-0 lg:max-h-screen lg:w-72 lg:shrink-0 lg:self-start lg:overflow-y-auto"
            episodes={EPISODES}
            selectedId={episode.id}
            onSelect={setEpisode}
          />
          <Suspense
            fallback={
              <p className="pt-6 text-sm text-muted">Loading transcript…</p>
            }
          >
            <EpisodePlayer
              key={episode.id}
              className="min-w-0 flex-1"
              tts={tts}
              episode={episode}
            />
          </Suspense>
        </main>
      ) : (
        <main className="flex flex-1 items-center py-16">
          <ModelLoader
            className="w-full"
            // The pipeline is callable: wrap it so React stores it instead of
            // treating it as a state updater function.
            onLoaded={(loaded) => setTts(() => loaded)}
          />
        </main>
      )}

      <footer className="border-t border-line py-5 text-xs leading-relaxed text-muted">
        Speech by{" "}
        <a
          className="underline decoration-white/20 underline-offset-2 hover:text-white"
          href="https://huggingface.co/onnx-community/phonon-31m-en-ONNX"
          target="_blank"
          rel="noreferrer"
        >
          Phonon 31M
        </a>{" "}
        from Gradium, running with Transformers.js on WebGPU. Transcripts by{" "}
        <a
          className="underline decoration-white/20 underline-offset-2 hover:text-white"
          href="https://syntax.fm"
          target="_blank"
          rel="noreferrer"
        >
          Syntax
        </a>{" "}
        and{" "}
        <a
          className="underline decoration-white/20 underline-offset-2 hover:text-white"
          href="https://github.com/thechangelog/transcripts"
          target="_blank"
          rel="noreferrer"
        >
          Changelog Media
        </a>{" "}
        (licensed{" "}
        <a
          className="underline decoration-white/20 underline-offset-2 hover:text-white"
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-SA 4.0
        </a>
        ). The voices are synthetic and are not the hosts' real voices.{" "}
        <a
          className="underline decoration-white/20 underline-offset-2 hover:text-white"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          Source on GitHub
        </a>
        .
      </footer>
    </div>
  );
}
