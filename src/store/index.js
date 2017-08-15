import Vue from 'vue';
import Vuex from 'vuex';
// modules
import language from './modules/language';

Vue.use(Vuex);

export default new Vuex.Store({
    // 將整理好的 modules 放到 vuex 中組合
    modules: {
        language
    },
    // 嚴格模式，禁止直接修改 state
    strict: true
});