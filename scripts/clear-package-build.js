const fs = require('fs-extra');
const { packagePath } = require('./config');

module.exports = function(pkg, format) {
  console.info(`[${pkg}] clear ${format} build`);
  fs.removeSync(packagePath(pkg, format));
};
