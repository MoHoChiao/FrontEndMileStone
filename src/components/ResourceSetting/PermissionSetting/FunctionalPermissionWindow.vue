<template>
    <modal-window v-if="this.windowAlive" :window-title="_windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <functional-permission-form slot="content" ref="rolePermissionForm" :peopleUid="peopleUid"></functional-permission-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../axios/http-common'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import FunctionalPermissionForm from './FunctionalPermissionForm.vue'
import FormButton from '../FormButton.vue'

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
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.rolePermissionForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'functional-permission-form': FunctionalPermissionForm,
        'form-button': FormButton
    }
}
</script>