<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <driver-add-form slot="content" ref="driverAddForm" @filePreview="filePreview"></driver-add-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="buttonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY_Upload,errorHandle } from '../../../util_js/axios_util';
import ModalWindow from '../../Common/window/ModalWindow.vue';
import DriverAddForm from './DriverAddForm.vue';
import FormButton from '../FormButton.vue';

export default {
    data() {
        return {
            buttonLoading: false,
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
            if(this.buttonLoading)
                return
            this.$emit('closeAdd')
        },
        filePreview(flag){
            this.buttonLoading = flag
        },
        async save(){
            let formData = await this.$refs.driverAddForm.save()

            if(formData){
                this.buttonLoading = true
                HTTP_TRINITY_Upload.post(`driver-manager/addDriverFolderAndProp`, formData)
                .then(response => {
                    this.buttonLoading = false
                    this.$emit('closeAdd', response.data)
                })
                .catch(error => {
                    this.buttonLoading = false
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