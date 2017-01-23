'use strict'

const findInFiles = require('find-in-files')
const C = require('./conf')

module.exports = (text, callback) => {
  findInFiles.findSync({ 'term': text, 'flags': 'ig' }, C.noteDir, '.md$')
        .then((results) => {
          Object.assign({}, results)
          const r = []
          for (const t in results) {
            const item = results[t]
            const title = t.replace(C.noteDir, '')
            r.push({
              title: title,
              match: item.matches[0],
              line: item.line[0],
              path: title
            })
          }
          console.log(r)
          callback(r)
        })
}

