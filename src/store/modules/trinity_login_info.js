import { HTTP } from '../../axios/http-common';
import qs from 'qs'
import * as common_types from '../common_mutations_type.js';

const types = {
    Check_Login_Token: 'check/Login_Token',
    Gen_Login_Token: 'gen/Login_Token'
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
    getUserInfo: state => state.userInfo
}

// actions 也是以 Object 形式建構。
const actions = {
    genLoginToken({ commit }, formAttr) {
        HTTP.post(`authc/gen-access-token`, {
            account: formAttr.account,
            psw: formAttr.psw
        })
        .then(response => {
            commit(types.Gen_Login_Token, response.data);
        })
        .catch(error => {
            if (error.response) {
                let newStatus = {
                    "msg": error.response.data,
                    "status": "Error"
                }
                commit(common_types.Set_System_Status, newStatus);
            }else{
                alert("else error!!!!!!")
            }
        })
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