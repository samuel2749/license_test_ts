import Vue from 'vue';
import Vuex from 'vuex';
import test from './module1';

Vue.use(Vuex);
const SET_DEVICE = 'SET_DEVICE';
export default new Vuex.Store({
    state: {
        isMobile: false,
        name: ''
    },
    mutations: {
        SET_DEVICE(state, value) {
            state.isMobile = value;
        }
    },
    actions: {
        SetDevice: function(context, val) {
            context.commit(SET_DEVICE, val);
        }
    },
    modules: {
        test
    }
});
