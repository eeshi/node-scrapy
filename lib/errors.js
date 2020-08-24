class ModelError extends Error {
  constructor(...args) {
    super(...args)

    if (Error.captureStackTrace) Error.captureStackTrace(this, ModelError)

    this.name = 'ModelError'
  }
}

class UnknownFilterError extends Error {
  constructor(...args) {
    super(...args)

    if (Error.captureStackTrace) Error.captureStackTrace(this, UnknownFilterError)

    this.name = 'UnknownFilterError'
  }
}

module.exports = {
  ModelError,
  UnknownFilterError,
}
