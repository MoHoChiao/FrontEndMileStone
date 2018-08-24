<template>
    <div>
        <user-group-add-window :windowAlive="addWindowAlive" 
                            window-title="Add User Group" 
                            @closeAdd="changeAddWindowStatus" 
        ></user-group-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive" 
                            :deleteName="deleteName" 
                            window-title="Confirm window" 
                            window-bg-color="highway-schoolbus" 
                            btn-color="signal-white" 
                            @closeDelete="changeDeleteWindowStatus" 
                            @confirmDelete="deleteGroup" 
        ></confirm-delete-window>
        <user-group-member-window :windowAlive="applyWindowAlive" 
                            window-title="Apply Members To User Group"
                            :groupuid="selectedUserGroupRecord.groupuid" 
                            @closeApply="changeMemberWindowStatus" 
        ></user-group-member-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> User Group</i>
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i class="fa fa-plus w3-button w3-right" title="Add User Group" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getGroup"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode">
                <div :key="content.groupuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allGroupObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/Group.png" alt="User Group" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            {{ content.groupname }}
                        </p>
                        <br>
                        <user-group-member-panel :key="content.groupuid+'MemberPanel'" :groupuid="content.groupuid"></user-group-member-panel>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i> Edit</button>
                        <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.groupuid, content.groupname)">
                            <i class="fa fa-trash-o"></i> Delete</button>
                    </div>
                    <user-group-edit-panel v-else :key="content.groupuid+'EditPanel1'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></user-group-edit-panel>
                </div>
            </div>
            <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
                <li :key="content.groupuid+'li'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allGroupObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/Group.png" alt="User Group" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            {{ content.groupname }}
                        </p>
                        <button title="Delete This User Group" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.groupuid, content.groupname)">
                            <i class="fa fa-trash-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Delete</span>
                        </button>
                        <button title="Apply Members To User Group" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeMemberWindowStatus(content)">
                            <i class="fa fa-hand-lizard-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Members</span>
                        </button>
                        <button title="Edit This User Group" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i>
                            <span class="w3-hide-medium w3-hide-small"> Edit</span>
                        </button>
                    </div>
                    <user-group-edit-panel v-else :key="content.groupuid+'EditPanel2'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></user-group-edit-panel>
                </li>
            </ul>
        </div>
        <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getGroup"></filter-panel>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import UserGroupEditPanel from './UserGroupEditPanel.vue'
import UserGroupMemberPanel from './UserGroupMemberPanel.vue'
import UserGroupAddWindow from './UserGroupAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import UserGroupMemberWindow from './UserGroupMemberWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            selectedRecord: new Object(),   //store which record has been selected.(User Group)
            groupWindowAlive: false,  //for add/edit User Group modal windows
            operation: 'add',   //keep which operation(add,edit,copy) will be execute
            applyWindowAlive: false, //for modify User Group Member modal windows
            deleteWindowAlive: false,  //for delete User Group modal windows
            deleteName: '',     //store which obj name will be delete
            allGroupObjs: [], //store all User Group
            editable: [],   //for all User Group content edit panel
            //about paging info
            totalPages: 1,
            selectedPage: 1, //this is for UI use
            selectedNum: 0,
            selectedSize: 10,
            //about ordering info
            orderFields: { //Ordering fields, only for UI
                virtualagentname: "ASC",
                description: "",
                lastupdatetime: ""
            },
            orderField: 'virtualagentname',   //send to backend
            orderType: 'ASC',  //send to backend
            //about query param
            queryParam: ''
        }
    },
    mounted() {
        this.getGroup()
    },
    methods: {
        getGroup(e){
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

            HTTP_TRINITY.post(`user-group/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allGroupObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allGroupObjs = response.data
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
                this.allGroupObjs[index] = content
            }
        },
        changeMemberWindowStatus(record){
            if(record)
                this.selectedUserGroupRecord = record
            this.applyWindowAlive = !this.applyWindowAlive
        },
        deleteGroup(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTP_TRINITY.get(`user-group/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allGroupObjs.splice(this.deleteIndex, 1)
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
                this.allGroupObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, groupuid, groupname){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = groupuid
            this.deleteName = groupname
        },
        //above for pagging, ordering, query
        changeNum(e, index){
            //紀錄現在點擊的是那一頁
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.selectedPage = index   //for UI page num
            this.getVRAgents()
        },
        changeSize(e){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getVRAgents()
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
            this.getVRAgents()
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

            this.getVRAgents()
        },
        applyQuery(){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getVRAgents()
        }
        
    },
    components: {
        'filter-panel': FilterPanel,
        'user-group-edit-panel': UserGroupEditPanel,
        'user-group-member-panel': UserGroupMemberPanel,
        'user-group-add-window': UserGroupAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'user-group-member-window': UserGroupMemberWindow
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

