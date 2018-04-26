<template>
    <div>
        <user-group-form ref="userGroupForm" :content="content"></user-group-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../axios/http-common'
import UserGroupForm from './UserGroupForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    groupuid: '',
                    groupname: '',
                    description: ''
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
            let postContent = this.$refs.userGroupForm.save()
            
            if(postContent){
                HTTPRepo.post(`user-group/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.userGroupForm.reset()
        }
    },
    components: {
        'user-group-form': UserGroupForm,
        'form-button': FormButton
    }
}
</script>