<template>
    <div>
        <alias-form ref="aliasForm" :content="content"></alias-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import AliasForm from './AliasForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    busentityuid: '',
                    busentityname: '',
                    alias: []
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
            let postContent = this.$refs.aliasForm.save()
            if(postContent){
                HTTPRepo.post(`objectalias/modify?parentUid=`+this.content.busentityuid, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.aliasForm.reset()
        }
    },
    components: {
        'alias-form': AliasForm,
        'form-button': FormButton
    }
}
</script>