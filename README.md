# 个人笔记-markdown

一个专注浏览的个人笔记.

### 快速使用

```bash
git clone https://github.com/hanxi/note-md.git
cd node-md
npm install
npm start
```

- 笔记存储在 `note` 目录
- 浏览器访问 <http://localhost:3000>

### 配置备份笔记

- 在 GitHub 上建一个空项目(类似这个 [note-md-testbackup](https://github.com/hanxi/note-md-testbackup) )
- 项目类型一定要选 private（国内的 oschina 和 Coding 都提供免费私人项目)
- 修改 `git.js` 中的 `gitUrl` 为自己刚新建的工程的 SSH 协议的路径(HTTPS需要输入密码不适合自动备份)
- 前提是本地配好了 id_rsa 和 GitHub 上也填写好了 id_rsa.pub
- 默认半小时提交一次

### TODO

- [ ] 实时刷新
- [x] 定期备份 `note` 目录
- [x] 目录树
- [ ] 笔记搜索

### 这些库帮我减少了不少时间

- Markdown 转 HTML [showdown](https://github.com/showdownjs/showdown)
- ~~轻量灵活的移动端 CSS 框架 [mobi.css](https://github.com/xcatliu/mobi.css)~~
- 基于 Material Design 的前端框架 [MDUI](https://github.com/zdhxiong/mdui)
