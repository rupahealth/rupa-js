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
});

build({
  ...config,
  outfile: "dist/index.esm.js",
  format: "esm",
});
