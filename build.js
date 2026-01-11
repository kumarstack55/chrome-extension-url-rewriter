import * as esbuild from "esbuild";

const options = {
  entryPoints: [
    "src/popup.ts",
  ],
  bundle: true,
  outdir: "extension",
  format: "esm",
  platform: "browser",
  target: "chrome120",
  sourcemap: true,
  minify: false,
};

if (process.argv.includes("--watch")) {
  const context = await esbuild.context(options);
  await context.watch();
  console.log("Watching for changes...");
} else {
  await esbuild.build(options);
  console.log("Build complete!");
}
