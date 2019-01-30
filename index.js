module.exports.emitThen = async function emitThen (event, ...args) {
  return Promise.all(this.listeners(event).map(listener => Promise.resolve().then(() => {
    const _0 = args[0], _1 = args[1]
    switch (args.length) {
      case 0:
        return listener.call(this)
      case 1:
        return listener.call(this, _0)
      case 2:
        return listener.call(this, _0, _1)
      default:
        return listener.apply(this, args)
    }
  })))
}

module.exports.register = function () {
  require('events').EventEmitter.prototype.emitThen = module.exports.emitThen
}

