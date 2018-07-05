<template>
    <over-lay-loading-div :is-loading="isLoading" :loading-text="loadingText" loadingSize="80px" textSize="20px">
        <div slot="content">
            <driver-edit-form ref="driverEditForm" :content="content" :driverClassList="driverClassList"></driver-edit-form>
            <hr class="w3-border-grey">
            <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </over-lay-loading-div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../util_js/axios_util'
import DriverEditForm from './DriverEditForm.vue'
import FormButton from '../FormButton.vue'
import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            driverClassList: [],
            loadingText: '',
            isLoading: false
        }
    },
    mounted(){
        this.fetchDriverClass()
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    name: '',
                    url: '',
                    driver: '',
                    owner: ''
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
            let postContent = this.$refs.driverEditForm.save()
            
            if(postContent){
                this.loadingText = 'Save ' + this.content.name + '...'
                this.isLoading = true

                HTTP_TRINITY.post(`driver-manager/modifyDriverProp`, postContent)
                .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.driverEditForm.reset()
        },
        fetchDriverClass(){
            this.loadingText = 'Fetch Driver Class...'
            this.isLoading = true
            
            HTTP_TRINITY.get(`driver-manager/findDriverClassByDriverName?driverName=` + this.content.name)
            .then(wait(FAST_SPEED)) // DEV ONLY: wait for 0.5s 
            .then(response => {
                this.driverClassList = response.data
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                errorHandle(this.$store, error)
            })
        }
    },
    components: {
        'driver-edit-form': DriverEditForm,
        'form-button': FormButton,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>
