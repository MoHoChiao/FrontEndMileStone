<template>
<div>
  <!-- For Add/Edit/Copy Agent Window -->
  <agent-edit-window v-if="agentWindowAlive" :windowAlive="agentWindowAlive" 
                    @closeAdd="saveAgentWindowContentForAdd" 
                    @closeEdit="saveAgentWindowContentForEdit" 
                    @closeCopy="saveAgentWindowContentForAdd" 
                    :content="agentRecord" 
                    :urlOp="operation" 
  ></agent-edit-window>
  <!-- For Delete Confirm Window -->
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeDelete="closeDeleteWindow" 
                    @confirmDelete="deleteAgent" 
  ></confirm-delete-window>
  <!-- For Apply Permission Window -->
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
                                <i class="fa fa-search w3-button w3-theme-d2" title="Search For Name And Host" aria-hidden="true" @click="applyQuery"></i>
                            </span>
                            <span class="w3-col m6 w3-right w3-hide-small w3-hide-medium">
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete Agent" aria-hidden="true" @click="showDeleteWindow"></i>
                                <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit Agent" aria-hidden="true" @click="changeAgentWindowStatus('edit')"></i>
                                <i class="fa fa-plus w3-button w3-right" title="Add Agent" aria-hidden="true" @click="changeAgentWindowStatus('add')"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                        <div v-if="showMode">
                                            <i class="w3-bar-item fa fa-clone w3-button" aria-hidden="true" @click="changeAgentWindowStatus('copy')"> Copy Agent</i>
                                            <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus()"> Permission</i>
                                        </div>
                                        <hr v-if="showMode" class="w3-border-black" style="padding:0px;margin:0px">
                                        <div class="w3-row-padding w3-small">
                                            <span class="w3-col m5" style="padding-top:13px">Page Num</span>
                                            <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Number" 
                                                v-model="selectedPage" @change="pageNumSelectedComboBox">
                                                <template v-for="n in totalPages">
                                                    <option :key="n" :value="n" selected>{{ n }}</option>
                                                </template>
                                            </select>
                                        </div>
                                        <div class="w3-row-padding w3-small" style="padding-bottom:10px">
                                            <span class="w3-col m5" style="padding-top:13px">Page Size</span>
                                            <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Size" 
                                                v-model="selectedSize" @change="changeSize">
                                                <option value="-1" disabled selected>Page Size</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                                <option value="500">500</option>
                                            </select>
                                        </div>
                                    </div>
                                </span>
                            </span>
                            <span class="w3-col m6 w3-right w3-hide-large">
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                        <div v-if="showMode">
                                            <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeAgentWindowStatus('add')"> Add Agent</i>
                                            <i class="w3-bar-item fa fa-pencil w3-button" aria-hidden="true" @click="changeAgentWindowStatus('edit')"> Edit Agent</i>
                                            <i class="w3-bar-item fa fa-trash-o w3-button" aria-hidden="true" @click="showDeleteWindow"> Delete Agent</i>
                                            <i class="w3-bar-item fa fa-clone w3-button" aria-hidden="true" @click="changeAgentWindowStatus('copy')"> Copy Agent</i>
                                            <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus()"> Permission</i>
                                        </div>
                                        <div v-else>
                                            <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeAgentWindowStatus('add')"> Add Agent</i>
                                        </div>
                                        <hr class="w3-border-black" style="padding:0px;margin:0px">
                                        <div class="w3-row-padding w3-small">
                                            <span class="w3-col m5" style="padding-top:13px">Page Num</span>
                                            <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Number" 
                                                v-model="selectedPage" @change="pageNumSelectedComboBox">
                                                <template v-for="n in totalPages">
                                                    <option :key="n" :value="n" selected>{{ n }}</option>
                                                </template>
                                            </select>
                                        </div>
                                        <div class="w3-row-padding w3-small" style="padding-bottom:10px">
                                            <span class="w3-col m5" style="padding-top:13px">Page Size</span>
                                            <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Size" 
                                                v-model="selectedSize" @change="changeSize">
                                                <option value="-1" disabled selected>Page Size</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                                <option value="500">500</option>
                                            </select>
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
                    <span><img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-margin-right w3-left w3-hide-small" style="height32px;width:32px"></span>
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
                <div id="agentContainer" class="w3-responsive w3-card w3-round">
                    <table id="agentTable" class="w3-table-all w3-left">
                        <empty-grid v-if="allJCSAgentObjs.length <= 0"></empty-grid>
                        <tr :id="content.agentuid" :key="content.agentuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnAgentRecord(content.agentuid, index)" v-for="(content, index) in allJCSAgentObjs">
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
                            <span class="w3-col m6 w3-hide-medium" style="padding-top:15px">
                                Page Size
                            </span>
                            <span class="w3-col m6" style="padding-top:10px">
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
                <hr class="w3-border-black w3-clear">
                <p >{{ content.description }}</p>
                <span class="w3-right">
                    <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit Agent" @click="clickOnAgentPanel('edit', index, content)">
                        <i class="fa fa-pencil"></i></button>
                    <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Copy Agent" @click="clickOnAgentPanel('copy', index, content)">
                        <i class="fa fa-clone"></i></button>
                    <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Apply Permission" @click="clickOnAgentPanel('permission', index, content)">
                        <i class="fa fa-universal-access"></i></button>
                    <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete Agent" @click="clickOnAgentPanel('delete', index, content)">
                        <i class="fa fa-trash-o"></i></button>
                </span>
            </div>
            <agent-edit-panel v-else :index="index" :content="content" @closeEdit="closeEditable"></agent-edit-panel>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import JCSAgentEditPanel from './JCSAgentEditPanel.vue'
