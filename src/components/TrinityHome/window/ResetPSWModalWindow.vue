<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" window-animations="animate-zoom" @closeModalWindow="closeResetPSWModalWindow">
        <reset-psw-form slot="content" 
                    ref="resetForm" 
                    :form-action="formAction" 
                    :label-text-color="labelTextColor" 
                    :field-msg-inline="fieldMsgInline" 
                    :field-msg-color="fieldMsgColor" 
                    :input-round="inputRound" 
                    :input-border="inputBorder" 
                    :input-hover-color="inputHoverColor" 
        ></reset-psw-form>
        <div slot="footer" class="w3-container">
            <w3c-btn @click="onValidate" class="w3-right" :btn-bg-color="windowBtnColor" btn-round="medium">{{ $t('Login.ResetButton') }}</w3c-btn>
        </div>
    </modal-window>
</template>
<script>
import ModalWindow from '../../Common/window/ModalWindow.vue';
import ResetPSWForm from '../form/ResetPSWForm.vue';
import W3CBtn from '../../Common/button/W3CBtn.vue';
import { mapGetters } from 'vuex'

export default {
    computed: {
        //ES7的寫法
        ...mapGetters({
            loginStatus: 'getloginStatus'
        }),
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
            default: 'highway-schoolbus'
        },
        windowBtnColor: {
            type: String,
            default: 'signal-white'
        },
        labelTextColor: {
            type: String,
            default: 'blue'
        },
        formAction: {
            type: String,
            default: '',
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
            let retObj = this.$refs.resetForm.verifyForm()
            if (retObj.flag) {
                this.$store.dispatch('resetLoginToken', retObj.psw)
                this.$emit('closeResetPSWModalWindow', e)
            }
        },
        closeResetPSWModalWindow(e){
            this.$emit('closeResetPSWModalWindow', e)
        }
    },
    components: {
        'modal-window': ModalWindow,
        'reset-psw-form': ResetPSWForm,
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
