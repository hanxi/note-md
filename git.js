'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const gitUrl = 'git@github.com:hanxi/note-md-testbackup.git';
const noteDir = path.join(process.cwd(), 'note');

const myExec = function(cmd) {
    let promise = new Promise(function(resolve, reject){
        exec(cmd, {cwd: noteDir}, (error, stdout, stderr) => {
            console.log('='.repeat(80));
            console.log(`cmd: ${cmd}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error) {
                console.error(`exec error: ${error}`);
                reject();
                return;
            }
            resolve();
        });
    });
    return promise;
};

let api = {};

api.init = () => {
    let exists = fs.existsSync(noteDir);
    if (!exists) {
        fs.mkdirSync(noteDir);
    }
    myExec('git init').then(
        () => myExec(`git remote add origin ${gitUrl}`)
    ).then(
        () => myExec('git pull origin master')
    ).then(
        () => console.log("init git success!"),
        () => console.log("init git failed!")
    );
}

api.backup = () => {
    myExec('git add .').then(
        () => myExec('git commit -a -m "auto backup"')
    ).then(
        () => myExec('git push -u origin master')
    ).then(
        () => console.log("auto backup success!"),
        () => console.log("auto backup failed!")
    );
}

const method = process.argv[2];
if ((typeof method)==='string') {
    if (method in api) {
        api[method]();
    }
}

module.exports = api;

