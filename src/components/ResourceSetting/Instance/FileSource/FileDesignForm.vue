<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>Pattern And Type</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>File Name Pattern</label>
                <input :class="inputClassList.filename" v-model="new_content.filename" type="text" maxlength="64" placeholder="Please Input File Name Pattern" required>
            </div>
            <div class="w3-col m6">
                <label>Pattern Rule</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.pattern" style="padding:0px" required>
                    <option value="1" selected>From The Beginning</option>
                    <option value="2">From The End</option>
                    <option value="3">Specified Position</option>
                    <option value="4">Full Match</option>
                </select>
            </div>
        </div>
        <div v-if="new_content.pattern === '3'" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Start Position</label>
                <input :class="inputClassList.startposition" v-model="new_content.startposition" type="number" placeholder="Start Position" required>
            </div>
            <div class="w3-col m6">
                <label>End Position</label>
                <input :class="inputClassList.endposition" v-model="new_content.endposition" type="number" placeholder="End Position" required>
            </div>
        </div>
        <div v-if="new_content.filetype === 'D'" class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <label>File Type</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.filetype" style="padding:0px" required>
                    <option value="D" selected>Regular File</option>
                    <option value="C">Control File</option>
                </select>
            </div>
        </div>
        <div v-else class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>File Type</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.filetype" style="padding:0px" required>
                    <option value="D" selected>Regular File</option>
                    <option value="C">Control File</option>
                </select>
            </div>
            <div class="w3-col m6">
                <label>Implementation Class</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.cfImpClass" style="padding:0px" required>
                    <template v-for="(info, index) in cfs">
                        <option v-if="index % 2 === 0 && cfs[index+1]" :value="cfs[index+1].value">{{ info.value }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>Check Mode</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.checkduplicate" type="checkbox">
                <label>Check Duplication</label>
            </div>
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.checksum" type="checkbox">
                <label>Check Sum</label>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div v-if="new_content.checkduplicate && new_content.filetype === 'C'" class="w3-col m6">
                <label>Filter Rule</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.filterduplicate" style="padding:0px" required>
                    <option value="1" selected>Filter Out Duplication</option>
                    <option value="2">Filter Out All</option>
                </select>
            </div>
            <div v-if="new_content.checksum" class="w3-col m3">
                <label><span class="w3-hide-medium w3-hide-small">Check Sum </span>File Extension</label>
                <input :class="inputClassList.checksumfe" v-model="new_content.checksumfe" type="text" placeholder="Check Sum File Extension" required>
            </div>
            <div v-if="new_content.checksum" class="w3-col m3">
                <label>Algorithm</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.checksumalg" style="padding:0px" required>
                    <option value="M" selected>MD5</option>
                    <option value="S">SHA1</option>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>File Setting</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Min Amount of Files</label>
                <input :class="inputClassList.minfile" v-model="new_content.minfile" type="number" required>
            </div>
            <div class="w3-col m6">
                <label>Max Amount of Files</label>
                <input :class="inputClassList.maxfile" v-model="new_content.maxfile" type="number" required>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Timeout (In Minutes)</label>
                <input :class="inputClassList.timeout" v-model="new_content.timeout" type="number" required>
            </div>
            <div v-if="new_content.filetype === 'C'" class="w3-col m6">
                <label>Control File Amount Mode</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.datafilecountmode" style="padding:0px">
                    <option value="R" selected>Data File</option>
                    <option value="C">Control File</option>
                </select>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m5">
                <input class="w3-check" v-model="new_content.bypasszero" type="checkbox">
                <label>Success If No File</label>
            </div>
            <div class="w3-col m7">
                <input class="w3-check" v-model="new_content.appendUid" type="checkbox">
                <label>Append Task Uid in File(s) Name</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>FTP Setting</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.ftpget" type="checkbox">
                <label>FTP Get</label>
            </div>
            <div v-if="new_content.ftpget" class="w3-col m6">
                <input class="w3-check" v-model="new_content.sftp" type="checkbox">
                <label>SFTP</label>
            </div>
        </div>
        <div v-if="new_content.ftpget && !new_content.sftp" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.ftpbinary" type="checkbox">
                <label>FTP Binary Mode</label>
            </div>
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.passive" type="checkbox">
                <label>Passive</label>
            </div>
        </div>
        <div v-if="new_content.ftpget" class="w3-row-padding w3-section" style="padding-top:10px">
            <div class="w3-col m6">
                <label>FTP Connection</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.ftpconnectionuid" style="padding:0px" required>
                    <template v-for="(info, index) in ftpConns">
                        <option :value="info.connectionuid">{{ info.connectionname }}</option>
                    </template>
                </select>
            </div>
            <div class="w3-col m6">
                <label>Post FTP Action</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.ftppostaction" style="padding:0px">
                    <option value="0" selected>Do Nothing</option>
                    <option value="1">Move File To Another Directory</option>
                    <option value="2">Delete File</option>
                </select>
            </div>
        </div>
        <div v-if="new_content.ftpget" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>FTP Remote Directory</label>
                <input :class="inputClassList.ftpremotedir" v-model="new_content.ftpremotedir" type="text" required>
            </div>
            <div v-if="new_content.ftppostaction === '1'" class="w3-col m6">
                <label>FTP Move Directory</label>
                <input :class="inputClassList.ftpmovedir" v-model="new_content.ftpmovedir" type="text" required>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'

export default {
    data() {
        return {
            inputClassList: {
                filename: ['w3-input','w3-border'],
                startposition: ['w3-input','w3-border'],
                endposition: ['w3-input','w3-border'],
                checksumfe: ['w3-input','w3-border'],
                minfile: ['w3-input','w3-border'],
                maxfile: ['w3-input','w3-border'],
                timeout: ['w3-input','w3-border'],
                ftpremotedir: ['w3-input','w3-border'],
                ftpmovedir: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                filename: this.content.filename,
                pattern: this.content.pattern,
                startposition: this.content.startposition,
                endposition: this.content.endposition,
                filetype: this.content.filetype,
                cfImpClass: this.content.cfImpClass,
                datafilecountmode: this.content.datafilecountmode,
                checkduplicate: this.content.checkduplicate,
                filterduplicate: this.content.filterduplicate,
                checksum: this.content.checksum,
                checksumalg: this.content.checksumalg,
                checksumfe: this.content.checksumfe,
                minfile: this.content.minfile,
                maxfile: this.content.maxfile,
                timeout: this.content.timeout,
                bypasszero: this.content.bypasszero,
                appendUid: this.content.appendUid,
                ftpget: this.content.ftpget,
                sftp: this.content.sftp,
                ftpbinary: this.content.ftpbinary,
                passive: this.content.passive,
                ftpconnectionuid: this.content.ftpconnectionuid,
                ftppostaction: this.content.ftppostaction,
                ftpremotedir: this.content.ftpremotedir,
                ftpmovedir: this.content.ftpmovedir,
                checkrow: this.content.checkrow    //此值不知道作用, 似乎永遠都是0
            },
            cfs: [],    //store all Implementation Class and display name
            ftpConns: []
        }
    },
    mounted() {
        //Fetch cfs objs is above
        HTTPRepo.get(`disconfig/findByModule`, {params: {
                module: 'filesource'
            }})
            .then(response => {
                this.cfs = response.data
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
        
        //Fetch ftp connection objs is above
        let params = {
            "ordering":{
                "orderType":"ASC",
                "orderField":"connectionname"
            },
            "querying":{
                "queryType":'equals',
                "queryField":'connectiontype',
                "queryString":'F',
                "ignoreCase":true
            }
        }
        HTTPRepo.post(`connection/findByFilter`, params)
            .then(response => {
                this.ftpConns = response.data
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
    props: {
        content: {
            type: Object,
            default () {
                return {
                    filename: '',
                    pattern: '1',
                    startposition: 0,
                    endposition: 0,
                    filetype: 'D',
                    cfImpClass: 'com.netpro.filesource.ctrl.MatchFileSizeCtrlFileHandler',
                    datafilecountmode: 'R',
                    checkduplicate: 0,
                    filterduplicate: '1',
                    checksum: 0,
                    checksumalg: 'M',
                    checksumfe: '.checksum',
                    minfile: 1,
                    maxfile: 5,
                    timeout: 3,
                    bypasszero: 0,
                    appendUid: 0,
                    ftpget: 0,
                    sftp: 0,
                    ftpbinary: 0,
                    passive: 0,
                    ftpconnectionuid: '',
                    ftppostaction: '0',
                    ftpremotedir: '',
                    ftpmovedir: '',
                    checkrow: 0
                }
            }
        },
        index: Number
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.agentname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.host.trim().length <= 0){
                this.inputClassList.host.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.port.toString().trim() === '' || isNaN(this.new_content.port)){
                this.inputClassList.port.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.cpuweight.toString().trim() === '' || isNaN(this.new_content.cpuweight)){
                this.inputClassList.cpu.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.memweight.toString().trim() === '' || isNaN(this.new_content.memweight)){
                this.inputClassList.mem.splice(2, 1, 'w3-text-red')
            }else{
                this.new_content.activate = Number(this.new_content.activate)
                this.new_content.compresstransfer = Number(this.new_content.compresstransfer)
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.agentuid = this.content.agentuid
            this.new_content.agentname = this.content.agentname
            this.new_content.description = this.content.description
            this.new_content.host = this.content.host
            this.new_content.port = this.content.port
            this.new_content.maximumjob = this.content.maximumjob
            this.new_content.activate = Number(this.content.activate)
            this.new_content.ostype = this.content.ostype
            this.new_content.osname = this.content.osname
            this.new_content.deadperiod = this.content.deadperiod
            this.new_content.memweight = this.content.memweight
            this.new_content.compresstransfer = Number(this.content.compresstransfer)
            this.new_content.encoding = this.content.encoding
            this.new_content.monitortime = this.content.monitortime
            this.new_content.cpuweight = this.content.cpuweight
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.host.splice(2, 1)
            this.inputClassList.port.splice(2, 1)
            this.inputClassList.cpu.splice(2, 1)
            this.inputClassList.mem.splice(2, 1)
        }
    }
}
</script>
<style scoped>
    input,select {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>