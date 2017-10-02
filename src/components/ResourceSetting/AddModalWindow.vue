<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <agent-form slot="content" ref="agentForm"></agent-form>
        <div slot="footer">
            <form-button btn-color="win-phone-cyan" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../axios/http-common'
import ModalWindow from '../Common/window/ModalWindow.vue'
import JCSAgentForm from './JCSAgentForm.vue'
import FormButton from './FormButton.vue'

export default {
   
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
        onValidate(e) {
            
        },
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            HTTPRepo.post(`jcsagent/add`, this.$refs.agentForm.save())
            .then(response => {
                this.$emit('closeAdd', response.data)
            })
            .catch(error => {
                if (error.response) {
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
        },
        reset(){
            this.$refs.agentForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'agent-form': JCSAgentForm,
        'form-button': FormButton
    }
}
</script>