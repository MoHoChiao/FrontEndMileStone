<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <driver-jar-panel slot="content" 
                :driverName="driverName" :jarFiles="jarFiles" 
        ></driver-jar-panel>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import DriverJarPanel from './DriverJarPanel.vue'

export default {
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        driverName: '',
        jarFiles: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        }
    },
    components: {
        'modal-window': ModalWindow,
        'driver-jar-panel': DriverJarPanel
    }
}
</script>