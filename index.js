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

const staticFilePaths = [process.cwd(), noteDir];
const existsStaticFile = (pathname, callback) => {
    for (let parrentPath of staticFilePaths) {
        let filename = path.join(parrentPath, pathname);
        if (fs.existsSync(filename)) {
            return callback(filename);
        }
    }
    callback(null);
};

const generatePaths = (pathname) => {
    let pathList = pathname.split('/');
    for (let i=0; i<pathList.length-1; i++) {
    }
    console.log('pathList:', pathList);
    let paths = [{
        'path': '/',
        'name': 'index'
    }];
    let pathPre = '/';
    for (let i=0; i<pathList.length; i++) {
        let p = pathList[i];
        if (p!=='') {
            console.log('path:', p);
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
    console.log(paths)
    return paths;
};

const generateNotes = (pathname, dirname) => {
    let files = fs.readdirSync(dirname);
    let notes = [];
    for (let p of files) {
        console.log('xxxxx', path.extname(p));
        let pname = path.join(dirname, p);
        let stat = fs.statSync(pname);
        if (stat.isDirectory()) {
            notes.push({
                'title': p,
                'path': pathname + p + '/'
            });
        } else if (stat.isFile()) {
            let ext = path.extname(p).split('.')[1];
            if (ext=='md') {
                notes.push({
                    'title': p,
                    'path': pathname + p
                });
            }
        }
    }
    console.log(notes);
    return notes;
};

const notFound = (res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
};

const parseNote = (filename) => {
    let text = fs.readFileSync(filename, 'utf8');
    let html = converter.makeHtml(text);
    return html;
};


const requestHandler = (req, res) => {
    let pathname = urlParse(req.url).pathname;
    console.log(pathname);
    let mimeType = mimeTypes[path.extname(pathname).split('.')[1]];
    if (mimeType) {
        existsStaticFile(pathname, (filename) => {
            if (!filename) {
                return notFound(res);
            }
            res.writeHead(200, mimeType);
            let fileStream = fs.createReadStream(filename);
            fileStream.pipe(res);
        });
    } else {
        if (pathname.substr(-1)==='/') {
            console.log('in directory');
            let dirname = path.join(noteDir, pathname);
            fs.exists(dirname, (exists) => {
                if (!exists) {
                    return notFound(res);
                }
                let data = {
                    'paths': generatePaths(pathname),
                    'notes': generateNotes(pathname, dirname)
                };
                res.end(directoryTemplate(data));
            });
        } else if (pathname.substr(-3)==='.md') {
            let filename = path.join(noteDir, pathname);
            fs.exists(filename, (exists) => {
                if (!exists) {
                    return notFound(res);
                }
                let data = {
                    'paths': generatePaths(pathname),
                    'note': parseNote(filename)
                };
                res.end(noteTemplate(data));
            });
        } else {
            return notFound(res);
        }
    }
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});

