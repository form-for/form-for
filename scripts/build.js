const async = require('async');

const buildPackage = require('./build-package');
const { packagePath } = require('./config');

// The packages must be ordered due to the inter dependency
const packages = [
  'form-for',
  'form-for-component-helpers',
  'form-for-components',
  'form-for-bootstrap-components',
  'mobx-form-for'
];

async.forEach(packages, pkg => buildPackage(pkg));
