<template>
    <div class="w3-container w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.connectionname" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
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
                    <input :class="inputClassList.jdbc_driver" v-model="new_content.jdbc_driver" type="text" placeholder="Please Input Connection Driver">
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
        <div v-show="typeFlag['S']" class="w3-container" style="overflow:auto;max-height:300px;min-height:300px">
            <job-trigger-form ref="jobTriggerForm" :content="new_content.jobTrigger"></job-trigger-form>
        </div>
        <div v-show="typeFlag['N']" class="w3-container" style="overflow:auto;max-height:300px;min-height:300px">
            <job-trigger-form ref="jobTriggerForm" :content="new_content.jobTrigger"></job-trigger-form>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import DirectoryAsignForm from './DirectoryAsignForm.vue'
import FileDesignForm from './FileDesignForm.vue'
import JobTriggerForm from './JobTriggerForm.vue'

export default {
    data() {
        return {
            typeFlag: { D:true, F:false, J:false, M:false, O:false, S:false, N:false },
            inputClassList: {
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border'],
                connectiontype: ['w3-select','w3-border','w3-round'],
                server: ['w3-input','w3-border'],
                targetdir: ['w3-input','w3-border'],
                jdbc_dbType: ['w3-select','w3-border','w3-round'],
                jdbc_driver: ['w3-input','w3-border'],
                jdbc_url: ['w3-input','w3-border'],
                host: ['w3-input','w3-border'],
                port: ['w3-input','w3-border'],
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
                jdbc_userid: this.content.jdbc_userid,
                jdbc_password: this.content.jdbc_password,
                host: this.content.host,
                port: this.content.port,
                mailssl: this.content.mailssl,
                mailtls: this.content.mailtls,
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
                    jdbc_userid: '',
                    jdbc_password: '',
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
        // save(){
        //     this.clearInValid()
            
        //     //check form value
        //     if(this.new_content.filesourcename === undefined || this.new_content.filesourcename.trim().length <= 0){
        //         this.inputClassList.name.splice(2, 1, 'w3-red')
        //         return
        //     }
            
        //     //collect basic necessary value
        //     let returnValue = {
        //         "filesourceuid":this.new_content.filesourceuid,
        //         "filesourcename":this.new_content.filesourcename,
        //         "description":this.new_content.description
        //     }
            
        //     //fscategoryuid這個值只為了如果是move/copy的情況下, 需要傳回去,才能知道目前選擇的是那一個category
        //     if(this.fscategoryuid && this.fscategoryuid.trim().length > 0)
        //         returnValue.fscategoryuid = this.fscategoryuid

        //     //call Directory Asign form to check value
        //     let directoryAsignContent = this.$refs.directoryAsignForm.save()
        //     //collect all necessary value from Directory Asign form
        //     if(directoryAsignContent){
        //         for(let key in directoryAsignContent){
        //             returnValue[key] = directoryAsignContent[key]
        //         }
        //     }else{
        //         this.openTab(0)
        //         return
        //     }

        //     //call File Design form to check value
        //     let fileDesignContent = this.$refs.fileDesignForm.save()
        //     //collect all necessary value from File Design form
        //     if(fileDesignContent){
        //         for(let key in fileDesignContent){
        //             returnValue[key] = fileDesignContent[key]
        //         }
        //     }else{
        //         this.openTab(1)
        //         return
        //     }
            
        //     //call Job Trigger form to check value
        //     let jobTriggerContent = this.$refs.jobTriggerForm.save()
        //     //collect all necessary value from Job Trigger form
        //     if(jobTriggerContent){
        //         for(let key in jobTriggerContent){
        //             returnValue[key] = jobTriggerContent[key]
        //         }
        //     }else{
        //         this.openTab(2)
        //         return
        //     }

        //     return returnValue
        // },
        // reset(){
        //     //clear red font
        //     this.clearInValid()

        //     //reset value to initial
        //     if(this.urlOp !== 'copy'){  //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
        //         this.new_content.filesourceuid = this.content.filesourceuid
        //         this.new_content.filesourcename = this.content.filesourcename
        //         this.new_content.description = this.content.description
        //     }

        //     //call child form to reset value to initial
        //     this.$refs.directoryAsignForm.reset()
        //     this.$refs.fileDesignForm.reset()
        //     this.$refs.jobTriggerForm.reset()
        // },
        // clearInValid(){
        //     this.inputClassList.name.splice(2, 1)
        //     this.inputClassList.desc.splice(2, 1)
        // },
        // getCategories(){
        //     let params = {
        //         "ordering":{
        //             "orderType":"ASC",
        //             "orderField":"fscategoryname"
        //         }
        //     }

        //     HTTPRepo.post(`file-source-category/findByFilter`, params)
        //     .then(response => {
        //         this.allCategoryObjs = response.data
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.data) {
        //             let newStatus = {
        //                 "msg": error.response.data,
        //                 "status": "Error"
        //             }
        //             this.$store.dispatch('setSystemStatus', newStatus)
        //         } else {
        //             let newStatus = {
        //                 "msg": error.message,
        //                 "status": "Error"
        //             }
        //             this.$store.dispatch('setSystemStatus', newStatus)
        //         }
        //     })
        // }
    },
    components: {
        'directory-asign-form': DirectoryAsignForm,
        'file-design-form': FileDesignForm,
        'job-trigger-form': JobTriggerForm
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
