<template>
    <div class="w3-container w3-small" style="overflow:auto;max-height:485px">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div :class="[(urlOp === 'add' || urlOp === 'edit') ? 'w3-col m9' : 'w3-col m4']">
                <input :class="inputClassList.connectionname" v-model="new_content.connectionname" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
            <div v-if="urlOp !== 'add' && urlOp !== 'edit'">
                <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                    <label class="w3-right"><span class="w3-text-red">*</span>Category</label>
                </div>
                <div class="w3-col m3">
                    <select :class="inputClassList.conncategoryuid" v-model="conncategoryuid" style="padding:0px">
                        <option value="" selected>/</option>
                        <template v-for="category in allCategoryObjs">
                            <option :value="category.conncategoryuid">{{ category.conncategoryname }}</option>
                        </template>
                    </select>
                </div>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.description" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Type</label>
            </div>
            <div class="w3-col m9">
                <select :class="inputClassList.connectiontype" v-model="new_content.connectiontype" @click="clickType" style="padding:0px">
                    <option value="D">Database</option>
                    <option value="F">FTP</option>
                    <option value="J">JDBC</option>
                    <option value="M">Mail</option>
                    <option value="O">OS Account</option>
                    <option value="S">SAP</option>
                    <option value="N">Notes</option>
                </select>
            </div>
        </div>
        <hr class="w3-border-black">
        <div v-show="typeFlag['D']" class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <span class="w3-text-red">*</span><label>Server Name</label>
                <input :class="inputClassList.server" v-model="new_content.server" type="text" placeholder="Please Input Server Name">
            </div>
        </div>
        <div v-show="typeFlag['F']" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Server Name</label>
                <input :class="inputClassList.server" v-model="new_content.server" type="text" placeholder="Please Input Server Name">
            </div>
            <div class="w3-col m6">
                <label>Target Directory</label>
                <input :class="inputClassList.targetdir" v-model="new_content.targetdir" type="text" placeholder="Please Input Target Directory">
            </div>
        </div>
        <div v-show="typeFlag['J']">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m8">
                    <span class="w3-text-red">*</span><label>Database Type</label>
                    <select :class="inputClassList.jdbc_dbType" v-model="new_content.jdbc_dbType" style="padding:0px" @change="clickJDBCType()">
                        <template v-for="(info, key) in jdbcDriverInfo">
                            <option :value="key" >{{ key }}</option>
                        </template>
                        <option value="Generic" >Generic</option>
                    </select>
                </div>
                <div class="w3-col m4">
                    <button class="w3-button w3-blue-grey w3-round" style="margin-top:16px" @click="testConnection">Test Connection</button>
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>JDBC Driver</label>
                    <input :class="inputClassList.jdbc_driver" v-model="new_content.jdbc_driver" type="text" placeholder="Please Input Connection Driver" readonly>
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>JDBC URL</label>
                    <input :class="inputClassList.jdbc_url" v-model="new_content.jdbc_url" type="text" placeholder="Please Input Connection URL">
                </div>
            </div>
        </div>
        <div v-show="typeFlag['M']">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m12">
                    <label>Mail Server</label>
                    <input :class="inputClassList.host" v-model="new_content.host" type="text" placeholder="Please Input Mail Server Host">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <label>Port</label>
                    <input :class="inputClassList.port" v-model="new_content.port" type="number" min="0" max="65535">
                </div>
                <div class="w3-col m6">
                    <div class="w3-left" style="margin-top:16px;margin-right:16px;">
                        <input class="w3-check" v-model="new_content.mailssl" type="checkbox" >
                        <label>SSL</label>
                    </div>
                    <div class="w3-left" style="margin-top:16px">
                        <input class="w3-check" v-model="new_content.mailtls" type="checkbox">
                        <label>TLS</label>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="typeFlag['O']"></div>
        <div v-show="typeFlag['S']">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>System Name</label>
                    <input :class="inputClassList.sapSystemName" v-model="new_content.sapSystemName" type="text" placeholder="Please Input System Name">
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Host IP</label>
                    <input :class="inputClassList.sapHostIP" v-model="new_content.sapHostIP" type="text" placeholder="Please Input Host IP">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Client</label>
                    <input :class="inputClassList.sapClient" v-model="new_content.sapClient" type="text" placeholder="Please Input Client">
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>System #</label>
                    <input :class="inputClassList.sapSystemNumber" v-model="new_content.sapSystemNumber" type="text" placeholder="Please Input System Number">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <label>Code Page</label>
                    <input :class="inputClassList.sapCodePage" v-model="new_content.sapCodePage" type="text" placeholder="Please Input Code Page">
                </div>
                <div class="w3-col m6">
                    <label>Language</label>
                    <input :class="inputClassList.saplanguage" v-model="new_content.saplanguage" type="text" placeholder="Please Input Language">
                </div>
            </div>
        </div>
        <div v-show="typeFlag['N']">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Host IP</label>
                    <input :class="inputClassList.notesHostIP" v-model="new_content.notesHostIP" type="text" placeholder="Please Input Host IP">
                </div>
                <div class="w3-col m6">
                    <label>Server Name</label>
                    <input :class="inputClassList.notesServerName" v-model="new_content.notesServerName" type="text" placeholder="Please Input Server Name">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Database Name</label>
                    <input :class="inputClassList.notesDBName" v-model="new_content.notesDBName" type="text" placeholder="Please Input Database Name">
                </div>
                <div class="w3-col m6">
                    <label>IOR String</label>
                    <input :class="inputClassList.notesIor" v-model="new_content.notesIor" type="text" placeholder="Please Input IOR String">
                </div>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m4">
                <span class="w3-text-red">*</span><label>Account</label>
                <input :class="inputClassList.userid" v-model="new_content.userid" type="text" placeholder="Please Input Account">
            </div>
            <div class="w3-col m4">
                <span class="w3-text-red">*</span><label>Password</label>
                <input :class="inputClassList.password" v-model="new_content.password" type="password" placeholder="Please Input Password">
            </div>
            <div class="w3-col m4">
                <div style="margin-top:16px;margin-right:16px">
                    <input class="w3-check" v-model="new_content.withpim" type="checkbox">
                    <label>PIM</label>
                </div>
            </div>
        </div>
        <div v-show="new_content.withpim">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Endpoint Type</label>
                    <input :class="inputClassList.pimendpointtype" v-model="new_content.pimendpointtype" type="text" placeholder="Please Input Endpoint Type">
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Endpoint Name</label>
                    <input :class="inputClassList.pimendpointname" v-model="new_content.pimendpointname" type="text" placeholder="Please Input Endpoint Name">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Account Container</label>
                    <input :class="inputClassList.pimaccountcontainer" v-model="new_content.pimaccountcontainer" type="text" placeholder="Please Input Account Container">
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Account Name</label>
                    <input :class="inputClassList.pimaccountname" v-model="new_content.pimaccountname" type="text" placeholder="Please Input Account Name">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <button class="w3-button w3-blue-grey w3-round">Get Password</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'

