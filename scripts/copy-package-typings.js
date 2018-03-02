const cpy = require('cpy');
const { packagePath } = require('./config');

module.exports = function(pkg, format) {
  console.info(`[${pkg}] add ${format} flow copy`);
  cpy('./scripts/templates/flow.template.js', packagePath(pkg, 'dist'), {
    rename: basename => `${pkg}.${format}.js.flow`
  });
};
