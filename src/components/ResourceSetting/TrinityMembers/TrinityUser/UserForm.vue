<template>
    <div class="w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>User ID</label>
                <input v-if="content.userid === ''" :class="inputClassList.userid" v-model="new_content.userid" type="text" maxlength="20" placeholder="Please Input ID">
                <input v-else :class="inputClassList.userid" v-model="new_content.userid" type="text" maxlength="20" readonly>
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>User Name</label>
                <name-input :class="inputClassList.username" v-model="new_content.username" type="text" maxlength="32" placeholder="Please Input Name" />
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>User Password</label>
                <input :class="inputClassList.password1" v-model="password1" type="password" maxlength="64" placeholder="Please Input Password">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>CONFIRM Password</label>
                <input :class="inputClassList.password2" v-model="password2" type="password" maxlength="64" placeholder="Please Password Again">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.activate" type="checkbox">
                <label>Activate</label>
            </div>
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.localaccount" type="checkbox">
                <label>Local Account</label>
            </div>
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.onlyforexecution" type="checkbox">
                <label>Only For Exe</label>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <label>Description</label>
                <input :class="inputClassList.description" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Mobile Number</label>
                <input :class="inputClassList.mobile" v-model="new_content.mobile" type="text" maxlength="20" placeholder="Please Input Mobile Number">
            </div>
            <div class="w3-col m6">
                <label>E-mail</label>
                <input :class="inputClassList.email" v-model="new_content.email" type="text" maxlength="64" placeholder="Please Input E-mail">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>SSO ID</label>
                <input :class="inputClassList.ssoid" v-model="new_content.ssoid" type="text" maxlength="20" placeholder="Please Input SSO ID">
            </div>
            <div class="w3-col m6">
                <label>DEFAULT Language</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.defaultlang" style="padding:7px">
                    <option value="en_US" selected>English</option>
                    <option value="zh_TW">Traditional Chinese</option>
                    <option value="zh_CN">Simplified Chinese</option>
                </select>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <label>Home Directory</label>
                <input :class="inputClassList.homedir" v-model="new_content.homedir" type="text" maxlength="255" placeholder="Please Input Home Directory">
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                inputClassList: {
                    userid: ['w3-input', 'w3-border'],
                    username: ['w3-input', 'w3-border'],
                    password1: ['w3-input', 'w3-border'],
                    password2: ['w3-input', 'w3-border'],
                    email: ['w3-input', 'w3-border'],
                    mobile: ['w3-input', 'w3-border'],
                    description: ['w3-input', 'w3-border'],
                    ssoid: ['w3-input', 'w3-border'],
                    homedir: ['w3-input', 'w3-border']
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
            save() {
                this.clearInValid()

                if (this.new_content.userid.trim().length <= 0) {
                    this.inputClassList.userid.splice(2, 1, 'w3-red')
                } else if (this.new_content.username.trim().length <= 0) {
                    this.inputClassList.username.splice(2, 1, 'w3-red')
                    // }else if(this.password1.trim() === '') {
                    //     this.inputClassList.password1.splice(2, 1, 'w3-red')
                    // }else if(this.password2.trim() === '') {
                    //     this.inputClassList.password2.splice(2, 1, 'w3-red')
                } else if (this.password1 !== this.password2) {
                    let newStatus = {
                        "msg": "Passwords are not identical!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.inputClassList.password1.splice(2, 1, 'w3-red')
                    this.inputClassList.password2.splice(2, 1, 'w3-red')
                } else {
                    this.new_content.activate = Number(this.new_content.activate)
                    this.new_content.localaccount = Number(this.new_content.localaccount)
                    this.new_content.onlyforexecution = Number(this.new_content.onlyforexecution)
                    this.new_content.password = this.password1
                    return this.new_content
                }
            },
            reset() {
                this.clearInValid()

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
            },
            clearInValid() {
                this.inputClassList.userid.splice(2, 1)
                this.inputClassList.username.splice(2, 1)
                this.inputClassList.password1.splice(2, 1)
                this.inputClassList.password2.splice(2, 1)
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