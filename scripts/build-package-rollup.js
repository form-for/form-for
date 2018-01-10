const { rollup } = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify");

module.exports = async function(pkg, format) {
  const formatSplit = format.split(".");
  const formatType = formatSplit[0];
  const minify = formatSplit.length === 2 && formatSplit[1] === "min";
  const sourcemap = formatType === "umd";

  const globals = {
    react: "React",
    "prop-types": "PropTypes",
    "mobx-react": "mobxReact"
  };

  const plugins = [
    babel({
      exclude: ["node_modules/**"]
    })
  ];

  if (formatType === "umd") {
    plugins.push(resolve());
    plugins.push(commonjs());
  }

  if (minify) {
    plugins.push(uglify());
  }

  try {
    console.log("[" + pkg + "] rollup " + format);
    const result = await rollup({
      input: "packages/form-for/src/index.js",
      external: Object.keys(globals),
      plugins
    });

    await result.write({
      name: pkg,
      file: "packages/" + pkg + "/dist/" + pkg + "." + formatType + (minify ? ".min" : "") + ".js",
      format: formatSplit[0],
      globals,
      sourcemap
    });
  } catch (error) {
    console.error(error);
  }
};
