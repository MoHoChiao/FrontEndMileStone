<template>
    <div>
        <user-form ref="userForm" :index="index" :content="content"></user-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import UserForm from './UserForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    useruid: '',
                    userid: '',
                    username: '',
                    description: '',
                    usertype: 'G',
                    password: '',
                    activate: '1',
                    localaccount: '0',
                    onlyforexecution: '0',
                    email: '',
                    mobile: '',
                    defaultlang: 'en_US',
                    ssoid: '',
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
            let postContent = this.$refs.userForm.save()
            
            if(postContent){
                HTTPRepo.post(`trinity-user/edit`, postContent)
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
            this.$refs.userForm.reset()
        }
    },
    components: {
        'user-form': UserForm,
        'form-button': FormButton
    }
}
</script>