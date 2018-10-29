<template>
    <modal-window :window-title="$t('Window.System.PublishToJCSAgent')" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <publish-rule-form slot="content" ref="publishForm"></publish-rule-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="buttonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY } from '../../../util_js/axios_util'
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
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    methods: {
        cancel(){
            if(this.buttonLoading)
                return
            this.$emit('closePublish')
        },
        save(){
            let postContent = this.$refs.publishForm.save()

            if(postContent){
                this.buttonLoading = true
                HTTP_TRINITY.post(`dm-ext-package/publish`, postContent)
                .then(response => {
                    this.buttonLoading = false
                    this.$emit('closePublish', response.data)
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