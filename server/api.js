'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('url');

const router = require('./router');
const note = require('./note');
const C = require('./constant');

const register = (url, method) => {
    router.register('/api'+url, method);
};

const notFound = (req, res) => {
    console.error(req.url, ' Not Found');
    let mime = req.headers.accepts || 'application/json';
    res.writeHead(404, {'Content-Type': mime});
    let ret = {
        error: 'Not Found'
    }
    res.end(JSON.stringify(ret));
};

register('/tree', function(req, res) {
});

register('/list', function(req, res) {
    let uri = parser.parse(req.url, true);
    let pathname = uri.query.pathname;
    let dirname = path.join(C.noteDir, pathname);
    fs.access(dirname, (err) => {
        let exists = err ? false : true;
        if (!exists) {
            return notFound(req, res);
        }
        note.getNoteList(pathname, dirname, (notes) => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(notes));
        });
    });
});

