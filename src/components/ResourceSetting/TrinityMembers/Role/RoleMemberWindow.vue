<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <role-member-panel slot="content" 
                :roleuid="content.roleuid" 
                :rolename="content.rolename" 
        ></role-member-panel>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import RoleMemberPanel from './RoleMemberPanel.vue'

export default {
    computed: {
        windowTitle(){
            return this.$t('Window.Member.Apply') + ' - ' + this.content.rolename
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
        //store selected role
        content: {
            type: Object,
            default () {
                return {
                    roleuid: '',
                    rolename: '',
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
        'role-member-panel': RoleMemberPanel
    }
}
</script>