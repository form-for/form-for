const async = require("async");
const { lstatSync, readdirSync } = require("fs");

const buildPackage = require("./build-package");
const { packagePath } = require("./config");

const isDirectory = source => lstatSync(source).isDirectory();
const packages = readdirSync("packages").filter(name => isDirectory(packagePath(name)));

async.forEach(packages, pkg => buildPackage(pkg));
