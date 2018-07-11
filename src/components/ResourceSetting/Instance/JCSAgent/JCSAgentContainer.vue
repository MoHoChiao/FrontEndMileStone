<template>
<div>
  <agent-add-window :windowAlive="addWindowAlive" 
                    window-title="Add JCS Agent" 
                    @closeAdd="saveAddWindowContent" 
                    :content="copyContent" 
  ></agent-add-window>
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeDelete="changeDeleteWindowStatus" 
                    @confirmDelete="deleteAgent" 
  ></confirm-delete-window>
  <permission-window :windowAlive="applyPermissionWindowAlive" 
                    window-title="Apply Permission To "
                    :objectUid="selectedRecord.agentuid" 
                    :objectName="selectedRecord.agentname" 
                    @closeApply="changePermissionWindowStatus" 
  ></permission-window>
  <div class="w3-col m9 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> JCSAgent</i>
                        <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i class="fa fa-plus w3-button w3-right" title="Add Agent" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getAgents"></i></button>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showMode" class="w3-small">
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div>
                    <span><img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                    <span>
                        <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                JCS Agents
                            </div>
                        </div>
                    </span>
                    <span class="w3-dropdown-hover w3-right w3-hide-large">
                        <i class="fa fa-bars w3-button" title="Copy/Move/Edit/Delete" aria-hidden="true"></i>
                        <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block">
                            <div>
                                <i class="w3-bar-item fa fa-clone w3-button" title="Copy Connection" aria-hidden="true" @click="changeConnectionWindowStatus('copy')"> Copy Connection</i>
                                <i class="w3-bar-item fa fa-clipboard w3-button" title="Move Connection" aria-hidden="true" @click="changeConnectionWindowStatus('move')"> Move Connection</i>
                                <i class="w3-bar-item fa fa-pencil w3-button" title="Edit Connection" aria-hidden="true" @click="changeConnectionWindowStatus('edit')"> Edit Connection</i>
                                <i class="w3-bar-item fa fa-trash-o w3-button" title="Delete Connection" aria-hidden="true" @click="showdeleteConnectionWindow"> Delete Connection</i>
                            </div>
                        </div>
                    </span>
                    <i class="fa fa-trash-o w3-button w3-right w3-hide-medium w3-hide-small" title="Delete Connection" aria-hidden="true" @click="showdeleteConnectionWindow"></i>
                    <i class="fa fa-universal-access w3-button w3-right" title="Apply Permission To Connection" aria-hidden="true" @click="changePermissionWindowStatus()"></i>
                    <i class="fa fa-pencil w3-button w3-right w3-hide-medium w3-hide-small" title="Edit Connection" aria-hidden="true" @click="changeConnectionWindowStatus('edit')"></i>
                    <i class="fa fa-clipboard w3-button w3-right w3-hide-medium w3-hide-small" title="Move Connection" aria-hidden="true" @click="changeConnectionWindowStatus('move')"></i>
                    <i class="fa fa-clone w3-button w3-right w3-hide-medium w3-hide-small" title="Copy Connection" aria-hidden="true" @click="changeConnectionWindowStatus('copy')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add Connection" aria-hidden="true" @click="changeConnectionWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload Connection" aria-hidden="true" @click="getConnections"></i>
                </div>
            </p>
            <p>
              <div>
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="25%">Name</th>
                            <th class="w3-center" width="15%">IP Address</th>
                            <th class="w3-center" width="38%">Description</th>
                            <th class="w3-center" width="22%">Update Time</th>
                        </tr>
                    </table>
                </div>
                <div id="agentContainer" class="w3-responsive w3-card w3-round" style="min-height:450px">
                    <table id="agentTable" class="w3-table-all w3-left">
                        <tr :id="content.agentuid" :key="content.agentuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnAgent(content.agentuid, index)" v-for="(content, index) in allJCSAgentObjs">
                            <td width="25%">
                                <span>{{ content.agentname }}</span>
                            </td>
                            <td width="15%">
                                <span>{{ content.host }}</span>
                            </td>
                            <td width="38%">
                                <span>{{ content.description }}</span>
                            </td>
                            <td width="22%">
                                <span>{{ content.lastupdatetime }}</span>
                            </td>
                        </tr>
                    </table>
                </div>
              </div>
            </p>
        </div>
    </div>
    <div v-else class="w3-small">
        <div :key="content.agentuid+'content'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allJCSAgentObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.agentname }}</p>
                <span class="w3-tag w3-theme-l2" style="transform:rotate(-5deg)">{{ 'Host:' + content.host }}</span>
                <span class="w3-tag w3-theme-l3" style="transform:rotate(-5deg)">{{ 'Port:' + content.port }}</span>
                <span class="w3-tag w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <span class="w3-tag w3-theme-l4 w3-hide-medium w3-hide-small" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
                <hr class="w3-border-black w3-clear">
                <p >{{ content.description }}</p>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeAddWindowStatus(content)">
                    <i class="fa fa-clone"></i> Copy</button>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i> Edit</button>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changePermissionWindowStatus(content)">
                            <i class="fa fa-universal-access"></i> Permission</button>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.agentuid, content.agentname)">
                    <i class="fa fa-trash-o"></i> Delete</button>
            </div>
            <agent-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></agent-edit-panel>
        </div>
    </div>
    <!--ul class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
        <li :key="content.agentuid+'table'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allJCSAgentObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.agentname }}</p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ 'Host:' + content.host }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ 'Port:' + content.port }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <button type="button" title="Delete This Agent" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.agentuid, content.agentname)">
                    <i class="fa fa-trash-o"></i>
                    <span class="w3-hide-medium w3-hide-small"> Delete</span>
                </button>
                <button title="Apply Permission To JCSAgent" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changePermissionWindowStatus(content)">
                    <i class="fa fa-universal-access"></i>
                    <span class="w3-hide-medium w3-hide-small"> Permission</span>
                </button>
                <button type="button" title="Edit This Agent" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i>
                    <span class="w3-hide-medium w3-hide-small"> Edit</span>
                </button>
                <button type="button" title="Copy This Agent" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeAddWindowStatus(content)">
                    <i class="fa fa-clone"></i>
                    <span class="w3-hide-medium w3-hide-small"> Copy</span>
                </button>
            </div>
            <agent-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></agent-edit-panel>
        </li>
    </ul-->
  </div>
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getAgents"></filter-panel>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import JCSAgentEditPanel from './JCSAgentEditPanel.vue'
import JCSAgentAddWindow from './JCSAgentAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            selectedAgentRecord: new Object(),   //store which record has been selected.(JCSAgents)
            addWindowAlive: false,  //for add agent modal windows
            deleteWindowAlive: false,  //for delete agent modal windows
            applyPermissionWindowAlive: false, //for modify Permission modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allJCSAgentObjs: new Object(), //store all agents
            editable: [],   //for all agents content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "agentname"},
                {name: "Activate",value: "activate"},
                {name: "Host",value: "host"},
                {name: "Port",value: "port"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "Agentname"},
                {name: "Activate",value: "activate"},
                {name: "Host",value: "host"},
                {name: "Port",value: "port"},
                {name: "Desc",value: "Description"}
            ],
            copyContent: undefined,   //for copy click, pass copyContent to Add Window
            selectedRecord: new Object()   //store which JCSAgent has been clicked.
        }
    },
    mounted() {
        this.getAgents()
    },
    methods: {
        clickOnAgent(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedAgentRecord(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedAgentRecord = this.allJCSAgentObjs[index]
                this.selectedAgentRecord.index = index //New prop is stores which agent obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        getAgents(e){
            let params = {
                "paging":{
                    "number":this.$refs.filter.selectedNum,
                    "size":this.$refs.filter.selectedSize
                }
            }
            
            if(this.$refs.filter.isOrder){
                params.ordering = {
                    "orderType":this.$refs.filter.orderType,
                    "orderField":this.$refs.filter.orderField
                }
            }

            if(this.$refs.filter.isQuery){
                params.querying = {
                    "queryType":this.$refs.filter.queryType,
                    "queryField":this.$refs.filter.queryField,
                    "queryString":this.$refs.filter.queryString,
                    "ignoreCase":this.$refs.filter.ignoreCase
                }
            }

            HTTP_TRINITY.post(`jcsagent/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allJCSAgentObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allJCSAgentObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
            })
            .catch(error => {
                if(e){
                    if(e.target.title === 'Apply Order')
                        this.$refs.filter.isOrder = true
                    else if(e.target.title === 'Apply Query')
                        this.$refs.filter.isQuery = true
                    else if(e.target.title === 'Cancel Order')
                        this.$refs.filter.isOrder = false
                    else if(e.target.title === 'Cancel Query')
                        this.$refs.filter.isQuery = false
                }

                errorHandle(this.$store, error)
            })
        },
        changeEditable(index, content){
            /*
                this.$set is for above :
                http://www.jianshu.com/p/358c1974d9a5
                https://jsfiddle.net/qnq2munr/2/
            */
            if(this.editable[index] === undefined){
                this.$set(this.editable, index, true) 
            }else{
                this.$set(this.editable, index, !this.editable[index])
            }

            if(content !== undefined){
                this.allJCSAgentObjs[index] = content
            }
        },
        deleteAgent(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTP_TRINITY.get(`jcsagent/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allJCSAgentObjs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '', '')
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
            
        },
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeAddWindowStatus(old_content){
            this.addWindowAlive = !this.addWindowAlive  //change add window open/close
            if(old_content){    //old_content !== undefined, it means from Copy Click
                this.copyContent = new Object()
                this.copyContent.agentname = ''
                this.copyContent.description = ''
                this.copyContent.host = old_content.host
                this.copyContent.port = old_content.port
                this.copyContent.activate = old_content.activate
                this.copyContent.maximumjob = old_content.maximumjob
                this.copyContent.ostype = old_content.ostype
                this.copyContent.osname = old_content.osname
                this.copyContent.deadperiod = old_content.deadperiod
                this.copyContent.memweight = old_content.memweight
                this.copyContent.compresstransfer = old_content.compresstransfer
                this.copyContent.encoding = old_content.encoding
                this.copyContent.monitortime = old_content.monitortime
                this.copyContent.cpuweight = old_content.cpuweight
            }
        },
        saveAddWindowContent(new_content){
            this.copyContent = undefined //Reset Add Window Content is empty
            this.changeAddWindowStatus()    //Add Window open/close

            if(new_content){    //new_content !== undefined, it means from Add Window Save Click
                this.allJCSAgentObjs.unshift(new_content) //add object to the top of array
                this.editable.fill(false) //close all edit form
            }
        },
        changeDeleteWindowStatus(index, agentuid, agentname){
            this.deleteWindowAlive = !this.deleteWindowAlive
            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = agentuid
            this.deleteName = agentname
        },
        changePermissionWindowStatus(record){
            if(record){
                this.selectedRecord = record
                this.selectedRecord.agentuid = this.selectedRecord.agentuid.trim()
            }

            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
        },
        clearSelectedAgentRecord(tr){
            let table = document.getElementById('agentTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有agent row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedAgentRecord = new Object()
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'agent-edit-panel': JCSAgentEditPanel,
        'agent-add-window': JCSAgentAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'permission-window': PermissionWindow
    }
}
</script>

