import Vue from 'vue';
import Vuex from 'vuex';
// modules
import system_status from './modules/system_status';
import trinity_apps_model from './modules/TrinityHome/trinity_apps_model';
import trinity_login_info from './modules/TrinityHome/trinity_login_info';
import resource_content_model from './modules/ResourceSetter/resource_content_model';

Vue.use(Vuex);

export default new Vuex.Store({
    // 將整理好的 modules 放到 vuex 中組合
    modules: {
        system_status,
        trinity_apps_model,
        trinity_login_info,
        resource_content_model
    },
    // 嚴格模式，禁止直接修改 state
    strict: true
});