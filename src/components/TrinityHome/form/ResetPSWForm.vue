<template>
    <div class="w3-container">
        <form class="w3-left-align" method="POST" :action="_formAction">
            <string-input ref="psw_input1"
                        :label-text="$t('formContent.User_New_Password')" 
                        :input-placeholder="$t('formContent.User_Password_Placeholder')" 
                        input-type="password"
                        :input-auto="false" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
            ></string-input>
            <string-input ref="psw_input2"
                        :label-text="$t('formContent.Confirmation_Password')" 
                        :input-placeholder="$t('formContent.User_Password_Placeholder')" 
                        input-type="password"
                        :input-auto="false" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
            ></string-input>
            <validate-code ref="code_input" 
                        :label-text="$t('formContent.User_Validator')" 
                        :input-placeholder="$t('formContent.User_Validator_Placeholder')" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
                        :reload-text="$t('formContent.Reload_Text')" 
            ></validate-code> 
        </form>
    </div>
</template>
<script>
import StringInput from '../../Common/form/StringInput.vue';
import ValidateCode from '../../Common/form/ValidateCode.vue';

export default {
    computed: {
        _formAction() {
            return this.formAction !== null ? this.formAction.trim() : '';
        }
    },
    props: {
        formAction: {
            type: String,
            default: ''
        },
        labelTextColor: {
            type: String,
            default: 'blue'
        },
        fieldMsgColor: {
            type: String,
            default: 'red'
        },
        fieldMsgInline: {
            type: Boolean,
            default: true
        },
        inputRound: {
            type: String,
            default: null
        },
        inputBorder: {
            type: Boolean,
            default: true
        },
        inputHoverColor: {
            type: String,
            default: null
        }
    },
    methods: {
        verifyForm() {
            return {
                psw: this.$refs.psw_input1.inputContent,
                flag: (this.$refs.psw_input1.checkEmpty('formContent.Field_Empty')) &&
                    (this.$refs.psw_input2.checkEmpty('formContent.Field_Empty')) &&
                    (this.$refs.psw_input2.checkEquals('formContent.PSW_Confirm_Error', this.$refs.psw_input1.inputContent)) &&
                    (this.$refs.code_input.checkEmpty('formContent.Field_Empty')) &&
                    (this.$refs.code_input.checkVerify('formContent.Validate_Error'))
            } 
        }
    },
    components: {
        'string-input': StringInput,
        'validate-code': ValidateCode,
    }
}
</script>