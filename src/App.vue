<template>
    <div>
        <v-header></v-header>
        <v-content v-show="contentType=='list'">
            <div>
                <ul class="top-gap-big text-muted">
                    <li v-for="item in noteList">
                        <v-link :href="item.path">{{item.title}}</v-link>
                    </li>
                </ul>
            </div>
        </v-content>
        <v-content v-show="contentType=='note'">
            <div>
                <p
                v-on:click="back"
                >back</P>
                <p
                v-on:click="forward"
                >forward</P>
                <p
                v-on:click="replace"
                >replace</P>
            </div>
            <div v-html="note"></div>
        </v-content>
        <v-footer></v-footer>
    </div>
</template>
<script>
import util from 'util';

export default {
    data () {
        return {
            noteList: [],
            note: '',
            loading: false
        };
    },
    computed: {
        contentType () {
            let contentType = 'note';
            let path = this.$root.currentRoute;
            if (path && path.substr(-1)==='/') {
                contentType = 'list';
                console.log('list');
                this.getNoteList();
            } else {
                this.getNote();
            }
            return contentType;
        }
    },
    methods: {
        back () {
            this.$root.go(-1);
        },
        forward () {
            this.$root.go(1);
        },
        replace () {
            this.$root.replace(this.$root.currentRoute+'/x');
        },
        getNote () {
            this.loading = true;
            util.get('/api/note', {
                pathname: this.$root.currentRoute
            }, (res) => {
                this.loading = false;
                this.note = res.content;
            }, (err) => {
                this.loading = false;
            });
        },
        getNoteList () {
            this.loading = true;
            util.get('/api/noteList', {
                pathname: this.$root.currentRoute
            }, (res) => {
                this.loading = false;
                this.noteList = res.noteList;
            }, (err) => {
                this.loading = false;
            });
        }
    }
}
</script>

