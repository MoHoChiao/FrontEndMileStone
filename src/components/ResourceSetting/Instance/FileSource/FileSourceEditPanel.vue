<template>
    <div>
        <file-source-form ref="fileSourceForm" :index="index" :content="content"></file-source-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import FileSourceForm from './FileSourceForm.vue'
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
            let postContent = this.$refs.fileSourceForm.save()
            
            if(postContent){
                HTTPRepo.post(`vragent/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
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
            this.$refs.fileSourceForm.reset()
        }
    },
    components: {
        'file-source-form': FileSourceForm,
        'form-button': FormButton
    }
}
</script>