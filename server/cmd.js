'use strict'

const fs = require('fs')
const exec = require('child_process').exec
const C = require('./constant')

const myExec = function (cmd) {
  const promise = new Promise(function (resolve, reject) {
    exec(cmd, { cwd: C.noteDir }, (error, stdout, stderr) => {
      console.log('='.repeat(80))
      console.log(`cmd: ${cmd}`)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      if (error) {
        console.error(`exec error: ${error}`)
        reject()
        return
      }
      resolve()
    })
  })
  return promise
}

const _M = {}

_M.init = () => {
  const exists = fs.existsSync(C.noteDir)
  if (!exists) {
    fs.mkdirSync(C.noteDir)
  }
  myExec('git init').then(
        () => myExec(`git remote add origin ${C.git}`)
    ).then(
        () => myExec('git pull origin master')
    ).then(
        () => console.log('init git success!'),
        () => console.log('init git failed!')
    )
}

_M.backup = () => {
  myExec('git add .').then(
        () => myExec('git commit -m "auto backup"')
    ).then(
        () => myExec('git push -u origin master')
    ).then(
        () => console.log('auto backup success!'),
        () => console.log('auto backup failed!')
    )
}

const method = process.argv[2]
if ((typeof method) === 'string') {
  if (method in _M) {
    _M[method]()
  }
}

module.exports = _M

