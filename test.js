/* eslint-env jest */
const EventEmitter = require('events').EventEmitter
require('./').register()

describe('emit-then unit test', () => {
  let emitter, error, spy

  beforeEach(() => {
    emitter = new EventEmitter()
    error = new Error('A wild error appeared')
    spy = jest.fn((...args) => args)
  })

  it('resolves when the handlers resolve', (done) => {
    emitter.on('event', () => {
      return Promise.resolve(0)
    })
    emitter.emitThen('event').then(res => {
      expect(res).toEqual([0])
      done()
    })
  })

  it('rejects when a handler rejects', async () => {
      emitter.on('event', () => Promise.reject(error))
      return expect(emitter.emitThen('event'))
        .rejects.toEqual(error)
    }
  )

  it('rejects when a handler throws', () => {
    emitter.on('event', () => {
      throw error
    })
    return expect(emitter.emitThen('event'))
      .rejects.toBe(error)
  })

  it('preserves the context for the handlers', async () => {
    emitter.on('event', spy)
    await emitter.emitThen('event').then(() => {
      expect(spy).toHaveBeenCalled()
    })
  })

  it('preserves the arguments for the handlers', (done) => {
    emitter.on('event', spy)
    emitter.emitThen('event', 'foo', 'bar').then(() => {
      expect(spy).toReturnWith(['foo', 'bar'])
      done()
    })
  })

  it('should resolve multi-params', (done) => {
    emitter.on('event', (one, two, three) => {
      return one + two + three
    })
    emitter.emitThen('event', 1, 2, 3).then(res => {
      expect(res).toEqual([6])
      done()
    })
  })

  // can't resolve `once`
  // it('should resolve multi-listeners',  async() => {
  //     emitter.on('event', () => {
  //       return 'first'
  //     })
  //     emitter.on('event', () => {
  //       return 'second'
  //     })
  //     emitter.once('event', () => {
  //       return 'temp'
  //     })
  //     await emitter.emitThen('event').then(res => {
  //       expect(res).toEqual(['first', 'second', 'temp'])
  //       done()
  //     })
  //     await emitter.emitThen('event').then(res => {
  //       expect(res).toEqual(['first', 'second'])
  //     })
  //   }
  // )
})
