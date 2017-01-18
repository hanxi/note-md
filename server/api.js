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

const resJson = (req, res, json) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(json));
};

register('/folder', function(req, res) {
    let uri = parser.parse(req.url, true);
    let pathname = uri.query.pathname;
    let dirname = path.join(C.noteDir, pathname);
    fs.access(dirname, (err) => {
        let exists = err ? false : true;
        if (!exists) {
            return notFound(req, res);
        }
        note.getFolderList(pathname, dirname, (folder) => {
            return resJson(req, res, { folder });
        });
    });
});

register('/noteList', function(req, res) {
    let uri = parser.parse(req.url, true);
    let pathname = uri.query.pathname;
    let dirname = path.join(C.noteDir, pathname);
    console.log('dirname', dirname);
    fs.access(dirname, (err) => {
        let exists = err ? false : true;
        if (!exists) {
            return notFound(req, res);
        }
        note.getNoteList(pathname, dirname, (noteList) => {
            return resJson(req, res, { noteList });
        });
    });
});

register('/note', function(req, res) {
    let uri = parser.parse(req.url, true);
    let pathname = uri.query.pathname;
    let filename = path.join(C.noteDir, pathname);
    fs.access(filename, (err) => {
        let exists = err ? false : true;
        if (!exists) {
            return notFound(req, res);
        }
        note.getNote(filename, (content) => {
            return resJson(req, res, {content});
        });
    });

});

