<template>
    <div class="w3-row w3-section">
        <div class="w3-col">
            <label v-if="labelText !== null" :class="_labelTextColor">
                <b>{{ labelText }}</b>
            </label>
            <form-field-msg v-if="showMsg" :inline="fieldMsgInline" :color="fieldMsgColor">{{ $t(msg) }}</form-field-msg>
        </div>
        <div class="w3-col">
            <div class="w3-cell w3-mobile w3-text-black">
                <input v-model="inputContent" :class="_classList" type="text" :placeholder="inputPlaceholder" autocomplete="off">
            </div>
            <div class="w3-cell w3-mobile code" @click="createCode">{{ code }}</div>
            <div class="w3-cell w3-mobile">
                <a href="#" class="w3-text-indigo w3-margin-left" @click="createCode">{{ reloadText }}</a>
            </div>
        </div>
    </div>
</template>
<script>
import FormFieldMsg from './FormFieldMsg.vue';

export default {
    data() {
        return {
            showMsg: false,
            inputContent: '',
            msg: '',
            code: "",
            codeChars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            //驗證碼的長度
            codeLength: 5
        }
    },
    computed: {
        _classList() {
            return [
                'w3-input',
                'w3-center',
                this._inputRound,
                this._inputBorder,
                this._inputHoverColor,
                this._inputAnimate
            ];
        },
        _labelTextColor() {
            return this.labelTextColor !== null ? `w3-text-${this.labelTextColor}` : '';
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
        },
        reloadText: {
            type: String,
            default: 'Image Reload'
        }
    },
    methods: {
        createCode() {
            this.code = "";
            for (var i = 0; i < this.codeLength; i++) {
                this.code += this.codeChars[Math.floor(Math.random() * 52)];
            }
        },
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
        checkVerify(msg){
            if (this.inputContent.toUpperCase() !== this.code.toUpperCase()){
                this.msg = msg;
                this.showMsg = true;
                this.createCode();
        	    return false;
            }else{
                this.showMsg = false;
                return true;
            }
        }
    },
    components: {
        'form-field-msg': FormFieldMsg
    },
    created: function () {
        this.createCode();
    }
}
</script>
<style scoped>
.code {
    background: url(/src/assets/images/validate_background.png);
    font-family: Arial;
    font-style: italic;
    color: blue;
    font-size: 20px;
    border: 0;
    padding: 2px 3px;
    letter-spacing: 3px;
    font-weight: bolder;
    cursor: pointer;
    width: 100px;
    height: 20px;
    line-height: 20px;
    max-width: 150px;
    text-align: center;
    vertical-align: middle;
}
@media (max-width: 34em) {
    label,input,a {
        font-size: 0.75em;
        font-size: 3.5vw;
    }
    .code {
        font-size: 1em;
        font-size: 3.8vw;
        margin-top: 5px;
        height: 30px;
        line-height: 30px;
    }
}
</style>