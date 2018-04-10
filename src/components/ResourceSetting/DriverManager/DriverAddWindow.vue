<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <driver-add-form slot="content" ref="driverAddForm"></driver-add-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPUpload } from '../../../axios/http-common'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import DriverAddForm from './DriverAddForm.vue'
import FormButton from '../FormButton.vue'

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
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.driverAddForm.save()

            if(postContent){
                HTTPUpload.post(`driver-manager/add?driverName=`+postContent.name+'&driverURL='+postContent.url, 
                    postContent.formData)
                .then(response => {
                    this.$emit('closeAdd', response.data)
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