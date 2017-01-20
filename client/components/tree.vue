<style>
.active {
    color: #8449c5;
    font-weight: 700;
}
.menu-list, .menu-list-item {
    list-style-type: none;
    margin: 0px;
    padding-left: 24px;
    padding-top: 5px;
}
</style>
<template>
    <li class="menu-list-item">
        <a class="mdui-ripple"
           :class="{'active': model.path===root.activePath}">
            <i
                v-if="isFolder"
                @click="toggle"
                class="mdui-icon material-icons mdui-text-color-blue-a200">
                {{open ? '&#xe2c8;' : '&#xe2c7;'}}
                
            </i>
            <i v-else class="mdui-icon material-icons mdui-text-color-blue-a100">&#xe24d;</i>
            <span @click="selected">
                {{model.name}}
            </span>

        </a>

        <ul class="" style="list-style-type:none; padding:0px;" v-show="open" v-if="isFolder">
            <v-tree
                          v-for="model in orderedChildren"
                          :model="model"
                          :root="root">
            </v-tree>
        </ul>
    </li>
</template>
<script>
import Vue from 'vue'
import is from 'is'

export default {
  props: {
    model: Object,
    root: Object
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    isFolder () {
      return this.model.children
    },
    orderedChildren () {
      if (this.isFolder) {
        this.model.children.sort((a, b) => {
          if (a.children) {
            return -1
          }
          if (b.children) {
            return 1
          }
          return a.name > b.name
        })
      }
      return this.model.children
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
    addChild () {
      this.model.children.push({
        name: 'new stuff'
      })
    },
    selected () {
      if (is.fn(this.root.onSelected)) {
        this.root.onSelected(this.model)
      }
      this.root.activePath = this.model.path
    }
  },
  watch: {
    open (val) {
      if (!this.model.hasOwnProperty('_loading')) {
        Vue.set(this.model, '_loading', false)
      }
      if (val) {
        console.log('open', this.model.path)
        if (this.root.hasOwnProperty('onOpened') &&
                    is.fn(this.root.onOpened)) {
          this.root.onOpened(this.model)
        }
      } else {
        console.log('close', this.model.path)
        if (this.root.hasOwnProperty('onClosed') &&
                    is.fn(this.root.onClosed)) {
          this.root.onClosed(this.model)
        }
      }
    }
  }
}
</script>

