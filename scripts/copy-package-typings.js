const cpy = require('cpy');
const { packagePath } = require('./config');

module.exports = function(pkg, format) {
  console.info(`[${pkg}] add ${format} flow copy`);

  const pkgSrc = packagePath(pkg, 'src');
  cpy([`${pkgSrc}/*.js`, `!${pkgSrc}/*.test.js`], packagePath(pkg, format), {
    rename: basename => `${basename}.flow`
  });
};
