<style>
.active {
    color: #8449c5;
}
</style>
<template>
    <li>
        <a
            :class="{active: model.path===root.activePath }"
            @click="selected">
            {{model.name}}
            <span @click="toggle" v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </a>
        <ul v-show="open" v-if="isFolder">
            <v-tree
                v-for="model in orderedChildren"
                :model="model"
                :root="root">
            </v-tree>
        </ul>
    </li>
</template>
<script>
import Vue from 'vue';
import is from 'is';

export default {
    props: {
        model: Object,
        root: Object
    },
    data () {
        return {
            open: false
        };
    },
    computed: {
        isFolder () {
            return this.model.children;
        },
        orderedChildren() {
            if (this.isFolder) {
                this.model.children.sort((a,b) => {
                    if (a.children) {
                        return -1;
                    }
                    if (b.children) {
                        return 1;
                    }
                    return a.name>b.name;
                });
            }
            return this.model.children;
        }
    },
    methods: {
        toggle () {
            if (this.isFolder) {
                this.open = !this.open;
            }
        },
        addChild () {
            this.model.children.push({
                name: 'new stuff'
            })
        },
        selected () {
            if (is.fn(this.root.onSelected)) {
                this.root.onSelected(this.model);
            }
            this.root.activePath = this.model.path;
        }
    },
    watch: {
        open (val) {
            if (!this.model.hasOwnProperty('_loading')) {
                Vue.set(this.model, '_loading', false);
            }
            if (val) {
                console.log('open', this.model.path);
                if (this.root.hasOwnProperty('onOpened')
                    && is.fn(this.root.onOpened)) {
                    this.root.onOpened(this.model);
                }
            } else {
                console.log('close', this.model.path);
                if (this.root.hasOwnProperty('onClosed')
                    && is.fn(this.root.onClosed)) {
                    this.root.onClosed(this.model);
                }
            }
        }
    }
};
</script>

