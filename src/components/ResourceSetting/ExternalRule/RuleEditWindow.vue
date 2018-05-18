<template>
    <modal-window :window-title="'Edit Rule - ' + modifyRuleRecord.rulename" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <rule-edit-form slot="content" ref="ruleEditForm" :modifyRuleRecord="modifyRuleRecord"></rule-edit-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="buttonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util';
import ModalWindow from '../../Common/window/ModalWindow.vue';
import RuleEditForm from './RuleEditForm.vue';
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
        index:{
            type: Number,
            default: 0
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
            this.$emit('closeEdit')
        },
        save(){
            let postContent = this.$refs.ruleEditForm.save()
            
            if(postContent){
                this.buttonLoading = true
                HTTPRepo.post(`dm-ext-rule/edit?targetRuleName=` + this.modifyRuleRecord.rulename, postContent)
                .then(response => {
                    this.buttonLoading = false
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    this.buttonLoading = false
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.ruleEditForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'rule-edit-form': RuleEditForm,
        'form-button': FormButton
    }
}
</script>