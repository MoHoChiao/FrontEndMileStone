<template>
    <modal-window v-if="this.windowAlive" :window-title="_windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <role-permission-form slot="content" ref="rolePermissionForm" :peopleUid="peopleUid"></role-permission-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import RolePermissionForm from './RolePermissionForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        _windowTitle() {
            return this.windowTitle + this.peopleName;
        },
    },
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
        peopleUid: '',
        peopleName: ''
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        },
        save(){
            let postContent = this.$refs.rolePermissionForm.save()
            
            if(postContent){
                HTTPRepo.post(`access-right/modifyByPeopleUid?peopleUid=`+this.peopleUid, postContent)
                .then(response => {
                    this.$emit('closeApply')
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        let newStatus = {
                            "msg": error.response.data,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    } else {
                        let newStatus = {
                            "msg": error.message,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                })
            }
        },
        reset(){
            this.$refs.rolePermissionForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'role-permission-form': RolePermissionForm,
        'form-button': FormButton
    }
}
</script>