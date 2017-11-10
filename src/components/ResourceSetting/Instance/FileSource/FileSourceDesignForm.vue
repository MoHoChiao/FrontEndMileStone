<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding-right:4px">
                <label class="w3-right"><span class="w3-hide-medium">File Name </span><span>Pattern</span></label>
            </div>
            <div class="w3-col m5" style="padding-right:4px">
                <input :class="inputClassList.name" v-model="new_content.agentname" type="text" maxlength="64" placeholder="Please Input Root Path">
            </div>
            <div class="w3-col m5">
                <select class="w3-select w3-border w3-round" v-model="new_content.ostype" style="padding:0px">
                    <option value="1" selected>From The Beginning</option>
                    <option value="2">From The End</option>
                    <option value="3">Specified Position</option>
                    <option value="4">Full Match</option>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Received</label>
            </div>
            <div class="w3-col m8">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="128" placeholder="Please Input Received Path">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m3" style="padding-right:4px">
                <label class="w3-right">Target</label>
            </div>
            <div class="w3-col m8">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="128" placeholder="Please Input Target Path">
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
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border'],
                host: ['w3-input','w3-border'],
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
                agentuid: this.content.agentuid,
                agentname: this.content.agentname,
                description: this.content.description,
                host: this.content.host,
                port: this.content.port,
                maximumjob: this.content.maximumjob,
                activate: Number(this.content.activate),
                ostype: this.content.ostype,
                osname: this.content.osname,
                deadperiod: this.content.deadperiod,
                memweight: this.content.memweight,
                compresstransfer: Number(this.content.compresstransfer),
                encoding: this.content.encoding,
                monitortime: this.content.monitortime,
                cpuweight: this.content.cpuweight
            }
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    agentuid: '',
                    agentname: '',
                    description: '',
                    host: '',
                    port: '',
                    maximumjob: 5,
                    activate: '0',
                    ostype: 'Linux',
                    osname: '',
                    deadperiod: 10,
                    memweight: 1,
                    compresstransfer: '0',
                    encoding: '',
                    monitortime: 6,
                    cpuweight: 2
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
    select {
        height: 20px
    }
</style>