export default {
    data() {
        return {
            typeFlag: { D:true, F:false, J:false, M:false, O:false, S:false, N:false },
            inputClassList: {
                connectionname: ['w3-input','w3-border'],
                description: ['w3-input','w3-border'],
                connectiontype: ['w3-select','w3-border','w3-round'],
                server: ['w3-input','w3-border'],
                targetdir: ['w3-input','w3-border'],
                jdbc_dbType: ['w3-select','w3-border','w3-round'],
                jdbc_driver: ['w3-input','w3-border'],
                jdbc_url: ['w3-input','w3-border'],
                host: ['w3-input','w3-border'],
                port: ['w3-input','w3-border'],
                sapSystemName: ['w3-input','w3-border'],
                sapHostIP: ['w3-input','w3-border'],
                sapClient: ['w3-input','w3-border'],
                sapSystemNumber: ['w3-input','w3-border'],
                sapCodePage: ['w3-input','w3-border'],
                saplanguage: ['w3-input','w3-border'],
                notesHostIP: ['w3-input','w3-border'],
                notesServerName: ['w3-input','w3-border'],
                notesDBName: ['w3-input','w3-border'],
                notesIor: ['w3-input','w3-border'],
                userid: ['w3-input','w3-border'],
                password: ['w3-input','w3-border'],
                pimendpointtype: ['w3-input','w3-border'],
                pimendpointname: ['w3-input','w3-border'],
                pimaccountcontainer: ['w3-input','w3-border'],
                pimaccountname: ['w3-input','w3-border'],
                conncategoryuid: ['w3-select','w3-border','w3-round']
            },
            conncategoryuid: '',  //store categoryuid for copy/move operation
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
                sapClient: this.content.sapClient
            }
        }
    },
    created() {
        //Get all jdbc connection info
        this.getJDBCInfo()
        
        if(this.urlOp === 'copy' || this.urlOp === 'move'){
            this.getCategories()    //取得所有可供選擇的connection categories

            if(this.urlOp === 'copy'){
                //copy動作, 把name和description設空值
                this.new_content.connectionname = ''
                this.new_content.description = ''
            }
        }

        if(this.urlOp !== 'add'){    //如果不是add, 表示connectiontype必定有值,要把typeFlag中對應的connectiontype值改為true
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
            default () {
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
            this.typeFlag = new Array()
            this.typeFlag[this.new_content.connectiontype] = true
        },
        clickJDBCType() {
            if(this.new_content.jdbc_dbType !== this.content.jdbc_dbType){  //不相等, 表示才是由使用者操作所選擇的jdbc type, 此時才需要代入預設值
                if(this.new_content.jdbc_dbType === 'Generic'){
                    this.new_content.jdbc_driver = ''
                    this.new_content.jdbc_url = ''
                }else{
                    this.new_content.jdbc_driver = this.jdbcDriverInfo[this.new_content.jdbc_dbType].driver
                    this.new_content.jdbc_url = this.jdbcDriverInfo[this.new_content.jdbc_dbType].url
                }
            }
        },
        save(){
            this.clearInValid()
            
            //check form value
            if(this.new_content.connectionname === undefined || this.new_content.connectionname.trim().length <= 0){
                this.inputClassList.connectionname.splice(2, 1, 'w3-red')
                return
            }
            
            if(this.new_content.userid === undefined || this.new_content.userid.trim().length <= 0){
                this.inputClassList.userid.splice(2, 1, 'w3-red')
                return
            }

            if(this.new_content.password === undefined || this.new_content.password.trim().length <= 0){
                this.inputClassList.password.splice(2, 1, 'w3-red')
                return
            }

            if(this.new_content.withpim){
                if(this.new_content.pimendpointtype === undefined || this.new_content.pimendpointtype.trim().length <= 0){
                    this.inputClassList.pimendpointtype.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.pimendpointname === undefined || this.new_content.pimendpointname.trim().length <= 0){
                    this.inputClassList.pimendpointname.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.pimaccountcontainer === undefined || this.new_content.pimaccountcontainer.trim().length <= 0){
                    this.inputClassList.pimaccountcontainer.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.pimaccountname === undefined || this.new_content.pimaccountname.trim().length <= 0){
                    this.inputClassList.pimaccountname.splice(2, 1, 'w3-red')
                    return
                }
            }

            if(this.new_content.connectiontype === 'D'){
                if(this.new_content.server === undefined || this.new_content.server.trim().length <= 0){
                    this.inputClassList.server.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'F'){
                if(this.new_content.server === undefined || this.new_content.server.trim().length <= 0){
                    this.inputClassList.server.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'J'){
                if(this.new_content.jdbc_driver === undefined || this.new_content.jdbc_driver.trim().length <= 0){
                    this.inputClassList.jdbc_driver.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.jdbc_url === undefined || this.new_content.jdbc_url.trim().length <= 0){
                    this.inputClassList.jdbc_url.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'M'){
        
            }else if(this.new_content.connectiontype === 'O'){

            }else if(this.new_content.connectiontype === 'S'){
                if(this.new_content.sapSystemName === undefined || this.new_content.sapSystemName.trim().length <= 0){
                    this.inputClassList.sapSystemName.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.sapHostIP === undefined || this.new_content.sapHostIP.trim().length <= 0){
                    this.inputClassList.sapHostIP.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.sapClient === undefined || this.new_content.sapClient.trim().length <= 0){
                    this.inputClassList.sapClient.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.sapSystemNumber === undefined || this.new_content.sapSystemNumber.trim().length <= 0){
                    this.inputClassList.sapSystemNumber.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'N'){
                if(this.new_content.notesHostIP === undefined || this.new_content.notesHostIP.trim().length <= 0){
                    this.inputClassList.notesHostIP.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.notesDBName === undefined || this.new_content.notesDBName.trim().length <= 0){
                    this.inputClassList.notesDBName.splice(2, 1, 'w3-red')
                    return
                }
            }

            //collect basic necessary value
            let returnValue = {
                "connectionuid":this.new_content.connectionuid,
                "connectionname":this.new_content.connectionname,
                "connectiontype":this.new_content.connectiontype,
                "description":this.new_content.description,
                "withpim":Number(this.new_content.withpim),
                "pimendpointtype":this.new_content.pimendpointtype,
                "pimendpointname":this.new_content.pimendpointname,
                "pimaccountcontainer":this.new_content.pimaccountcontainer,
                "pimaccountname":this.new_content.pimaccountname,
            }
            
            //conncategoryuid這個值只為了如果是move/copy的情況下, 需要把值傳回去前個元件, 才能知道目前選擇的是那一個category
            if(this.conncategoryuid && this.conncategoryuid.trim().length > 0)
                returnValue.conncategoryuid = this.conncategoryuid

            //collect form value(to be continue)
            if(this.new_content.connectiontype === 'D'){
                returnValue.server = this.new_content.server
                returnValue.password = this.new_content.password
                returnValue.userid = this.new_content.userid
            }else if(this.new_content.connectiontype === 'F'){
                returnValue.server = this.new_content.server
                returnValue.password = this.new_content.password
                returnValue.userid = this.new_content.userid
                returnValue.targetdir = this.new_content.targetdir
            }else if(this.new_content.connectiontype === 'J'){
                returnValue.jdbc_dbType = this.new_content.jdbc_dbType
                returnValue.jdbc_password = this.new_content.password
                returnValue.jdbc_driver = this.new_content.jdbc_driver
                returnValue.jdbc_url = this.new_content.jdbc_url
                returnValue.jdbc_userid = this.new_content.userid
            }else if(this.new_content.connectiontype === 'M'){
                returnValue.mailssl = Number(this.new_content.mailssl)
                returnValue.password = this.new_content.password
                returnValue.mailtls = Number(this.new_content.mailtls)
                returnValue.port = this.new_content.port
                returnValue.host = this.new_content.host
                returnValue.user = this.new_content.userid
            }else if(this.new_content.connectiontype === 'O'){
                returnValue.password = this.new_content.password
                returnValue.port = this.new_content.port
                returnValue.userid = this.new_content.userid
            }else if(this.new_content.connectiontype === 'S'){
                returnValue.sapCodePage = this.new_content.sapCodePage
                returnValue.sapSystemNumber = this.new_content.sapSystemNumber
                returnValue.sapSystemName = this.new_content.sapSystemName
                returnValue.sapHostIP = this.new_content.sapHostIP
                returnValue.sapClient = this.new_content.sapClient
                returnValue.userid = this.new_content.userid
                returnValue.password = this.new_content.password
                returnValue.saplanguage = this.new_content.saplanguage
            }else if(this.new_content.connectiontype === 'N'){
                returnValue.notesIor = this.new_content.notesIor
                returnValue.notesHostIP = this.new_content.notesHostIP
                returnValue.notesServerName = this.new_content.notesServerName
                returnValue.password = this.new_content.password
                returnValue.notesDBName = this.new_content.notesDBName
                returnValue.userid = this.new_content.userid
            }

            return returnValue
        },
        testConnection(){
            if(this.new_content.userid === undefined || this.new_content.userid.trim().length <= 0){
                this.inputClassList.userid.splice(2, 1, 'w3-red')
                return
            }

            if(this.new_content.password === undefined || this.new_content.password.trim().length <= 0){
                this.inputClassList.password.splice(2, 1, 'w3-red')
                return
            }

            let postData = new Object()
            let urlPath = ``

            if(this.new_content.connectiontype === 'J'){
                if(this.new_content.jdbc_driver === undefined || this.new_content.jdbc_driver.trim().length <= 0){
                    this.inputClassList.jdbc_driver.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.jdbc_url === undefined || this.new_content.jdbc_url.trim().length <= 0){
                    this.inputClassList.jdbc_url.splice(2, 1, 'w3-red')
                    return
                }
                urlPath = `connection/test-jdbc-conn`
                postData.jdbc_url = this.new_content.jdbc_url
                postData.jdbc_driver = this.new_content.jdbc_driver
                postData.jdbc_userid = this.new_content.userid
                postData.jdbc_password = this.new_content.password
                postData.jdbc_dbType = this.new_content.jdbc_dbType
            }else{
                return
            }

            HTTPRepo.post(urlPath, postData)
                .then(response => {
                    let newStatus = {
                        "msg": response.data,
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        let msg = error.response.data

                        if(error.response.data.message){
                            msg = error.response.data.message
                            if(error.response.data.exception)
                                msg = error.response.data.exception + ' [' + msg +']'
                        }

                        let newStatus = {
                            "msg": msg,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    } else {
                        let newStatus = {
                            "msg": error.message,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                })
        },
        reset(){
            //clear red font
            this.clearInValid()

            //reset value to initial
            if(this.urlOp === 'copy'){  //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
                this.new_content.connectionname = ''
                this.new_content.description = ''
            }else{
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
        clearInValid(){
            this.inputClassList.connectionname.splice(2, 1)
            this.inputClassList.userid.splice(2, 1)
            this.inputClassList.password.splice(2, 1)
            this.inputClassList.server.splice(2, 1)
            this.inputClassList.jdbc_driver.splice(2, 1)
            this.inputClassList.jdbc_url.splice(2, 1)
            this.inputClassList.sapSystemName.splice(2, 1)
            this.inputClassList.sapHostIP.splice(2, 1)
            this.inputClassList.sapClient.splice(2, 1)
            this.inputClassList.sapSystemNumber.splice(2, 1)
            this.inputClassList.notesHostIP.splice(2, 1)
            this.inputClassList.notesDBName.splice(2, 1)
            this.inputClassList.pimendpointtype.splice(2, 1)
            this.inputClassList.pimendpointname.splice(2, 1)
            this.inputClassList.pimaccountcontainer.splice(2, 1)
            this.inputClassList.pimaccountname.splice(2, 1)
        },
        getCategories(){    //Get all connection category
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"conncategoryname"
                }
            }

            HTTPRepo.post(`connection-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        getJDBCInfo(){  //Get all jdbc connection info
            HTTPRepo.get(`connection/findJDBCDriverInfo`)
            .then(response => {
                this.jdbcDriverInfo = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        convertUserIdAndPassword(){
            if(this.new_content.connectiontype === 'J'){    //因為JDBC Connection時, 一樣是userid卻叫jdbc_userid, 而password叫jdbc_password, so suck!
                this.new_content.userid = this.content.jdbc_userid
                this.new_content.password = this.content.jdbc_password
            }else if(this.new_content.connectiontype === 'M'){  //因為Mail Connection時, 一樣是userid卻叫user, so suck!
                this.new_content.userid = this.content.user
                this.new_content.password = this.content.password
            }else{
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
