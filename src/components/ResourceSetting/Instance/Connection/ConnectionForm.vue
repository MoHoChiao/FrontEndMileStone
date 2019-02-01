<template>
    <div class="w3-container w3-small" style="overflow:auto;max-height:450px">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Name') }}</label>
            </div>
            <div :class="[(urlOp === 'add') ? 'w3-col m9' : 'w3-col m4']">
                <name-input name="connectionname" :class="[inputClassList.common, errors.has('connectionname')? inputClassList.invalid: '']" 
                            v-validate="'required'" v-model="new_content.connectionname" type="text" maxlength="32" placeholder=""
                            style="text-transform:uppercase" />
            </div>
            <div v-if="urlOp !== 'add'">
                <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                    <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Category') }}</label>
                </div>
                <div class="w3-col m3">
                    <select :class="[inputClassList.common, inputClassList.round]" v-model="new_content.categoryuid"
                            style="padding:0px" @change="changeCategory" :disabled="urlOp === 'edit'">
                        <option value="root" selected>/</option>
                        <template v-for="category in allCategoryObjs">
                            <option :key="category.conncategoryuid" :value="category.conncategoryuid">{{ category.conncategoryname }}</option>
                        </template>
                    </select>
                </div>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Description') }}</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.common" v-model="new_content.description" type="text" maxlength="255" placeholder="">
            </div>
        </div>
        <div v-show="urlOp !== 'move'">
            <div class="w3-row w3-section">
                <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                    <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Type') }}</label>
                </div>
                <div class="w3-col m9">
                    <select :class="[inputClassList.common, inputClassList.round]" v-model="new_content.connectiontype" @click="clickType"
                            style="padding:0px" :disabled="urlOp === 'copy'">
                        <option value="D">Database</option>
                        <option value="F">FTP</option>
                        <option value="J">JDBC</option>
                        <option value="M">Mail</option>
                        <option value="O">OS Account</option>
                    </select>
                </div>
            </div>
            <hr class="w3-border-black">
            <div v-if="typeFlag['D']" class="w3-row-padding w3-section">
                <div class="w3-col m12">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.ServerName') }}</label>
                    <input name="server" :class="[inputClassList.common, errors.has('server')? inputClassList.invalid: '']"
                           v-validate="'required'" v-model="new_content.server" type="text" maxlength="255" placeholder="">
                </div>
            </div>
            <div v-if="typeFlag['F']" class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.ServerName') }}</label>
                    <input name="server" :class="[inputClassList.common, errors.has('server')? inputClassList.invalid: '']"
                           v-validate="'required'" v-model="new_content.server" type="text" maxlength="255" placeholder="">
                </div>
                <div class="w3-col m6">
                    <label>Target Directory</label>
                    <input :class="inputClassList.common" v-model="new_content.targetdir" type="text" maxlength="255" placeholder="">
                </div>
            </div>
            <div v-if="typeFlag['J']">
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m8">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.DBType') }}</label>
                        <select :class="[inputClassList.common, inputClassList.round]" v-model="new_content.jdbc_dbType"
                                style="padding:0px" @change="clickJDBCType()">
                            <template v-for="(info, key) in jdbcDriverInfo">
                                <option :value="key">
                                    {{ key }}
                                </option>
                            </template>
                            <option value="Generic">Generic</option>
                        </select>
                    </div>
                    <div class="w3-col m4">
                        <button class="w3-button w3-blue-grey w3-round" style="margin-top:16px" @click="testConnection">{{ $t('Form.Conn.TestConn') }}</button>
                    </div>
                </div>
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m6">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.JDBCDriver') }}</label>
                        <input name="jdbc_driver" :class="[inputClassList.common, errors.has('jdbc_driver')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.jdbc_driver" type="text" maxlength="255" placeholder="" :readonly="new_content.jdbc_dbType != 'Generic'">
                    </div>
                    <div class="w3-col m6">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.JDBCURL') }}</label>
                        <input name="jdbc_url" :class="[inputClassList.common, errors.has('jdbc_url')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.jdbc_url" type="text" maxlength="255" placeholder="">
                    </div>
                </div>
            </div>
            <div v-if="typeFlag['M']">
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m12">
                        <label>{{ $t('Form.Conn.MailServer') }}</label>
                        <input name="host" :class="[inputClassList.common, errors.has('host')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.host" type="text" maxlength="255" placeholder="">
                    </div>
                </div>
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m6">
                        <label>{{ $t('Form.Conn.Port') }}</label>
                        <input name="port" :class="[inputClassList.common, errors.has('port')? inputClassList.invalid: '']"
                               v-validate="'required|numeric'" v-model="new_content.port" type="number" min="0" max="65535">
                    </div>
                    <div class="w3-col m6">
                        <div class="w3-left" style="margin-top:16px;margin-right:16px;">
                            <input class="w3-check" v-model="new_content.mailssl" type="checkbox">
                            <label>SSL</label>
                        </div>
                        <div class="w3-left" style="margin-top:16px">
                            <input class="w3-check" v-model="new_content.mailtls" type="checkbox">
                            <label>TLS</label>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="typeFlag['O']"></div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m4">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Account') }}</label>
                    <input name="userid" :class="[inputClassList.common, errors.has('userid')? inputClassList.invalid: '']"
                           v-validate="'required'" v-model="new_content.userid" type="text" maxlength="255" placeholder="">
                </div>
                <div class="w3-col m4">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Pwd') }}</label>
                    <input name="password" :class="[inputClassList.common, errors.has('password')? inputClassList.invalid: '']"
                           v-validate="'required'" v-model="new_content.password" type="password" maxlength="255" placeholder="">
                </div>
                <div class="w3-col m2">
                    <div style="margin-top:16px;">
                        <input class="w3-check" v-model="new_content.withpim" type="checkbox">
                        <label>PIM</label>
                    </div>
                </div>
                <div v-if="new_content.withpim" class="w3-col m2">
                    <div style="margin-top:16px;">
                        <button class="w3-button w3-blue-grey w3-round">{{ $t('Form.Conn.GetPwd') }}</button>
                    </div>
                </div>
            </div>
            <div v-if="new_content.withpim">
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m6">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.EndPointType') }}</label>
                        <input name="pimendpointtype" :class="[inputClassList.common, errors.has('pimendpointtype')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.pimendpointtype" type="text" placeholder="">
                    </div>
                    <div class="w3-col m6">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.EndPointName') }}</label>
                        <input name="pimendpointname" :class="[inputClassList.common, errors.has('pimendpointname')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.pimendpointname" type="text" placeholder="">
                    </div>
                </div>
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m6">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.AccountContainer') }}</label>
                        <input name="pimaccountcontainer" :class="[inputClassList.common, errors.has('pimaccountcontainer')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.pimaccountcontainer" type="text" placeholder="">
                    </div>
                    <div class="w3-col m6">
                        <span class="w3-text-red">*</span><label>{{ $t('Form.Conn.AccountName') }}</label>
                        <input name="pimaccountname" :class="[inputClassList.common, errors.has('pimaccountname')? inputClassList.invalid: '']"
                               v-validate="'required'" v-model="new_content.pimaccountname" type="text" placeholder="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'

    export default {
        data() {
            return {
                typeFlag: {
                    D: true,
                    F: false,
                    J: false,
                    M: false,
                    O: false,
                    S: false,
                    N: false
                },
                inputClassList: {
                    common: 'w3-input w3-border',
                    invalid: 'w3-pale-red',
                    round: 'w3-round'
                },
                allCategoryObjs: new Object(), //store all remote data.(File Source Categories) for copy/move operation
                jdbcDriverInfo: new Object(),
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    connectionuid: this.content.connectionuid,
                    connectionname: this.content.connectionname,
                    description: this.content.description,
                    connectiontype: this.content.connectiontype,
                    pimendpointtype: this.content.pimendpointtype,
                    pimendpointname: this.content.pimendpointname,
                    pimaccountcontainer: this.content.pimaccountcontainer,
                    pimaccountname: this.content.pimaccountname,
                    withpim: Number(this.content.withpim),
                    userid: this.content.userid,
                    server: this.content.server,
                    password: this.content.password,
                    targetdir: this.content.targetdir,
                    jdbc_dbType: this.content.jdbc_dbType,
                    jdbc_url: this.content.jdbc_url,
                    jdbc_driver: this.content.jdbc_driver,
                    host: this.content.host,
                    port: this.content.port,
                    mailssl: Number(this.content.mailssl),
                    mailtls: Number(this.content.mailtls),
                    user: this.content.user,
                    notesHostIP: this.content.notesHostIP,
                    notesIor: this.content.notesIor,
                    notesServerName: this.content.notesServerName,
                    notesDBName: this.content.notesDBName,
                    saplanguage: this.content.saplanguage,
                    sapSystemNumber: this.content.sapSystemNumber,
                    sapSystemName: this.content.sapSystemName,
                    sapHostIP: this.content.sapHostIP,
                    sapCodePage: this.content.sapCodePage,
                    sapClient: this.content.sapClient,
                    categoryname: this.content.categoryname,
                    categoryuid: this.content.categoryuid
                }
            }
        },
        created() {
            //Get all jdbc connection info
            this.getJDBCInfo()

            if (this.urlOp !== 'add') {
                this.getCategories() //取得所有可供選擇的connection categories

                if (this.urlOp === 'copy') {
                    //copy動作, 把name和description設空值
                    this.new_content.connectionname = ''
                    this.new_content.description = ''
                }
            }

            if (this.urlOp !== 'add') { //如果不是add, 表示connectiontype必定有值,要把typeFlag中對應的connectiontype值改為true
                this.clickType()
            }

            /*
             *因為JDBC Connection時, 一樣是userid卻叫jdbc_userid, 而password叫jdbc_password
             *因為Mail Connection時, 一樣是userid卻叫user
             *由於以上兩點, 所以才需下面這個function來作一些很不自然的轉換動作, 這樣的設計是標準的UI相依於後端邏輯, very suck!!!
             */
            this.convertUserIdAndPassword()
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        connectionuid: '',
                        connectionname: '',
                        description: '',
                        connectiontype: 'D',
                        pimendpointtype: '',
                        pimendpointname: '',
                        pimaccountcontainer: '',
                        pimaccountname: '',
                        withpim: '0',
                        userid: '',
                        server: '',
                        password: '',
                        targetdir: '',
                        jdbc_dbType: 'AS400',
                        jdbc_url: 'jdbc:as400://host/libname',
                        jdbc_driver: 'com.ibm.as400.access.AS400JDBCDriver',
                        host: '',
                        port: 25,
                        mailssl: '0',
                        mailtls: '0',
                        user: '',
                        notesHostIP: '',
                        notesIor: '',
                        notesServerName: '',
                        notesDBName: '',
                        saplanguage: '',
                        sapSystemNumber: '',
                        sapSystemName: '',
                        sapHostIP: '',
                        sapCodePage: '',
                        sapClient: '',
                        categoryname: '/',
                        categoryuid: 'root'
                    }
                }
            },
            urlOp: {
                type: String,
                default: 'add'
            }
        },
        methods: {
            clickType() {
                this.typeFlag = []
                this.typeFlag[this.new_content.connectiontype] = true
            },
            clickJDBCType() {
                if (this.new_content.jdbc_dbType !== this.content.jdbc_dbType) { //不相等, 表示才是由使用者操作所選擇的jdbc type, 此時才需要代入預設值
                    if (this.new_content.jdbc_dbType === 'Generic') {
                        this.new_content.jdbc_driver = ''
                        this.new_content.jdbc_url = ''
                    } else {
                        this.new_content.jdbc_driver = this.jdbcDriverInfo[this.new_content.jdbc_dbType].driver
                        this.new_content.jdbc_url = this.jdbcDriverInfo[this.new_content.jdbc_dbType].url
                    }
                }
            },
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                }

                //collect basic necessary value
                let returnValue = {
                    "connectionuid": this.new_content.connectionuid,
                    "connectionname": this.new_content.connectionname.trim().toUpperCase(),
                    "connectiontype": this.new_content.connectiontype,
                    "description": this.new_content.description,
                    "withpim": Number(this.new_content.withpim),
                    "pimendpointtype": this.new_content.pimendpointtype,
                    "pimendpointname": this.new_content.pimendpointname,
                    "pimaccountcontainer": this.new_content.pimaccountcontainer,
                    "pimaccountname": this.new_content.pimaccountname,
                    "categoryuid": this.new_content.categoryuid,
                    "categoryname": this.new_content.categoryname
                }

                //collect form value(to be continue)
                if (this.new_content.connectiontype === 'D') {
                    returnValue.server = this.new_content.server
                    returnValue.password = this.new_content.password
                    returnValue.userid = this.new_content.userid
                } else if (this.new_content.connectiontype === 'F') {
                    returnValue.server = this.new_content.server
                    returnValue.password = this.new_content.password
                    returnValue.userid = this.new_content.userid
                    returnValue.targetdir = this.new_content.targetdir
                } else if (this.new_content.connectiontype === 'J') {
                    returnValue.jdbc_dbType = this.new_content.jdbc_dbType
                    returnValue.jdbc_password = this.new_content.password
                    returnValue.jdbc_driver = this.new_content.jdbc_driver
                    returnValue.jdbc_url = this.new_content.jdbc_url
                    returnValue.jdbc_userid = this.new_content.userid
                } else if (this.new_content.connectiontype === 'M') {
                    returnValue.mailssl = Number(this.new_content.mailssl)
                    returnValue.password = this.new_content.password
                    returnValue.mailtls = Number(this.new_content.mailtls)
                    returnValue.port = this.new_content.port
                    returnValue.host = this.new_content.host
                    returnValue.user = this.new_content.userid
                } else if (this.new_content.connectiontype === 'O') {
                    returnValue.password = this.new_content.password
                    returnValue.port = this.new_content.port
                    returnValue.userid = this.new_content.userid
                } else if (this.new_content.connectiontype === 'S') {
                    returnValue.sapCodePage = this.new_content.sapCodePage
                    returnValue.sapSystemNumber = this.new_content.sapSystemNumber
                    returnValue.sapSystemName = this.new_content.sapSystemName
                    returnValue.sapHostIP = this.new_content.sapHostIP
                    returnValue.sapClient = this.new_content.sapClient
                    returnValue.userid = this.new_content.userid
                    returnValue.password = this.new_content.password
                    returnValue.saplanguage = this.new_content.saplanguage
                } else if (this.new_content.connectiontype === 'N') {
                    returnValue.notesIor = this.new_content.notesIor
                    returnValue.notesHostIP = this.new_content.notesHostIP
                    returnValue.notesServerName = this.new_content.notesServerName
                    returnValue.password = this.new_content.password
                    returnValue.notesDBName = this.new_content.notesDBName
                    returnValue.userid = this.new_content.userid
                }

                return returnValue
            },
            async testConnection() {
                await this.$validator.validate('userid')
                await this.$validator.validate('password')

                if (this.errors.has('userid') || this.errors.has('password')) {
                    return
                }

                let postData = new Object()
                let urlPath = ``

                if (this.new_content.connectiontype === 'J') {
                    await this.$validator.validate('jdbc_driver')
                    await this.$validator.validate('jdbc_url')

                    if (this.errors.has('jdbc_driver') || this.errors.has('jdbc_url')) {
                        return
                    }

                    urlPath = `connection/test-jdbc-conn`
                    postData.jdbc_url = this.new_content.jdbc_url
                    postData.jdbc_driver = this.new_content.jdbc_driver
                    postData.jdbc_userid = this.new_content.userid
                    postData.jdbc_password = this.new_content.password
                    postData.jdbc_dbType = this.new_content.jdbc_dbType
                } else {
                    return
                }

                HTTP_TRINITY.post(urlPath, postData)
                    .then(response => {
                        let newStatus = {
                            "msg": response.data,
                            "status": "Success"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            reset() {
                //reset value to initial
                if (this.urlOp === 'copy') { //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
                    this.new_content.connectionname = ''
                    this.new_content.description = ''
                } else {
                    this.new_content.connectionname = this.content.connectionname
                    this.new_content.description = this.content.description
                }

                this.new_content.connectionuid = this.content.connectionuid
                this.new_content.connectiontype = this.content.connectiontype,
                    this.new_content.pimendpointtype = this.content.pimendpointtype,
                    this.new_content.pimendpointname = this.content.pimendpointname,
                    this.new_content.pimaccountcontainer = this.content.pimaccountcontainer,
                    this.new_content.pimaccountname = this.content.pimaccountname,
                    this.new_content.withpim = Number(this.content.withpim),
                    this.new_content.server = this.content.server,
                    this.new_content.targetdir = this.content.targetdir,
                    this.new_content.jdbc_dbType = this.content.jdbc_dbType,
                    this.new_content.jdbc_url = this.content.jdbc_url,
                    this.new_content.jdbc_driver = this.content.jdbc_driver,
                    this.new_content.host = this.content.host,
                    this.new_content.port = this.content.port,
                    this.new_content.mailssl = Number(this.content.mailssl),
                    this.new_content.mailtls = Number(this.content.mailtls),
                    this.new_content.user = this.content.user,
                    this.new_content.notesHostIP = this.content.notesHostIP,
                    this.new_content.notesIor = this.content.notesIor,
                    this.new_content.notesServerName = this.content.notesServerName,
                    this.new_content.notesDBName = this.content.notesDBName,
                    this.new_content.saplanguage = this.content.saplanguage,
                    this.new_content.sapSystemNumber = this.content.sapSystemNumber,
                    this.new_content.sapSystemName = this.content.sapSystemName,
                    this.new_content.sapHostIP = this.content.sapHostIP,
                    this.new_content.sapCodePage = this.content.sapCodePage,
                    this.new_content.sapClient = this.content.sapClient

                /*
                 *因為JDBC Connection時, 一樣是userid卻叫jdbc_userid, 而password叫jdbc_password
                 *因為Mail Connection時, 一樣是userid卻叫user
                 *由於以上兩點, 所以才需下面這個function來作一些很不自然的轉換動作, 這樣的設計是標準的UI相依於後端邏輯, very suck!!!
                 */
                this.convertUserIdAndPassword()

                //當connectiontype值變了之後, 尚需要改變UI的功能選項
                this.clickType()
            },
            changeCategory(e) {
                let selectElement = e.target
                var optionIndex = selectElement.selectedIndex
                var option = selectElement.options[optionIndex]
                this.new_content.categoryname = option.text
            },
            getCategories() { //Get all connection category
                let params = {
                    "ordering": {
                        "orderType": "ASC",
                        "orderField": "conncategoryname"
                    }
                }

                HTTP_TRINITY.post(`connection-category/findByFilter`, params)
                    .then(response => {
                        this.allCategoryObjs = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getJDBCInfo() { //Get all jdbc connection info
                HTTP_TRINITY.get(`connection/findJDBCDriverInfo`)
                    .then(response => {
                        this.jdbcDriverInfo = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getPIMPwd() {
                let params = {
                    "pimendpointtype": this.new_content.pimendpointtype,
                    "pimendpointname": this.new_content.pimendpointname,
                    "pimaccountcontainer": this.new_content.pimaccountcontainer,
                    "pimaccountname": this.new_content.pimaccountname,
                }

                HTTP_TRINITY.post(`connection/findPimPwd`, params)
                    .then(response => {
                        this.new_content.password = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            convertUserIdAndPassword() {
                if (this.new_content.connectiontype === 'J') { //因為JDBC Connection時, 一樣是userid卻叫jdbc_userid, 而password叫jdbc_password, so suck!
                    this.new_content.userid = this.content.jdbc_userid
                    this.new_content.password = this.content.jdbc_password
                } else if (this.new_content.connectiontype === 'M') { //因為Mail Connection時, 一樣是userid卻叫user, so suck!
                    this.new_content.userid = this.content.user
                    this.new_content.password = this.content.password
                } else {
                    this.new_content.userid = this.content.userid
                    this.new_content.password = this.content.password
                }
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
