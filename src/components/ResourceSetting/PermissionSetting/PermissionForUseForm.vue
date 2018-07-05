<template>
<div>
    <apply-account-window v-if="applyAccountWindowAlive" :windowAlive="applyAccountWindowAlive" 
            window-title="Apply Accounts Window" 
            :userUids="userUids" 
            @closeApply="changeApplyAccountWindowStatus" 
            @applyMembers="addUsers" 
    ></apply-account-window>
    <apply-role-window v-if="applyRoleWindowAlive" :windowAlive="applyRoleWindowAlive" 
            window-title="Apply Roles Window" 
            :roleUids="roleUids" 
            @closeApply="changeApplyRoleWindowStatus" 
            @applyMembers="addRoles" 
    ></apply-role-window>
    <div class="w3-small">
        <div class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Apply Accounts</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">Apply Roles</div>
            </a>
        </div>
        <div class="w3-row w3-section">
            <div v-if="tabsFlag[0]" class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="60%" style="padding-top:12px;padding-bottom:12px">User Name (ID)</th>
                            <th class="w3-center" width="30%" style="padding-top:12px;padding-bottom:12px">Use</th>
                            <th class="w3-center" width="10%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Trinity Users" aria-hidden="true" @click="changeApplyAccountWindowStatus"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div id="usersContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
                    <table class="w3-table-all">
                        <tr :key="list_info.peopleuid+':'+list_info.objectuid" v-for="(list_info, index) in permissionListForUser">
                            <td class="w3-center" width="60%" style="padding-top:12px">
                                {{ list_info.peoplename }} ({{list_info.peopleid}})
                            </td>
                            <td class="w3-center" width="30%">
                                <input class="w3-check" type="checkbox" v-model="list_info.add">
                            </td>
                            <td class="w3-center" width="10%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delUser(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-if="tabsFlag[1]" class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="60%" style="padding-top:12px;padding-bottom:12px">Role Name</th>
                            <th class="w3-center" width="30%" style="padding-top:12px;padding-bottom:12px">Use</th>
                            <th class="w3-center" width="10%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Roles" aria-hidden="true" @click="changeApplyRoleWindowStatus"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div id="rolesContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
                    <table class="w3-table-all">
                        <tr :key="list_info.peopleuid+':'+list_info.objectuid" v-for="(list_info, index) in permissionListForRole">
                            <td class="w3-center" width="60%" style="padding-top:12px">
                                {{ list_info.peoplename }}
                            </td>
                            <td class="w3-center" width="30%">
                                <input class="w3-check" type="checkbox" v-model="list_info.add">
                            </td>
                            <td class="w3-center" width="10%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delRole(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { HTTP_AUTH,errorHandle } from '../../../util_js/axios_util'
