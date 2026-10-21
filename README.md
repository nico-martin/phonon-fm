# Phonon FM

Tech podcasts, recast live in your browser.

Phonon FM reads podcast transcripts aloud with [Phonon 31M](https://huggingface.co/onnx-community/phonon-31m-en-ONNX), a streaming text-to-speech model from Gradium, running on WebGPU with [Transformers.js](https://github.com/huggingface/transformers.js). Every host and guest gets their own voice, and you can change any voice while the episode plays: the new voice takes over from that speaker's next sentence.

**Live demo:** https://huggingface.co/spaces/nico-martin/phonon-fm

## How it works

- The transcript is split into sentences. Each one is generated with the speaker's current voice and streamed in 80 ms frames to the Web Audio API.
- About 5 seconds of audio is generated ahead of playback, but only about 0.3 seconds is committed to the audio graph. When you change a voice, queued sentences for that speaker are dropped and regenerated, so the change is heard right away.
- Voices come from [gradium/phonon-voices](https://huggingface.co/gradium/phonon-voices). The model is English-only; the French, German, Spanish and Portuguese voices are offered as accents.

The playback logic lives in `src/tts/PodcastPlayer.ts`.

## Run

Requires a browser with WebGPU. The model (fp32, about 165 MB) is downloaded on first use and cached.

```sh
pnpm install
pnpm dev
```

`@huggingface/transformers` is linked to a local checkout (`../../transformers.js/packages/transformers`) that includes Phonon support. Switch to the npm release once it ships Phonon.

`pnpm deploy` builds the app and pushes it to the Hugging Face Space.

## Credits

- Transcripts from [Syntax](https://syntax.fm) (#740, cleaned up by hand) and [Changelog Media](https://github.com/thechangelog/transcripts) (CC BY-SA 4.0).
- The voices are synthetic and are not the hosts' real voices.
