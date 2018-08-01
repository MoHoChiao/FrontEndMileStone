<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.agentname" type="text" 
                    maxlength="32" placeholder="Please Input Agent Name" style="text-transform:uppercase">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.activate" type="checkbox">
                <label>Activate</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.compresstransfer" type="checkbox">
                <label>Compress</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>OS Type</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.ostype" style="padding:7px">
                    <option value="Linux" selected>Linux</option>
                    <option value="Other">Other</option>
                    <option value="Unix">Unix</option>
                    <option value="Windows">Windows</option>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">OS Name</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.osname" v-model="new_content.osname" type="text" maxlength="20" placeholder="Please Input OS Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Host</label>
            </div>
            <div class="w3-col m4">
                <input :class="inputClassList.host" v-model="new_content.host" type="text" maxlength="30" placeholder="Please Input Host">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Port</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.port" v-model="new_content.port" type="number" min="0" max="65535">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Max Jobs</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.maximumjob" style="padding:7px">
                    <template v-for="n in 64">
                        <option v-if="n === 5" :value="n" selected>{{ n }}</option>
                        <option v-else :value="n">{{ n }}</option>
                    </template>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Encoding</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.encoding" v-model="new_content.encoding" type="text" placeholder="Please Input Encoding">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Dead Period</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.deadperiod" style="padding:7px">
                    <template v-for="n in 30">
                        <option v-if="n === 10" :value="n" selected>{{ n }} minutes</option>
                        <option v-else :value="n">{{ n }} minutes</option>
                    </template>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Monitor Period</label>
            </div>
            <div class="w3-col m3">
                <select class="w3-select w3-border w3-round" v-model="new_content.monitortime" style="padding:7px">
                    <template v-for="n in 60">
                        <option v-if="n === 6" :value="n" selected>{{ n }} seconds</option>
                        <option v-else :value="n">{{ n }} seconds</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>CPU Weight</label>
            </div>
            <div class="w3-col m4">
                <input :class="inputClassList.cpu" v-model="new_content.cpuweight" type="number" min="0" max="999">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>MEM Weight</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.mem" v-model="new_content.memweight" type="number" min="0" max="999">
            </div>
        </div>
    </div>
</template>
<script>

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
                mem: ['w3-input','w3-border'],
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
                    host: '127.0.0.1',
                    port: '1888',
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
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else if(this.new_content.host.trim().length <= 0){
                this.inputClassList.host.splice(2, 1, 'w3-red')
            }else if(this.new_content.port.toString().trim() === '' || isNaN(this.new_content.port) || 
                        this.new_content.port < 0 || this.new_content.port > 65535){
                this.inputClassList.port.splice(2, 1, 'w3-red')
            }else if(this.new_content.cpuweight.toString().trim() === '' || isNaN(this.new_content.cpuweight) || 
                        this.new_content.cpuweight < 0){
                this.inputClassList.cpu.splice(2, 1, 'w3-red')
            }else if(this.new_content.memweight.toString().trim() === '' || isNaN(this.new_content.memweight) || 
                        this.new_content.memweight < 0){
                this.inputClassList.mem.splice(2, 1, 'w3-red')
            }else{
                this.new_content.agentname = this.new_content.agentname.trim().toUpperCase()
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