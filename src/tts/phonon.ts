import {
  type DeviceType,
  GradiumPhononTTSForConditionalGeneration,
  PocketTTSProcessor,
  type ProgressInfo,
  type Tensor,
} from "@huggingface/transformers";

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

// Each voice is loaded once from the model repo and kept as a tensor for the
// lifetime of the page; generate_speech never disposes it.
const voices = new Map<string, Promise<Tensor>>();

export const loadVoice = (
  { model }: PhononTTS,
  voiceId: string
): Promise<Tensor> => {
  const cached = voices.get(voiceId);
  if (cached) return cached;
  const voice = model.load_voice(`voices/${voiceId}.bin`);
  voice.catch(() => voices.delete(voiceId));
  voices.set(voiceId, voice);
  return voice;
};

// Yields 80 ms frames of 24 kHz mono PCM. Leaving the loop early stops
// generation and frees the model state.
export async function* streamSpeech(
  tts: PhononTTS,
  text: string,
  voiceId: string
): AsyncGenerator<Float32Array> {
  yield* tts.model.generate_speech({
    chunks: await tts.processor(text),
    speaker_embeddings: await loadVoice(tts, voiceId),
  });
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
  return {
    model: model as GradiumPhononTTSForConditionalGeneration,
    processor: processor as PocketTTSProcessor,
  };
};
