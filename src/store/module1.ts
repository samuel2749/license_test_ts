import { Commit } from 'vuex';
const state = {
    menulist: [],
    name: 'test'
};

const mutations = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveMenuList(states: any, params: object) {
        states.menulist = params;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setName(states: any, value: string) {
        states.name = value;
    }
};

const actions = {
    saveMenuListFN(context: { commit: Commit }, params: object) {
        context.commit('saveMenuList', params);
    },
    setName(context: { commit: Commit }, value: string) {
        context.commit('setName', value);
    }
};

export default {
    namespaced: true, // namespaced为false的时候，state,mutations,actions全局可以调用，为true，生成作用域，引用时要声明模块名称
    state,
    mutations,
    actions
};
