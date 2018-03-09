const async = require('async');
const buildPackageRollup = require('./build-package-rollup');
const copyPackageTypings = require('./copy-package-typings');
const clearPackageBuild = require('./clear-package-build');

function buildPackage(pkg) {
  async.forEach(['es', 'cjs'], format => {
    clearPackageBuild(pkg, format);
    buildPackageRollup(pkg, format);
    copyPackageTypings(pkg, format);
  });
}

const pkg = process.argv[process.argv.length - 1];
if (pkg.indexOf('.js') === -1) {
  buildPackage(pkg);
}

module.exports = buildPackage;
