import assert from "node:assert/strict";
import { test } from "node:test";
import { setImmediate } from "node:timers/promises";
import { createServer } from "vite";

test("sentence highlighting and voice changes follow scheduled audio", async (t) => {
  const server = await createServer({
    server: { middlewareMode: true, ws: false },
  });
  t.after(() => server.close());
  const { default: PodcastPlayer } = await server.ssrLoadModule(
    "/src/tts/PodcastPlayer.ts"
  );

  let context;
  let tick;
  let player;
  t.after(() => player?.stop());
  const sources = [];
  const globals = {
    window: {
      setInterval(fn) {
        tick = fn;
        return 1;
      },
      clearInterval() {},
    },
    AudioContext: class {
      currentTime = 0;
      constructor() {
        context = this;
      }
      createAnalyser() {
        return { connect() {} };
      }
      async resume() {}
      async close() {}
      createBuffer(_channels, samples, rate) {
        return {
          duration: samples / rate,
          copyToChannel(pcm) {
            this.voice = pcm[0];
          },
        };
      }
      createBufferSource() {
        return {
          connect() {},
          start(time) {
            this.time = time;
            sources.push(this);
          },
          stop() {
            this.stopped = true;
          },
        };
      }
    },
    fetch: async (url) =>
      new Response(new Float32Array([url.endsWith("/new.bin") ? 2 : 1])),
  };
  for (const [key, value] of Object.entries(globals)) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    });
  }

  const { promise: thirdStarted, resolve: signalThirdStart } =
    Promise.withResolvers();
  const { promise: thirdResult, reject: rejectOldVoice } =
    Promise.withResolvers();
  const tts = async (text, { speaker_embeddings: embeddings }) => {
    assert.ok(embeddings instanceof Float32Array);
    const voice = embeddings[0];
    if (text === "Third." && voice === 1) {
      signalThirdStart();
      await thirdResult;
    }
    return {
      audio: new Float32Array(text === "First." ? 19200 : 9600).fill(voice),
      sampling_rate: 24000,
    };
  };
  const sentences = ["First.", "Second.", "Third."].map((text, index) => ({
    text,
    index,
    turnIndex: 0,
    speaker: "Host",
  }));
  player = new PodcastPlayer(tts, sentences, { Host: "old" });
  const advanceTo = (time) => {
    context.currentTime = time;
    tick();
  };

  await player.play();
  await thirdStarted;
  assert.equal(player.getState().playingSentence, null);
  advanceTo(0.25);
  assert.equal(player.getState().playingSentence, 0);
  advanceTo(0.61);
  assert.equal(player.getState().playingSentence, 0);
  const oldSecond = sources[1];
  assert.equal(oldSecond.buffer.voice, 1);
  assert.ok(oldSecond.time > context.currentTime);

  player.setVoice("Host", "new");
  rejectOldVoice(new Error("Obsolete inference"));
  await setImmediate();
  assert.equal(player.getState().error, null);
  assert.equal(oldSecond.stopped, true);
  assert.ok(!sources[0].stopped);
  const newSecond = sources[2];
  assert.equal(newSecond.buffer.voice, 2);
  assert.equal(newSecond.time, oldSecond.time);
  advanceTo(newSecond.time - 0.01);
  assert.equal(player.getState().playingSentence, 0);
  advanceTo(newSecond.time);
  assert.equal(player.getState().playingSentence, 1);
  advanceTo(newSecond.time + 0.2);
  const third = sources[3];
  advanceTo(third.time);
  assert.equal(player.getState().playingSentence, 2);
  assert.deepEqual(player.getState().spokenVoices, {
    0: "old",
    1: "new",
    2: "new",
  });
  advanceTo(third.time + third.buffer.duration);
  assert.equal(player.getState().status, "ended");
  assert.equal(player.getState().playingSentence, null);
});
