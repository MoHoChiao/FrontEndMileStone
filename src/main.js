import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n/i18n'
import router from './router/vue-router'

new Vue({
    el: '#app',
    store,
    i18n,
    router,
    render: h => h(App)
})

//this.$i18n.locale = 'tw'
//i18n.locale = 'tw'