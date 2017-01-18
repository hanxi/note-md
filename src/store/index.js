import Vue from 'vue';
import Vuex from 'vuex';
import route from './route';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true, //使用严格模式
    modules: {
        route
    }
});

