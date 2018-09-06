<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <input id="SearchAgentInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                    placeholder="Search For JCS Agent List..." @keyup="searchForAgentList()">
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
        <div v-show="this.selectedAgent" class="w3-row w3-section">
            <div>
                <input id="SearchPackageNameInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                    placeholder="Search For Package Name..." @keyup="searchForPackageName()">
            </div>
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="10%">Publish</th>
                            <th class="" width="25%">Package Name</th>
                            <th class="" width="25%">Rule Name</th>
                            <th class="" width="40%">Full Class</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:140px">
                    <table id="RuleListTable" class="w3-table-all">
                        <tr :key="publication.rulename" v-for="(publication, index) in getPublication()">
                            <td class="w3-center" width="10%" style="padding-top:4px">
                                <input class="w3-check" type="checkbox" v-model="publication.published">
                            </td>
                            <td class="" width="25%">{{publication.packagename}}</td>
                            <td class="" width="25%">{{publication.rulename}}</td>
                            <td class="" width="40%">{{publication.fullclasspath}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../util_js/axios_util'

export default {
    data() {
        return {
            checkAllFlag: false,
            inputClassList: ['w3-input','w3-border'],
            publications: [],
            selectedAgent: undefined,
            allJCSAgents: [],
            rules: [],
            pattern: '^([a-zA-Z]:/)|^([a-zA-Z]:\\\\)|^(\\\\)|^(/)'
        }
    },
    mounted() {
        this.getAllAgents()
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
        getAllAgents(){
            let params = {
                "paging": {
                    "number": 0,
                    "size": 500
                },
                "ordering": {
                    "orderType": 'ASC',
                    "orderField": 'agentname'
                },
                "param": ''
            }

            HTTP_TRINITY.post(`jcsagent/findByFilter`, params)
            .then(response => {
                this.allJCSAgents = response.data.content
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getRules(){
            if(this.getIndexByAgentUid() === -1){
                HTTP_TRINITY.get(`dm-ext-package/findPublicationsByAgentUid`, {
                    params: {
                        agentUid: this.selectedAgent.agentuid
                    }
                })
                .then(response => {
                    var new_publication = {
                        "agentuid": this.selectedAgent.agentuid,
                        "agentname": this.selectedAgent.agentname,
                        "publishRule": response.data
                    }

                    this.publications.push(new_publication)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        getPublication(){
            var publicationIndex = this.getIndexByAgentUid()
            if(publicationIndex !== -1)
                return this.publications[publicationIndex].publishRule
            else
                return []
        },
        getIndexByAgentUid(){
            var objIndex = this.publications.findIndex((obj) => {
                return obj.agentuid === this.selectedAgent.agentuid;
            });
            return objIndex
        },
        save(){            
            return this.publications
        },
        reset(){
            this.clearAllSelectedRecord('AgentListTable')
            this.publications = []
            this.selectedAgent = undefined
            document.getElementById('SearchPackageNameInput').value = ''
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
        searchForAgentList() {
            let input, filter, table, i
            input = document.getElementById('SearchAgentInput')
            filter = input.value.toUpperCase()
            table = document.getElementById('AgentListTable')
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[0].innerHTML
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
        },
        searchForPackageName() {
            let input, filter, table, i
            input = document.getElementById('SearchPackageNameInput')
            filter = input.value.toUpperCase()
            table = document.getElementById('RuleListTable')
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[1].innerHTML
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
        }
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
