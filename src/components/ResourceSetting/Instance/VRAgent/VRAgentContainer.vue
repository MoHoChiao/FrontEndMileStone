<template>
<div>
  <vr-agent-add-window :windowAlive="addWindowAlive" 
                    window-title="Add Virtual Agent" 
                    @closeAdd="changeAddWindowStatus" 
  ></vr-agent-add-window>
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
                    :objectUid="selectedRecord.virtualagentuid" 
                    :objectName="selectedRecord.virtualagentname" 
                    @closeApply="changePermissionWindowStatus" 
  ></permission-window>
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Virtual Agent</i>
                        <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                        <i class="fa fa-plus w3-button w3-right" title="Add Virtual Agent" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getVRAgents"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showMode">
        <div :key="content.virtualagentuid+'table'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allVRAgentObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/VrAgent_128.png" alt="Virtual Agent" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.virtualagentname }}</p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ (content.mode == 0) ? 'Load Balance' : 'By Seq' }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
                <p>
                  <div v-if="content.agentlist.length > 0">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all w3-small">
                            <tr class="w3-teal">
                                <th class="w3-center" width="7%">Seq</th>
                                <th class="w3-center" width="33%">Name</th>
                                <th class="w3-center" width="10%">Activate</th>
                                <th class="w3-center" width="50%">Description</th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px;word-break:break-all">
                        <table class="w3-table-all w3-small">
                            <tr :key="list_info.virtualagentuid+':'+list_info.agentuid" class="w3-hover-blue-grey w3-hover-opacity" draggable="true" v-for="(list_info, list_index) in content.agentlist">
                                <td width="7%">{{ list_index + 1 }}</td>
                                <td class="w3-center" width="33%">
                                    <span>{{ list_info.agentname }}</span>
                                </td>
                                <td class="w3-center" width="10%">
                                    <i v-if="list_info.activate === '1'" class="fa fa-check-square-o" title="Activate" aria-hidden="true"></i>
                                    <i v-else class="fa fa-square-o" title="Deactivate" aria-hidden="true"></i>
                                </td>
                                <td width="50%">
                                    <span>{{ list_info.description }}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                  </div>
                </p>
                <hr class="w3-border-black w3-clear">
                <p class="w3-small">{{ content.description }}</p>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i> Edit</button>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changePermissionWindowStatus(content)">
                            <i class="fa fa-universal-access"></i> Permission</button>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.virtualagentuid, content.virtualagentname)">
                    <i class="fa fa-trash-o"></i> Delete</button>
            </div>
            <vr-agent-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></vr-agent-edit-panel>
        </div>
    </div>
    <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
        <li :key="content.virtualagentuid+'list'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allVRAgentObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/VrAgent_128.png" alt="Virtual Agent" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.virtualagentname }}</p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ (content.mode == 0) ? 'Load Balance' : 'By Seq' }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
                <button title="Delete This Virtual Agent" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.virtualagentuid, content.virtualagentname)">
                    <i class="fa fa-trash-o"></i>
                    <span class="w3-hide-medium w3-hide-small"> Delete</span>
                </button>
                <button title="Apply Permission To Virtual Agent" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changePermissionWindowStatus(content)">
                    <i class="fa fa-universal-access"></i>
                    <span class="w3-hide-medium w3-hide-small"> Permission</span>
                </button>
                <button title="Edit This Virtual Agent" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i>
                    <span class="w3-hide-medium w3-hide-small"> Edit</span>
                </button>
            </div>
            <vr-agent-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></vr-agent-edit-panel>
        </li>
    </ul>

  </div>
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getVRAgents"></filter-panel>
</div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../axios/http-common'
import FilterPanel from '../../FilterPanel.vue'
import VRAgentEditPanel from './VRAgentEditPanel.vue'
import VRAgentAddWindow from './VRAgentAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add virtual agent modal windows
            applyPermissionWindowAlive: false, //for modify Permission modal windows
            deleteWindowAlive: false,  //for delete virtual agent modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allVRAgentObjs: new Object(), //store all virtual agents
            editable: [],   //for all virtual agents content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "virtualagentname"},
                {name: "Activate",value: "activate"},
                {name: "Mode",value: "mode"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "virtualagentname"},
                {name: "Activate",value: "activate"},
                {name: "Mode",value: "mode"},
                {name: "Desc",value: "Description"}
            ],
            selectedRecord: new Object()   //store which Virtual Agent has been clicked.
        }
    },
    mounted() {
        this.getVRAgents()
    },
    methods: {
        getVRAgents(e){
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

            HTTPRepo.post(`vragent/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allVRAgentObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allVRAgentObjs = response.data
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
                this.allVRAgentObjs[index] = content
            }
        },
        deleteAgent(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTPRepo.get(`vragent/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allVRAgentObjs.splice(this.deleteIndex, 1)
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
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            if(content !== undefined){
                this.allVRAgentObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, vr_agentuid, vr_agentname){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = vr_agentuid
            this.deleteName = vr_agentname
        },
        changePermissionWindowStatus(record){
            if(record){
                this.selectedRecord = record
                this.selectedRecord.virtualagentuid = this.selectedRecord.virtualagentuid.trim()
            }
            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'vr-agent-edit-panel': VRAgentEditPanel,
        'vr-agent-add-window': VRAgentAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'permission-window': PermissionWindow
    }
}
</script>

