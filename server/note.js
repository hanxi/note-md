'use strict'

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const removeMd = require('remove-markdown')
const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()
converter.setOption('headerLevelStart', 2)

const asyncGetFolder = (folder, pathname, dirname, p) => {
  const pname = path.join(dirname, p)
  return new Promise(function (resolve, reject) {
    fs.stat(pname, (err, stat) => {
      if (!err) {
        if (stat.isDirectory()) {
          folder.push({
            name: p,
            path: pathname + p + '/',
            children: []
          })
        } else if (stat.isFile()) {
          if (p.substr(-3) === '.md') {
            folder.push({
              name: p,
              path: pathname + p
            })
          }
        }
      }
      resolve()
    })
  })
}

exports.getFolderList = (pathname, dirname, callback) => {
  fs.readdir(dirname, (err, files) => {
    if (err) {
      console.error(err)
      return callback([])
    }
    const folder = []
    const promiseArr = []
    for (const p of files) {
      if (p.substr(0, 1) !== '.') {
        promiseArr.push(asyncGetFolder(folder, pathname, dirname, p))
      }
    }
    Promise.all(promiseArr).then((results) => {
      callback(folder)
    })
  })
}

const asyncGetNote = (noteList, pathname, dirname, p) => {
  const pname = path.join(dirname, p)
  return new Promise(function (resolve, reject) {
    fs.stat(pname, (err, stat) => {
      if (!err && stat.isFile()) {
        fs.readFile(pname, 'utf8', (err, text) => {
          if (!err) {
            const preview = removeMd(text)
            // read file head content
            noteList.push({
              title: p,
              path: pathname + p,
              updateTime: moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss'),
              preview: preview
            })
          }
          resolve()
        })
      } else {
        resolve()
      }
    })
  })
}

exports.getNoteList = (pathname, dirname, callback) => {
  fs.readdir(dirname, (err, files) => {
    if (err) {
      console.error(err)
      return callback([])
    }
    const noteList = []
    const promiseArr = []
    for (const p of files) {
      if (p.substr(-3) === '.md') {
        promiseArr.push(asyncGetNote(noteList, pathname, dirname, p))
      }
    }
    Promise.all(promiseArr).then((results) => {
      callback(noteList)
    })
  })
}

exports.getNote = (filename, callback) => {
  fs.readFile(filename, 'utf8', (err, text) => {
    if (err) {
      text = err.message
    }
    const html = converter.makeHtml(text)
    callback(html)
  })
}

