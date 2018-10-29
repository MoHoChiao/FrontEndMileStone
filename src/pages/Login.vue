<template>
    <div class="w3-animate-opacity">
        <div class="w3-display-middle w3-round-xlarge w3-white" style="width:40%">
            <div class="w3-container w3-padding-16">
                <p class="w3-center">
                    <img class="w3-center" src="src/assets/images/TrinityLogo_a.png" style="width:80%" />
                </p>
                <form class="w3-left-align" method="POST" :action="_formAction">
                    <string-input ref="ac_input"
                                  :label-text="$t('Login.UserAccount')"
                                  :input-placeholder="$t('Login.UserAccountPlaceholder')"
                                  input-type="text"
                                  :label-text-color="labelTextColor"
                                  :field-msg-color="fieldMsgColor"
                                  :field-msgIn-line="fieldMsgInline"
                                  :input-round="inputRound"
                                  :input-border="inputBorder"
                                  :input-hover-color="inputHoverColor">
                    </string-input>
                    <string-input ref="psw_input"
                                  :label-text="$t('Login.UserPassword')"
                                  :input-placeholder="$t('Login.UserPasswordPlaceholder')"
                                  input-type="password"
                                  :input-auto="false"
                                  :label-text-color="labelTextColor"
                                  :field-msg-color="fieldMsgColor"
                                  :field-msgIn-line="fieldMsgInline"
                                  :input-round="inputRound"
                                  :input-border="inputBorder"
                                  :input-hover-color="inputHoverColor">
                    </string-input>
                </form>
                <w3c-btn @click="onValidate" class="w3-center" :btn-bg-color="windowBtnColor" btn-round="medium">
                    <!--<i v-if="loading" class="fa fa-spinner fa-spin"></i>--> 
                     {{ $t('Login.LoginButton') }}
                </w3c-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import ModalWindow from '../components/Common/window/ModalWindow.vue'
    import StringInput from '../components/Common/form/StringInput.vue'
    import CheckBox from '../components/Common/form/CheckBox.vue'
    import W3CBtn from '../components/Common/button/W3CBtn.vue'
    import { mapGetters } from 'vuex'

    export default {
        components: {
            'modal-window': ModalWindow,
            'string-input': StringInput,
            'check-box': CheckBox,
            'w3c-btn': W3CBtn
        },
        data() {
            return {
                
            }
        },
        computed: {
            _formAction() {
                return this.formAction !== null ? this.formAction.trim() : '';
            },
            _rightBtnColor() {
                return this.windowBtnColor !== null ? `w3-${this.windowBtnColor}` : '';
            },
            _leftTextColor() {
                return this.windowBtnColor !== null ? `w3-text-${this.windowBtnColor}` : '';
            },
            //ES7的寫法
            ...mapGetters({
                TrinityApps: 'getTrinityApps',
                loginStatus: 'getloginStatus',
                userType: 'getUserType'
            })
        },
        props: {
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
            onValidate(e) {
                let retObj = this.verifyForm()
                if (retObj.flag) {
                    this.loading = true
                    this.$store.dispatch('genLoginToken', retObj)
                }
            },
            verifyForm() {
                return {
                    account: this.$refs.ac_input.inputContent,
                    psw: this.$refs.psw_input.inputContent,
                    flag: (this.$refs.ac_input.checkEmpty('Login.FieldEmpty')) &&
                        (this.$refs.psw_input.checkEmpty('Login.FieldEmpty'))
                }
            }
        }
    }
</script>