'use strict'

const http = require('http')
const fs = require('fs')

const C = require('./conf')
const router = require('./router')
require('./api')

router.addStaticPath(C.noteDir)
router.addStaticPath(C.dist)

const index = fs.readFileSync(`${C.dist}/index.html`)

router.notFound((req, res) => {
  console.log('Not Found ' + req.url)
  // 返回 index.html
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(index)
})

const server = http.createServer((req, res) => {
  router.route(req, (handler) => {
    try {
      handler.process(req, res)
    } catch (e) {
      console.error(e)
    }
  })
})

server.listen(C.port, (err) => {
  if (err) {
    return console.error('something bad happened', err)
  }
  console.log(`server is listening on ${C.port}`)
})

const cmd = require('./cmd')
const autoBackupInterval = 30 * 60 * 1000 // 半小时备份一次
cmd.backup() // 启动时备份一次
setInterval(cmd.backup, autoBackupInterval)

