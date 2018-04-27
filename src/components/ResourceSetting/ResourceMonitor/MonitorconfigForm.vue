<template>
    <div class="w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-half">
                <input id="SearchJCSInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                        placeholder="Search For JCS List..." @keyup="searchForList()">
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;height:346px">
                    <table id="JCSListTable" class="w3-table-all w3-small">
                        <tr id="JCSServer" key="JCSServer" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnJCS('JCSServer', 'JCSServer', 0)">
                            <td class="w3-center">
                                JCSServer
                            </td>
                        </tr>
                        <template v-for="(agent, index) in allJCSAgents">
                        <tr :id="agent.agentuid" :key="agent.agentuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnJCS(agent.agentuid, agent.agentname, index)">
                            <td class="w3-center">
                                {{ agent.agentname }}
                            </td>
                        </tr>
                        </template>
                    </table>
                </div>
            </div>
            <div class="w3-half">
                <div v-if="selectedMonitorConfig.uid === 'JCSServer'" class="w3-row">
                    <div class="w3-col m12 w3-left">
                        <input class="w3-check" v-model="selectedMonitorConfig.suspendJob" style="width:40px;" type="checkbox">
                        <label>Suspend Dispatch Job With Alert</label>
                    </div>
                </div>
                <div v-else class="w3-row">
                    <div class="w3-col m12 w3-left">
                        <input class="w3-check" v-model="selectedMonitorConfig.processmonitor" style="width:40px;" type="checkbox">
                        <label>Process Monitor</label>
                    </div>
                </div>
                <div class="w3-row">
                    <div class="w3-col m12 w3-left">
                        <input class="w3-check" v-model="selectedMonitorConfig.resourcemonitor" style="width:40px;" type="checkbox">
                        <label>Resource Monitor</label>
                    </div>
                </div>
                <div v-if="selectedMonitorConfig.resourcemonitor">
                    <div class="w3-row w3-section">
                        <div class="w3-col m6">
                            <div class="w3-row">
                                <div class="w3-col m3 w3-left">
                                    <span>CPU</span>
                                </div>
                                <div class="w3-col m6 w3-left">
                                    <input id="CPU" :class="inputClassList" v-model="selectedMonitorConfig.cpu" type="number" min="0" max="100">
                                </div>
                                <div class="w3-col m3 w3-left">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                        <div class="w3-col m6">
                            <div class="w3-row">
                                <div class="w3-col m5 w3-left">
                                    <span>Memory</span>
                                </div>
                                <div class="w3-col m6 w3-left">
                                    <input id="Memory" :class="inputClassList" v-model="selectedMonitorConfig.memory" type="number" min="0" max="100">
                                </div>
                                <div class="w3-col m1 w3-left">
                                    <span>%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w3-row">
                        <div class="w3-col m12">
                            <div class="w3-responsive w3-card w3-round">
                                <table class="w3-table-all">
                                    <tr class="w3-teal">
                                        <th class="w3-center" width="62%" style="padding-top:12px;padding-bottom:12px">File System</th>
                                        <th class="w3-center" width="30%" style="padding-top:12px;padding-bottom:12px">MB</th>
                                        <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                            <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Disk" aria-hidden="true" @click="addDisk"></i>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                            <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:190px">
                                <table class="w3-table-all">
                                    <tr :key="list_info.agentuid" v-for="(list_info, index) in selectedMonitorConfig.disk">
                                        <td class="w3-center" width="62%">
                                            <input class="w3-input w3-border" v-model="list_info.path" type="text" 
                                                placeholder="Please Input File System Path">
                                        </td>
                                        <td width="30%">
                                            <span>
                                                <input class="w3-input w3-border" style="width:100%" v-model="list_info.value" type="number" min="0" max="2147483647">
                                            </span>
                                        </td>
                                        <td class="w3-center" width="8%">
                                            <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delDisk(index)"></i>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w3-row">
                    <div class="w3-col m12 w3-center" style="padding-top:16px">
                        <button class="w3-button w3-round w3-teal" @click="reset">Reset</button>
                        <button class="w3-button w3-round w3-teal" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util'

export default {
    data() {
        return {
            inputClassList: ['w3-input','w3-border'],
            selectedMonitorConfig: new Object(),
            selectedMachineName: '',
            allJCSAgents: [],
            pattern: '^([a-zA-Z]:/)|^([a-zA-Z]:\\\\)|^(\\\\)|^(/)'
        }
    },
    mounted() {
        this.getAllAgents()
        this.clickOnJCS('JCSServer', 'JCSServer', 0)
    },
    methods: {
        clickOnJCS(id, name, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'JCSListTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedMachineName = name
                this.getMonitorconfig(id)
            }
            
        },
        getAllAgents(){
            let params = {
                "ordering":{
                    "orderType":'ASC',
                    "orderField":'agentname'
                }
            }

            HTTPRepo.post(`jcsagent/findByFilter`, params)
            .then(response => {
                this.allJCSAgents = response.data
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getMonitorconfig(uid){
            HTTPRepo.get(`monitor-config/findByUid?uid=`+uid)
            .then(response => {
                this.selectedMonitorConfig = response.data
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        save(){
            delete this.selectedMonitorConfig.lastupdatetime  //不需要傳送
            delete this.selectedMonitorConfig.xml  //不需要傳送
            if(!this.selectedMonitorConfig.resourcemonitor){
                this.selectedMonitorConfig.cpu = 0
                this.selectedMonitorConfig.memory = 0
                this.selectedMonitorConfig.disk = []
            }else{
                if(this.selectedMonitorConfig.cpu < 0)
                    this.selectedMonitorConfig.cpu = 0

                if(this.selectedMonitorConfig.cpu > 100)
                    this.selectedMonitorConfig.cpu = 100

                if(this.selectedMonitorConfig.memory < 0)
                    this.selectedMonitorConfig.memory = 0

                if(this.selectedMonitorConfig.memory > 100)
                    this.selectedMonitorConfig.memory = 100

                for(let i=0;i<this.selectedMonitorConfig.disk.length;i++){
                    if(!this.selectedMonitorConfig.disk[i].path.match(this.pattern)){
                        let newStatus = {
                            "msg": "File System Path Format Error!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }
                    
                    if(this.selectedMonitorConfig.disk[i].value < 0){
                        this.selectedMonitorConfig.disk[i].value = 0
                    }

                    if(this.selectedMonitorConfig.disk[i].value > 2147483647){
                        this.selectedMonitorConfig.disk[i].value = 2147483647
                    }
                }
            }

            HTTPRepo.post(`monitor-config/modify`, this.selectedMonitorConfig)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Resource Monitor - " + this.selectedMachineName + " Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.selectedMonitorConfig = response.data
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
        },
        reset(){
            if(this.selectedMonitorConfig.uid)
                this.getMonitorconfig(this.selectedMonitorConfig.uid)
        },
        addDisk(){
            let new_disk= {
                path: '',
                value: 200
            };
            this.selectedMonitorConfig.disk.push(new_disk)
        },
        delDisk(index){
            this.selectedMonitorConfig.disk.splice(index, 1)
        },
        clearSelectedRecord(tr, whichTable){
            let table = document.getElementById(whichTable)
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        searchForList() {
            let input, filter, table, i
            input = document.getElementById('SearchJCSInput')
            filter = input.value.toUpperCase()
            table = document.getElementById('JCSListTable')
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[0].innerHTML
                console.log(text+'/'+filter)
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
        },
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
    input.w3-check {
        height: 16px
    }
    #CPU {
        height: 16px
    }
    #Memory {
        height: 16px
    }
</style>
