<template>
    <modal-window v-if="this.windowAlive" :window-title="_windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <permission-form slot="content" ref="permissionForm" :objectUid="objectUid"></permission-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import PermissionForm from './PermissionForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        _windowTitle() {
            return this.windowTitle + this.objectName;
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
        objectUid: '',
        objectName: ''
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        },
        save(){
            let postContent = this.$refs.permissionForm.save()
            
            if(postContent){
                HTTPRepo.post(`access-right/modifyByObjectUid?objectUid=`+this.objectUid, postContent)
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
            this.$refs.permissionForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'permission-form': PermissionForm,
        'form-button': FormButton
    }
}
</script>