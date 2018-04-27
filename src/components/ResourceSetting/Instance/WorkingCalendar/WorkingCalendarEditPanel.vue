<template>
    <div>
        <working-calendar-form ref="wcForm" :index="index" :content="content" @save="save"></working-calendar-form>
        <hr class="w3-border-grey">
        <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="picked"></form-button>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
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
                    activate: '0',
                    wcalendarlist: []
                }
            }
        },
        index: Number
    },
    methods: {
        cancel(){
            this.$emit('closeEdit', this.index)
        },
        picked(){
            this.$refs.wcForm.picked()
        },
        save(postContent){
            if(postContent){
                HTTPRepo.post(`working-calendar/edit`, postContent)
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
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