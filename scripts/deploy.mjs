import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SPACE_REPOSITORY = "git@hf.co:spaces/nico-martin/phonon-fm";
const SPACE_URL = "https://huggingface.co/spaces/nico-martin/phonon-fm";
const GITHUB_URL = "https://github.com/nico-martin/phonon-fm";
const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = join(projectDirectory, "dist");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectDirectory,
    stdio: "inherit",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}`);
  }
}

run("pnpm", ["run", "build"]);
if (!existsSync(join(distDirectory, "index.html"))) {
  throw new Error("The production build did not produce dist/index.html.");
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), "phonon-fm-deploy-"));
const spaceDirectory = join(temporaryDirectory, "space");

try {
  run("git", ["clone", "--depth", "1", SPACE_REPOSITORY, spaceDirectory]);
  run("git", ["xet", "install", "--local"], { cwd: spaceDirectory });
  run("git", ["lfs", "track", "*.wasm"], { cwd: spaceDirectory });

  // Remove stale deployment assets only inside this fresh temporary clone.
  for (const entry of readdirSync(spaceDirectory)) {
    if ([".git", ".gitattributes", "README.md"].includes(entry)) continue;
    rmSync(join(spaceDirectory, entry), { recursive: true, force: true });
  }
  for (const entry of readdirSync(distDirectory)) {
    cpSync(join(distDirectory, entry), join(spaceDirectory, entry), { recursive: true });
  }

  const readmePath = join(spaceDirectory, "README.md");
  let readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : "";
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
  const existing = frontmatter.exec(readme);
  let metadata = existing?.[1].replaceAll("\r\n", "\n") ?? "pinned: false";
  for (const [key, value] of Object.entries({
    title: "Phonon FM",
    sdk: "static",
    app_file: "index.html",
  })) {
    const field = new RegExp(`^${key}:[^\\r\\n]*$`, "m");
    metadata = field.test(metadata)
      ? metadata.replace(field, `${key}: ${value}`)
      : `${metadata.trimEnd()}\n${key}: ${value}`;
  }
  readme = `---\n${metadata.trim()}\n---\n${existing ? readme.slice(existing[0].length) : readme}`;
  readme = readme.replace(
    /^Check out the configuration reference at https:\/\/huggingface\.co\/docs\/hub\/spaces-config-reference[^\r\n]*\r?\n?/gm,
    ""
  );

  const about =
    "Tech podcasts, recast live in your browser. Phonon FM reads podcast transcripts aloud with [Phonon 31M](https://huggingface.co/onnx-community/phonon-31m-en-ONNX), a streaming text-to-speech model running on WebGPU with Transformers.js. Give every host and guest their own voice, and switch voices mid-episode: the new voice takes over from that speaker's next sentence.\n\n" +
    "Transcripts by [Syntax](https://syntax.fm) and [Changelog Media](https://github.com/thechangelog/transcripts) (licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)). The voices are synthetic and are not the hosts' real voices.\n\n" +
    `Explore the implementation and run it yourself in the [GitHub repository](${GITHUB_URL}).`;
  const contextBlock = `<!-- phonon-fm:about:start -->\n${about}\n<!-- phonon-fm:about:end -->`;
  const existingContext = /<!-- phonon-fm:about:start -->[\s\S]*?<!-- phonon-fm:about:end -->/;
  if (existingContext.test(readme)) readme = readme.replace(existingContext, contextBlock);
  else readme = `${readme.trimEnd()}\n\n${contextBlock}\n`;
  writeFileSync(readmePath, `${readme.trimEnd()}\n`);

  run("git", ["add", "--all"], { cwd: spaceDirectory });
  const diff = spawnSync("git", ["diff", "--cached", "--quiet"], {
    cwd: spaceDirectory,
    stdio: "inherit",
  });
  if (diff.error) throw diff.error;
  if (diff.status === 0) {
    console.log("The Space is already up to date.");
  } else if (diff.status === 1) {
    run("git", ["commit", "-m", "Deploy Phonon FM production build"], { cwd: spaceDirectory });
    run("git", ["push", "origin", "HEAD:main"], { cwd: spaceDirectory });
    console.log(`Deployed to ${SPACE_URL}`);
  } else {
    throw new Error(`git diff exited with status ${diff.status}`);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
