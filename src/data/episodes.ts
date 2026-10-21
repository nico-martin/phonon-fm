import { type Transcript, parseTranscript } from "../utils/transcript";

export interface Episode {
  id: string;
  show: string;
  number: number;
  title: string;
  url: string;
}

// Syntax transcript from https://syntax.fm (machine transcript, cleaned up by
// hand); all others from https://github.com/thechangelog/transcripts
// (CC BY-SA 4.0).
export const EPISODES: Array<Episode> = [
  {
    id: "syntax-740",
    show: "Syntax",
    number: 740,
    title: "Local AI Models in JavaScript with Xenova",
    url: "https://syntax.fm/show/740/local-ai-models-in-javascript-machine-learning-deep-dive-with-xenova",
  },
  {
    id: "js-party-304",
    show: "JS Party",
    number: 304,
    title: "From WebGL to WebGPU with Gregg Tavares",
    url: "https://changelog.com/jsparty/304",
  },
  {
    id: "practical-ai-179",
    show: "Practical AI",
    number: 179,
    title: "The AI community building the future with Merve Noyan",
    url: "https://changelog.com/practicalai/179",
  },
  {
    id: "practical-ai-174",
    show: "Practical AI",
    number: 174,
    title: "Quick, beautiful web UIs for ML apps with Abubakar Abid",
    url: "https://changelog.com/practicalai/174",
  },
  {
    id: "js-party-349",
    show: "JS Party",
    number: 349,
    title: "React: then & now with Tom Occhino & Shruti Kapoor",
    url: "https://changelog.com/jsparty/349",
  },
  {
    id: "the-changelog-449",
    show: "The Changelog",
    number: 449,
    title: "The story behind Inter with Rasmus Andersson",
    url: "https://changelog.com/podcast/449",
  },
];

const files = import.meta.glob<string>(
  ["./transcripts/*.md", "!**/README.md"],
  {
    query: "?raw",
    import: "default",
  }
);

const transcripts = new Map<string, Promise<Transcript>>();

export const getTranscript = (episode: Episode): Promise<Transcript> => {
  const cached = transcripts.get(episode.id);
  if (cached) return cached;
  const transcript =
    files[`./transcripts/${episode.id}.md`]().then(parseTranscript);
  transcripts.set(episode.id, transcript);
  return transcript;
};
