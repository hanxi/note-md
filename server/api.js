'use strict'

const fs = require('fs')
const path = require('path')
const parser = require('url')

const router = require('./router')
const note = require('./note')
const C = require('./constant')

const register = (url, method) => {
  router.register('/api' + url, method)
}

const notFound = (req, res) => {
  console.error(req.url, ' Not Found')
  const mime = req.headers.accepts || 'application/json'
  res.writeHead(404, { 'Content-Type': mime })
  const ret = {
    error: 'Not Found'
  }
  res.end(JSON.stringify(ret))
}

const resJson = (req, res, json) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(json))
}

register('/folder', function (req, res) {
  const uri = parser.parse(req.url, true)
  const pathname = uri.query.pathname
  const dirname = path.join(C.noteDir, pathname)
  fs.access(dirname, (err) => {
    const exists = !err
    if (!exists) {
      return notFound(req, res)
    }
    note.getFolderList(pathname, dirname, (folder) => {
      return resJson(req, res, { folder })
    })
  })
})

register('/noteList', function (req, res) {
  const uri = parser.parse(req.url, true)
  const pathname = uri.query.pathname
  const dirname = path.join(C.noteDir, pathname)
  console.log('dirname', dirname)
  fs.access(dirname, (err) => {
    const exists = !err
    if (!exists) {
      return notFound(req, res)
    }
    note.getNoteList(pathname, dirname, (noteList) => {
      return resJson(req, res, { noteList })
    })
  })
})

register('/note', function (req, res) {
  const uri = parser.parse(req.url, true)
  const pathname = uri.query.pathname
  const filename = path.join(C.noteDir, pathname)
  fs.access(filename, (err) => {
    const exists = !err
    if (!exists) {
      return notFound(req, res)
    }
    note.getNote(filename, (content) => {
      return resJson(req, res, { content })
    })
  })
})

