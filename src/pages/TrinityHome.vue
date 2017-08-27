<template>
  <div>
    <!-- error msg -->
    <modal-msg></modal-msg>
    <!-- Info Side Bar -->
    <info-side-bar side-bar-bg-color="signal-black" btn-bg-color="signal-black"></info-side-bar>
    <!-- header -->
    <div class="w3-container w3-signal-black w3-padding w3-center">
      <h4 id="trinity_home_sub_title">Your key to the big data world.</h4>
      <h2 class="w3-xxxlarge w3-animate-zoom" id="trinity_home_title">Welcome To Trinity Home</h2>
      <div class="w3-padding-32">
        <login-btn v-if="loginStatus === ''" btn-text="LOGIN ALL APP" 
                  btn-round="medium" 
                  btn-bg-color="win-phone-cyan" 
                  btn-size="xlarge" 
                  btn-font-weight="900" 
                  btn-hover-color="opacity" 
                  form-action="/test" 
                  window-title="Sign In All App" 
        ></login-btn>
        <logout-btn v-else btn-text="LOGOUT ALL APP" 
                  btn-round="medium" 
                  btn-bg-color="win-phone-cyan" 
                  btn-size="xlarge" 
                  btn-font-weight="900" 
                  btn-hover-color="opacity" 
        ></logout-btn>
      </div>
    </div>
    <!-- content -->
    <app-card-layout></app-card-layout>
    <!-- Footer -->
    <div class="w3-container w3-signal-black w3-padding-16 w3-center">
      <p>Copyright © Trinity Data Corporation.</p>
      <p>5.0.0.alpha Build 20170714</p>
    </div>
  </div>
</template>

<script>
import AppCardLayout from '../components/layout/AppCardLayout.vue'
import LoginBtn from '../components/button/LoginBtn.vue'
import LogoutBtn from '../components/button/LogoutBtn.vue'
import InfoSideBar from '../components/bar/InfoSideBar.vue'
import ModalMsg from '../components/display_msg/ModalMsg.vue'
import { mapGetters } from 'vuex'
//import './assets/css/w3.css'
//import './assets/css/high-color.css'
export default {
  computed: {
    //ES7的寫法
    ...mapGetters({
      loginStatus: 'getloginStatus',
      loginMsg: 'getloginMsg',
      userInfo: 'getUserInfo'
    })
  },
  components: {
    'app-card-layout': AppCardLayout,
    'login-btn': LoginBtn,
    'logout-btn': LogoutBtn,
    'info-side-bar': InfoSideBar,
    'modal-msg': ModalMsg
  }
}
</script>
<style scoped>
/*
@import './assets/css/w3.css';
@import './assets/css/high-color.css';
*/
#trinity_home_title {
  font-family: 'Limelight', cursive;
}
#trinity_home_sub_title {
  font-family: 'Courgette', cursive;
}
</style>