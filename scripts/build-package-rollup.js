const fs = require('fs');
const { rollup } = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

module.exports = async function(pkg, format) {
  console.info(`[${pkg}] rollup ${format}`);

  const formatSplit = format.split('.');
  const formatType = formatSplit[0];
  const minify = formatSplit.length === 2 && formatSplit[1] === 'min';
  const sourcemap = formatType === 'umd';

  const packageJson = JSON.parse(fs.readFileSync(`packages/${pkg}/package.json`));

  const globals = [];

  const dependencies = Object.assign({}, packageJson.dependencies || {}, packageJson.peerDependencies || {});
  Object.keys(dependencies).forEach(key => {
    globals[key] = key.split('-').join('_');
  });

  const plugins = [
    babel({
      exclude: ['node_modules/**']
    })
  ];

  if (formatType === 'umd') {
    plugins.push(resolve());
    plugins.push(commonjs());
  }

  if (minify) {
    plugins.push(uglify());
  }

  try {
    const result = await rollup({
      input: `packages/${pkg}/src/index.js`,
      external: Object.keys(globals),
      plugins
    });

    await result.write({
      name: pkg,
      file: `packages/${pkg}/dist/${pkg}.${formatType}${minify ? '.min' : ''}.js`,
      format: formatSplit[0],
      globals,
      sourcemap
    });
  } catch (error) {
    console.error(error);
  }
};
