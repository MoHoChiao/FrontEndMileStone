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
                @click="goTo" 
        >
            {{ btnText }}
        </w3c-btn>
        <form method="post" :action="aUrl" :target="aTarget" type="hidden" ref="goto_form"></form>
    </div>
</template>

<script>
import W3CBtn from '../../Common/button/W3CBtn.vue';
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
            default: 'Go to',
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
        actionUrl: {
            type: String,
            default: ''
        },
        aTarget: {
            type: String,
            default: '_self'
        },
        aUrl: {
            type: String,
            default: '#'
        }
    },
    methods: {
        goTo(e) {
            this.$router.push('ResourceSetter')
            this.$store.dispatch('checkLoginToken', this.$refs.goto_form)
        }
    },
    components: {
        'w3c-btn': W3CBtn,
        'login-modal-window': LoginModalWindow
    }
};
</script>