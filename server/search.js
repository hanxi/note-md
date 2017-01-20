'use strict'

const findInFiles = require('find-in-files')
const C = require('./constant')

module.exports = (text, callback) => {
  findInFiles.findSync({ 'term': text, 'flags': 'ig' }, C.noteDir, '.md$')
        .then((results) => {
          callback(Object.assign({}, results))
        })
}

