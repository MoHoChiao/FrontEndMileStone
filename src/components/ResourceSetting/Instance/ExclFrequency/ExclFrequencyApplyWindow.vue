<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <excl-frequency-apply-panel slot="content" 
                :applyTimes="applyTimes" 
                :excludefrequencyuid="excludefrequencyuid" 
        ></excl-frequency-apply-panel>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import ExclFrequencyApplyPanel from './ExclFrequencyApplyPanel.vue'

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
        applyTimes:{
            type: Array
        },
        excludefrequencyuid: ''
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        }
    },
    components: {
        'modal-window': ModalWindow,
        'excl-frequency-apply-panel': ExclFrequencyApplyPanel
    }
}
</script>