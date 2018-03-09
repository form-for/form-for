# Contributing

We'd love to have your contribution added to Jewell. If you decide to do so, please follow the
[code of conduct](CODE_OF_CONDUCT.md)

## Prerequisites

[Node.js](http://nodejs.org/) >= v8 must be installed.
[Yarn](https://yarnpkg.com/en/)

## Installation

* Running `yarn` in the components's root directory will install everything you need for development.

## Running Tests

* `yarn test` will run jest

## Building

* `yarn build` will build all the packages
* `yarn build:package PACKAGE_NAME` will build a specific package

## Code Style

The project uses [prettier](https://github.com/prettier/prettier) hooked on `precommit`, so don't worry too much about it,
it will get formatted automatically once you commit.

## Releasing

This package uses `oao` to help publishing the packages.

```sh
yarn build
yarn oao publish
```
