import {
  type DeviceType,
  GradiumPhononTTSForConditionalGeneration,
  PocketTTSProcessor,
  type ProgressInfo,
  Tensor,
} from "@huggingface/transformers";

import { VOICES } from "../data/voices";

const MODEL_ID = "onnx-community/phonon-31m-en-ONNX";

export const SAMPLE_RATE = 24000;

export interface PhononTTS {
  model: GradiumPhononTTSForConditionalGeneration;
  processor: PocketTTSProcessor;
}

export interface LoadProgress {
  loaded: number;
  total: number;
}

// Voices are flat float32 files in [1, voice_dim, frames] order. Each one is
// loaded once from the model repo and kept as a tensor for the lifetime of the
// page; generate_speech never disposes it.
const voices = new Map<string, Promise<Tensor>>();

const fetchVoice = async (
  { model }: PhononTTS,
  voiceId: string
): Promise<Tensor> => {
  const response = await fetch(
    `https://huggingface.co/${MODEL_ID}/resolve/main/voices/${voiceId}.bin`
  );
  if (!response.ok) throw new Error(`Could not load voice ${voiceId}.`);
  const data = new Float32Array(await response.arrayBuffer());
  const { voice_dim } = (
    model.config as unknown as { phonon: { voice_dim: number } }
  ).phonon;
  return new Tensor("float32", data, [1, voice_dim, data.length / voice_dim]);
};

export const loadVoice = (tts: PhononTTS, voiceId: string): Promise<Tensor> => {
  const cached = voices.get(voiceId);
  if (cached) return cached;
  const voice = fetchVoice(tts, voiceId);
  voice.catch(() => voices.delete(voiceId));
  voices.set(voiceId, voice);
  return voice;
};

export interface SpeechChunk {
  // 24 kHz mono PCM of one processor chunk: one or more sentences, up to 50
  // tokens.
  audio: Float32Array;
  text: string;
}

// Yields the audio of each text chunk as soon as it is ready. Each call runs
// the voice through the flow model first, so callers should pass as much text
// per call as they can. Leaving the loop early stops generation and frees the
// model state.
export async function* streamSpeech(
  tts: PhononTTS,
  text: string,
  voiceId: string
): AsyncGenerator<SpeechChunk> {
  // generate_speech yields one waveform per processor chunk, in this order.
  const texts = tts.processor.split_text(text);
  let index = 0;
  for await (const audio of tts.model.generate_speech({
    chunks: await tts.processor(text),
    speaker_embeddings: await loadVoice(tts, voiceId),
  })) {
    yield { audio, text: texts[index++] };
  }
}

export const loadPhonon = async (
  onProgress?: (progress: LoadProgress) => void,
  device: DeviceType = "webgpu"
): Promise<PhononTTS> => {
  const [model, processor] = await Promise.all([
    GradiumPhononTTSForConditionalGeneration.from_pretrained(MODEL_ID, {
      dtype: "fp32",
      device,
      progress_callback: (info: ProgressInfo) => {
        if (info.status === "progress_total") {
          onProgress?.({ loaded: info.loaded, total: info.total });
        }
      },
    }),
    PocketTTSProcessor.from_pretrained(MODEL_ID),
  ]);
  const tts = {
    model: model as GradiumPhononTTSForConditionalGeneration,
    processor: processor as PocketTTSProcessor,
  };
  // The first generation compiles the WebGPU shaders. Do it here, behind the
  // loading screen, instead of during the first turn of an episode.
  const warmUp = streamSpeech(tts, "Hi.", VOICES[0].id);
  while (!(await warmUp.next()).done);
  return tts;
};
