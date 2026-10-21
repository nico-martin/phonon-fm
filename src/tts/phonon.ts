import {
  type DeviceType,
  type ProgressInfo,
  type Tensor,
  type TextToAudioPipeline,
  load_phonon_voice,
  pipeline,
} from "@huggingface/transformers";

const MODEL_ID = "onnx-community/phonon-31m-en-ONNX";
const VOICES_REPO = "gradium/phonon-voices";

export const SAMPLE_RATE = 24000;

export type PhononTTS = TextToAudioPipeline;

export interface LoadProgress {
  loaded: number;
  total: number;
}

// Voice tensors are small and reused across sentences, so each one is loaded
// once and kept for the lifetime of the page.
const voices = new Map<string, Promise<Tensor>>();

export const loadVoice = (voiceId: string): Promise<Tensor> => {
  const cached = voices.get(voiceId);
  if (cached) return cached;
  const voice = load_phonon_voice(VOICES_REPO, `voices/${voiceId}.safetensors`);
  voice.catch(() => voices.delete(voiceId));
  voices.set(voiceId, voice);
  return voice;
};

export const loadPhonon = async (
  onProgress?: (progress: LoadProgress) => void,
  device: DeviceType = "webgpu"
): Promise<PhononTTS> =>
  (await pipeline("text-to-speech", MODEL_ID, {
    dtype: "fp32",
    device,
    progress_callback: (info: ProgressInfo) => {
      if (info.status === "progress_total") {
        onProgress?.({ loaded: info.loaded, total: info.total });
      }
    },
  })) as PhononTTS;
