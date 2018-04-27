<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <user-group-member-panel slot="content" 
                :groupuid="groupuid" 
        ></user-group-member-panel>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import UserGroupMemberPanel from './UserGroupMemberPanel.vue'

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
        groupuid: ''
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        }
    },
    components: {
        'modal-window': ModalWindow,
        'user-group-member-panel': UserGroupMemberPanel
    }
}
</script>