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
                @click="noPermission" 
        >
            {{ btnText }}
        </w3c-btn>
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
        }
    },
    methods: {
        noPermission(e) {
            this.$store.dispatch('checkLoginToken', 'NoPermissionBtn')
            let newStatus = {
                "msg": "Sorry! you do not have enough permissions to access this program.<br>Please contact your manager.",
                "status": "Warn"
            }
            this.$store.dispatch('setSystemStatus', newStatus)
        }
    },
    components: {
        'w3c-btn': W3CBtn,
        'login-modal-window': LoginModalWindow
    }
};
</script>