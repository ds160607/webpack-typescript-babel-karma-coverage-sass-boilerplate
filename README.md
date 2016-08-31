# Webpack + Typescript + Babel + Karma (with coverage) + SASS (BEM)

## Description

This project can be used as a starter for real frontend projects.
Webpack is used as building system. Code is written in [Typescript](https://www.typescriptlang.org/).
For compatibility with old browsers [Babel Polyfill](https://babeljs.io/) is used.
[Karma](https://karma-runner.github.io/1.0/index.html) is used for unit testing.

## Getting started

You'll need [node / npm](https://nodejs.org/) and [tsd](http://definitelytyped.org/tsd/) installed globally. To get up and running just enter:

```
npm install
tsd install
npm start
```

This will:

1. Download the npm packages you need
2. Download the typings from DefinitelyTyped that you need.
3. Compile the code and serve it up at [http://localhost:9045/](http://localhost:9045/)

#HTML

[EJS](http://ejs.co/) template is used to generate an index.html file.

#CSS

CSS is writen using [SASS](http://sass-lang.com/) preprocessor and [BEM](https://en.bem.info/) methodology.

# Third-party Javascript libraries

In the project you will find an example of using javascript libraries [money.js](http://josscrowcroft.github.io/money.js/) and [jsonp-client](https://travis-ci.org/bermi/jsonp-client).
In order to use them with typescript two typings definition files was written (see typings/money.d.ts and typings/jsonp-client.d.ts)  

## Testing

For running unit tests run this:

```
npm test
```

## Production

To build production version of the application first set environment variable NODE_ENV into "prod":

```
set NODE_ENV=prod
```

Than run:

```
node build
```

In order to return back into the development mode set NODE_ENV back into "dev":

```
set NODE_ENV=dev
```
```

