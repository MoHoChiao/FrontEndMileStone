<template>
    <div class="w3-container w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.connectionname" v-model="new_content.connectionname" type="text" maxlength="32" placeholder="Please Input Name">
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
            <div class="w3-col m6">
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
        <div v-show="typeFlag['D']" class="w3-row-padding w3-section">
            <hr class="w3-border-black">
            <div class="w3-col m12">
                <span class="w3-text-red">*</span><label>Server Name</label>
                <input :class="inputClassList.server" v-model="new_content.server" type="text" placeholder="Please Input Server Name">
            </div>
        </div>
        <div v-show="typeFlag['F']" class="w3-row-padding w3-section">
            <hr class="w3-border-black">
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
            <hr class="w3-border-black">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m8">
                    <span class="w3-text-red">*</span><label>Database Type</label>
                    <select :class="inputClassList.jdbc_dbType" v-model="new_content.jdbc_dbType" style="padding:0px" @change="clickJDBCType()">
                        <template v-for="info in jdbcDriverInfo">
                            <option :value="info.name" >{{ info.name }}</option>
                        </template>
                        <option value="Generic" >Generic</option>
                    </select>
                </div>
                <div class="w3-col m4">
                    <button class="w3-button w3-blue-grey w3-round" style="margin-top:16px">Test Connection</button>
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
            <hr class="w3-border-black">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m12">
                    <label>Mail Server</label>
                    <input :class="inputClassList.host" v-model="new_content.host" type="text" placeholder="Please Input Mail Server Host">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <label>Port</label>
                    <input :class="inputClassList.port" v-model="new_content.port" type="number" placeholder="Please Input Port">
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
            <hr class="w3-border-black">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m8">
                    <span class="w3-text-red">*</span><label>System Name</label>
                    <input :class="inputClassList.sapSystemName" v-model="new_content.sapSystemName" type="text" placeholder="Please Input System Name">
                </div>
                <div class="w3-col m4">
                    <button class="w3-button w3-blue-grey w3-round" style="margin-top:16px">Test Connection</button>
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Host IP</label>
                    <input :class="inputClassList.sapHostIP" v-model="new_content.sapHostIP" type="text" placeholder="Please Input Host IP">
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Client</label>
                    <input :class="inputClassList.sapClient" v-model="new_content.sapClient" type="text" placeholder="Please Input Client">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m4">
                    <span class="w3-text-red">*</span><label>System #</label>
                    <input :class="inputClassList.sapSystemNumber" v-model="new_content.sapSystemNumber" type="text" placeholder="Please Input System Number">
                </div>
                <div class="w3-col m4">
                    <label>Code Page</label>
                    <input :class="inputClassList.sapCodePage" v-model="new_content.sapCodePage" type="text" placeholder="Please Input Code Page">
                </div>
                <div class="w3-col m4">
                    <label>Language</label>
                    <input :class="inputClassList.SAPLANGUAGE" v-model="new_content.SAPLANGUAGE" type="text" placeholder="Please Input Language">
                </div>
            </div>
        </div>
        <div v-show="typeFlag['N']">
            <hr class="w3-border-black">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m8">
                    <span class="w3-text-red">*</span><label>Host IP</label>
                    <input :class="inputClassList.notesHostIP" v-model="new_content.notesHostIP" type="text" placeholder="Please Input Host IP">
                </div>
                <div class="w3-col m4">
                    <button class="w3-button w3-blue-grey w3-round" style="margin-top:16px">Test Connection</button>
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <label>Server Name</label>
                    <input :class="inputClassList.notesServerName" v-model="new_content.notesServerName" type="text" placeholder="Please Input Server Name">
                </div>
                <div class="w3-col m6">
                    <span class="w3-text-red">*</span><label>Database Name</label>
                    <input :class="inputClassList.notesDBName" v-model="new_content.notesDBName" type="text" placeholder="Please Input Database Name">
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m12">
                    <label>IOR String</label>
                    <input :class="inputClassList.notesIor" v-model="new_content.notesIor" type="text" placeholder="Please Input IOR String">
                </div>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <hr class="w3-border-black">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Connection Account</label>
                <input :class="inputClassList.userid" v-model="new_content.userid" type="text" placeholder="Please Input Account">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Connection Password</label>
                <input :class="inputClassList.password" v-model="new_content.password" type="password" placeholder="Please Input Password">
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
                SAPLANGUAGE: ['w3-input','w3-border'],
                notesHostIP: ['w3-input','w3-border'],
                notesServerName: ['w3-input','w3-border'],
                notesDBName: ['w3-input','w3-border'],
                notesIor: ['w3-input','w3-border'],
                userid: ['w3-input','w3-border'],
                password: ['w3-input','w3-border']
            },
            fscategoryuid: '',  //store categoryuid for copy/move operation
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
                withpim: this.content.withpim,
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
                SAPLANGUAGE: this.content.SAPLANGUAGE,
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

        if(this.urlOp === 'copy' || this.urlOp === 'move'){
            this.getCategories()    //取得所有可供選擇的file source categories

            if(this.urlOp === 'copy'){
                //copy動作, 把name和description設空值
                this.new_content.filesourcename = ''
                this.new_content.description = ''
            }else if(this.urlOp === 'move'){
                // this.tabsFlag.fill(false)    //disable all tabs, because of move operation can not be modified
            }
        }
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
                    SAPLANGUAGE: '',
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
            if(this.new_content.jdbc_dbType === 'Generic'){
                this.new_content.jdbc_driver = ''
                this.new_content.jdbc_url = ''
            }else{
                for (let i = 0, len = this.jdbcDriverInfo.length; i < len; i++) {
                    if(this.new_content.jdbc_dbType === this.jdbcDriverInfo[i].name){
                        this.new_content.jdbc_driver = this.jdbcDriverInfo[i].driver
                        this.new_content.jdbc_url = this.jdbcDriverInfo[i].url
                        break
                    }
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
                "description":this.new_content.description,
                "userid":this.new_content.userid,
                "password":this.new_content.password
            }
            
            //conncategoryuid這個值只為了如果是move/copy的情況下, 需要傳回去,才能知道目前選擇的是那一個category
            if(this.conncategoryuid && this.conncategoryuid.trim().length > 0)
                returnValue.conncategoryuid = this.conncategoryuid

            //collect form value(to be continue)
            if(this.new_content.connectiontype === 'D'){
                returnValue.server = this.new_content.server
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

            return returnValue
        },
        reset(){
            //clear red font
            this.clearInValid()

            //reset value to initial
            if(this.urlOp !== 'copy'){  //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
                this.new_content.connectionuid = this.content.filesourceuid
                this.new_content.connectionname = this.content.filesourcename
                this.new_content.description = this.content.description
            }

            this.new_content.connectiontype = this.content.connectiontype,
            this.new_content.pimendpointtype = this.content.pimendpointtype,
            this.new_content.pimendpointname = this.content.pimendpointname,
            this.new_content.pimaccountcontainer = this.content.pimaccountcontainer,
            this.new_content.pimaccountname = this.content.pimaccountname,
            this.new_content.withpim = this.content.withpim,
            this.new_content.userid = this.content.userid,
            this.new_content.server = this.content.server,
            this.new_content.password = this.content.password,
            this.new_content.targetdir = this.content.targetdir,
            this.new_content.jdbc_dbType = this.content.jdbc_dbType,
            this.new_content.jdbc_url = this.content.jdbc_url,
            this.new_content.jdbc_driver = this.content.jdbc_driver,
            this.new_content.jdbc_userid = this.content.jdbc_userid,
            this.new_content.jdbc_password = this.content.jdbc_password,
            this.new_content.host = this.content.host,
            this.new_content.port = this.content.port,
            this.new_content.mailssl = this.content.mailssl,
            this.new_content.mailtls = this.content.mailtls,
            this.new_content.user = this.content.user,
            this.new_content.notesHostIP = this.content.notesHostIP,
            this.new_content.notesIor = this.content.notesIor,
            this.new_content.notesServerName = this.content.notesServerName,
            this.new_content.notesDBName = this.content.notesDBName,
            this.new_content.SAPLANGUAGE = this.content.SAPLANGUAGE,
            this.new_content.sapSystemNumber = this.content.sapSystemNumber,
            this.new_content.sapSystemName = this.content.sapSystemName,
            this.new_content.sapHostIP = this.content.sapHostIP,
            this.new_content.sapCodePage = this.content.sapCodePage,
            this.new_content.sapClient = this.content.sapClient
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
        }
    },
    components: {

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