import JCSAgentEditWindow from './JCSAgentEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'
import page from '../../page.vue'
import EmptyGrid from '../../../Common/EmptyGrid.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            selectedRecord: new Object(),   //store which record has been selected.(JCSAgents)
            agentWindowAlive: false,  //for add/edit/copy/move Connection modal windows
            operation: 'add',   //keep which operation(add,edit,copy) will be execute
            deleteWindowAlive: false,  //for delete agent modal windows
            applyPermissionWindowAlive: false, //for modify Permission modal windows
            deleteName: '',     //store which obj name will be delete
            allJCSAgentObjs: [], //store all agents
            agentRecord: new Object(), //store detail agent record
            editable: [],   //for all agents content edit panel
            //about paging info
            totalPages: 1,
            selectedPage: 1, //this is for UI use
            selectedNum: 0, //this is for backend use
            selectedSize: 10,
            //about ordering info
            orderFields: { //Ordering fields, only for UI
                agentname: "ASC",
                host: "",
                description: "",
                lastupdatetime: ""
            },
            orderField: 'agentname',   //send to backend
            orderType: 'ASC',  //send to backend
            //about query param
            queryParam: ''
        }
    },
    mounted() {
        this.getAgents()
    },
    methods: {
        //When Grid List click on agent record
        clickOnAgentRecord(id, index){
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
        //When Content List click on agent operation button
        clickOnAgentPanel(which, index, content){
            if(content){
                this.selectedRecord = content
                this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                if(which == 'edit')
                    this.openEditable(index)
                else if(which == 'copy')
                    this.changeAgentWindowStatus('copy')
                else if(which == 'permission')
                    this.changePermissionWindowStatus()
                else if(which == 'delete')
                    this.showDeleteWindow()
            }
        },
        //Get All Agents info
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
                this.clearSelectedRecord()
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        //for Content List, edit panel
        openEditable(index){
            HTTP_TRINITY.get(`jcsagent/findByUid?uid=` + this.selectedRecord.agentuid)
            .then(response => {
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
                console.log(response.data)
                if(response.data !== undefined){
                    this.allJCSAgentObjs[index] = response.data
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            }) 
        },
        closeEditable(index, content){
            this.$set(this.editable, index, false) 

            if(content)
                this.allJCSAgentObjs[index] = content
        },
        //above for delete window
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
        //about for add/edit/copy window
        changeAgentWindowStatus(which){
            if(which != 'add'){
                if(this.selectedRecord && this.selectedRecord.agentuid && this.selectedRecord.agentuid !== ''){
                    //Get Agent detail record
                    HTTP_TRINITY.get(`jcsagent/findByUid?uid=` + this.selectedRecord.agentuid)
                    .then(response => {
                        this.agentRecord = response.data
                        this.operation = which
                        this.agentWindowAlive = !this.agentWindowAlive
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
                }
            }else{
                this.operation = which
                this.agentWindowAlive = !this.agentWindowAlive
            } 
        },
        saveAgentWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from Agent Window Save Click
                this.allJCSAgentObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedRecord()
            }
            this.agentWindowAlive = !this.agentWindowAlive
        },
        saveAgentWindowContentForEdit(new_content){
            //new_content !== undefined, it means from Agent Window Save Click
            if(new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)){
                new_content.index = this.selectedRecord.index   //asign old index prop to new content
                this.allJCSAgentObjs[this.selectedRecord.index] = new_content   //replace object to the array
                this.selectedRecord = new_content
            }
            this.agentWindowAlive = !this.agentWindowAlive
        },
        //above for permission window
        changePermissionWindowStatus(){
            if(this.selectedRecord && this.selectedRecord.agentuid && this.selectedRecord.agentuid !== ''){
                this.selectedRecord.agentuid = this.selectedRecord.agentuid.trim()
                this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
            }
        },
        //about for change show mode(Grid List & Content List)
        changeShowMode(){
            this.showMode = !this.showMode
            this.selectedRecord = new Object()
        },
        //clear selected for UI
        clearSelectedRecord(tr){
            let table = document.getElementById('agentTable')
            if(table && table.childNodes){  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                for(var i=0;i<table.childNodes.length;i++){  //先重設所有agent row的class
                    if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                }
            }
            
            this.selectedRecord = new Object()
        },
        //above for pagging, ordering, query
        changeNum(e, index){
            //紀錄現在點擊的是那一頁
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.selectedPage = index   //for UI page num
            this.getAgents()
        },
        changeSize(e){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getAgents()
        },
        pageNumSelected(index){
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.selectedPage = Number(index)   //for UI page num
            if(this.$refs.paginate) //對content list而言, 其this.$refs.paginate可能為undefined
                this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
        },
        pageNumSelectedComboBox (){  //for Page select box
            this.selectedNum = Number(this.selectedPage) - 1
            if(this.$refs.paginate) //對content list而言, 其this.$refs.paginate可能為undefined
                this.$refs.paginate.selected = Number(this.selectedPage) - 1
            this.getAgents()
        },
        applyOrder(field){
            //先清除所有排序方式, only for UI display
            for(var x in this.orderFields){
                if(x !== field)
                    this.orderFields[x] = ''
            }

            this.orderField = field
            if (this.orderFields[field] === 'ASC') {
                this.orderFields[field] = 'DESC' //only for UI display
                this.orderType = 'DESC'
            } else {
                this.orderFields[field] = 'ASC'    //only for UI display
                this.orderType = 'ASC'
            }

            this.getAgents()
        },
        applyQuery(){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getAgents()
        }
    },
    components: {
        'agent-edit-panel': JCSAgentEditPanel,
        'agent-edit-window': JCSAgentEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'permission-window': PermissionWindow,
        'page': page,
        'empty-grid': EmptyGrid
    }
}
</script>
<style scoped>
    select {
        height: 30px;
        width: 86px;
        padding:0px 0px 0px 0px;
    }
    input {
        height: 31px;
        width: 210px;
    }
</style>

