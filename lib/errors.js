
class UnknownFilterError extends Error {
  constructor(...args) {
    super(...args)

    if (Error.captureStackTrace) Error.captureStackTrace(this, UnknownFilterError)

    this.name = 'UnknownFilterError'
  }
}

module.exports = {
  UnknownFilterError,
}
