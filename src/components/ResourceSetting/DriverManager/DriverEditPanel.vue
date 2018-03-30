<template>
    <div>
        <driver-form ref="userGroupForm" :content="content"></driver-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import DriverForm from './DriverForm.vue'
import FormButton from '../FormButton.vue'

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
            this.$refs.userGroupForm.reset()
        }
    },
    components: {
        'driver-form': DriverForm,
        'form-button': FormButton
    }
}
</script>