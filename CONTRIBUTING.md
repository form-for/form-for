# Contributing

We'd love to have your contribution added to Jewell. If you decide to do so, please follow the
[code of conduct](./CODE_OF_CONDUCT.md)

## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `npm install` in the components's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run clean` will delete built resources.

## Code Style

The project uses [prettier](https://github.com/prettier/prettier). To format your code just run:
 
```bash
npm run prettier
```
 
or
 
```bash
yarn prettier
```

Don't worry too much about the formatting, prettier will sort things out before publishing a new version.

## Releasing

To release a new version, define the number following the [semantic versioning](http://semver.org/).

``` bash
$ npm version <newversion> -m "Releasing %s"
$ npm publish
```