<template>
    <div>
        <domain-form ref="domainForm" :index="index" :content="content"></domain-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import DomainForm from './DomainForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    domainuid: '',
                    name: '',
                    description: '',
                    domainVars: [],
                    domainResources: []
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
            let postContent = this.$refs.domainForm.save()
            
            if(postContent){
                HTTP_TRINITY.post(`domain/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.domainForm.reset()
        }
    },
    components: {
        'domain-form': DomainForm,
        'form-button': FormButton
    }
}
</script>