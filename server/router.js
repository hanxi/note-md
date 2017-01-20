'use strict';

const handlerFactory = require('./handler');
const fs = require('fs');
const parser = require('url');
const path = require('path');
const note = require('./note');
const C = require('./constant');
let handlers = {};

let notFound = () => {
    return handlerFactory.createHandler((req, res) => {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("No route registered for " + req.url);
    });
};

const missing = (req, callback) => {
    let uri = parser.parse(req.url, true);
    let mimeType = mimeTypes[path.extname(uri.pathname).split('.')[1]];
    if (mimeType) {
        existsStaticFile(uri.pathname, (filename) => {
            if (!filename) {
                return callback(notFound());
            }
            let handler = handlerFactory.createHandler((req, res) => {
                res.writeHead(200, mimeType);
                let fileStream = fs.createReadStream(filename);
                fileStream.pipe(res);
            });
            callback(handler);
        });
    } else {
        callback(notFound());
    }
};

exports.notFound = (callback) => {
    notFound => handlerFactory.createHandler(callback);
};

exports.clear = () => {
    handlers = {};
};

exports.register = (url, method) => {
    handlers[url] = handlerFactory.createHandler(method);
};

exports.route = (req, callback) => {
    let uri = parser.parse(req.url, true);
    let handler = handlers[uri.pathname];
    if (!handler) {
        missing(req, callback);
    } else {
        callback(handler);
    }
};

const mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css'
};

let staticFilePaths = new Set([process.cwd()]);
const asyncExistsFile = (filename) => {
    return new Promise(function(resolve, reject) {
        fs.access(filename, (err) => {
            let exists = err ? false : true;
            resolve([filename, exists]);
        })
    });
}
const existsStaticFile = (pathname, callback) => {
    let promiseArr = [];
    for (let parrentPath of staticFilePaths) {
        let filename = path.join(parrentPath, pathname);
        promiseArr.push(asyncExistsFile(filename));
    }

    Promise.all(promiseArr).then((results) => {
        for (let result of results) {
            if (result[1]) {
                return callback(result[0]);
            }
        }
        callback(null);
    });
};

exports.addStaticPath = (p) => {
    staticFilePaths.add(p);
};

