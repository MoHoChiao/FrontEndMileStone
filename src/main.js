import Vue from 'vue'
import VeeValidate from 'vee-validate'  //npm install vee-validate
import App from './App.vue'
import store from './store'
import i18n from './i18n/i18n'
import router from './router/vue-router'
//import lodash from 'lodash'
import NameInput from './components/Common/form/NameInput.vue'

// register as global component
Vue.component('name-input', NameInput)

Vue.use(VeeValidate);

new Vue({
    el: '#app',
    store,
    i18n,
    router,
    render: h => h(App),
})

//Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });

//this.$i18n.locale = 'tw'
//i18n.locale = 'tw'