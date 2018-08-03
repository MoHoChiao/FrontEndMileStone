import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n/i18n'
import router from './router/vue-router'
import lodash from 'lodash'

new Vue({
    el: '#app',
    store,
    i18n,
    router,
    render: h => h(App),
})

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });
//this.$i18n.locale = 'tw'
//i18n.locale = 'tw'