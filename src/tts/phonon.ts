import {
  type DeviceType,
  ModelRegistry,
  type TextToAudioPipeline,
  pipeline,
} from "@huggingface/transformers";

import { VOICES } from "../data/voices";

const MODEL_ID = "onnx-community/phonon-31m-en-ONNX";
const TASK = "text-to-speech";
const DEFAULT_DEVICE = "webgpu";

export const SAMPLE_RATE = 24000;
export const DTYPE = "q4f16";

export type PhononTTS = TextToAudioPipeline;

export interface LoadProgress {
  loaded: number;
  total: number;
}

export const getPhononDownloadSize = async (): Promise<number | null> => {
  const files = await ModelRegistry.get_pipeline_files(TASK, MODEL_ID, {
    dtype: DTYPE,
    device: DEFAULT_DEVICE,
  });
  const metadata = await Promise.all(
    files.map((file) => ModelRegistry.get_file_metadata(MODEL_ID, file))
  );
  let total = 0;
  for (const { exists, size } of metadata) {
    if (!exists || size === undefined || !Number.isFinite(size)) return null;
    total += size;
  }
  return total || null;
};

// Cache raw embeddings; the pipeline handles their layout and prompt preparation.
const voices = new Map<string, Promise<Float32Array>>();

const fetchVoice = async (voiceId: string): Promise<Float32Array> => {
  const response = await fetch(
    `https://huggingface.co/${MODEL_ID}/resolve/main/voices/${voiceId}.bin`
  );
  if (!response.ok)
    throw new Error(`Could not load voice ${voiceId} (${response.status}).`);
  const buffer = await response.arrayBuffer();
  if (
    !buffer.byteLength ||
    buffer.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0
  ) {
    throw new Error(`Invalid voice data for ${voiceId}.`);
  }
  return new Float32Array(buffer);
};

export const loadVoice = (voiceId: string): Promise<Float32Array> => {
  const cached = voices.get(voiceId);
  if (cached) return cached;
  const voice = fetchVoice(voiceId);
  voice.catch(() => voices.delete(voiceId));
  voices.set(voiceId, voice);
  return voice;
};

export const synthesizeSentence = async (
  tts: PhononTTS,
  text: string,
  voiceId: string
): Promise<Float32Array> => {
  const { audio } = await tts(text, {
    speaker_embeddings: await loadVoice(voiceId),
  });
  if (!(audio instanceof Float32Array) || !audio.length) {
    throw new Error("Phonon returned no mono audio.");
  }
  return audio;
};

export const loadPhonon = async (
  onProgress?: (progress: LoadProgress) => void,
  device: DeviceType = DEFAULT_DEVICE
): Promise<PhononTTS> => {
  const tts = await pipeline(TASK, MODEL_ID, {
    dtype: DTYPE,
    device,
    progress_callback: (info) => {
      if (info.status === "progress_total") {
        onProgress?.({ loaded: info.loaded, total: info.total });
      }
    },
  });
  // The first generation compiles the WebGPU shaders. Do it here, behind the
  // loading screen, instead of during the first turn of an episode.
  try {
    await synthesizeSentence(tts, "Hi.", VOICES[0].id);
  } catch (error) {
    await tts.dispose();
    throw error;
  }
  return tts;
};
