import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "./qs.js",
  output: {
    file: "public/bundle.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [resolve()],
};
