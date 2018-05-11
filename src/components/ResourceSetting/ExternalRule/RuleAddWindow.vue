<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <rule-add-form slot="content" ref="packageAddForm"></rule-add-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util';
import ModalWindow from '../../Common/window/ModalWindow.vue';
import RuleAddForm from './RuleAddForm.vue';
import FormButton from '../FormButton.vue';

export default {
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.packageAddForm.save()

            if(postContent){
                HTTPRepo.post(`dm-ext-package/add`, postContent)
                .then(response => {
                    this.$emit('closeAdd', response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.packageAddForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'rule-add-form': RuleAddForm,
        'form-button': FormButton
    }
}
</script>