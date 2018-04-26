<template>
    <div>
        <role-add-window :windowAlive="addWindowAlive" 
                            window-title="Add Role" 
                            @closeAdd="changeAddWindowStatus" 
        ></role-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive" 
                            :deleteName="deleteName" 
                            window-title="Confirm window" 
                            window-bg-color="highway-schoolbus" 
                            btn-color="signal-white" 
                            @closeDelete="changeDeleteWindowStatus" 
                            @confirmDelete="deleteRole" 
        ></confirm-delete-window>
        <role-member-window :windowAlive="applyMemberWindowAlive" 
                            window-title="Apply Members To Role"
                            :roleuid="selectedRoleRecord.roleuid" 
                            @closeApply="changeMemberWindowStatus" 
        ></role-member-window>
        <functional-permission-window :windowAlive="applyPermissionWindowAlive" 
                            window-title="Apply Permission To "
                            :peopleUid="selectedRoleRecord.roleuid" 
                            :peopleName="selectedRoleRecord.rolename" 
                            @closeApply="changePermissionWindowStatus" 
        ></functional-permission-window>
        <div class="w3-col m7 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Role</i>
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i class="fa fa-plus w3-button w3-right" title="Add Role" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getRole"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode">
                <div :key="content.roleuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allRoleObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/Role.png" alt="Role" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            <i v-if="content.roleuid.startsWith('Role')" class="fa fa-user-circle fa-fw w3-text-blue"></i>
                            {{ content.rolename }}
                        </p>
                        <br>
                        <role-member-panel :key="content.roleuid+'MemberPanel'" :roleuid="content.roleuid"></role-member-panel>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i> Edit</button>
                        <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changePermissionWindowStatus(content)">
                            <i class="fa fa-universal-access"></i> Permission</button>   
                        <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.roleuid, content.rolename)">
                            <i class="fa fa-trash-o"></i> Delete</button>
                    </div>
                    <role-edit-panel v-else :key="content.roleuid+'EditPanel1'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></role-edit-panel>
                </div>
            </div>
            <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
                <li :key="content.roleuid+'li'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allRoleObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/Role.png" alt="Role" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            <i v-if="content.roleuid.startsWith('Role')" class="fa fa-user-circle fa-fw w3-text-blue"></i>
                            {{ content.rolename }}
                        </p>
                        <button title="Delete This Role" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.roleuid, content.rolename)">
                            <i class="fa fa-trash-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Delete</span>
                        </button>
                        <button title="Apply Permission To Role" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changePermissionWindowStatus(content)">
                            <i class="fa fa-universal-access"></i>
                            <span class="w3-hide-medium w3-hide-small"> Permission</span>
                        </button>
                        <button title="Apply Members To Role" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeMemberWindowStatus(content)">
                            <i class="fa fa-hand-lizard-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Members</span>
                        </button>
                        <button title="Edit This Role" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i>
                            <span class="w3-hide-medium w3-hide-small"> Edit</span>
                        </button>
                    </div>
                    <role-edit-panel v-else :key="content.roleuid+'EditPanel2'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></role-edit-panel>
                </li>
            </ul>
        </div>
        <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getRole"></filter-panel>
    </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../axios/http-common'
import FilterPanel from '../../FilterPanel.vue'
import RoleEditPanel from './RoleEditPanel.vue'
import RoleMemberPanel from './RoleMemberPanel.vue'
import RoleAddWindow from './RoleAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import RoleMemberWindow from './RoleMemberWindow.vue'
import FunctionalPermissionWindow from '../../PermissionSetting/FunctionalPermissionWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add Role modal windows
            applyMemberWindowAlive: false, //for modify Role Member modal windows
            applyPermissionWindowAlive: false, //for modify Role Functional Permission modal windows
            deleteWindowAlive: false,  //for delete Role modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allRoleObjs: [], //store all Role
            editable: [],   //for all Role content edit panel
            selectedRoleRecord: new Object(),   //store which role members button has been clicked.
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "rolename"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "rolename"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getRole()
    },
    methods: {
        getRole(e){
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

            HTTPRepo.post(`role/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allRoleObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allRoleObjs = response.data
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
                this.allRoleObjs[index] = content
            }
        },
        changeMemberWindowStatus(record){
            if(record)
                this.selectedRoleRecord = record
            this.applyMemberWindowAlive = !this.applyMemberWindowAlive
        },
        changePermissionWindowStatus(record){
            if(record){
                this.selectedRoleRecord = record
                this.selectedRoleRecord.roleuid = this.selectedRoleRecord.roleuid.trim()
            }
            
            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
        },
        deleteRole(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTPRepo.get(`role/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allRoleObjs.splice(this.deleteIndex, 1)
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
                this.allRoleObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, roleuid, rolename){
            if(roleuid && roleuid.startsWith('Role')){
                let newStatus = {
                    "msg": "You cannot delete default roles!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
                return
            }


            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = roleuid
            this.deleteName = rolename
        },
        
    },
    components: {
        'filter-panel': FilterPanel,
        'role-edit-panel': RoleEditPanel,
        'role-member-panel': RoleMemberPanel,
        'role-add-window': RoleAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'role-member-window': RoleMemberWindow,
        'functional-permission-window': FunctionalPermissionWindow
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

