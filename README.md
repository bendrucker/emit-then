emitThen [![Build Status](https://travis-ci.org/valet-io/emitThen.svg)](https://travis-ci.org/valet-io/emitThen)
========

EventEmitter.emit that wraps event calls in a promise.

## Installation
```bash
npm install emitThen
```

## Setup

Add `emitThen` to your emitter prototype(s):

```js
http.server.emitThen = require('emitThen');
```

Or register `emitThen on `EventEmitter.prototype` to make it available on all emitters:

```js
require('emitThen').register();
```

## Usage

Traditional event handlers behave as usual:

```js
emitter.on('event', function (argument) {
  console.log('hi there!');
});
emitter.emitThen('event', argument).then(function () {
  // logged: hi there!
});
```

Handlers can return promises:

```js
emitter
  .on('event', function () {
    return promise.then(function () {
      console.log('hi there!');
    });
  })
  .emitThen('event')
  .then(function () {
    // logged: hi there!
  });
```

Just like calling `emit`, the return value or resolution of the promise is unused. 

If a handler returns a rejected promise, `emitThen` is immediately rejected with the error:

```js
emitter
  .on('event', function () {
    return Promise.reject(new Error('rejected!'));
  })
  .emitThen('event')
  .catch(function (err) {
    // err.message => 'rejected!'
  });
```

You can also reject `emitThen` by throwing an error from a handler:

```js
emitter
  .on('event', function () {
    throw new Error('rejected!');
  })
  .emitThen('event')
  .catch(function (err) {
    // err.message => 'rejected!'
  });
```