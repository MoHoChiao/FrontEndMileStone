<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <role-member-panel slot="content" 
                :roleuid="roleuid" 
        ></role-member-panel>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import RoleMemberPanel from './RoleMemberPanel.vue'

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
        roleuid: ''
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        }
    },
    components: {
        'modal-window': ModalWindow,
        'role-member-panel': RoleMemberPanel
    }
}
</script>