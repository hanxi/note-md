<style scoped>
.tree {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
}
.searchbar {
    max-width: 300px;
}
.content {
    min-height: 400px;
}
</style>
<template>
    <div class="mdui-appbar-with-toolbar mdui-drawer-body-left mdui-theme-primary-blue mdui-theme-accent-light-blue">

        <div id="left-drawer" class="mdui-drawer mdui-drawer-close mdui-shadow-5">
            <ul class="tree">
                    <v-tree
                 :model="treeData">
                    </v-tree>
            </ul>
        </div>

        <div class="mdui-appbar mdui-appbar-fixed">
            <div class="mdui-toolbar mdui-color-theme">
                <span class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-drawer="{target: '#left-drawer'}">
                    <i class="mdui-icon material-icons">{{'&#xe5d2;'}}</i>
                </span>
                <span class="mdui-typo-title">{{treeData.name}}</span>
                <div class="mdui-toolbar-spacer"></div>
                <div class="mdui-textfield mdui-textfield-expandable mdui-float-right searchbar">
                    <button class="mdui-textfield-icon mdui-btn mdui-btn-icon"
                        @click="search">
                        <i class="mdui-icon material-icons">&#xe8b6;</i>
                    </button>
                    <input class="mdui-textfield-input" type="text" placeholder="搜索"
                        @keyup.enter="search"
                        v-model="searchText"/>
                    <button 
                        @click="searchText=''"
                        class="mdui-textfield-close mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">&#xe5cd;</i></button>
                </div>
            </div>
        </div>

        <div class="mdui-container-fluid">
                <v-header v-if="page!=='search'">
                    <span v-if="page==='note'">
                        <span class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white"
                            @click="timerToggle">
                            <i v-if="timerIndex===-1"
                                class="mdui-icon material-icons">&#xe426;</i>
                            <i v-else class="mdui-icon material-icons">&#xe425;</i>
                        </span>
                    </span>
                </v-header>

                <div class="mdui-divider"></div>

                <div class="mdui-container-fluid content">
                    <v-list 
                        v-show="page==='list'"
                        :note-list="noteList"></v-list>

                    <div
                        v-show="page=='note'"
                        class="mdui-container">
                        <v-note :note="note"></v-note>
                    </div>

                    <v-list
                        v-show="page=='search'"
                        :note-list="noteList">
                    </v-list>
                </div>

                <div class="mdui-divider"></div>

				<v-footer></v-footer>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import util from 'util'
/* global mdui */
import 'mdui/dist/js/mdui.js'
import queryString from 'query-string'

export default {
  data () {
    return {
      noteList: [],
      note: '',
      loading: false,
      currentRoute: window.location.pathname,
      treeData: {
        name: '个人笔记',
        children: [],
        path: '/'
      },
      timerIndex: -1,
      searchText: '',
      searchPath: ''
    }
  },
  computed: {
    page () {
      return this.getPage()
    }
  },
  methods: {
    getPage () {
      let page = 'note'
      const path = this.currentRoute
      if (path && path.indexOf('/search') !== -1) {
        page = 'search'
        if (this.searchPath === '') {
          this.getSearchList()
        }
      } else if (path && path.substr(-1) === '/') {
        page = 'list'
        this.getNoteList()
      } else {
        this.getNote()
      }
      console.log('page:', page)
      return page
    },
    getNote () {
      this.loading = true
      util.get('/api/note', {
        pathname: this.currentRoute
      }, (res) => {
        this.loading = false
        this.note = res.content
      }, () => {
        this.loading = false
      })
    },
    getNoteList () {
      this.loading = true
      util.get('/api/noteList', {
        pathname: this.currentRoute
      }, (res) => {
        if (res.noteList.length > 0) {
          res.noteList[res.noteList.length - 1].isLast = true
        }
        this.loading = false
        const noteList = []
        for (const item of res.noteList) {
          noteList.push({
            title: item.title,
            firstLine: item.updateTime,
            secondLine: item.preview,
            path: item.path
          })
        }
        this.noteList = noteList
      }, () => {
        this.loading = false
      })
    },
    push (href) {
      this.currentRoute = href
      window.history.pushState(null, null, href)
    },
    replace (href) {
      this.currentRoute = href
      window.history.replaceState(null, null, href)
    },
    go (n) {
      window.history.go(n)
    },
    onOpened (model) {
      if (!model._loading) {
        console.log('open2', model.path, model._loading)
        Vue.set(model, 'children', [])
        Vue.set(model, '_loading', true)
        util.get('/api/folder', {
          pathname: model.path
        }, (res) => {
          Vue.set(model, '_loading', false)
          for (const item of res.folder) {
            model.children.push(item)
          }
          console.log('res', res)
        }, () => {
          Vue.set(model, '_loading', false)
        })
      }
    },
    onSelected (model) {
      this.push(model.path)
      if (!mdui.screen.mdUp()) {
        const inst = new mdui.Drawer('#left-drawer')
        inst.close()
      }
    },
    timerToggle () {
      if (this.timerIndex !== -1) {
        clearInterval(this.timerIndex)
        this.timerIndex = -1
      } else {
        this.timerIndex = setInterval(this.getNote, 1000)
      }
    },
    search () {
      if (this.searchText !== '') {
        this.push('/search?q=' + this.searchText)
        this.getSearchList()
      }
    },
    getSearchList () {
      this.searchPath = this.path
      this.loading = true
      const parsed = queryString.parse(window.location.search)
      if (parsed.q && parsed.q !== '') {
        util.get('/api/search', {
          text: parsed.q
        }, (res) => {
          console.log('res', res)
          this.loading = false
          const noteList = []
          for (const item of res.results) {
            noteList.push({
              title: item.title,
              firstLine: item.match,
              secondLine: item.line,
              path: item.path
            })
          }
          this.noteList = noteList
        }, () => {
          this.loading = false
        })
      }
    }
  }
}
</script>

