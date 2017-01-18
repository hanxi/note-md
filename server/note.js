'use strict';

const fs = require('fs');
const path = require('path');
const showdown  = require('showdown');
showdown.setFlavor('github');
const converter = new showdown.Converter();

const asyncGetFolder = (folder, pathname, dirname, p) => {
    let pname = path.join(dirname, p);
    return new Promise(function(resolve, reject) {
        fs.stat(pname, (err, stat) => {
            if (stat.isDirectory()) {
                folder.push({
                    name: p,
                    path: pathname + p +'/',
                    children: [],
                });
            } else if (stat.isFile()) {
                if (p.substr(-3)==='.md') {
                    folder.push({
                        name: p,
                        path: pathname + p
                    });
                }
            }
            resolve();
        });
    });
};

exports.getFolderList = (pathname, dirname, callback) => {
    fs.readdir(dirname, (err, files) => {
        if (err) {
            console.error(err);
            return callback([]);
        }
        let folder = [];
        let promiseArr = [];
        for (let p of files) {
            if (p.substr(0,1)!=='.') {
                promiseArr.push(asyncGetFolder(folder, pathname, dirname, p));
            }
        }
        Promise.all(promiseArr).then((results) => {
            callback(folder);
        });
    });
};

const asyncGetNote = (noteList, pathname, dirname, p) => {
    let pname = path.join(dirname, p);
    return new Promise(function(resolve, reject) {
        fs.stat(pname, (err, stat) => {
            if (stat.isFile()) {
                // TODO: read file head content
                noteList.push({
                    'title': p,
                    'path': pathname + p
                });
            }
            resolve();
        });
    });
};

exports.getNoteList = (pathname, dirname, callback) => {
    fs.readdir(dirname, (err, files) => {
        if (err) {
            console.error(err);
            return callback([]);
        }
        let noteList = [];
        let promiseArr = [];
        for (let p of files) {
            if (p.substr(-3)==='.md') {
                promiseArr.push(asyncGetNote(noteList, pathname, dirname, p));
            }
        }
        Promise.all(promiseArr).then((results) => {
            callback(noteList);
        });
    });
};

exports.getNote = (filename, callback) => {
    fs.readFile(filename, 'utf8', (err, text) => {
        if (err) {
            text = err.message;
        }
        let html = converter.makeHtml(text);
        callback(html);
    });
};

