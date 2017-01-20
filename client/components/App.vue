<style scoped>
.tree {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
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
            </div>
        </div>
        <div class="mdui-container-fluid">
                <v-header>
                    <span v-if="contentType!=='list'">
                    <span class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white"
                        @click="timerToggle">
                        <i v-if="timerIndex===-1"
                            class="mdui-icon material-icons">&#xe426;</i>
                        <i v-else class="mdui-icon material-icons">&#xe425;</i>
                    </span>
                    </span>
                </v-header>
                <div class="mdui-divider"></div>

                <v-content v-show="contentType==='list'">
                    <ul class="mdui-list">
                        <div v-for="item in noteList">
                        <li>
                            <v-link :href="item.path"
                                class="mdui-list-item mdui-ripple">
                                <i class="mdui-list-item-avatar mdui-icon material-icons mdui-color-blue mdui-text-color-white">{{'&#xe85d;'}}</i>
                                <div class="mdui-list-item-content">
                                    <div class="mdui-list-item-title mdui-list-item-one-line">
                                        <span class="mdui-typo-title">
                                        {{item.title}}
                                        </span>
                                    </div>
                                    <div class="mdui-list-item-text mdui-list-item-two-line">
                                        <span class="mdui-text-color-theme-text">
                                            {{item.updateTime}} 
                                        <br>
                                        </span>
                                        {{item.preview}}
                                    </div>
                                </div>
                            </v-link>
                        </li>
                        <li v-if="!item.isLast" class="mdui-divider-inset mdui-m-y-0"></li>
                        </div>
                    </ul>
                </v-content>
                <v-content v-show="contentType=='note'">
                    <div class="mdui-container">
                        <div v-html="note"></div>
                    </div>
                </v-content>

                <div class="mdui-divider"></div>
				<v-footer></v-footer>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import util from 'util'
import 'mdui/dist/js/mdui.js'

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
        path: '/',
      },
      activePath: '',
      timerIndex: -1
    }
  },
  computed: {
    contentType () {
      let contentType = 'note'
      const path = this.currentRoute
      if (path && path.substr(-1) === '/') {
        contentType = 'list'
        this.getNoteList()
      } else {
        this.getNote()
      }
      console.log('contentType:', contentType)
      return contentType
    }
  },
  methods: {
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
        if (res.noteList.length>0) {
          res.noteList[res.noteList.length-1].isLast = true;
        }
        this.loading = false
        this.noteList = res.noteList
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
          const inst = new mdui.Drawer('#left-drawer');
          inst.close();
      }
    },
    timerToggle () {
        if (this.timerIndex!==-1) {
            clearInterval(this.timerIndex)
            this.timerIndex = -1
        } else {
            this.timerIndex = setInterval(this.getNote, 1000)
        }
    }
  }
}
</script>

