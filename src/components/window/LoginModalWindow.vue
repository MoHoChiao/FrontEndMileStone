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
import { mapGetters, mapActions } from 'vuex'

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
                this.$store.dispatch('genAccessToken', retObj);
                //document.cookie = "access_token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBQyIsInN1YiI6InJvb3QiLCJwb3dlci51c2VyIjoidHJ1ZSIsImxkYXAudXNlciI6ImZhbHNlIiwicm9sZS5hZG1pbmlzdHJhdG9yIjoiZmFsc2UiLCJyZWZyZXNoLnRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpCUXlJc0luTjFZaUk2SW5KdmIzUWlMQ0psZUhBaU9qRTRNVGcyTkRjek5EVjkuektMRDk5cW54SWJoLWxWVURLZThpcDE5UF94X3pIdDBHV1FfWlFBQlNLSSIsInRzLmFjY2VzcyI6IjE1MDMyODczNDUzMDIiLCJ0cy5sYXN0LmFjY2VzcyI6IjE1MDMwNTM3NzEyNTAiLCJ3YXJuLmNyZWQuZXhwaXJlIjoiZmFsc2UiLCJyZXNldC50b2tlbiI6ImZhbHNlIn0.VA0g_Q-mWcLD3oO7PV653G-x0ertlghFN8U75yy2nWj2FbM8MoS8ZNBdWza63F5vLiz9IbY4yibNL0Bd2yYD8rA_KNYL_45J41ODtJBymVhVpdp5CXbH4pqw0KMtKgkEYq5KHfTvalZrQVBQ5ylfPEGVjYLBHHmjtIACQitA-rwaqPsc6gE-rNCXd6tjtFqmvl19U8f2Webb4_3IRnND7wzBOA0Q5OVY310W_Hw3FQnrzbYUtmPSdy2SB9lz_vi8v98L6LqjUtVLZj2cmP5ZkYRr_v1f6A2i4guP_q8JW2WuNxU5waHIgStfSJJdwDaNfx3Qkxn6iDSna3Qq4W021Q;path=/";
            } else {
                
            }
        },
        closeLoginModalWindow(e){
            this.$emit('closeLoginModalWindow', e);
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
