<template>
  <div>
    <router-view>
    <!--所有被routing的組件內容都會在這裡渲染-->
    </router-view>
    <!-- Uniform msg window -->
    <modal-msg></modal-msg>
  </div>
</template>

<script>
//import './assets/css/w3.css'
//import './assets/css/high-color.css'
import ModalMsg from './components/Common/window/ModalMsg.vue'

export default {
  components: {
    'modal-msg': ModalMsg
  }
}
</script>
<style scoped>
/*
@import './assets/css/w3.css';
@import './assets/css/high-color.css';
*/
</style>