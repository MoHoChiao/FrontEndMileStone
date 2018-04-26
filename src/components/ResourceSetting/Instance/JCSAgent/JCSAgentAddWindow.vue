<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <agent-form slot="content" ref="agentForm" :content="content"></agent-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import JCSAgentForm from './JCSAgentForm.vue'
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
        },
        content: {
            type: Object,
            default () {
                return {
                    agentuid: '',
                    agentname: '',
                    description: '',
                    host: '',
                    port: '',
                    maximumjob: 5,
                    activate: '0',
                    ostype: 'Linux',
                    osname: '',
                    deadperiod: 10,
                    memweight: 1,
                    compresstransfer: '0',
                    encoding: '',
                    monitortime: 6,
                    cpuweight: 2
                }
            }
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.agentForm.save()

            if(postContent){
                HTTPRepo.post(`jcsagent/add`, postContent)
                .then(response => {
                    this.$emit('closeAdd', response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
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