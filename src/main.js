import Vue from 'vue';
import Vuex from 'vuex';

import components from './components/'; //加载公共组件
import App from './App';

Vue.use(Vuex);

Object.keys(components).forEach((key) => {
    var name = key.replace(/(\w)/, (v) => v.toUpperCase()); //首字母大写
    Vue.component(`v${name}`, components[key]);
});

const app = new Vue({
    el: '#app',
    data: {
        currentRoute: window.location.pathname
    },
    template: '<App/>',
    components: { App },
    methods: {
        push (href) {
			this.currentRoute = href;
			window.history.pushState(null, null, href);
        },
        replace (href) {
			this.currentRoute = href;
			window.history.replaceState(null, null, href);
        },
        go (n) {
            window.history.go(n);
        }
    }
});

window.addEventListener('popstate', (e) => {
    app.currentRoute = window.location.pathname;
});

