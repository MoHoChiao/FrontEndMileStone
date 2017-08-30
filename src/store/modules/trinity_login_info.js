import { HTTP } from '../../axios/http-common';
import * as common_types from '../common_mutations_type.js';

const types = {
    Check_Login_Token: 'check/Login_Token',
    Gen_Login_Token: 'gen/Login_Token',
    Reomve_Login_Token: 'remove/Login_Token'
}

// state
const state = {
    loginMsg: '',
    loginStatus: '',
    userInfo: '',
    userType: ''
}

// getters 也可以整理到這邊直接返回內容
const getters = {
    getloginMsg: state => state.loginMsg,
    getloginStatus: state => state.loginStatus,
    getUserInfo: state => state.userInfo,
    getUserType: state => state.userType
}

// actions 也是以 Object 形式建構。
const actions = {
    genLoginToken({ commit }, formAttr) {
        HTTP.post(`authc-lib/gen-authc`, {
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
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    commit(common_types.Set_System_Status, newStatus);
                }
            })
    },
    removeLoginToken({ commit }) {
        HTTP.get(`authc-lib/remove-authc`)
            .then(response => {
                commit(types.Reomve_Login_Token, response.data);
            })
            .catch(error => {
                if (error.response) {
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
    },
    checkLoginToken({ commit }, goto_form) {
        HTTP.get(`authc-lib/find-authc`)
            .then(response => {
                response.data.goto_form = goto_form // add form element to data
                commit(types.Check_Login_Token, response.data);
            })
            .catch(error => {
                if (error.response) {
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
    [types.Gen_Login_Token](state, data) {
        state.loginMsg = data.msg
        state.loginStatus = data.status
        state.userInfo = data.userinfo
        state.userType = data.usertype

        console.log('Mutation Success', types.Gen_Login_Token, "User:", state.userInfo);
    },
    [types.Reomve_Login_Token](state, data) {
        if (data === 'Logout Success.') {
            state.loginMsg = ''
            state.loginStatus = ''
            state.userInfo = ''
            state.userType = ''
        }

        console.log('Mutation Success', types.Reomve_Login_Token, "Logout:", data);
    },
    [types.Check_Login_Token](state, data) {
        if (data.status === 'Success') {
            state.loginMsg = data.msg
            state.loginStatus = data.status
            state.userInfo = data.userinfo
            state.userType = data.usertype
                // state.userType = 'G'
            if(data.goto_form)
                data.goto_form.submit();
        } else {
            state.loginMsg = ''
            state.loginStatus = ''
            state.userInfo = ''
            state.userType = ''

            // let newStatus = {
            //     "msg": 'Someone has logged out of the Trinity.',
            //     "status": "Warn"
            // }
            // commit(common_types.Set_System_Status, newStatus);
        }

        console.log('Mutation Success', types.Check_Login_Token, "Validate:", data.msg);
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