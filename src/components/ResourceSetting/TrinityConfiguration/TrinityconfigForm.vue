<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Conf.VerID') }}</label>
            </div>
            <div class="w3-col m4">
                <input :class="inputClassList.common" v-model="content.versionid" type="text" 
                    maxlength="8" style="text-transform:uppercase" readonly>
            </div>
            <div class="w3-col m1"/>
            <div class="w3-col m5 w3-right">
                <input class="w3-check" v-model="content.dualservermode" style="width:40px;" type="checkbox">
                <label>{{ $t('Form.Conf.RedundantServer') }}</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Conf.Primary') }} <span class="w3-hide-medium w3-hide-small">{{ $t('Form.Host') }}</span></label>
            </div>
            <div class="w3-col m4">
                <input name="primaryhost" :class="[inputClassList.common, errors.has('primaryhost')? inputClassList.invalid: '']"
                       v-validate="'required|ip'" v-model="content.primaryhost" type="text" maxlength="30" placeholder="">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-hide-medium w3-hide-small">{{ $t('Form.Conf.Primary') }} </span>{{ $t('Form.Port') }}</label>
            </div>
            <div class="w3-col m3">
                <input name="primaryport" :class="[inputClassList.common, errors.has('primaryport')? inputClassList.invalid: '']"
                       v-validate="'required|between:0,65535'"v-model="content.primaryport" type="number" min="0" max="65535">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Conf.Standby') }} <span class="w3-hide-medium w3-hide-small">{{ $t('Form.Host') }}</span></label>
            </div>
            <div class="w3-col m4">
                <input name="standbyhost" :class="[inputClassList.common, errors.has('standbyhost')? inputClassList.invalid: '']"
                       v-validate="'required|ip'" v-model="content.standbyhost" type="text" maxlength="30" placeholder="">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-hide-medium w3-hide-small">{{ $t('Form.Conf.Standby') }} </span>{{ $t('Form.Host') }}</label>
            </div>
            <div class="w3-col m3">
                <input name="standbyport" :class="[inputClassList.common, errors.has('standbyport')? inputClassList.invalid: '']"
                       v-validate="'required|between:0,65535'" v-model="content.standbyport" type="number" min="0" max="65535">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Conf.SMTPSetting') }}</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Host') }}</label>
            </div>
            <div class="w3-col m4">
                <input name="smtpserver" :class="[inputClassList.common, errors.has('smtpserver')? inputClassList.invalid: '']"
                       v-validate="{regex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::(?![7-9]\d\d\d\d)(?!6[6-9]\d\d\d)(?!65[6-9]\d\d)(?!655[4-9]\d)(?!6553[6-9])(?!0+)(\d{1,5}))?$/}"
                       v-model="content.smtpserver" type="text" maxlength="30" placeholder="IPv4[:Port]">
            </div>
            <div class="w3-col m6"/>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Account') }}</label>
            </div>
            <div class="w3-col m4">
                <input :class="inputClassList.common" v-model="content.smtpuser" type="text" maxlength="64" placeholder="">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Pwd') }}</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.common" v-model="content.smtppassword" type="password" maxlength="32" placeholder="">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Conf.AuthSetting') }}</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Conf.AccountAuth') }}</label>
            </div>
            <div class="w3-col m9">
                <select :class="selectClassList" v-model="content.authmode" style="padding:0px">
                    <option value="0">Trinity</option>
                    <option value="1">LDAP</option>
                </select>
            </div>
        </div>
        <div v-if="content.authmode === '1'" class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Conf.LDAPServer') }}</label>
            </div>
            <div class="w3-col m4">
                <input :class="inputClassList.common" v-model="content.ldapserver" type="text" maxlength="512" placeholder="">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Item.Domain') }}</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.common" v-model="content.defaultdomain" type="text" maxlength="512" placeholder="">
            </div>
        </div>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../util_js/axios_util'

export default {
    data() {
        return {
            inputClassList: {
                common: 'w3-input w3-border',
                invalid: 'w3-pale-red'
            },
            selectClassList: ['w3-select','w3-border','w3-round'],
            content: new Object()
        }
    },
    mounted() {
        this.getTrinityconfig()
    },
    methods: {
        getTrinityconfig(){
            HTTP_TRINITY.get(`trinity-config/findAll`)
            .then(response => {
                if(response.data && response.data.length > 0){
                    this.content = response.data[0]
                    this.content.dualservermode = Number(this.content.dualservermode)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        async save() {
            await this.$validator.validateAll()

            if (this.errors.any()) {
                return
            }

            if (!this.content.dualservermode) {
                this.content.standbyhost = ''
                this.content.standbyport = 0
            }

            if (this.content.authmode === '0') {
                this.content.ldapserver = ''
                this.content.defaultdomain = ''
            }

            this.content.dualservermode = Number(this.content.dualservermode)
            return this.content
        },
        reset(){
            this.getTrinityconfig()
        }
    }
}
</script>
<style scoped>
    input,select {
        height: 30px
    }
    input.w3-check,input.w3-radio {
        height: 16px
    }
</style>