import ApplyAccountsWindow from './ApplyAccountsWindow.vue'
import ApplyRolesWindow from './ApplyRolesWindow.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false],
            applyAccountWindowAlive: false,
            applyRoleWindowAlive: false,
            trinityusers: [],
            roles: [],
            permissionListForUser: [],  //Array for keeping the permission for user
            permissionListForRole: [],  //Array for keeping the permission for role
            userUids: [], //Array for keeping the user uids
            roleUids: [] //Array for keeping the role uids
        }
    },
    mounted() {
        this.getPermissionOnlyForUser()
        this.getPermissionOnlyForRole()
    },
    props: {
        objectUid: ''
    },
    methods: {
        openTab(numOfTab) {
            if(this.whichTab === numOfTab)
                return

            this.whichTab = numOfTab

            for (let i = 0; i < this.tabsFlag.length; i++) {
                this.$set(this.tabsFlag, i, false)
            }
            this.$set(this.tabsFlag, this.whichTab, true)

            for (let i = 0; i < this.tabsClass.length; i++) {
                this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
            }
            this.$set(this.tabsClass, this.whichTab, this.tabsClass[this.whichTab] + " w3-border-theme")
        },
        delUser(index){
            this.permissionListForUser.splice(index, 1)
            this.userUids.splice(index, 1)
        },
        addUsers(selectedUserRecords){
            if(selectedUserRecords){
                for(let i=0;i<selectedUserRecords.length;i++){
                    let new_user= {
                        peopleuid: selectedUserRecords[i].useruid.trim(),
                        peopleid: selectedUserRecords[i].userid.trim(),
                        peoplename: selectedUserRecords[i].username,
                        objectuid: '',
                        view: 0,
                        add: 1,
                        delete: 0,
                        edit: 0,
                        run: 0,
                        reRun: 0,
                        grant: 0,
                        import_export: 0
                    };
                    this.permissionListForUser.unshift(new_user)
                    this.userUids.unshift(selectedUserRecords[i].useruid.trim())
                }
                /*
                 * if add user records success, scroll to top
                */
                var usersContainer = this.$el.querySelector("#usersContainer")
                usersContainer.scrollTop = -usersContainer.scrollTop
            }   
        },
        delRole(index){
            this.permissionListForRole.splice(index, 1)
            this.roleUids.splice(index, 1)
        },
        addRoles(selectedRoleRecords){
            if(selectedRoleRecords){
                for(let i=0;i<selectedRoleRecords.length;i++){
                    let new_role= {
                        peopleuid: selectedRoleRecords[i].roleuid.trim(),
                        peoplename: selectedRoleRecords[i].rolename,
                        objectuid: '',
                        view: 0,
                        add: 1,
                        delete: 0,
                        edit: 0,
                        run: 0,
                        reRun: 0,
                        grant: 0,
                        import_export: 0
                    };
                    this.permissionListForRole.unshift(new_role)
                    this.roleUids.unshift(selectedRoleRecords[i].roleuid.trim())
                }
                /*
                 * if add user records success, scroll to top
                */
                var rolesContainer = this.$el.querySelector("#rolesContainer")
                rolesContainer.scrollTop = -rolesContainer.scrollTop
            }
        },
        getPermissionOnlyForUser(){
            HTTP_AUTH.get(`authorization/findUserExByObjectUid?objectUid=`+this.objectUid)
            .then(response => {
                this.permissionListForUser = response.data
                this.userUids = []
                for (var i = 0, len = this.permissionListForUser.length; i < len; i++) {
                    this.permissionListForUser[i] = {
                        peopleuid: this.permissionListForUser[i].peopleuid,
                        peoplename: this.permissionListForUser[i].peoplename,
                        peopleid: this.permissionListForUser[i].peopleid,
                        objectuid: this.objectUid,
                        view: Number(this.permissionListForUser[i].view),
                        add: Number(this.permissionListForUser[i].add),
                        delete: Number(this.permissionListForUser[i].delete),
                        edit: Number(this.permissionListForUser[i].edit),
                        run: Number(this.permissionListForUser[i].run),
                        reRun: Number(this.permissionListForUser[i].reRun),
                        grant: Number(this.permissionListForUser[i].grant),
                        import_export: Number(this.permissionListForUser[i].import_export)
                    };
                    this.userUids.push(this.permissionListForUser[i].peopleuid)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getPermissionOnlyForRole(){
            HTTP_AUTH.get(`authorization/findRoleExByObjectUid?objectUid=`+this.objectUid)
            .then(response => {
                this.permissionListForRole = response.data
                this.roleUids = []
                for (var i = 0, len = this.permissionListForRole.length; i < len; i++) {
                    this.permissionListForRole[i] = {
                        peopleuid: this.permissionListForRole[i].peopleuid,
                        peoplename: this.permissionListForRole[i].peoplename,
                        objectuid: this.objectUid,
                        view: Number(this.permissionListForRole[i].view),
                        add: Number(this.permissionListForRole[i].add),
                        delete: Number(this.permissionListForRole[i].delete),
                        edit: Number(this.permissionListForRole[i].edit),
                        run: Number(this.permissionListForRole[i].run),
                        reRun: Number(this.permissionListForRole[i].reRun),
                        grant: Number(this.permissionListForRole[i].grant),
                        import_export: Number(this.permissionListForRole[i].import_export)
                    };
                    this.roleUids.push(this.permissionListForRole[i].peopleuid)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        changeApplyAccountWindowStatus(){
            this.applyAccountWindowAlive = !this.applyAccountWindowAlive
        },
        changeApplyRoleWindowStatus(){
            this.applyRoleWindowAlive = !this.applyRoleWindowAlive
        },
        save(){
            var retPermissionList = []

            //permission only users
            for(let i=0;i<this.permissionListForUser.length;i++){
                this.permissionListForUser[i].objectuid = null //在這裡的應用而言, 此欄位, 對後端無用, 減少一點傳輸量
                this.permissionListForUser[i].view = '0'
                this.permissionListForUser[i].add = Number(this.permissionListForUser[i].add)
                this.permissionListForUser[i].delete = '0'
                this.permissionListForUser[i].edit = '0'
                this.permissionListForUser[i].run = '0'
                this.permissionListForUser[i].reRun = '0'
                this.permissionListForUser[i].grant = '0'
                this.permissionListForUser[i].import_export = '0'
                retPermissionList.push(this.permissionListForUser[i])
            }

            //permission only roles
            for(let i=0;i<this.permissionListForRole.length;i++){
                this.permissionListForRole[i].objectuid = null //在這裡的應用而言, 此欄位, 對後端無用, 減少一點傳輸量
                this.permissionListForRole[i].view = '0'
                this.permissionListForRole[i].add = Number(this.permissionListForRole[i].add)
                this.permissionListForRole[i].delete = '0'
                this.permissionListForRole[i].edit = '0'
                this.permissionListForRole[i].run = '0'
                this.permissionListForRole[i].reRun = '0'
                this.permissionListForRole[i].grant = '0'
                this.permissionListForRole[i].import_export = '0'
                retPermissionList.push(this.permissionListForRole[i])
            }

            return retPermissionList
        },
        reset(){
            this.openTab(0)
            this.getPermissionOnlyForUser()
            this.getPermissionOnlyForRole()
        }
    },
    components: {
        'apply-account-window': ApplyAccountsWindow,
        'apply-role-window': ApplyRolesWindow
    }
}
</script>
<style scoped>
    input,select {
        height: 30px
    }
    input.w3-check,input.w3-radio {
        height: 16px
    }
</style>
