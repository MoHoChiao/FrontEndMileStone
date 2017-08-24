<template>
    <modal-window v-if="systemStatus !== ''" window-title="systemStatus" :window-bg-color="color" @closeModalWindow="closeLoginModalWindow">
        <p class="w3-large" slot="content" v-html="systemMsg"></p>
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
            return this.systemStatus === 'Error' ? `highway-red` : 'highway-schoolbus';
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