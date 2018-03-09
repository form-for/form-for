const async = require('async');
const buildPackageRollup = require('./build-package-rollup');
const copyPackageTypings = require('./copy-package-typings');
const clearPackageBuild = require('./clear-package-build');

const FORMATS = [{ format: 'es', flow: true }, { format: 'cjs', flow: true }, { format: 'umd' }];

function buildPackage(pkg) {
  async.forEach(['cjs', 'es', 'umd'], format => {
    clearPackageBuild(pkg, format);
    buildPackageRollup(pkg, format, true);
    if (format !== 'umd') copyPackageTypings(pkg, format);
  });
}

const pkg = process.argv[process.argv.length - 1];
if (pkg.indexOf('.js') === -1) {
  buildPackage(pkg);
}

module.exports = buildPackage;
