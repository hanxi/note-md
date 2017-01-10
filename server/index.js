'use strict';

const http = require('http');

const C = require('./constant');
const router = require('./router');
require('./api');

router.addStaticPath(C.noteDir);

router.register('/', function(req, res) {
    // TODO: 返回 index.html
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
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

