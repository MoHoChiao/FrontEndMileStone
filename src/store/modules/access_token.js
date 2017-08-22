import { HTTP } from '../../axios/http-common';

const types = {
    Fetch_Access_Token: 'fetch/Access_Token',
    Gen_Access_Token: 'gen/Access_Token'
}

// state
const state = {
    accessToken: ''
}

// getters 也可以整理到這邊直接返回內容
const getters = {
    getAccessToken: state => state.accessToken
}

// actions 也是以 Object 形式建構。
const actions = {
    genAccessToken({ commit }, formAttr) {
        alert(formAttr.account)
        HTTP.post(`authc/gen-access-token`, formAttr)
            .then(response => {
                console.log(response.data);
                console.log(response.status);
                console.log(response.statusText);
                console.log(response.headers);
                console.log(response.config);
                commit(types.Gen_Access_Token, response.data);
            })
            .catch(e => {
                console.error(e);
            })
    }
}

// mutations
const mutations = {
    [types.Gen_Access_Token](state, loginInfo) {
        document.cookie = loginInfo.info
        state.accessToken = loginInfo.info
        console.log('Mutation Success', types.Gen_Access_Token, "token", state.accessToken);

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