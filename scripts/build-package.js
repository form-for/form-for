const async = require("async");
const buildPackageRollup = require("./build-package-rollup");
const copyPackageTypings = require("./copy-package-typings");
const clearPackageBuild = require("./clear-package-build");

const FORMATS = [
  { format: "es" },
  { format: "cjs" },
  { format: "umd", sourcemap: true },
  { format: "umd.min", sourcemap: true }
];

function buildPackage(pkg) {
  clearPackageBuild(pkg);
  async.forEach(FORMATS, item => buildPackageRollup(pkg, item.format, true));
  copyPackageTypings(pkg);
}

const pkg = process.argv[process.argv.length - 1];
if (pkg.indexOf(".js") === -1) {
  buildPackage(pkg);
}

module.exports = buildPackage;
