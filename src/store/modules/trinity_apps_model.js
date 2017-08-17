import { HTTP } from '../../axios/http-common';

const types = {
    Fetch_Trinity_APPS: 'fetch/Trinity_APPS_MODEL'
}

// lang state 必須是 Object
const state = {
    appsContent: []
}

// getters 也可以整理到這邊直接返回 lang 內容
const getters = {
    getTrinityApps: state => state.appsContent
}

// actions 也是以 Object 形式建構。
const actions = {
    fetchTrinityAPPS({ commit }) {
        HTTP.get(`trinity-apps-model/get-apps-model`)
            .then(response => {
                commit(types.Fetch_Trinity_APPS, response.data);
            })
            .catch(e => {
                console.error(e);
            })
    }
}

// mutations
const mutations = {
    [types.Fetch_Trinity_APPS](state, appsContent) {
        state.appsContent = appsContent;
        console.log('Mutation Success', types.Fetch_Trinity_APPS);

    }
}

/*
  因為我們把 vuex 所有職權都寫在同一隻檔案，
  所以必須要 export 出去給最外層 index.js 組合使用
*/
export default {
    state,
    getters,
    actions,
    mutations
}