<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2">&nbsp;</div>
            <div class="w3-col m4">
                <input :class="inputClassList.rootdir" v-model="new_content.rootdir" type="text" placeholder="Root Path">
            </div>
            <div class="w3-col m4">
                <input class="w3-check" v-model="new_content.isApplyRoot" type="checkbox">
                <label>Apply Root Path</label>
            </div>
            <div class="w3-col m2">&nbsp;</div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Received Directory</label>
                <input :class="inputClassList.receivedir" v-model="new_content.receivedir" type="text" maxlength="128" placeholder="Please Input Received Path" required>
            </div>
            <div class="w3-col m6">
                <label>Corrupt Directory</label>
                <input :class="inputClassList.corruptdir" v-model="new_content.corruptdir" type="text" maxlength="128" placeholder="Please Input Corrupt Path" required>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Target Directory</label>
                <input :class="inputClassList.targetdir" v-model="new_content.targetdir" type="text" maxlength="128" placeholder="Please Input Target Path" required>
            </div>
            <div class="w3-col m6">
                <label>Duplicate Directory</label>
                <input :class="inputClassList.duplicatedir" v-model="new_content.duplicatedir" type="text" maxlength="128" placeholder="Please Input Duplicate Path" required>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <label>Complete Directory</label>
                <input :class="inputClassList.completedir" v-model="new_content.completedir" type="text" maxlength="128" placeholder="Please Input Complete Path" required>
            </div>
            <div class="w3-col m6">
                <label>Error Directory</label>
                <input :class="inputClassList.errordir" v-model="new_content.errordir" type="text" maxlength="128" placeholder="Please Input Error Path" required>
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
                rootdir: ['w3-input'],
                receivedir: ['w3-input','w3-border'],
                targetdir: ['w3-input','w3-border'],
                completedir: ['w3-input','w3-border'],
                corruptdir: ['w3-input','w3-border'],
                duplicatedir: ['w3-input','w3-border'],
                errordir: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                rootdir: this.content.rootdir,
                receivedir: this.content.receivedir,
                targetdir: this.content.targetdir,
                completedir: this.content.completedir,
                corruptdir: this.content.corruptdir,
                duplicatedir: this.content.duplicatedir,
                errordir: this.content.errordir
            },
            isApplyRoot: false
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    rootdir: '',
                    receivedir: '',
                    targetdir: '',
                    completedir: '',
                    corruptdir: '',
                    duplicatedir: '',
                    errordir: ''
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
    input {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>