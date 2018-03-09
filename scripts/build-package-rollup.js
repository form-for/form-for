const fs = require('fs');
const { rollup } = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

module.exports = async function(pkg, format) {
  console.info(`[${pkg}] rollup ${format}`);

  const sourcemap = format === 'umd';
  const minify = format === 'umd';

  const packageJson = JSON.parse(fs.readFileSync(`packages/${pkg}/package.json`));
  const dependencies = Object.assign({}, packageJson.dependencies || {}, packageJson.peerDependencies || {});

  const globals = [];
  Object.keys(dependencies).forEach(key => {
    globals[key] = key.split('-').join('_');
  });

  const plugins = [
    babel({
      exclude: ['node_modules/**']
    })
  ];

  if (format === 'umd') {
    plugins.push(resolve());
    plugins.push(commonjs());
  }

  if (minify) {
    plugins.push(uglify());
  }

  try {
    const bundle = await rollup({
      input: `packages/${pkg}/src/index.js`,
      external: Object.keys(globals),
      plugins
    });

    await bundle.write({
      name: pkg,
      file: `packages/${pkg}/${format}/index${minify ? '.min' : ''}.js`,
      format,
      globals,
      sourcemap
    });
  } catch (error) {
    console.error(error);
  }
};
