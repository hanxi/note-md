'use strict';

const http = require('http');
const urlParse = require('url').parse;
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const directoryTemplate = require('./templates/directory.hbs');
const noteTemplate = require('./templates/note.hbs');
const showdown  = require('showdown');
showdown.setFlavor('github');
const converter = new showdown.Converter();


const port = 3000;
const noteDir = 'note';
const mimeTypes = {
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'js': 'text/javascript',
    'css': 'text/css'
};


const asyncExistsFile = (filename) => {
    return new Promise(function(resolve, reject) {
        fs.exists(filename, (exists) => {
            resolve([filename, exists]);
        })
    });
}
const staticFilePaths = [process.cwd(), noteDir];
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

const generatePaths = (pathname) => {
    let pathList = pathname.split('/');
    for (let i=0; i<pathList.length-1; i++) {
    }
    let paths = [{
        'path': '/',
        'name': 'index'
    }];
    let pathPre = '/';
    for (let i=0; i<pathList.length; i++) {
        let p = pathList[i];
        if (p!=='') {
            pathPre += p;
            if (i!==pathList.length-1) {
                pathPre += '/';
            }
            paths.push({
                'path': pathPre,
                'name': p
            });
        }
    }
    return paths;
};

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

const generateNotes = (pathname, dirname, callback) => {
    fs.readdir(dirname, (err, files) => {
        if (err) {
            console.error(err);
            return callback([]);
        }
        let notes = [];
        let promiseArr = [];
        for (let p of files) {
            promiseArr.push(asyncGetNotes(notes, pathname, dirname, p));
        }
        Promise.all(promiseArr).then((results) => {
            callback(notes);
        });
    });
};

const sendDirectoryRender = (res, pathname, dirname) => {
    let paths = generatePaths(pathname);
    generateNotes(pathname, dirname, (notes) => {
        let data = {
            'paths': paths,
            'notes': notes
        };
        res.end(directoryTemplate(data));
    });
};

const notFound = (req, res) => {
    console.error(req.url, ' Not Found');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
};

const parseNote = (filename, callback) => {
    fs.readFile(filename, 'utf8', (err, text) => {
        if (err) {
            text = err.message;
        }
        let html = converter.makeHtml(text);
        callback(html);
    });
};

const sendNoteRender = (res, pathname, filename) => {
    let paths = generatePaths(pathname);
    parseNote(filename, (note) => {
        let data = {
            'paths': paths,
            'note': note
        };
        res.end(noteTemplate(data));
    });
};

const requestHandler = (req, res) => {
    let pathname = urlParse(req.url).pathname;
    console.log(pathname);
    let mimeType = mimeTypes[path.extname(pathname).split('.')[1]];
    if (mimeType) {
        existsStaticFile(pathname, (filename) => {
            if (!filename) {
                return notFound(req, res);
            }
            res.writeHead(200, mimeType);
            let fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        });
    } else {
        if (pathname.substr(-1)==='/') {
            let dirname = path.join(noteDir, pathname);
            fs.exists(dirname, (exists) => {
                if (!exists) {
                    return notFound(req, res);
                }
                sendDirectoryRender(res, pathname, dirname);
            });
        } else if (pathname.substr(-3)==='.md') {
            let filename = path.join(noteDir, pathname);
            fs.exists(filename, (exists) => {
                if (!exists) {
                    return notFound(req, res);
                }
                sendNoteRender(res, pathname, filename);
            });
        } else {
            return notFound(req, res);
        }
    }
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.error('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});

