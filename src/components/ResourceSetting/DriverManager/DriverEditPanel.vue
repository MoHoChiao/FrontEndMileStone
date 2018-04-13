<template>
    <over-lay-loading-div ref="loadingDIV">
        <div slot="content">
            <driver-edit-form ref="driverEditForm" :content="content" :driverClassList="driverClassList"></driver-edit-form>
            <hr class="w3-border-grey">
            <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </over-lay-loading-div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import DriverEditForm from './DriverEditForm.vue'
import FormButton from '../FormButton.vue'
import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            driverClassList: []
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
                this.$refs.loadingDIV.loadingText = 'Save ' + this.content.name + '...'
                this.$refs.loadingDIV.isLoading = true

                HTTPRepo.post(`driver-manager/modifyDriverProp`, postContent)
                .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
                .then(response => {
                    this.$emit('closeEdit', this.index, response.data)
                    this.$refs.loadingDIV.isLoading = false
                })
                .catch(error => {
                    this.$refs.loadingDIV.isLoading = false
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
            this.$refs.driverEditForm.reset()
        },
        fetchDriverClass(){
            this.$refs.loadingDIV.loadingText = 'Fetch Driver Class...'
            this.$refs.loadingDIV.isLoading = true
            
            HTTPRepo.get(`driver-manager/findDriverClassByDriverName?driverName=` + this.content.name)
            .then(wait(FAST_SPEED)) // DEV ONLY: wait for 0.5s 
            .then(response => {
                this.driverClassList = response.data
                this.$refs.loadingDIV.isLoading = false
            })
            .catch(error => {
                this.$refs.loadingDIV.isLoading = false
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
    components: {
        'driver-edit-form': DriverEditForm,
        'form-button': FormButton,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>
