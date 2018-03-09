const fs = require('fs');
const { rollup } = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = async function(name, format) {
  console.info(`[${name}] rollup ${format}`);

  const packageJson = JSON.parse(fs.readFileSync(`packages/${name}/package.json`));
  const dependencies = Object.assign({}, packageJson.dependencies || {}, packageJson.peerDependencies || {});

  const globals = [];
  Object.keys(dependencies).forEach(key => (globals[key] = key.split('-').join('_')));

  try {
    const result = await rollup({
      input: `packages/${name}/src/index.js`,
      external: Object.keys(globals),
      plugins: [babel({ exclude: ['node_modules/**'] })]
    });

    const file = `packages/${name}/${format}/index.js`;
    await result.write({ name, file, format, globals });
  } catch (error) {
    console.error(error);
  }
};
