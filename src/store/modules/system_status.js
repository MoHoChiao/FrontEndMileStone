import * as common_types from '../common_mutations_type.js';

// state
const state = {
    systemMsg: '',
    systemStatus: ''
}

// getters 也可以整理到這邊直接返回內容
const getters = {
    getSystemMsg: state => state.systemMsg,
    getSystemStatus: state => state.systemStatus,
}

// actions 也是以 Object 形式建構。
const actions = {
    setSystemStatus({ commit }, newStatus) {
        commit(common_types.Set_System_Status, newStatus);
    }
}

// mutations
const mutations = {
    [common_types.Set_System_Status](state, newStatus) {
        state.systemStatus = newStatus.status
        newStatus.msg = newStatus.msg.replace(/(?:\r\n|\r|\n)/g, '<br />')
        state.systemMsg = newStatus.msg;
        console.log('Mutation Success', common_types.Set_System_Status, "NewStatus:", state.systemMsg + '(' + state.systemStatus + ')');
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