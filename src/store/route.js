import Vue from 'vue';

export const ROUTE = 'ROUTE';

export default {
    state: {
    },
    mutations: {
        [ROUTE](state, route) {
            Object.assign(state, route);
        }
    },
    actions: {
        [ROUTE]({commit}, route) {
            commit(ROUTE, route);
        }
    }
}

