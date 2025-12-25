import { $, Glob } from "bun";

const glob = new Glob("src/lib/tests/*.test.src");
const testFiles = await Array.fromAsync(glob.scan("."));

const results = await Promise.all(
  testFiles.map(async (file) => {
    const result = await $`bunx greybel execute ${file}`.quiet();
    return {
      file,
      stdout: result.stdout.toString(),
      stderr: result.stderr.toString(),
    };
  })
);

for (const { file, stdout, stderr } of results) {
  console.log(`\n--- ${file} ---`);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}
