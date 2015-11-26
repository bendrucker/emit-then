'use strict';

function emitThen (event) {
  var args = Array.prototype.slice.call(arguments, 1);
  /* jshint validthis:true */
  return Promise
    .all(this.listeners(event).map(listener => Promise.resolve().then(() => {
      var a1 = args[0], a2 = args[1];
      switch (args.length) {
        case 0: return listener.call(this);
        case 1: return listener.call(this, a1);
        case 2: return listener.call(this, a1, a2);
        default: return listener.apply(this, args);
      }
    })))
    .then(() => null);
}

emitThen.register = function () {
  require('events').prototype.emitThen = emitThen;
};

module.exports = emitThen;
