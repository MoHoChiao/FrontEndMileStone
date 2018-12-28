<template>
    <div class="w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.User.UserID') }}</label>
                <input name="userid" :class="[inputClassList.common, errors.has('userid')? inputClassList.invalid: '']" 
                       v-validate="'required|alpha_dash'" v-model="new_content.userid" type="text" maxlength="20" placeholder="" 
                       :readonly="content.userid !== ''">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.User.UserName') }}</label>
                <name-input name="username" :class="[inputClassList.common, errors.has('username')? inputClassList.invalid: '']" 
                            v-validate="'required|alpha_dash'" v-model="new_content.username" type="text" maxlength="32" placeholder="" />
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.User.UserPwd') }}</label>
                <input name="pwd1" :class="[inputClassList.common, errors.has('pwd1')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="password1" type="password" maxlength="64" placeholder="" ref="password">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.User.ConfirmPwd') }}</label>
                <input name="pwd2" :class="[inputClassList.common, errors.has('pwd2')? inputClassList.invalid: '']" 
                       v-validate="'required|confirmed:password'" v-model="password2" type="password" maxlength="64" placeholder="">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.activate" type="checkbox">
                <label>{{ $t('Form.Activate') }}</label>
            </div>
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.localaccount" type="checkbox">
                <label>{{ $t('Form.User.LocalAccount') }}</label>
            </div>
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.onlyforexecution" type="checkbox">
                <label>{{ $t('Form.User.OnlyForExe') }}</label>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Description') }}</label>
                <input :class="inputClassList.common" v-model="new_content.description" type="text" maxlength="255" placeholder="">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>{{ $t('Form.User.MobileNum') }}</label>
                <input name="mobile" :class="[inputClassList.common, errors.has('email')? inputClassList.invalid: '']" 
                       v-validate="'numeric'" v-model="new_content.mobile" type="text" maxlength="20" placeholder="">
            </div>
            <div class="w3-col m6">
                <label>{{ $t('Form.User.Email') }}</label>
                <input name="email" :class="[inputClassList.common, errors.has('email')? inputClassList.invalid: '']" 
                       v-validate="'email'" v-model="new_content.email" type="text" maxlength="64" placeholder="">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>{{ $t('Form.User.SSOID') }}</label>
                <input :class="inputClassList.common" v-model="new_content.ssoid" type="text" maxlength="20" placeholder="">
            </div>
            <div class="w3-col m6">
                <label>{{ $t('Form.User.Language') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.defaultlang" style="padding:7px">
                    <option value="en_US" selected>English</option>
                    <option value="zh_TW">Traditional Chinese</option>
                    <option value="zh_CN">Simplified Chinese</option>
                </select>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.HomeDir') }}</label>
                <input :class="inputClassList.common" v-model="new_content.homedir" type="text" maxlength="255" placeholder="">
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                inputClassList: {
                    common: 'w3-input w3-border',
                    invalid: 'w3-pale-red'
                },
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    useruid: this.content.useruid,
                    userid: this.content.userid,
                    username: this.content.username,
                    description: this.content.description,
                    usertype: this.content.usertype,
                    activate: Number(this.content.activate),
                    localaccount: Number(this.content.localaccount),
                    onlyforexecution: Number(this.content.onlyforexecution),
                    email: this.content.email,
                    mobile: this.content.mobile,
                    defaultlang: this.content.defaultlang,
                    ssoid: this.content.ssoid,
                    homedir: this.content.homedir,
                    createduseruid: this.content.createduseruid
                },
                password1: '',
                password2: ''
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        useruid: '',
                        userid: '',
                        username: '',
                        description: '',
                        usertype: 'G',
                        activate: '1',
                        localaccount: '0',
                        onlyforexecution: '0',
                        email: '',
                        mobile: '',
                        defaultlang: 'en_US',
                        ssoid: '',
                        homedir: '',
                        createduseruid: ''
                    }
                }
            },
            index: Number
        },
        methods: {
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                }

                this.new_content.activate = Number(this.new_content.activate)
                this.new_content.localaccount = Number(this.new_content.localaccount)
                this.new_content.onlyforexecution = Number(this.new_content.onlyforexecution)
                this.new_content.password = this.password1
                return this.new_content
            },
            reset() {
                this.new_content.useruid = this.content.useruid
                this.new_content.userid = this.content.userid
                this.new_content.username = this.content.username
                this.new_content.description = this.content.description
                this.new_content.usertype = this.content.usertype
                this.new_content.activate = Number(this.content.activate)
                this.new_content.localaccount = Number(this.content.localaccount)
                this.new_content.onlyforexecution = Number(this.content.onlyforexecution)
                this.new_content.email = this.content.email
                this.new_content.mobile = this.content.mobile
                this.new_content.defaultlang = this.content.defaultlang
                this.new_content.ssoid = this.content.ssoid
                this.new_content.homedir = this.content.homedir

                this.password1 = ''
                this.password2 = ''
            }
        }
    }
</script>
<style scoped>
    input, select {
        height: 30px
    }

    input.w3-check {
        height: 20px
    }
</style>