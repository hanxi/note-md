<style>
</style>
<template>
    <header class="theme-header">
        <nav class="flex-left">
            <ul>
              <v-tree
                :model="treeData"
                :root="this">
              </v-tree>
            </ul>
        </nav>

        <nav class="flex-top">
            <span v-for="item in paths">
                <v-link :href="item.path">{{item.name}}</v-link>
                >>
            </span>
            <span>{{current}}</span>
        </nav>
    </header>
</template>
<script>

import Vue from 'vue';
import util from 'util';


let data = {
    name: '个人笔记',
    children: [],
    path: '/'
};

export default {
    data () {
        return {
            treeData: data,
            activePath: ''
        };
    },
    computed: {
        paths () {
            let path = this.getPath();
            let paths = [];
            let fromIndex = 0;
            while (true) {
                let index = path.indexOf('/', fromIndex);
                if (index===-1) {
                    break;
                }
                paths.push({
                    path: path.substring(0, index+1),
                    name: path.substring(fromIndex, index===0?index+1:index)
                });
                fromIndex = index + 1;
            }
            return paths;
        },
        current () {
            let path = this.getPath();
            let index = path.lastIndexOf('/');
            let current = path.substring(index+1);
            return current;
        }
    },
    methods: {
        getPath () {
            let path = this.$root.currentRoute;
            if (path.substr(-1,1)==='/') {
                path = path.substr(0,path.length-1);
            }
            return path;
        },
        onOpened (model) {
            if (!model._loading) {
                console.log('open2', model.path, model._loading);
                Vue.set(model, 'children', []);
                Vue.set(model, '_loading', true);
                util.get('/api/folder', {
                    pathname: model.path
                }, (res) => {
                    Vue.set(model, '_loading', false);
                    for (let item of res.folder) {
                        model.children.push(item);
                    }
                    console.log('res', res);
                }, (err) => {
                    Vue.set(model, '_loading', false);
                });
            }
        },
        onSelected (model) {
            this.$root.push(model.path);
        }
    }
}
</script>

