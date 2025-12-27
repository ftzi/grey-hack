import chokidar from "chokidar";
import path from "path";
import { $ } from "bun";

const __dirname = import.meta.dirname;
const rootDir = path.join(__dirname, "src");

const buildTargets = ["src/x.src"];

let isBuilding = false;
let buildPending = false;

const build = async () => {
  if (isBuilding) {
    buildPending = true;
    return;
  }
  console.clear();

  isBuilding = true;
  console.log("Building...");
  for (const target of buildTargets) {
    await $`bunx greybel build ${target} -ci -ac -acp --env-files .env`.quiet();
    console.log(`Built ${target}`);
  }
  console.log("Build complete.\n");
  isBuilding = false;

  if (buildPending) {
    buildPending = false;
    await build();
  }
};

const main = async (): Promise<void> => {
  console.clear();

  await build();

  const watcher = chokidar.watch(rootDir, {
    ignoreInitial: true,
    persistent: true,
  });

  watcher
    .on("add", async (filePath) => {
      console.log(`File ${filePath} has been added.`);
      await build();
    })
    .on("change", async (filePath) => {
      console.log(`File ${filePath} has been changed.`);
      await build();
    });

  console.log(`Watching ${rootDir} for changes...\n`);

  return new Promise(() => null);
};

await main();
