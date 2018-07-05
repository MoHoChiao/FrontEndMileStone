<template>
    <div>
        <excl-frequency-form ref="exclFreqForm" :content="content"></excl-frequency-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
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
                HTTP_TRINITY.post(`excl-frequency/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
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