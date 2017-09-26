<template>
    <div class="w3-row w3-section">
        <div class="w3-col">
            <label v-if="labelText !== null" :class="_labelTextColor">
                <b>{{ labelText }}</b>
            </label>
            <form-field-msg v-if="showMsg" :inline="fieldMsgInline" :color="fieldMsgColor">{{ $t(msg) }}</form-field-msg>
        </div>
        <div class="w3-col w3-text-black">
            <input v-if="_inputType === 'text'" v-model="inputContent" :class="_classList" type="text" :placeholder="inputPlaceholder" :autocomplete="_inputAuto">
            <input v-else-if="_inputType === 'password'" v-model="inputContent" :class="_classList" type="password" :placeholder="inputPlaceholder" :autocomplete="_inputAuto">
        </div>
    </div>
</template>
<script>
import FormFieldMsg from './FormFieldMsg.vue'

export default {
    data() {
        return {
            showMsg: false,
            inputContent: '',
            msg: ''
        }
    },
    computed: {
        _classList() {
            return [
                'w3-input',
                this._inputRound,
                this._inputBorder,
                this._inputHoverColor,
                this._inputAnimate
            ];
        },
        _labelTextColor() {
            return this.labelTextColor !== null ? `w3-text-${this.labelTextColor}` : '';
        },
        _inputType() {
            return this.inputType.toLowerCase() === 'text' || this.inputType.toLowerCase() === 'password' 
                    ? this.inputType.toLowerCase() : 'text';
        },
        _inputAuto() {
            return this.inputAuto ? `on` : 'off';
        },
        _inputRound() {
            return this.inputRound !== null ? `w3-round-${this.inputRound}` : '';
        },
        _inputBorder() {
            return this.inputBorder ? `w3-border` : '';
        },
        _inputHoverColor() {
            return this.inputHoverColor !== null ? `w3-hover-${this.inputHoverColor}` : '';
        },
        _inputAnimate() {
            return this.inputAnimate ? `w3-animate-input` : '';
        }
    },
    props: {
        labelText: {
            type: String,
            default: null
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
        inputType: {
            type: String,
            default: 'text'
        },
        inputAuto: {
            type: Boolean,
            default: true
        },
        inputPlaceholder: {
            type: String,
            default: ''
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
        },
        inputAnimate: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        checkEmpty(msg) {
            var trimContent = this.inputContent.trim();
            if(trimContent.length <= 0){
                this.msg = msg;
                this.showMsg = true;
                this.inputContent = trimContent;
                return false;
            }else{
                this.showMsg = false;
                return true;
            }
        },
        checkEquals(msg, value) {
            var trimContent = this.inputContent.trim();
            var trimValue = value.trim();
            if(trimContent !== trimValue){
                this.msg = msg;
                this.showMsg = true;
                return false;
            }else{
                this.showMsg = false;
                return true;
            }
        }
    },
    components: {
        'form-field-msg': FormFieldMsg
    }
}
</script>
<style scoped>
@media (max-width: 34em) {
    label,input {
        font-size: 0.75em;
        font-size: 3.5vw;
    }
}
</style>