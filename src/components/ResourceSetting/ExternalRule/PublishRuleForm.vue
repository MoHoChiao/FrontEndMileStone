<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <input id="SearchJCSInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                    placeholder="Search For JCS Agent List..." @keyup="searchForList()">
            <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:140px">
                <table id="AgentListTable" class="w3-table-all w3-small">
                    <template v-for="(agent, index) in allJCSAgents">
                    <tr :id="'tr'+index" :key="agent.agentuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnAgent(agent, index)">
                        <td class="w3-center">
                            {{ agent.agentname }}
                        </td>
                    </tr>
                    </template>
                </table>
            </div>
        </div>  
        <div v-if="this.selectedAgent" class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="10%">Published</th>
                            <th class="w3-center" width="30%">File Name</th>
                            <th class="w3-center" width="30%">Rule Name</th>
                            <th class="w3-center" width="30%">Full Class</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:140px">
                    <table class="w3-table-all">
                        <tr :key="rule.rulename" v-for="(rule, index) in rules">
                            <td class="w3-center" width="10%" style="padding-top:4px">
                                <input class="w3-check" type="checkbox" v-model="rule.published" @click="onClickCheck(rule, index)">
                            </td>
                            <td class="w3-center" width="30%">{{rule.filename.split('/')[1]}}</td>
                            <td class="w3-center" width="30%">{{rule.rulename}}</td>
                            <td class="w3-center" width="30%">{{rule.fullclasspath}}</td>
                        </tr>
                    </table>
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
            checkAllFlag: false,
            inputClassList: ['w3-input','w3-border'],
            selectedMonitorConfig: new Object(),
            selectedAgent: undefined,
            allJCSAgents: [],
            rules: new Object(),
            pattern: '^([a-zA-Z]:/)|^([a-zA-Z]:\\\\)|^(\\\\)|^(/)'
        }
    },
    mounted() {
        this.getAllAgents()
    },
    props: {
        packageUid: {
            type: String,
            default: ""
        }
    },
    methods: {
        clickOnAgent(agent, index){
            let tr = document.getElementById('tr'+index)
            this.clearSelectedRecord(tr, 'AgentListTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedAgent = agent
                this.getRules()
            }
            
        },
        onClickCheck(driver, index){
            if(driver.checked){
                let new_driver = {
                    "driverName": driver.name
                }
                this.selectedRecords[index] = new_driver
            }else{
                delete this.selectedRecords[index]
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
        getRules(uid){
            HTTPRepo.get(`dm-ext-package/findPublicationByAgentUidAndPackageUid`, {
                params: {
                    agentUid: this.selectedAgent.agentuid,
                    packageUid: this.packageUid
                }
            })
            .then(response => {
                this.rules = response.data
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
            this.clearAllSelectedRecord('AgentListTable')
            this.selectedAgent = undefined
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
        clearAllSelectedRecord(whichTable){
            let table = document.getElementById(whichTable)
            for(var i=0;i<table.childNodes.length;i++){
                table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        searchForList() {
            let input, filter, table, i
            input = document.getElementById('SearchJCSInput')
            filter = input.value.toUpperCase()
            table = document.getElementById('AgentListTable')
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
