<template>
    <modal-window :window-title="'Add New Rule to ' + filename" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <rule-add-form slot="content" ref="ruleAddForm" :modifyRuleRecord="modifyRuleRecord"></rule-add-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="buttonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../util_js/axios_util';
import ModalWindow from '../../Common/window/ModalWindow.vue';
import RuleAddForm from './RuleAddForm.vue';
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
        },
        filename: {
            type: String,
            default: ''
        },
        modifyRuleRecord: {
            type: Object,
            default: function () {
                return { 
                    extjaruid: '', 
                    rulename: '', 
                    fullclasspath: '', 
                    active: '1', 
                    description: '',
                    non_setting_rules: []
                }
            }
        }
    },
    methods: {
        cancel(){
            if(this.buttonLoading)
                return
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.ruleAddForm.save()

            if(postContent){
                this.buttonLoading = true
                HTTP_TRINITY.post(`dm-ext-rule/add`, postContent)
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
            this.$refs.ruleAddForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'rule-add-form': RuleAddForm,
        'form-button': FormButton
    }
}
</script>