<template>
<div>
  <user-add-window :windowAlive="addWindowAlive" 
                    window-title="Add Trinity User" 
                    @closeAdd="changeAddWindowStatus" 
  ></user-add-window>
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeDelete="changeDeleteWindowStatus" 
                    @confirmDelete="deleteUser" 
  ></confirm-delete-window>
  <confirm-lock-user-window :windowAlive="lockWindowAlive" 
                    :lockName="lockName" 
                    :lock="lockStatus" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeLock="changeLockWindowStatus" 
                    @confirmLock="lockUser" 
  ></confirm-lock-user-window>
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> User</i>
                        <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i class="fa fa-plus w3-button w3-right" title="Add User" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getUsers"></i></button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showMode">
        <div :key="content.useruid+'content'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allUserObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/User.png" alt="Trinity User" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>
                    <i v-if="content.lock && content.lock === '1'" class="fa fa-lock fa-fw w3-text-red"></i>
                    <i v-if="content.resetCred === '1'" class="fa fa-battery-quarter fa-fw w3-text-red"></i>
                    {{ content.username }}
                </p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ 'User ID:' + content.userid }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ 'User Type:' + content.usertype }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <hr class="w3-border-black w3-clear">
                <p class="w3-small">{{ content.description }}</p>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i> Edit</button>
                <button v-if="!content.lock || content.lock !== '1'" type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeLockWindowStatus(index, content.username, content.userid, true)">
                    <i class="fa fa-lock"></i> Lock</button>
                <button v-else type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeLockWindowStatus(index, content.username, content.userid, false)">
                    <i class="fa fa-unlock"></i> Unlock</button>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.useruid, content.username, content.userid)">
                    <i class="fa fa-trash-o"></i> Delete</button>
            </div>
            <user-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></user-edit-panel>
        </div>
    </div>
    <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
        <li :key="content.useruid+'table'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allUserObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/User.png" alt="Trinity User" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>
                    <i v-if="content.lock === '1'" class="fa fa-lock fa-fw w3-text-red"></i>
                    <i v-if="content.resetCred === '1'" class="fa fa-battery-quarter fa-fw w3-text-red"></i>
                    {{ content.username }}
                </p>
                <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ 'User ID:' + content.userid }}</span>
                <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ 'User Type:' + content.usertype }}</span>
                <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                <button type="button" title="Delete This User" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.useruid, content.username, content.userid)">
                    <i class="fa fa-trash-o"></i>
                    <span class="w3-hide-medium w3-hide-small"> Delete</span>
                </button>
                <button v-if="content.lock === '0'" type="button" title="Lock This User" class="w3-button w3-theme-d2 w3-round w3-small w3-right" style="margin-right:3px" @click="changeLockWindowStatus(index, content.username, content.userid, true)">
                    <i class="fa fa-lock"></i>
                    <span class="w3-hide-medium w3-hide-small"> Lock</span>
                </button>
                <button v-else type="button" title="Unlock This User" class="w3-button w3-theme-d2 w3-round w3-small w3-right" style="margin-right:3px" @click="changeLockWindowStatus(index, content.username, content.userid, false)">
                    <i class="fa fa-unlock"></i>
                    <span class="w3-hide-medium w3-hide-small"> Unlock</span>
                </button>
                <button type="button" title="Edit This User" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i>
                    <span class="w3-hide-medium w3-hide-small"> Edit</span>
                </button>
            </div>
            <user-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></user-edit-panel>
        </li>
    </ul>

  </div>
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getUsers"></filter-panel>
</div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import UserEditPanel from './UserEditPanel.vue'
import UserAddWindow from './UserAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import ConfirmLockUserWindow from '../../ConfirmLockUserWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add user modal windows
            deleteWindowAlive: false,  //for delete user modal windows
            deleteIndex: -1,    //store which index will be deleted
            deleteUid: '',      //store which obj will be deleted
            deleteName: '',     //store which obj name will be deleted
            lockWindowAlive: false,  //for lock user modal windows
            lockIndex: -1,    //store which index will be locked
            lockId: '',      //store which obj will be locked
            lockName: '',     //store which obj name will be locked
            lockStatus: true, //store lock or unlock status
            allUserObjs: new Object(), //store all users
            editable: [],   //for all users content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "username"},
                {name: "Activate",value: "activate"},
                {name: "Type",value: "usertype"},
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "username"},
                {name: "Activate",value: "activate"},
                {name: "Type",value: "usertype"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getUsers()
    },
    methods: {
        getUsers(e){
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

            HTTPRepo.post(`trinity-user/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allUserObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allUserObjs = response.data
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
                this.allUserObjs[index] = content
            }
        },
        deleteUser(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTPRepo.get(`trinity-user/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allUserObjs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '', '', '')
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
            
        },
        lockUser(){
            if(this.lockIndex === -1)
                return
            if(this.lockUid === '')
                return
            
            HTTPRepo.get(`trinity-user/lock`, {
                params: {
                    userid: this.lockId,
                    lock: this.lockStatus
                }
            })
            .then(response => {   
                if(response.data === true)
                    this.allUserObjs[this.lockIndex].lock = '1'
                else
                    this.allUserObjs[this.lockIndex].lock = '0'
                this.changeLockWindowStatus(-1, '', '', response.data)
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
                this.allUserObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, useruid, username, userid){
            this.deleteWindowAlive = !this.deleteWindowAlive
            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = useruid
            this.deleteName = username + ' (' + userid + ')'
        },
        changeLockWindowStatus(index, username, userid, lock){
            this.lockWindowAlive = !this.lockWindowAlive
            /*
                store which obj be delete
            */
            this.lockIndex = index
            this.lockId = userid
            this.lockName = username + ' (' + userid + ')'
            this.lockStatus = lock 
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'user-edit-panel': UserEditPanel,
        'user-add-window': UserAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'confirm-lock-user-window': ConfirmLockUserWindow
    }
}
</script>

