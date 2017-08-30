<template>
    <div>
        <w3c-btn :btn-block="btnBlock" 
                :btn-disabled="btnDisabled" 
                :btn-round="btnRound" 
                :btn-bg-color="btnBgColor" 
                :btn-size="btnSize" 
                :btn-font-weight="btnFontWeight" 
                :btn-border-color="btnBorderColor" 
                :btn-hover-color="btnHoverColor" 
                @click="onOpen" 
        >
            {{ btnText }}
        </w3c-btn>

        <login-modal-window v-if="alive" 
                    :window-title="windowTitle" 
                    :window-bg-color="windowBgColor" 
                    :window-btn-color="windowBtnColor" 
                    :label-text-color="labelTextColor" 
                    :form-action="formAction" 
                    :field-msg-inline="fieldMsgInline" 
                    :field-msg-color="fieldMsgColor" 
                    :input-round="inputRound" 
                    :input-border="inputBorder" 
                    :input-hover-color="inputHoverColor" 
                    @closeLoginModalWindow="closeLoginBtnWindow" 
        ></login-modal-window>
    </div>
</template>

<script>
import W3CBtn from './W3CBtn.vue';
import LoginModalWindow from '../window/LoginModalWindow.vue';

export default {
    data() {
        return {
            alive: false,
        }
    },
    props: {
        btnText: {
            type: String,
            default: 'Login',
        },
        btnBlock: {
            type: Boolean,
            default: false
        },
        btnDisabled: {
            type: Boolean,
            default: false
        },
        btnRound: {
            type: String,
            default: null
        },
        btnBgColor: {
            type: String,
            default: null
        },
        btnSize: {
            type: String,
            default: null
        },
        btnFontWeight: {
            type: String,
            default: null
        },
        btnBorderColor: {
            type: String,
            default: null
        },
        btnHoverColor: {
            type: String,
            default: null
        },
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
            default: ''
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
        onOpen(e) {
            if (!this.btnDisabled) {
                this.alive = true;
            } else {
                e.stopPropagation();
                e.preventDefault();
            }
        },
        closeLoginBtnWindow(e){
            this.alive = false;
        }
    },
    components: {
        'w3c-btn': W3CBtn,
        'login-modal-window': LoginModalWindow
    }
};
</script>