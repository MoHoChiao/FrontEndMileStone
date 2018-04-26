<template>
    <div>
        <vr-agent-form ref="vrAgentForm" :index="index" :content="content"></vr-agent-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../axios/http-common'
import VRAgentForm from './VRAgentForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    virtualagentuid: '',
                    virtualagentname: '',
                    description: '',
                    maximumjob: 5,
                    activate: '0',
                    mode: '0'
                }
            }
        },
        index: Number
    },
    methods: {
        cancel(){
            this.$emit('closeEdit', this.index)
        },
        save(){
            let postContent = this.$refs.vrAgentForm.save()
            if(postContent){
                HTTPRepo.post(`vragent/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.vrAgentForm.reset()
        }
    },
    components: {
        'vr-agent-form': VRAgentForm,
        'form-button': FormButton
    }
}
</script>