module.exports.emitThen = async function emitThen (event, ...args) {
  return Promise.all(
    this.rawListeners(event).map(
      listener => Promise.resolve()
        .then(() => {
            return listener.apply(this, args)
          }
        )
    )
  )
}

module.exports.register = function () {
  require('./lib/events').EventEmitter.prototype.emitThen = module.exports.emitThen
}

