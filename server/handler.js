'use strict'

const Handler = function (method) {
  this.process = function (req, res) {
    return method.apply(this, [req, res])
  }
}

exports.createHandler = function (method) {
  return new Handler(method)
}

