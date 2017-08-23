<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="closeLoginModalWindow">
        <login-form slot="content" 
                    ref="loginForm" 
                    :form-action="formAction" 
                    :label-text-color="labelTextColor" 
                    :field-msg-inline="fieldMsgInline" 
                    :field-msg-color="fieldMsgColor" 
                    :input-round="inputRound" 
                    :input-border="inputBorder" 
                    :input-hover-color="inputHoverColor" 
        ></login-form>
        <div slot="footer" class="w3-container">
            <w3c-btn @click="onValidate" class="w3-right" :btn-bg-color="windowBtnColor" btn-round="medium">{{ $t('loginWindowContent.Login_Button') }}</w3c-btn>
            <span class="w3-left w3-padding">
                <a :class="_leftTextColor" href="#">{{ $t('loginWindowContent.Forget_PWS') }}</a>
            </span>
        </div>
    </modal-window>
</template>
<script>
import ModalWindow from './ModalWindow.vue';
import LoginForm from '../form/LoginForm.vue';
import W3CBtn from '../button/W3CBtn.vue';

export default {
    computed: {
        _rightBtnColor() {
            return this.windowBtnColor !== null ? `w3-${this.windowBtnColor}` : '';
        },
        _leftTextColor() {
            return this.windowBtnColor !== null ? `w3-text-${this.windowBtnColor}` : '';
        },
    },
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowBtnColor: {
            type: String,
            default: 'win-phone-cyan'
        },
        labelTextColor: {
            type: String,
            default: 'blue'
        },
        formAction: {
            type: String,
            default: '',
            required: true
        },
        fieldMsgInline: {
            type: Boolean,
            default: true
        },
        fieldMsgColor: {
            type: String,
            default: 'red'
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
        onValidate(e) {
            let retObj = this.$refs.loginForm.verifyForm()
            if (retObj.flag) {
                this.$store.dispatch('genLoginToken', retObj)
                this.$emit('closeLoginModalWindow', e)
            }
        },
        closeLoginModalWindow(e){
            this.$emit('closeLoginModalWindow', e)
        }
    },
    components: {
        'modal-window': ModalWindow,
        'login-form': LoginForm,
        'w3c-btn': W3CBtn
    }
}
</script>
<style scoped>
@media (max-width: 34em) {
    a {
        font-size: 0.75em;
        font-size: 3.5vw;
    }
}
</style>
