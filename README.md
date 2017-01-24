# 个人笔记-markdown

一个专注浏览的个人笔记.

### 快速使用

```bash
git clone https://github.com/hanxi/note-md.git
cd node-md
npm install
npm run build
npm start
```

- 笔记存储在 `note` 目录
- 浏览器访问 <http://localhost:3000>

### 配置备份笔记

- 在 GitHub 上建一个空项目(类似这个 [note-md-testbackup](https://github.com/hanxi/note-md-testbackup) )
- 项目类型一定要选 private（国内的 oschina 和 Coding 都提供免费私人项目)
- 修改 `server/conf.js` 中的 `git` 为自己刚新建的工程的 SSH 协议的路径(HTTPS需要输入密码不适合自动备份)
- 前提是本地配好了 id_rsa 和 GitHub 上也填写好了 id_rsa.pub
- 默认半小时提交一次

### 功能

- [x] 实时刷新
- [x] 定期备份 `note` 目录
- [x] 目录树
- [x] 笔记搜索

### TODO

- [ ] 搜索笔记时考虑搜索文件名
- [ ] 左侧栏支持自定义宽度

### 这些库帮我减少了不少时间

- Markdown 转 HTML [showdown](https://github.com/showdownjs/showdown)
- ~~轻量灵活的移动端 CSS 框架 [mobi.css](https://github.com/xcatliu/mobi.css)~~ (v0.0.1)
- 基于 Material Design 的前端框架 [MDUI](https://github.com/zdhxiong/mdui)
- 文件内容搜索工具 [find-in-files](https://github.com/kaesetoast/find-in-files)
- 当然少不了 [Vue](https://cn.vuejs.org/)
