const { build } = require("esbuild");
const { dependencies = {}, peerDependencies = {} } = require("./package.json");

const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
};

build({
  ...config,
  outfile: "dist/index.js",
  // Allows the library to be used via a <script> tag
  format: "iife",
  // This will save the module (in the format { default: Rupa(...)})
  globalName: "__Rupa",
  // As the default output is the module object, we extract that into a global
  // `Rupa` variable so that users can do `const rupa = new Rupa(...)`
  footer: {
    js: "var Rupa = __Rupa.default",
  },
});

build({
  ...config,
  outfile: "dist/index.esm.js",
  // Allows the library to be used via esm + npm
  format: "esm",
});
