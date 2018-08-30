<template>
    <div>
        <router-view style="min-height: calc(100vh - 42px);">
            <!--所有被routing的組件內容都會在這裡渲染-->
        </router-view>
        <!-- Uniform msg window -->
        <modal-msg></modal-msg>
        <custom-footer style="height:42px;"></custom-footer>
    </div>
</template>
<script>
    //import './assets/css/w3.css'
    //import './assets/css/high-color.css'
    import ModalMsg from './components/Common/window/ModalMsg.vue'
    import CustomFooter from './components/Common/CustomFooter.vue'

    export default {
        components: {
            'modal-msg': ModalMsg,
            'custom-footer': CustomFooter
        }
    }
</script>
<style scoped>

    /*
    @import './assets/css/w3.css';
    @import './assets/css/high-color.css';
    */
</style>