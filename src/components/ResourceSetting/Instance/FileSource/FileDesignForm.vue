<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding-right:4px">
                <label class="w3-right"><span class="w3-hide-medium">File Name </span><span>Pattern</span></label>
            </div>
            <div class="w3-col m5" style="padding-right:4px">
                <input :class="inputClassList.filename" v-model="new_content.filename" type="text" maxlength="64" placeholder="Please Input File Name Pattern">
            </div>
            <div class="w3-col m5">
                <select class="w3-select w3-border w3-round" v-model="new_content.pattern" style="padding:0px">
                    <option value="1" selected>From The Beginning</option>
                    <option value="2">From The End</option>
                    <option value="3">Specified Position</option>
                    <option value="4">Full Match</option>
                </select>
            </div>
        </div>
        <div v-if="new_content.pattern === '3'" class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Start</label>
            </div>
            <div class="w3-col m2">
                <input :class="inputClassList.startposition" v-model="new_content.startposition" type="number" placeholder="Start Position">
            </div>
            <div class="w3-col m1" style="padding-right:4px;padding-left:10px">
                <label class="w3-right">End</label>
            </div>
            <div class="w3-col m2">
                <input :class="inputClassList.endposition" v-model="new_content.endposition" type="number" placeholder="End Position">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding-right:4px">
                <label class="w3-right">File Type</label>
            </div>
            <div class="w3-col m5" style="padding-right:4px">
                <select class="w3-select w3-border w3-round" v-model="new_content.filetype" style="padding:0px">
                    <option value="D" selected>Regular File</option>
                    <option value="C">Control File</option>
                </select>
            </div>
            <div v-if="new_content.filetype === 'C'" class="w3-col m5">
                <select class="w3-select w3-border w3-round" v-model="new_content.cfImpClass" style="padding:0px">
                    <template v-for="(info, index) in cfs">
                        <option v-if="index % 2 === 0 && cfs[index+1]" :value="cfs[index+1].value">{{ info.value }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Complete</label>
            </div>
            <div class="w3-col m8">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="128" placeholder="Please Input Complete Path">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Corrupt</label>
            </div>
            <div class="w3-col m8">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="128" placeholder="Please Input Corrupt Path">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Duplicate</label>
            </div>
            <div class="w3-col m8">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="128" placeholder="Please Input Duplicate Path">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Error</label>
            </div>
            <div class="w3-col m8">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="128" placeholder="Please Input Error Path">
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


                port: ['w3-input','w3-border'],
                osname: ['w3-input','w3-border'],
                encoding: ['w3-input','w3-border'],
                cpu: ['w3-input','w3-border'],
                mem: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                filetrigger: this.content.filetrigger,





                filename: this.content.filename,
                pattern: this.content.pattern,
                startposition: this.content.startposition,
                endposition: this.content.endposition,
                filetype: this.content.filetype,
                cfImpClass: this.content.cfImpClass,





                
                minfile: this.content.minfile,
                maxfile: this.content.maxfile,
                timeout: this.content.timeout,
                checkduplicate: this.content.checkduplicate,
                filterduplicate: this.content.filterduplicate,
                checkrow: this.content.checkrow,
                bypasszero: this.content.bypasszero,
                ftpget: this.content.ftpget,
                ftppostaction: this.content.ftppostaction,
                
                txdateformat: this.content.txdateformat,
                ftpconnectionuid: this.content.ftpconnectionuid,
                passive: this.content.passive,
                triggerjobuid: this.content.triggerjobuid,
                checksumalg: this.content.checksumalg,
                txdateendpos: this.content.txdateendpos,
                ftpmovedir: this.content.ftpmovedir,
                datafilecountmode: this.content.datafilecountmode,
                checksumfe: this.content.checksumfe,
                appendUid: this.content.appendUid,
                ftpremotedir: this.content.ftpremotedir,
                checksum: this.content.checksum,
                sftp: this.content.sftp,
                txdatestartpos: this.content.txdatestartpos,
                ftpbinary: this.content.ftpbinary
            },
            cfs: []
        }
    },
    created() {
        HTTPRepo.get(`disconfig/findByModule`, {params: {
                module: 'filesource'
            }})
            .then(response => {
                this.cfs = response.data
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.msg) {
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
                    pattern: 1,
                    startposition: 0,
                    endposition: 0,
                    filetype: 'D',
                    cfImpClass: 'com.netpro.filesource.ctrl.MatchFileSizeCtrlFileHandler'
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
    input, select {
        height: 20px
    }
</style>