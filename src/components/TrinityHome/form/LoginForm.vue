<template>
    <div class="w3-container">
        <form class="w3-left-align" method="POST" :action="_formAction">
            <string-input ref="ac_input"
                        :label-text="$t('formContent.User_Account')"
                        :input-placeholder="$t('formContent.User_Account_Placeholder')" 
                        input-type="text" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
            ></string-input>
            <string-input ref="psw_input"
                        :label-text="$t('formContent.User_Password')" 
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
            <check-box ref="remember_input">{{ $t('formContent.Remember_Me') }}</check-box>
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
import CheckBox from '../../Common/form/CheckBox.vue';
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
                account: this.$refs.ac_input.inputContent,
                psw: this.$refs.psw_input.inputContent,
                flag: (this.$refs.ac_input.checkEmpty('formContent.Field_Empty')) &&
                    (this.$refs.psw_input.checkEmpty('formContent.Field_Empty')) &&
                    (this.$refs.code_input.checkEmpty('formContent.Field_Empty')) &&
                    (this.$refs.code_input.checkVerify('formContent.Validate_Error'))
            } 
        }
    },
    components: {
        'string-input': StringInput,
        'check-box': CheckBox,
        'validate-code': ValidateCode,
    }
}
</script>