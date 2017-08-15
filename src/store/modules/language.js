const types = {
    LANGUAGE: 'lang/SET_LANGUAGE'
}

// lang state 必須是 Object
const state = {
    lang: 'tw'
}

// getters 也可以整理到這邊直接返回 lang 內容
const getters = {
    getLang: state => state.lang
}

// actions 也是以 Object 形式建構。
const actions = {
    setLang({ commit }, lang) {
        console.log('Action', types.LANGUAGE, 'lang:', state.lang);
        commit(types.LANGUAGE, lang);
    }
}

// mutations
const mutations = {
    [types.LANGUAGE](state, lang) {
        state.lang == lang;
        console.log('Mutation', types.LANGUAGE, 'lang:', state.lang);
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