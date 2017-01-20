'use strict'

const handlerFactory = require('./handler')
const fs = require('fs')
const parser = require('url')
const path = require('path')
const mime = require('mime-types')
let handlers = {}

const notFounds = {
  default () {
    return handlerFactory.createHandler((req, res) => {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('No route registered for ' + req.url)
    })
  }
}

const missing = (req, callback) => {
  const uri = parser.parse(req.url, true)
  if (uri.pathname.substr(-3) === '.md') {
    return callback(notFounds.default())
  }
  const mimeType = mime.lookup(uri.pathname)
  if (mimeType) {
    existsStaticFile(uri.pathname, (filename) => {
      if (!filename) {
        return callback(notFounds.default())
      }
      const handler = handlerFactory.createHandler((req, res) => {
        res.writeHead(200, mimeType)
        const fileStream = fs.createReadStream(filename)
        fileStream.pipe(res)
      })
      callback(handler)
    })
  } else {
    callback(notFounds.default())
  }
}

exports.notFound = (callback) => {
  notFounds.default = () => handlerFactory.createHandler(callback)
}

exports.clear = () => {
  handlers = {}
}

exports.register = (url, method) => {
  handlers[url] = handlerFactory.createHandler(method)
}

exports.route = (req, callback) => {
  const uri = parser.parse(req.url, true)
  const handler = handlers[uri.pathname]
  if (!handler) {
    missing(req, callback)
  } else {
    callback(handler)
  }
}

const staticFilePaths = new Set([process.cwd()])
const asyncExistsFile = (filename) => {
  return new Promise(function (resolve, reject) {
    fs.access(filename, (err) => {
      const exists = !err
      resolve([filename, exists])
    })
  })
}
const existsStaticFile = (pathname, callback) => {
  const promiseArr = []
  for (const parrentPath of staticFilePaths) {
    const filename = path.join(parrentPath, pathname)
    promiseArr.push(asyncExistsFile(filename))
  }

  Promise.all(promiseArr).then((results) => {
    for (const result of results) {
      if (result[1]) {
        return callback(result[0])
      }
    }
    callback(null)
  })
}

exports.addStaticPath = (p) => {
  staticFilePaths.add(p)
}

