import { HTTP } from '../../axios/http-common';

const types = {
    Fetch_Login_Token: 'fetch/Login_Token',
    Gen_Login_Token: 'gen/Login_Token',
    Set_Login_Status: 'set/Login_Status'
}

// state
const state = {
    loginToken: '',
    loginMsg: '',
    loginStatus: '',
    userInfo: ''
}

// getters 也可以整理到這邊直接返回內容
const getters = {
    getLoginToken: state => state.loginToken,
    getLoginMsg: state => state.loginMsg,
    getLoginStatus: state => state.loginStatus,
    getUserInfo: state => state.userInfo
}

// actions 也是以 Object 形式建構。
const actions = {
    genLoginToken({ commit }, formAttr) {
        HTTP.post(`authc/gen-access-token`, formAttr)
            .then(response => {
                commit(types.Gen_Login_Token, response.data);
            })
            .catch(error => {
                alert(error.response.data);
                if (error.response) {
                    let newStatus = {
                        "msg": error.response.data.response,
                        "status": "Error"
                    }
                    commit(types.Set_Login_Status, newStatus);
                }
            })
    },
    setLoginStatus({ commit }, newStatus) {
        commit(types.Set_Login_Status, newStatus);
    }
}

// mutations
const mutations = {
    [types.Gen_Login_Token](state, data) {
        document.cookie = state.loginToken

        state.loginToken = data.token
        state.loginMsg = data.msg
        state.loginStatus = data.status
        state.userInfo = data.userinfo

        console.log('Mutation Success', types.Gen_Login_Token, "token", state.loginToken);
    },
    [types.Set_Login_Status](state, newStatus) {
        state.loginStatus = newStatus.status
        state.loginMsg = newStatus.msg
        console.log('Mutation Success', types.Set_Login_Status, "new status", state.loginMsg + '(' + state.loginStatus + ')');
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