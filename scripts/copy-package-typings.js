const cpy = require("cpy");
const { packagePath } = require("./config");

module.exports = function(pkg) {
  console.info("[" + pkg + "] copy type files");
  cpy(packagePath(pkg, "src/**.js"), packagePath(pkg, "dist"), {
    rename: basename => `${basename}.flow`
  });
};
