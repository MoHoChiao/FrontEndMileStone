<template>
    <div>
        <excl-frequency-form ref="exclFreqForm" :index="index" :content="content"></excl-frequency-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ExclFrequencyForm from './ExclFrequencyForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    excludefrequencyuid: '',
                    excludefrequencyname: '',
                    description: '',
                    activate: '0',
                    excludefrequencylist: []
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
            let postContent = this.$refs.exclFreqForm.save()
            
            if(postContent){
                HTTPRepo.post(`excl-frequency/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
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
            this.$refs.exclFreqForm.reset()
        }
    },
    components: {
        'excl-frequency-form': ExclFrequencyForm,
        'form-button': FormButton
    }
}
</script>