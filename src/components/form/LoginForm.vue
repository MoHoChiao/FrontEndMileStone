<template>
    <div class="w3-container">
        <form class="w3-left-align" method="POST" :action="_formAction">
            <string-input ref="ac_input"
                        :label-text="$t('loginFormContent.User_Account')"
                        :input-placeholder="$t('loginFormContent.User_Account_Placeholder')" 
                        input-type="text" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
            ></string-input>
            <string-input ref="psw_input"
                        :label-text="$t('loginFormContent.User_Password')" 
                        :input-placeholder="$t('loginFormContent.User_Password_Placeholder')" 
                        input-type="password"
                        :input-auto="false" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
            ></string-input>
            <check-box ref="remember_input">{{ $t('loginFormContent.Remember_Me') }}</check-box>
            <validate-code ref="code_input" 
                        :label-text="$t('loginFormContent.User_Validator')" 
                        :input-placeholder="$t('loginFormContent.User_Validator_Placeholder')" 
                        :label-text-color="labelTextColor" 
                        :field-msg-color="fieldMsgColor" 
                        :field-msgIn-line="fieldMsgInline" 
                        :input-round="inputRound" 
                        :input-border="inputBorder" 
                        :input-hover-color="inputHoverColor" 
                        :reload-text="$t('loginFormContent.Reload_Text')" 
            ></validate-code> 
        </form>
    </div>
</template>
<script>
import StringInput from '../form_element/StringInput.vue';
import CheckBox from '../form_element/CheckBox.vue';
import ValidateCode from '../form_element/ValidateCode.vue';

export default {
    computed: {
        _formAction() {
            return this.formAction !== null ? this.formAction.trim() : '';
        }
    },
    props: {
        formAction: {
            type: String,
            default: '',
            required: true
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
                flag: (this.$refs.ac_input.checkEmpty('此欄位不可為空')) &&
                    (this.$refs.psw_input.checkEmpty('此欄位不可為空')) &&
                    (this.$refs.code_input.checkEmpty('此欄位不可為空')) &&
                    (this.$refs.code_input.checkVerify('驗證碼輸入有誤'))
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