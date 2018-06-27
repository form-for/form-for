const { lstatSync, readdirSync } = require('fs');
const cpy = require('cpy');
const { packagePath } = require('./config');

module.exports = function(pkg, format) {
  console.info(`[${pkg}] add ${format} flow copy`);

  const options = { rename: basename => `${basename}.flow` };
  const pkgSrc = packagePath(pkg, 'src');

  const isDirectory = source => lstatSync(source).isDirectory();
  const folders = readdirSync(pkgSrc).filter(name => isDirectory(`${pkgSrc}/${name}`));

  cpy([`${pkgSrc}/*.js`, `!*.test.js`], packagePath(pkg, format), options);
  folders.forEach(folder => {
    cpy([`${pkgSrc}/${folder}/*.js`, `!*.test.js`], packagePath(pkg, `${format}/${folder}`), options);
  });
};
