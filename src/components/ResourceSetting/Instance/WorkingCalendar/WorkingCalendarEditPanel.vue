<template>
    <div>
        <working-calendar-form ref="wcForm" :index="index" :content="content"></working-calendar-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import WorkingCalendarForm from './WorkingCalendarForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        content: {
            type: Object,
            default () {
                return {
                    wcalendaruid: '',
                    wcalendarname: '',
                    description: '',
                    activate: '0'
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
            let postContent = this.$refs.wcForm.save()
            
            if(postContent){
                HTTPRepo.post(`working-calendar/edit`, postContent)
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
            this.$refs.wcForm.reset()
        }
    },
    components: {
        'working-calendar-form': WorkingCalendarForm,
        'form-button': FormButton
    }
}
</script>