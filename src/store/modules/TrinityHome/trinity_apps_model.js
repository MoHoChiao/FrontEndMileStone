import { HTTP } from '../../../axios/http-common';
import * as common_types from '../../common_mutations_type.js';

const types = {
    Fetch_Trinity_APPS: 'fetch/Trinity_APPS_MODEL'
}

// state
const state = {
    appsContent: []
}

// getters 也可以整理到這邊直接返回內容
const getters = {
    getTrinityApps: state => state.appsContent
}

// actions 也是以 Object 形式建構。
const actions = {
    fetchTrinityAPPS({ commit }) {
        HTTP.get(`trinity-prop-setting/find-all-apps`)
            .then(response => {
                commit(types.Fetch_Trinity_APPS, response.data);
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.msg) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    commit(common_types.Set_System_Status, newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    commit(common_types.Set_System_Status, newStatus);
                }
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