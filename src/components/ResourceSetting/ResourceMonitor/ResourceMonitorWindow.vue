<template>
    <modal-window v-if="windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <resource-monitor-form slot="content" ref="monitorForm"></resource-monitor-form>
        <div slot="footer">
            <div>&nbsp;</div>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import ResourceMonitorForm from './ResourceMonitorForm.vue'

export default {
    props: {
        windowTitle: {
            type: String,
            default: 'Modify Global Exclude Frequency'
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        }
    },
    components: {
        'modal-window': ModalWindow,
        'resource-monitor-form': ResourceMonitorForm
    }
}
</script>