<template>
    <div class="w3-small">
        <div class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Monitor</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">Notification</div>
            </a>
        </div>
        <div v-show="tabsFlag[0]" class="w3-row-padding w3-section">
            <div class="w3-half">
                <input id="SearchJCSInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                        placeholder="Search For JCS List..." @keyup="searchForList()">
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;min-height:312px;max-height:312px">
                    <table id="JCSListTable" class="w3-table-all w3-small">
                        <tr id="JCSServer" key="JCSServer" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnJCS('JCSServer', 0)">
                            <td class="w3-center">
                                <span>JCSServer</span>
                            </td>
                        </tr>
                        <template v-for="(agent, index) in allJCSAgents">
                        <tr :id="agent.agentuid" :key="agent.agentuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnJCS(agent.agentuid, index)">
                            <td class="w3-center">
                                <span>{{ agent.agentname }}</span>
                            </td>
                        </tr>
                        </template>
                    </table>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-row w3-section">
                    <div class="w3-col m3 w3-right">
                        <input class="w3-check" v-model="new_content.activate" style="width:40px;" type="checkbox">
                        <label>Activate</label>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="tabsFlag[1]" class="w3-row-padding w3-section">
            Fuck You!!!
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'

export default {
    data() {
        return {
            inputClassList: ['w3-input','w3-border'],
            selectClassList: ['w3-select','w3-border','w3-round'],
            tabsClass: ['w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false],
            allJCSAgents: []
        }
    },
    mounted() {
        this.getAllAgents()
    },
    methods: {
        openTab(whichTab) {
            for (let i = 0; i < this.tabsFlag.length; i++) {
                this.$set(this.tabsFlag, i, false)
            }
            this.$set(this.tabsFlag, whichTab, true)

            for (let i = 0; i < this.tabsClass.length; i++) {
                this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
            }
            this.$set(this.tabsClass, whichTab, this.tabsClass[whichTab] + " w3-border-theme")
        },
        clickOnJCS(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'JCSListTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                // this.selectedJobOrFlowRecord = this.jobsOrFlows[index]
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
        save(){
            if(!this.content.dualservermode){
                this.content.standbyhost = ''
                this.content.standbyport = 0
            }

            if(this.content.authmode === '0'){
                this.content.ldapserver = ''
                this.content.defaultdomain = ''
            }

            this.content.dualservermode = Number(this.content.dualservermode)
            return this.content
        },
        reset(){
            this.getTrinityconfig()
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
    input,select {
        height: 30px
    }
    input.w3-check,input.w3-radio {
        height: 16px
    }
</style>
