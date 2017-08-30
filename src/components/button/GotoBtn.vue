<template>
    <div>
        <w3c-btn v-if="loginStatus !== ''" :btn-block="btnBlock" 
                :btn-disabled="btnDisabled" 
                :btn-round="btnRound" 
                :btn-bg-color="btnBgColor" 
                :btn-size="btnSize" 
                :btn-font-weight="btnFontWeight" 
                :btn-border-color="btnBorderColor" 
                :btn-hover-color="btnHoverColor" 
                btn-type="href" 
                :a-target="aTarget" 
                :a-url="aUrl" 
                @click="goTo" 
        >
            {{ btnText }}
        </w3c-btn>
        <w3c-btn v-else :btn-block="btnBlock" 
                :btn-disabled="btnDisabled" 
                :btn-round="btnRound" 
                :btn-bg-color="btnBgColor" 
                :btn-size="btnSize" 
                :btn-font-weight="btnFontWeight" 
                :btn-border-color="btnBorderColor" 
                :btn-hover-color="btnHoverColor" 
                btn-type="href" 
                a-target="_self" 
                a-url="#" 
                @click="goTo" 
        >
            {{ btnText }}
        </w3c-btn>
    </div>
</template>

<script>
import W3CBtn from './W3CBtn.vue';
import LoginModalWindow from '../window/LoginModalWindow.vue';
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            alive: false,
        }
    },
    computed: {
        //ES7的寫法
        ...mapGetters({
            loginStatus: 'getloginStatus'
        })
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
            this.$store.dispatch('checkLoginToken', e)
        }
    },
    components: {
        'w3c-btn': W3CBtn,
        'login-modal-window': LoginModalWindow
    }
};
</script>