# Phonon FM

Tech podcasts, recast live in your browser.

Phonon FM reads podcast transcripts aloud with [Phonon 31M](https://huggingface.co/onnx-community/phonon-31m-en-ONNX), a streaming text-to-speech model from Gradium, running on WebGPU with [Transformers.js](https://github.com/huggingface/transformers.js). Every host and guest gets their own voice, and you can change any voice while the episode plays.

**Live demo:** https://huggingface.co/spaces/nico-martin/phonon-fm

## How it works

- The demo calls the Transformers.js `text-to-speech` pipeline once per transcript sentence. The transcript highlights each sentence when its audio starts playing.
- The player starts generating ahead when less than about 5 seconds of audio is buffered. A voice change takes effect on that speaker's next sentence that hasn't started playing, even if its audio was already scheduled.
- The demo fetches and caches voice embeddings from the model repo. The model is English-only; the French, German, Spanish and Portuguese voices from [gradium/phonon-voices](https://huggingface.co/gradium/phonon-voices) are offered as accents.

The playback logic lives in `src/tts/PodcastPlayer.ts`.

## Run

Requires a browser with WebGPU. The model is downloaded on first use and cached. The load button shows the download size for the selected model variant when available.

```sh
pnpm install
pnpm dev
```

`@huggingface/transformers` is linked to the local checkout at `../../transformers.js/packages/transformers`. If the checkout doesn't have current bundles and types, run `pnpm install` and `pnpm --filter @huggingface/transformers build` from its repository root.

`pnpm deploy` builds the app and pushes it to the Hugging Face Space.

## Credits

- Transcripts from [Syntax](https://syntax.fm) (#740, cleaned up by hand) and [Changelog Media](https://github.com/thechangelog/transcripts) (CC BY-SA 4.0).
- The voices are synthetic and are not the hosts' real voices.
