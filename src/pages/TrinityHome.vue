<template>
  <div>
    <!-- reset psw window -->
    <reset-psw-modal-window v-if="loginStatus === 'ChangeCredentials'" 
                  window-title="Password Expire! Please Reset." 
                  @closeResetPSWModalWindow="closeResetPSW"
    ></reset-psw-modal-window>
    <!-- msg window -->
    <modal-msg></modal-msg>
    <!-- Info Side Bar -->
    <info-side-bar side-bar-bg-color="signal-black" btn-bg-color="signal-black"></info-side-bar>
    <!-- header -->
    <div class="w3-container w3-signal-black w3-padding w3-center">
      <h4 id="trinity_home_sub_title">Your key to the big data world.</h4>
      <h2 class="w3-xxxlarge w3-animate-zoom" id="trinity_home_title">Welcome To Trinity Home</h2>
      <div class="w3-padding-32">
        <login-btn v-if="(loginStatus === '' || loginStatus == 'ChangeCredentials')" btn-text="LOGIN ALL APP" 
                  btn-round="medium" 
                  btn-bg-color="win-phone-cyan" 
                  btn-size="xlarge" 
                  btn-font-weight="900" 
                  btn-hover-color="opacity" 
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
      <address>
        <p>Copyright © Trinity Data Corporation.</p>
        <p>5.0.0.alpha Build 20170908</p>
      </address>
    </div>
  </div>
</template>

<script>
import AppCardLayout from '../components/TrinityHome/layout/AppCardLayout.vue'
import LoginBtn from '../components/TrinityHome/button/LoginBtn.vue'
import LogoutBtn from '../components/TrinityHome/button/LogoutBtn.vue'
import InfoSideBar from '../components/TrinityHome/bar/InfoSideBar.vue'
import ResetPSWModalWindow from '../components/TrinityHome/window/ResetPSWModalWindow.vue'
import ModalMsg from '../components/Common/window/ModalMsg.vue'
import { mapGetters } from 'vuex'
//import './assets/css/w3.css'
//import './assets/css/high-color.css'
export default {
  mounted: function() {
    this.$store.dispatch('checkLoginToken', 'TrinityHome')

    let val = 'en'
    let cookies = document.cookie
    var name = "trinity_language=";
    var ca = cookies.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) == 0) {
        val = c.substring(name.length, c.length)
      }
    }
    this.$i18n.locale = val
  },
  computed: {
    //ES7的寫法
    ...mapGetters({
      loginStatus: 'getloginStatus'
    })
  },
  methods: {
    closeResetPSW(e){
      this.alive = false;
    }
  },
  components: {
    'app-card-layout': AppCardLayout,
    'login-btn': LoginBtn,
    'logout-btn': LogoutBtn,
    'info-side-bar': InfoSideBar,
    'reset-psw-modal-window': ResetPSWModalWindow,
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