<template>
    <div>
        <!-- For Add/Edit User Group Window -->
        <user-group-edit-window v-if="groupWindowAlive" :windowAlive="groupWindowAlive" 
                            @closeAdd="saveGroupWindowContentForAdd" 
                            @closeEdit="saveGroupWindowContentForEdit" 
                            :content="groupRecord" 
                            :urlOp="operation" 
        ></user-group-edit-window>
        <!-- For Delete Confirm Window -->
        <confirm-delete-window :windowAlive="deleteWindowAlive" 
                            :deleteName="deleteName" 
                            window-title="Confirm window" 
                            window-bg-color="highway-schoolbus" 
                            btn-color="signal-white" 
                            @closeDelete="closeDeleteWindow" 
                            @confirmDelete="deleteGroup" 
        ></confirm-delete-window>
        <!-- For Apply group member Window -->
        <user-group-member-window v-if="applyWindowAlive" :windowAlive="applyWindowAlive" 
                            :content="selectedRecord" 
                            @closeApply="closeMemberWindow" 
        ></user-group-member-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                                <div class="w3-row">
                                    <span class="w3-col m6 w3-left">
                                        <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                            placeholder="Search For Name" style="text-transform:uppercase">
                                        <i class="fa fa-search w3-button w3-theme-d2" title="Search For Name" aria-hidden="true" @click="applyQuery"></i>
                                    </span>
                                    <span class="w3-col m6 w3-right w3-hide-small w3-hide-medium">
                                        <!--i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i-->
                                        <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete User Group" aria-hidden="true" @click="showDeleteWindow"></i>
                                        <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit User Group" aria-hidden="true" @click="changeGroupWindowStatus('edit')"></i>
                                        <i class="fa fa-plus w3-button w3-right" title="Add User Group" aria-hidden="true" @click="changeGroupWindowStatus('add')"></i>
                                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                        <span class="w3-dropdown-hover w3-right">
                                            <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                            <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                                <div v-if="showMode">
                                                    <i class="w3-bar-item fa fa-user w3-button" aria-hidden="true" @click="openMemberWindow()"> Apply Member</i>
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
                                                    <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeGroupWindowStatus('add')"> Add User Group</i>
                                                    <i class="w3-bar-item fa fa-pencil w3-button" aria-hidden="true" @click="changeGroupWindowStatus('edit')"> Edit User Group</i>
                                                    <i class="w3-bar-item fa fa-trash-o w3-button" aria-hidden="true" @click="showDeleteWindow"> Delete User Group</i>
                                                    <i class="w3-bar-item fa fa-user w3-button" aria-hidden="true" @click="openMemberWindow()"> Apply Member</i>
                                                </div>
                                                <div v-else>
                                                    <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeGroupWindowStatus('add')"> Add User Group</i>
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
                            <span><img src="/src/assets/images/resource_setter/Group.png" alt="User Group" class="w3-margin-right w3-left w3-hide-small" style="height32px;width:32px"></span>
                            <span>
                                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        User Group
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
                                    <th class="w3-center w3-btn w3-hover-none" width="30%" title="Order by Group Name" @click="applyOrder('groupname')">
                                        Name
                                        &nbsp;&nbsp;
                                        <span v-if="this.orderFields['groupname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.orderFields['groupname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                    <th class="w3-center w3-btn w3-hover-none" width="48%" title="Order by Description" @click="applyOrder('description')">
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
                        <div id="groupContainer" class="w3-responsive w3-card w3-round">
                            <table id="groupTable" class="w3-table-all w3-left">
                                <empty-grid v-if="allGroupObjs.length <= 0"></empty-grid>
                                <tr v-else :id="content.groupuid" :key="content.groupuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                        @click="clickOnGroupRecord(content.groupuid, index)" v-for="(content, index) in allGroupObjs">
                                    <td width="30%">
                                        <span>{{ content.groupname }}</span>
                                    </td>
                                    <td width="48%">
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
                <div :key="content.groupuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allGroupObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/Group.png" alt="User Group" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            {{ content.groupname }}
                        </p>
                        <br><br>
                        <user-group-member-panel :key="content.groupuid+'MemberPanel'" :groupuid="content.groupuid"></user-group-member-panel>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <span class="w3-right">
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit User Group" @click="clickOnGroupPanel('edit', index, content)">
                                <i class="fa fa-pencil"></i></button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete User Group" @click="clickOnGroupPanel('delete', index, content)">
                                <i class="fa fa-trash-o"></i></button>
                        </span>
                    </div>
                    <user-group-edit-panel v-else :key="content.groupuid+'EditPanel1'" 
                        :index="index" :content="content" @closeEdit="closeEditable"></user-group-edit-panel>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTP_TRINITY,HTTP_AUTH,errorHandle } from '../../../../util_js/axios_util'
