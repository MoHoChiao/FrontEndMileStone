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
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <h6 class="w3-opacity">The current path is as follows :</h6>
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> Virtual Agent</i>
                        <i class="fa fa-toggle-on w3-button w3-right" title="Content/Table List Switch" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i class="fa fa-plus w3-button w3-right" title="Add Virtual Agent" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getVRAgents"></i></button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showMode">
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in objs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/VrAgent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.virtualagentname }}</p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ (content.mode == 0) ? 'Load Balance' : 'By Seq' }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
                <hr class="w3-border-black w3-clear">
                <p class="w3-small">{{ content.description }}</p>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i> Edit</button>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.virtualagentuid, content.virtualagentname)">
                    <i class="fa fa-trash-o"></i> Delete</button>
            </div>
            <vr-agent-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></vr-agent-edit-panel>
        </div>
    </div>
    <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
        <li class="w3-bar w3-border-camo-black" v-for="(content, index) in objs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/VrAgent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right w3-hide-medium" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.virtualagentname }}</p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ (content.mode == 0) ? 'Load Balance' : 'By Seq' }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.virtualagentuid, content.virtualagentname)">
                    <i class="fa fa-trash-o"></i>
                    <span class="w3-hide-medium"> Delete</span>
                </button>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i>
                    <span class="w3-hide-medium"> Edit</span>
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
import { HTTPRepo } from '../../../../axios/http-common'
import FilterPanel from '../../FilterPanel.vue'
import VRAgentEditPanel from './VRAgentEditPanel.vue'
import VRAgentAddWindow from './VRAgentAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add virtual agent modal windows
            deleteWindowAlive: false,  //for delete virtual agent modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            objs: new Object(), //for all virtual agents list panel
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
            ]
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
                    this.objs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.objs = response.data
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

                if (error.response) {
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
                this.objs[index] = content
            }
        },
        deleteAgent(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            alert(this.deleteUid)
            HTTPRepo.get(`vragent/delete`, {
                params: {
                    virtualagentuid: this.deleteUid
                }
            })
            .then(response => {
                this.objs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '', '')
            })
            .catch(error => {
                if (error.response) {
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
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            this.editable
            if(content !== undefined){
                this.objs.unshift(content) //add object to the top of array
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
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'vr-agent-edit-panel': VRAgentEditPanel,
        'vr-agent-add-window': VRAgentAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>

