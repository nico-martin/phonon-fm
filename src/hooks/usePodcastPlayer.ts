import { useEffect, useState, useSyncExternalStore } from "react";

import { defaultVoices } from "../data/voices";
import PodcastPlayer from "../tts/PodcastPlayer";
import { type PhononTTS, loadVoice } from "../tts/phonon";
import type { Transcript } from "../utils/transcript";

export default function usePodcastPlayer(
  tts: PhononTTS,
  transcript: Transcript
) {
  const [player] = useState(
    () =>
      new PodcastPlayer(
        tts,
        transcript.sentences,
        defaultVoices(transcript.speakers)
      )
  );
  const state = useSyncExternalStore(player.subscribe, player.getState);

  useEffect(() => {
    Object.values(player.getState().voices).forEach(
      (voiceId) => void loadVoice(tts, voiceId).catch(console.error)
    );
    return () => player.stop();
  }, [player, tts]);

  return { player, state };
}
