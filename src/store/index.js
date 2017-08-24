import Vue from 'vue';
import Vuex from 'vuex';
// modules
import trinity_language from './modules/trinity_language';
import trinity_apps_model from './modules/trinity_apps_model';
import trinity_login_info from './modules/trinity_login_info';
import system_status from './modules/system_status';

Vue.use(Vuex);

export default new Vuex.Store({
    // 將整理好的 modules 放到 vuex 中組合
    modules: {
        system_status,
        trinity_language,
        trinity_apps_model,
        trinity_login_info
    },
    // 嚴格模式，禁止直接修改 state
    strict: true
});