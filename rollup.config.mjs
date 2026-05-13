import { babel } from "@rollup/plugin-babel";

// Mark Mirador, React, MUI, and Emotion as externals so the consuming app's
// copies are used at runtime — Mirador 4 plugins are ESM and rely on the
// host's React/MUI/Emotion singletons.
const external = [
  "mirador",
  "react",
  "react-dom",
  "react/jsx-runtime",
  /^@mui\//,
  /^@emotion\//,
];

const config = {
  input: "src/index.js",
  output: {
    dir: "dist/es",
    format: "es",
  },
  external,
  plugins: [babel({ babelHelpers: "bundled" })],
};

export default config;
