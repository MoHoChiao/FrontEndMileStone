<template>
    <over-lay-loading-div :is-loading="isLoading" :loading-text="loadingText">
        <div slot="content">
            <package-edit-form ref="packageForm" :content="content"></package-edit-form>
            <hr class="w3-border-grey">
            <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </over-lay-loading-div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../util_js/axios_util'
import PackageEditForm from './PackageEditForm.vue'
import FormButton from '../FormButton.vue'
import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils'

export default {
    data() {
        return {
            loadingText: '',
            isLoading: false
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    packageuid: '',
                    packagename: '',
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
            let postContent = this.$refs.packageForm.save()
            
            if(postContent){
                this.loadingText = 'Save ' + this.content.packagename + '...'
                this.isLoading = true

                HTTP_TRINITY.post(`dm-ext-package/edit`, postContent)
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
            this.$refs.packageForm.reset()
        }
    },
    components: {
        'package-edit-form': PackageEditForm,
        'form-button': FormButton,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>
