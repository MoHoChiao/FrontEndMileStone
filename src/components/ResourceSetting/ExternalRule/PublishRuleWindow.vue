<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <publish-rule-form slot="content" ref="publishForm" :packageUid="packageUid"></publish-rule-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="buttonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../util_js/axios_util'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import PublishRuleForm from './PublishRuleForm.vue'
import FormButton from '../FormButton.vue';

export default {
    data() {
        return {
            buttonLoading: false,
        }
    },
    props: {
        windowTitle: {
            type: String,
            default: 'Publish Rules to JCS Agent'
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        packageUid: {
            type: String,
            default: ""
        }
    },
    methods: {
        cancel(){
            if(this.buttonLoading)
                return
            this.$emit('closePublish')
        },
        save(){
            let formData = this.$refs.publishForm.save()

            if(formData){
                this.buttonLoading = true
                HTTPUpload.post(`driver-manager/addDriverFolderAndProp`, formData)
                .then(response => {
                    this.buttonLoading = false
                    this.$emit('closeAdd', response.data)
                })
                .catch(error => {
                    this.buttonLoading = false
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.publishForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'publish-rule-form': PublishRuleForm,
        'form-button': FormButton
    }
}
</script>