<template>
    <modal-window v-if="systemStatus !== ''" :window-title="systemStatus" :window-bg-color="color" @closeModalWindow="closeLoginModalWindow">
        <div class="w3-panel" slot="content"><p class="w3-large" v-html="systemMsg"></p></div>
        <div slot="footer" class="w3-padding"></div>
    </modal-window>
</template>
<script>
import ModalWindow from '../window/ModalWindow.vue';
import { mapGetters } from 'vuex'
export default {
    computed: {
        //ES7的寫法
        ...mapGetters({
            systemStatus: 'getSystemStatus',
            systemMsg: 'getSystemMsg',
        }),
        classList() {
            return [
                'w3-panel',
                this.color
            ];
        },
        color() {
            if(this.systemStatus === 'Error'){
                return `highway-red`
            }else if(this.systemStatus === 'Warn'){
                return 'highway-schoolbus'
            }else{
                return 'highway-green'
            }
        }
    },
    methods: {
        closeLoginModalWindow() {
            this.$store.dispatch('setSystemStatus', {"status":"","msg":""})
        }
    },
    components: {
        'modal-window': ModalWindow
    }
}
</script>