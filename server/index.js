'use strict';

const http = require('http');
const fs = require('fs');

const C = require('./constant');
const router = require('./router');
require('./api');

router.addStaticPath(C.noteDir);
router.addStaticPath(C.dist);

const index = fs.readFileSync(`${C.dist}/index.html`);

router.notFound( () => {
    return handlerFactory.createHandler((req, res) => {
        // 返回 index.html
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(index);
    });
});

const server = http.createServer((req, res) => {
    router.route(req, (handler) => {
        handler.process(req, res);
    });
});

server.listen(C.port, (err) => {
    if (err) {
        return console.error('something bad happened', err);
    }
    console.log(`server is listening on ${C.port}`);
});


const git = require('./git');
const autoBackupInterval = 30*60*1000; // 半小时备份一次
git.backup(); // 启动时备份一次
setInterval(git.backup, autoBackupInterval);

