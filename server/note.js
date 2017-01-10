'use strict';

const fs = require('fs');
const path = require('path');
const showdown  = require('showdown');
showdown.setFlavor('github');
const converter = new showdown.Converter();

const asyncGetNotes = (notes, pathname, dirname, p) => {
    let pname = path.join(dirname, p);
    return new Promise(function(resolve, reject) {
        fs.stat(pname, (err, stat) => {
            if (stat.isDirectory()) {
                notes.push({
                    'title': p,
                    'path': pathname + p +'/'
                });
            } else if (stat.isFile()) {
                if (p.substr(-3)==='.md') {
                    notes.push({
                        'title': p,
                        'path': pathname + p
                    });
                }
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
        let notes = [];
        let promiseArr = [];
        for (let p of files) {
            if (p.substr(0,1)!=='.') {
                promiseArr.push(asyncGetNotes(notes, pathname, dirname, p));
            }
        }
        Promise.all(promiseArr).then((results) => {
            callback(notes);
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

