<template>
    <modal-window v-if="this.windowAlive" :window-title="_windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <permission-for-use-form v-if="whichForm === 'USE'" slot="content" ref="permissionForm" :objectUid="objectUid"></permission-for-use-form>
        <permission-form v-else slot="content" ref="permissionForm" :objectUid="objectUid"></permission-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import PermissionForm from './PermissionForm.vue'
import PermissionForUseForm from './PermissionForUseForm.vue'
import FormButton from '../FormButton.vue'

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
        objectName: '',
        whichForm: ''
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
                    errorHandle(this.$store, error)
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
        'permission-for-use-form': PermissionForUseForm,
        'form-button': FormButton
    }
}
</script>