# Contributing

We'd love to have your contribution added to form-for. If you decide to do so, please follow the
[code of conduct](CODE_OF_CONDUCT.md)

This repository is a monorepo controlled with [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) and uses [oao](https://github.com/guigrpa/oao) to help publishing.

## Prerequisites

[Node.js](http://nodejs.org/) >= v8 must be installed.
[Yarn](https://yarnpkg.com/en/)

## Installation

* Running `yarn` in the root directory will install everything you need for development.

## Running Tests

* `yarn test` will run jest

## Building

* `yarn build` will build all the packages
* `yarn build:package PACKAGE_NAME` will build a specific package

All projects share the same build process, which is implemented using `rollup` in `scripts/`.

Right now there is no `build:watch`, but it's something that would help a lot in the future. If you're working on two dependent projects you'll need to run `build:package PACKAGE_NAME` on the depency.

For example, if you're working on `mobx-form-for` and you make a change on `form-for`, you'll need to run `yarn build:package form-for` for `mobx-form-for` to see the changes. Adding a `build:watch` command would solve the problem.

## Code Style

The project uses [prettier](https://github.com/prettier/prettier) hooked on `precommit`, so don't worry too much about it,
it will get formatted automatically once you commit.

## Releasing

```sh
yarn build
yarn oao publish
```
