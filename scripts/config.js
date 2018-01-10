const { join } = require("path");

const config = {
  PACKAGES_PATH: "./packages",
  packagePath: function(pkg, folder = "") {
    return join(config.PACKAGES_PATH, pkg, folder);
  }
};

module.exports = config;
