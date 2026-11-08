// Bundles src/ into assets/ so GitHub Pages can serve the repo root as is.
// npm run build      -> minified bundle
// npm run dev        -> rebuild on change + local server on http://localhost:5173
import * as esbuild from "esbuild";

const dev = process.argv.includes("--dev");
const options = {
  entryPoints: { app: "src/main.tsx" },
  bundle: true,
  outdir: "assets",
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",
  minify: !dev,
  sourcemap: dev,
  legalComments: "none",
  define: { "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production") },
  nodePaths: process.env.NODE_PATH ? process.env.NODE_PATH.split(":") : [],
  logLevel: "info",
};

if (dev) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  await ctx.serve({ servedir: ".", port: 5173 });
} else {
  await esbuild.build(options);
}
