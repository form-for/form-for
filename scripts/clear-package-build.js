const fs = require('fs-extra');
const { packagePath } = require('./config');

module.exports = function(pkg) {
  console.info(`[${pkg}] clear build dist`);
  fs.removeSync(packagePath(pkg, 'dist'));
};
