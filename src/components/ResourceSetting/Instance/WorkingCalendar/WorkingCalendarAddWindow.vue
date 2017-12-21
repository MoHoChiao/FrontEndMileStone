<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <working-calendar-form slot="content" ref="wcForm"></working-calendar-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import WorkingCalendarForm from './WorkingCalendarForm.vue'
import FormButton from '../../FormButton.vue'

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
            let postContent = this.$refs.wcForm.save()
            
            if(postContent){
                HTTPRepo.post(`working-calendar/add`, postContent)
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
            this.$refs.wcForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'working-calendar-form': WorkingCalendarForm,
        'form-button': FormButton
    }
}
</script>