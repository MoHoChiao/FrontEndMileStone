<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <user-group-member-panel slot="content" 
                :groupuid="content.groupuid" 
                :groupname="content.groupname" 
        ></user-group-member-panel>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import UserGroupMemberPanel from './UserGroupMemberPanel.vue'

export default {
    computed: {
        windowTitle(){
            return this.$t('Window.Account.Member.Apply') + ' - ' + this.content.groupname
        }  
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        //store selected user group
        content: {
            type: Object,
            default () {
                return {
                    groupuid: '',
                    groupname: '',
                    description: ''
                }
            }
        }
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