<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <vr-agent-form slot="content" ref="vrAgentForm"></vr-agent-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import VRAgentForm from './VRAgentForm.vue'
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
        onValidate(e) {
            
        },
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.vrAgentForm.save()

            if(postContent){
                HTTPRepo.post(`vragent/add`, postContent)
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
            }
        },
        reset(){
            this.$refs.vrAgentForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'vr-agent-form': VRAgentForm,
        'form-button': FormButton
    }
}
</script>