import { HTTPRepo } from '../../../axios/http-common';
import * as common_types from '../../common_mutations_type.js';

const types = {
    InitialAllParams: 'initial/All_Params_MODEL',
    Fetch_Agent_Content: 'fetch/Agent_Content_MODEL',
    Edit_Agent_Content: 'edit/Agent_Content_MODEL'
}

// state
const state = {
    content: [],
    totalPages: 1,
    pageSize: 10,
    pageNum: 0
}

// getters 也可以整理到這邊直接返回內容
const getters = {
    getContent: state => state.content,
    getTotalPages: state => state.totalPages,
    getPageSize: state => state.pageSize,
    getPageNum: state => state.pageNum
}

// actions 也是以 Object 形式建構。
const actions = {
    initialAllParams({ commit }) {
        commit(types.InitialAllParams);
    },
    fetchAgentContent({ commit }, params) {
        HTTPRepo.get(`jcsagent/findAll`, { params })
            .then(response => {
                commit(types.Fetch_Agent_Content, response.data);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data.status + ':' + error.response.data.error + '\n' + "Path:" + error.response.data.path + '\n' + error.response.data.message,
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
    editAgentContent({ commit }, newContent) {
        commit(types.Edit_Agent_Content, newContent)
    }
}

// mutations
const mutations = {
    [types.InitialAllParams](state) {
        state.content = []
        state.totalPages = 1
        state.pageSize = 10
        state.pageNum = 0
        console.log('Mutation Success', types.InitialAllParams);
    },
    [types.Fetch_Agent_Content](state, data) {
        if (data.content !== undefined) {
            state.content = data.content
            state.totalPages = data.totalPages
        } else {
            state.content = data
            state.totalPages = 1
        }
        console.log('Mutation Success', types.Fetch_Agent_Content);
    },
    [types.Edit_Agent_Content](state, newContent) {
        let index = newContent.index
        state.content[index].agentname = newContent.agentname
        state.content[index].host = newContent.host
        state.content[index].port = newContent.port
        state.content[index].maximumjob = newContent.maximumjob
        console.log('Mutation Success', types.Edit_Agent_Content);
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