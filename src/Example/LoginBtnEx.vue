<template>
  <div id="login-btn-ex" class="w3-container">
    <login-btn btn-text="LOGIN ALL APP" 
               btn-round="medium" 
               btn-bg-color="win-phone-cyan" 
               btn-size="xlarge" 
               btn-font-weight="900" 
               form-action="/test" 
               window-title="Sign In All App" 
    >
    </login-btn>
    <login-btn btn-text="Login" 
               btn-round="medium" 
               btn-border-color="blue" 
               form-action="/test" 
               window-bg-color="orange" 
               window-btn-color="highway-green" 
               :field-msg-inline="false" 
               field-msg-color="black" 
    >
    </login-btn>
  </div>
</template>

<script>
import LoginBtn from '../components/button/LoginBtn.vue'
export default {
  name: 'login-btn-ex',
  components: {
    'login-btn': LoginBtn
  }
}
</script>