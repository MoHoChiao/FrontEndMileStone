import Vue from 'vue';
import Vuex from 'vuex';
// modules
import language from './modules/language';
import trinity_apps_model from './modules/trinity_apps_model';

Vue.use(Vuex);

export default new Vuex.Store({
    // 將整理好的 modules 放到 vuex 中組合
    modules: {
        language,
        trinity_apps_model
    },
    // 嚴格模式，禁止直接修改 state
    strict: true
});