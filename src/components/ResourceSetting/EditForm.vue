<template>
    <div class="w3-container w3-small">
        <div class="w3-half w3-padding">
            <string-input ref="agent_name"
                        label-text="Name"
                        input-placeholder="Agent Name" 
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
        </div>
        <div class="w3-half w3-padding">
            <div class="w3-row w3-section">
            <label class="w3-text-blue">
                <b>Activate</b>
            </label>
            <select class="w3-select w3-border w3-round" name="option" v-model="queryField">
                <option value="" disabled selected>Field</option>
                <option value="Agentname">Name</option>
                <option value="Activate">Activate</option>
                <option value="Host">Host</option>
                <option value="Port">Port</option>
                <option value="Description">Desc</option>
            </select>
            </div>
            <div class="w3-row w3-section">
            <label class="w3-text-blue">
                <b>Activate</b>
            </label>
            <select class="w3-select w3-border w3-round" name="option" v-model="queryField">
                <option value="" disabled selected>Field</option>
                <option value="Agentname">Name</option>
                <option value="Activate">Activate</option>
                <option value="Host">Host</option>
                <option value="Port">Port</option>
                <option value="Description">Desc</option>
            </select>
            </div>
        </div>
    </div>
</template>
<script>
import StringInput from '../Common/form/StringInput.vue';
import CheckBox from '../Common/form/CheckBox.vue';
import ValidateCode from '../Common/form/ValidateCode.vue';

export default {
    computed: {
       
    },
    props: {
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