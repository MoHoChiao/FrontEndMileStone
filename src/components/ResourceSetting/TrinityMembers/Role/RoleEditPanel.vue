<template>
    <div>
        <role-form ref="roleForm" :content="content"></role-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import RoleForm from './RoleForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    roleuid: '',
                    rolename: '',
                    description: '',
                    homedir: ''
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
            let postContent = this.$refs.roleForm.save()
            
            if(postContent){
                HTTPRepo.post(`role/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.roleForm.reset()
        }
    },
    components: {
        'role-form': RoleForm,
        'form-button': FormButton
    }
}
</script>