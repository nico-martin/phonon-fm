export interface Sentence {
  index: number;
  turnIndex: number;
  speaker: string;
  text: string;
}

export interface Turn {
  index: number;
  speaker: string;
  sentences: Array<Sentence>;
}

export interface Transcript {
  speakers: Array<string>;
  turns: Array<Turn>;
  sentences: Array<Sentence>;
}

// Short segments keep voice changes and transcript highlighting responsive.
const MAX_WORDS = 28;

const SPEAKER_LINE = /^\*\*([^*]+?):\*\*\s*(.*)$/s;

export const cleanText = (text: string): string =>
  text
    .replace(/\\\[[^\]]*\\\]/g, " ") // [laughter], [00:12:34], [unintelligible]
    .replace(/\S*\\\]/g, " ") // stray closing brackets from source typos
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // markdown links
    .replace(/\\(.)/g, "$1")
    .replace(/[*_]+/g, "")
    .replace(/\s+--\s+|--/g, ", ")
    .replace(/…/g, "...")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/^[,\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

const hasWords = (text: string) => /[\p{L}\p{N}]/u.test(text);

const splitByWords = (text: string): Array<string> => {
  const words = text.split(" ");
  return Array.from({ length: Math.ceil(words.length / MAX_WORDS) }, (_, i) =>
    words.slice(i * MAX_WORDS, (i + 1) * MAX_WORDS).join(" ")
  );
};

// Split a long sentence at clause boundaries, packing clauses up to MAX_WORDS.
const splitLong = (sentence: string): Array<string> => {
  if (sentence.split(" ").length <= MAX_WORDS) return [sentence];
  const clauses = sentence.match(/[^,;:]+[,;:]?/g) ?? [sentence];
  return clauses
    .map((clause) => clause.trim())
    .filter(Boolean)
    .reduce<Array<string>>((chunks, clause) => {
      const last = chunks[chunks.length - 1];
      const merged = last ? `${last} ${clause}` : clause;
      if (last && merged.split(" ").length <= MAX_WORDS) {
        chunks[chunks.length - 1] = merged;
        return chunks;
      }
      return [...chunks, clause];
    }, [])
    .flatMap(splitByWords);
};

const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

export const splitSentences = (text: string): Array<string> =>
  Array.from(segmenter.segment(text), ({ segment }) => segment.trim())
    .filter(hasWords)
    .flatMap(splitLong);

// Changelog transcripts: one paragraph per block, a new turn starts with
// `**Speaker Name:**`, and `**Break:**` marks an ad break.
export const parseTranscript = (markdown: string): Transcript => {
  const raw = markdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .reduce<Array<{ speaker: string | null; text: Array<string> }>>(
      (turns, paragraph) => {
        const match = paragraph.match(SPEAKER_LINE);
        if (match) {
          const speaker = match[1].trim();
          return [
            ...turns,
            { speaker: speaker === "Break" ? null : speaker, text: [match[2]] },
          ];
        }
        turns[turns.length - 1]?.text.push(paragraph);
        return turns;
      },
      []
    )
    .filter(
      (turn): turn is { speaker: string; text: Array<string> } =>
        turn.speaker !== null
    )
    .map((turn) => ({
      speaker: turn.speaker,
      text: turn.text.map(cleanText).filter(hasWords),
    }))
    .filter((turn) => turn.text.length > 0);

  const sentences: Array<Sentence> = [];
  const turns = raw.map(({ speaker, text }, turnIndex) => ({
    index: turnIndex,
    speaker,
    sentences: text.flatMap(splitSentences).map((sentenceText) => {
      const sentence = {
        index: sentences.length,
        turnIndex,
        speaker,
        text: sentenceText,
      };
      sentences.push(sentence);
      return sentence;
    }),
  }));

  return {
    speakers: [...new Set(turns.map((turn) => turn.speaker))],
    turns,
    sentences,
  };
};
