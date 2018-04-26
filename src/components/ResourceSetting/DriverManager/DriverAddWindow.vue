<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <driver-add-form slot="content" ref="driverAddForm" @filePreview="filePreview"></driver-add-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="addButtonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPUpload,errorHandle } from '../../../axios/http-common';
import ModalWindow from '../../Common/window/ModalWindow.vue';
import DriverAddForm from './DriverAddForm.vue';
import FormButton from '../FormButton.vue';

export default {
    data() {
        return {
            addButtonLoading: false,
        }
    },
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    methods: {
        cancel(){
            if(this.addButtonLoading)
                return
            this.$emit('closeAdd')
        },
        filePreview(flag){
            this.addButtonLoading = flag
        },
        save(){
            let formData = this.$refs.driverAddForm.save()

            if(formData){
                this.addButtonLoading = true
                HTTPUpload.post(`driver-manager/addDriverFolderAndProp`, formData)
                .then(response => {
                    this.addButtonLoading = false
                    this.$emit('closeAdd', response.data)
                })
                .catch(error => {
                    this.addButtonLoading = false
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.driverAddForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'driver-add-form': DriverAddForm,
        'form-button': FormButton
    }
}
</script>