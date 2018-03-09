const fs = require('fs');
const { rollup } = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

function getDependencies(pkg) {
  const packageJson = JSON.parse(fs.readFileSync(`packages/${pkg}/package.json`));
  return Object.assign({}, packageJson.dependencies || {}, packageJson.peerDependencies || {});
}

function getPlugins(format, minify) {
  const plugins = [
    babel({
      exclude: ['node_modules/**']
    })
  ];

  if (format === 'umd') {
    plugins.push(resolve());
    plugins.push(commonjs());
  }

  if (minify) plugins.push(uglify());

  return plugins;
}

module.exports = async function(pkg, format) {
  console.info(`[${pkg}] rollup ${format}`);

  const sourcemap = format === 'umd';
  const minify = format === 'umd';

  const dependencies = getDependencies(pkg);
  const globals = {};
  Object.keys(dependencies).forEach(key => {
    globals[key] = key.split('-').join('_');
  });

  try {
    const bundle = await rollup({
      input: `packages/${pkg}/src/index.js`,
      external: Object.keys(dependencies),
      plugins: getPlugins(format, minify)
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
