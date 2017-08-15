import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n/i18n'

new Vue({
    el: '#app',
    store,
    i18n,
    render: h => h(App)
})

//this.$i18n.locale = 'tw'
//i18n.locale = 'tw'