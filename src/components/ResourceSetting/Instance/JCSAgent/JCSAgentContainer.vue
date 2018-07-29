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
                    @closeDelete="closeDeleteWindow" 
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
                    <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                        <div class="w3-row">
                            <span class="w3-col m6 w3-left">
                                <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                    placeholder="Search For Name and Host" style="text-transform:uppercase">
                                <i class="fa fa-search w3-button w3-theme-d2" title="Reload" aria-hidden="true" @click="getAgents"></i>
                            </span>
                            <span class="w3-col m6 w3-right w3-hide-medium w3-hide-medium">
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i class="fa fa-trash-o w3-button w3-right" title="Delete Agent" aria-hidden="true" @click="showDeleteWindow"></i>
                                <i class="fa fa-pencil w3-button w3-right" title="Edit Agent" aria-hidden="true" @click="changeEditWindowStatus('edit')"></i>
                                <i class="fa fa-plus w3-button w3-right" title="Add Agent" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getAgents"></i>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-bars w3-button" title="Other Menu" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block">
                                        <div>
                                            <i class="w3-bar-item fa fa-clone w3-button" aria-hidden="true" @click="changeAddWindowStatus('copy')"> Copy Agent</i>
                                            <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus('move')"> Permission</i>
                                        </div>
                                    </div>
                                </span>
                            </span>
                            <span class="w3-col m6 w3-right w3-hide-large">
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getAgents"></i>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-bars w3-button" title="Function Menu" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block">
                                        <div>
                                            <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeAddWindowStatus()"> Add Agent</i>
                                            <i class="w3-bar-item fa fa-pencil w3-button" aria-hidden="true" @click="changeEditWindowStatus()"> Edit Agent</i>
                                            <i class="w3-bar-item fa fa-trash-o w3-button" aria-hidden="true" @click="showDeleteWindow"> Delete Agent</i>
                                            <i class="w3-bar-item fa fa-clone w3-button" aria-hidden="true" @click="changeAddWindowStatus('copy')"> Copy Agent</i>
                                            <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus('copy')"> Permission</i>
                                        </div>
                                    </div>
                                </span>
                            </span>
                        </div>
                    </div>
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
                </div>
            </p>
            <p>
              <div>
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center w3-btn w3-hover-none" width="25%" title="Order by Agent Name" @click="applyOrder('agentname')">
                                Name
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['agentname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['agentname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                            <th class="w3-center w3-btn w3-hover-none" width="15%" title="Order by IP" @click="applyOrder('host')">
                                IP Address
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['host'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['host'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                            <th class="w3-center w3-btn w3-hover-none" width="38%" title="Order by Description" @click="applyOrder('description')">
                                Description
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                            <th class="w3-center w3-btn w3-hover-none" width="22%" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                Update Time
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                        </tr>
                    </table>
                </div>
                <div id="agentContainer" class="w3-responsive w3-card w3-round" style="min-height:420px">
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
                                <span :title="content.description">{{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}</span>
                            </td>
                            <td width="22%">
                                <span>{{ content.lastupdatetime }}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="w3-row-padding">
                    <div class="w3-col m9 w3-center" style="padding-top:10px">
                        <page ref="paginate" :page-count="totalPages" :clickHandler="changeNum"></page>
                    </div>
                    <div class="w3-col m3">
                        <div class="w3-row w3-right">
                            <span class="w3-col m6 w3-hide-medium" style="padding-top:16px">
                                Page Size
                            </span>
                            <span class="w3-col m6" style="padding-top:8px">
                                <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize">
                                    <option value="-1" disabled selected>Size</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="500">500</option>
                                </select>
                            </span>
                        </div>
                    </div>
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
  </div>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import JCSAgentEditPanel from './JCSAgentEditPanel.vue'
import JCSAgentAddWindow from './JCSAgentAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'
import page from '../../page.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            selectedRecord: new Object(),   //store which record has been selected.(JCSAgents)
            addWindowAlive: false,  //for add agent modal windows
            deleteWindowAlive: false,  //for delete agent modal windows
            applyPermissionWindowAlive: false, //for modify Permission modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allJCSAgentObjs: new Object(), //store all agents
            editable: [],   //for all agents content edit panel
            
            queryFields: [  //for querying filter fields
                {name: "Name",value: "Agentname"},
                {name: "Activate",value: "activate"},
                {name: "Host",value: "host"},
                {name: "Port",value: "port"},
                {name: "Desc",value: "Description"}
            ],
            copyContent: undefined,   //for copy click, pass copyContent to Add Window
            selectedRecord: new Object(),   //store which JCSAgent has been clicked.
            //about paging info
            totalPages: 1,
            selectedNum: 0,
            selectedSize: 10,
            //about ordering info
            orderFields: { //Ordering fields, only for UI
                agentname: "",
                host: "",
                description: "",
                lastupdatetime: "DESC"
            },
            orderField: 'lastupdatetime',   //send to backend
            orderType: 'DESC',  //send to backend
            //about query param
            queryParam: ''
        }
    },
    mounted() {
        this.getAgents()
    },
    methods: {
        clickOnAgent(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedRecord = this.allJCSAgentObjs[index]
                this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        getAgents(e){
            let params = {
                "paging":{
                    "number":this.selectedNum,
                    "size":this.selectedSize
                },
                "ordering":{
                    "orderType":this.orderType,
                    "orderField":this.orderField
                },
                "param":this.queryParam
            }

            HTTP_TRINITY.post(`jcsagent/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allJCSAgentObjs = response.data.content
                    this.totalPages = response.data.totalPages
                } else {
                    this.allJCSAgentObjs = response.data
                    this.totalPages = 1
                }
            })
            .catch(error => {
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
        showDeleteWindow(){
            if( (this.selectedRecord.index || this.selectedRecord.index === 0) 
                    && this.selectedRecord.agentname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedRecord.agentname
            }
        },
        deleteAgent(){
            HTTP_TRINITY.get(`jcsagent/delete`, {
                params: {
                    uid: this.selectedRecord.agentuid
                }
            })
            .then(response => {
                this.allJCSAgentObjs.splice(this.selectedRecord.index, 1)
                this.clearSelectedRecord()
                this.closeDeleteWindow()
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        closeDeleteWindow(){
            this.deleteWindowAlive = false
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
        changePermissionWindowStatus(record){
            if(record){
                this.selectedRecord = record
                this.selectedRecord.agentuid = this.selectedRecord.agentuid.trim()
            }

            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
        },
        clearSelectedRecord(tr){
            let table = document.getElementById('agentTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有agent row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedRecord = new Object()
        },
        changeNum(e, index){
            //紀錄現在點擊的是那一頁
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.getAgents()
        },
        changeSize(e){
            //每一次的查詢, 都要讓page number先回到第一頁
            this.pageNumSelected('1')
            this.getAgents()
        },
        pageNumSelected(index){
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
        },
        applyOrder(field){
            //先清除所有排序方式, only for UI display
            for(var x in this.orderFields){
                if(x !== field)
                    this.orderFields[x] = ''
            }

            this.orderField = field
            if(this.orderFields[field] === 'DESC'){
                this.orderFields[field] = 'ASC' //only for UI display
                this.orderType = 'ASC'  
            }else{
                this.orderFields[field] = 'DESC'    //only for UI display
                this.orderType = 'DESC'
            }

            this.getAgents()
        },
    },
    components: {
        'agent-edit-panel': JCSAgentEditPanel,
        'agent-add-window': JCSAgentAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'permission-window': PermissionWindow,
        'page': page
    }
}
</script>
<style scoped>
    select {
        height: 35px;
        width: 86px;
    }
    input {
        height: 31px;
        width: 210px;
    }
</style>