import UserGroupEditPanel from './UserGroupEditPanel.vue'
import UserGroupMemberPanel from './UserGroupMemberPanel.vue'
import UserGroupEditWindow from './UserGroupEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import UserGroupMemberWindow from './UserGroupMemberWindow.vue'
import page from '../../page.vue'
import EmptyGrid from '../../../Common/EmptyGrid.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            selectedRecord: new Object(),   //store which record has been selected.(User Group)
            groupWindowAlive: false,  //for add/edit User Group modal windows
            operation: 'add',   //keep which operation(add,edit) will be execute
            applyWindowAlive: false, //for modify User Group Member modal windows
            deleteWindowAlive: false,  //for delete User Group modal windows
            deleteName: '',     //store which obj name will be delete
            allGroupObjs: [], //store all User Group
            groupRecord: new Object(), //store detail usergroup record
            editable: [],   //for all User Group content edit panel
            //about paging info
            totalPages: 1,
            selectedPage: 1, //this is for UI use
            selectedNum: 0,
            selectedSize: 10,
            //about ordering info
            orderFields: { //Ordering fields, only for UI
                groupname: "ASC",
                description: "",
                lastupdatetime: ""
            },
            orderField: 'groupname',   //send to backend
            orderType: 'ASC',  //send to backend
            //about query param
            queryParam: ''
        }
    },
    mounted() {
        this.getGroup()
    },
    methods: {
        //When Grid List click on user group record
        clickOnGroupRecord(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr)
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedRecord = this.allGroupObjs[index]
                this.selectedRecord.index = index //New prop is stores which user group obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        //When Content List click on user group operation button
        clickOnGroupPanel(which, index, content){
            if(content){
                this.selectedRecord = content
                this.selectedRecord.index = index //New prop is stores which user group obj will be deleted in UI

                if(which == 'edit')
                    this.openEditable(index)
                else if(which == 'delete')
                    this.showDeleteWindow()
            }
        },
        //Get All user groups info
        getGroup(e){
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

            HTTP_TRINITY.post(`user-group/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allGroupObjs = response.data.content
                    if(response.data.totalPages <= 0)
                        this.totalPages = 1
                    this.totalPages = response.data.totalPages
                } else {
                    this.allGroupObjs = response.data
                    this.totalPages = 1
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        //for Content List, edit panel
        openEditable(index){
            HTTP_TRINITY.get(`user-group/findByUid?uid=` + this.selectedRecord.groupuid)
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
                
                if(response.data !== undefined){
                    this.allGroupObjs[index] = response.data
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        closeEditable(index, content){
            this.$set(this.editable, index, false) 

            if(content){
                this.allGroupObjs[index] = content
            }
                
        },
        //above for delete window
        showDeleteWindow(){
            if( (this.selectedRecord.index || this.selectedRecord.index === 0) 
                    && this.selectedRecord.groupname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedRecord.groupname
            }
        },
        deleteGroup(){
            HTTP_TRINITY.get(`user-group/delete`, {
                params: {
                    uid: this.selectedRecord.groupuid
                }
            })
            .then(response => {
                this.allGroupObjs.splice(this.selectedRecord.index, 1)
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
        //about for add/edit window
        changeGroupWindowStatus(which){
            if(which != 'add'){
                if(this.selectedRecord && this.selectedRecord.groupuid && this.selectedRecord.groupuid !== ''){
                    //Get User Group detail record
                    HTTP_TRINITY.get(`user-group/findByUid?uid=` + this.selectedRecord.groupuid)
                    .then(response => {
                        this.groupRecord = response.data
                        this.operation = which
                        this.groupWindowAlive = !this.groupWindowAlive
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
                }
            }else{
                this.operation = which
                this.groupWindowAlive = !this.groupWindowAlive
            } 
        },
        saveGroupWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from UserGroup Window Save Click
                this.allGroupObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedRecord()
            }
            this.groupWindowAlive = !this.groupWindowAlive
        },
        saveGroupWindowContentForEdit(new_content){
            //new_content !== undefined, it means from Group Window Save Click
            if(new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)){
                new_content.index = this.selectedRecord.index   //asign old index prop to new content
                this.allGroupObjs[this.selectedRecord.index] = new_content   //replace object to the array
                this.selectedRecord = new_content
            }
            this.groupWindowAlive = !this.groupWindowAlive
        },
        //above for open/close apply member window
        openMemberWindow(){
            if(this.selectedRecord && this.selectedRecord.groupuid){
                HTTP_AUTH.get(`authorization/isRootOrAdmin`)
                .then(response => {
                    if(response.data){
                        this.applyWindowAlive = true
                    }else{
                        let newStatus = {
                            "msg": "You do not have 'Root Or Admin' Permission!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        closeMemberWindow(){
            if(this.selectedRecord && this.selectedRecord.groupuid){
                this.applyWindowAlive = false
            }
        },
        //about for change show mode(Grid List & Content List)
        changeShowMode(){
            this.showMode = !this.showMode
            this.selectedRecord = new Object()
        },
        clearSelectedRecord(tr){
            let table = document.getElementById('groupTable')
            if(table && table.childNodes){  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                for(var i=0;i<table.childNodes.length;i++){  //先重設所有group row的class
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
            this.getGroup()
        },
        changeSize(e){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getGroup()
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
            this.getGroup()
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

            this.getGroup()
        },
        applyQuery(){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getGroup()
        }
    },
    components: {
        'user-group-edit-panel': UserGroupEditPanel,
        'user-group-member-panel': UserGroupMemberPanel,
        'user-group-edit-window': UserGroupEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'user-group-member-window': UserGroupMemberWindow,
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
