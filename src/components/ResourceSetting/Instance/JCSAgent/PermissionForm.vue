<template>
<div>
    <apply-account-window v-if="applyWindowAlive" :windowAlive="applyAccountWindowAlive" 
            window-title="Apply Accounts To " 
            :memberUids="memberUids" 
            :groupuid="groupuid"  
            @closeApply="changeApplyWindowStatus" 
            @applyMembers="getMembers" 
    ></apply-account-window>
    <apply-role-window v-if="applyWindowAlive" :windowAlive="applyRoleWindowAlive" 
            window-title="Apply Roles To " 
            :memberUids="memberUids" 
            :groupuid="groupuid"  
            @closeApply="changeApplyWindowStatus" 
            @applyMembers="getMembers" 
    ></apply-role-window>
    <confirm-delete-window v-if="deleteWindowAlive" :windowAlive="deleteWindowAlive" 
            :deleteName="deleteName" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteWindowStatus" 
            @confirmDelete="deleteApply" 
    ></confirm-delete-window>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m1">&nbsp;</div>
            <div class="w3-col m10 w3-center">
                <button class="w3-button w3-round w3-teal" @click="changePatternWindowStatus">Add Acount</button>
                <button class="w3-button w3-round w3-teal" @click="clearAllDate">Add Role</button>
            </div>
            <div class="w3-col m1">&nbsp;</div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="32%" style="padding-top:12px;padding-bottom:12px">Name</th>
                            <th class="w3-center" width="12%" style="padding-top:12px;padding-bottom:12px">View</th>
                            <th class="w3-center" width="12%" style="padding-top:12px;padding-bottom:12px">Add</th>
                            <th class="w3-center" width="12%" style="padding-top:12px;padding-bottom:12px">Delete</th>
                            <th class="w3-center" width="12%" style="padding-top:12px;padding-bottom:12px">Edit</th>
                            <th class="w3-center" width="12%" style="padding-top:12px;padding-bottom:12px">Grant</th>
                            <th class="w3-center" width="8%" style="padding-top:12px;padding-bottom:12px"></th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
                    <table class="w3-table-all">
                        <tr :key="list_info.peopleuid+':'+list_info.objectuid" v-for="(list_info, index) in permissionList">
                            <td class="w3-center" width="32%" style="padding:6px 0px 0px 6px">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.peopleuid" style="width:100%;padding:0px" @change="changeFunction(list_info.objectuid, index)">
                                        <template v-for="(user, index) in trinityusers">
                                            <option :key="user.useruid" v-if="user.useruid === list_info.peopleuid" :value="user.useruid" selected>{{ user.name }} ({{user.userid}})</option>
                                            <option :key="user.useruid" v-else-if="!objUids.includes(user.useruid)" :value="obj.id">{{ obj.name }}</option>
                                        </template>
                                    </select>
                                </span>
                            </td>
                            <td class="w3-center" width="12%">
                                <input class="w3-check" type="checkbox" v-model="list_info.view">
                            </td>
                            <td class="w3-center" width="12%">
                                <input class="w3-check" type="checkbox" v-model="list_info.add">
                            </td>
                            <td class="w3-center" width="12%">
                                <input class="w3-check" type="checkbox" v-model="list_info.delete">
                            </td>
                            <td class="w3-center" width="12%">
                                <input class="w3-check" type="checkbox" v-model="list_info.edit">
                            </td>
                            <td class="w3-center" width="12%">
                                <input class="w3-check" type="checkbox" v-model="list_info.grant">
                            </td>
                            <td class="w3-center" width="8%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="deleteWindowAlive(index, user)"></i>
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
import { HTTPRepo } from '../../../../axios/http-common'
import ApplyAccountsWindow from './ApplyAccountsWindow.vue'
import ApplyRolesWindow from './ApplyRolesWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false],
            applyAccountWindowAlive: false,
            applyRoleWindowAlive: false,
            deleteWindowAlive: false,
            trinityusers: [],
            roles: [],
            permissionList: [],
            userUids: null //Array for keeping the selected functional object uids
        }
    },
    created() {
        this.getTrinityUser()
        this.getRole()
    },
    mounted() {
        

        // this.getFunctions()
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

            if(this.tabsFlag[1]){
                this.getFreqExclude()
            }else if(this.tabsFlag[2]){
                this.getJobExclude()
            }else if(this.tabsFlag[3]){
                this.getFlowExclude()
            }
        },
        getTrinityUser(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"username"
                }
            }

            HTTPRepo.post(`trinity-user/findByFilter`, params)
            .then(response => {
                this.trinityusers = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
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
        getRole(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"roleame"
                }
            }

            HTTPRepo.post(`role/findByFilter`, params)
            .then(response => {
                this.roles = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
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
        getPermission(){
            HTTPRepo.get(`access-right/findByObjectUid?objectUid=`+this.objectUid)
            .then(response => {
                this.permissionList = response.data
                this.objUids = []
                for (var i = 0, len = this.permissionList.length; i < len; i++) {
                    this.permissionList[i] = {
                        peopleuid: this.permissionList[i].peopleuid,
                        objectuid: this.objectUid,
                        view: Number(this.permissionList[i].view),
                        add: Number(this.permissionList[i].add),
                        delete: Number(this.permissionList[i].delete),
                        edit: Number(this.permissionList[i].edit),
                        run: Number(this.permissionList[i].run),
                        reRun: Number(this.permissionList[i].reRun),
                        grant: Number(this.permissionList[i].grant),
                        import_export: Number(this.permissionList[i].import_export)
                    };
                    this.objUids.push(this.permissionList[i].objectuid)
                }
            })
            .catch(error => {
                if (error.response && error.response.data) {
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
        changeApplyAccountWindowStatus(){
            this.applyAccountWindowAlive = !this.applyAccountWindowAlive
        },
        changeApplyRoleWindowStatus(){
            this.applyRoleWindowAlive = !this.applyRoleWindowAlive
        },
        changeDeleteWindowStatus(index, list_info){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            if(list_info){
                this.deleteIndex = index

                this.deleteUid = list_info.useruid
                this.deleteName = 'Member - ' + this.compositionName(list_info)
            }else{
                this.deleteIndex = -1
                this.deleteUid = ''
                this.deleteName = ''
            }
        },
        save(){
            for(let i=0;i<this.functionalList.length;i++){
                if(this.functionalList[i].objectuid === undefined || this.functionalList[i].objectuid.trim() === ''){
                    let newStatus = {
                        "msg": "Function Name can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }else{
                    this.functionalList[i].peopleUid = null //在這裡的應用而言, 此欄位, 對後端無用, 減少一點傳輸量
                    this.functionalList[i].view = Number(this.functionalList[i].view)
                    this.functionalList[i].add = Number(this.functionalList[i].add)
                    this.functionalList[i].delete = Number(this.functionalList[i].delete)
                    this.functionalList[i].edit = Number(this.functionalList[i].edit)
                    this.functionalList[i].run = '0'
                    this.functionalList[i].reRun = '0'
                    this.functionalList[i].grant = '0'
                    this.functionalList[i].import_export = '0'
                }
            }

            return this.functionalList
        },
        reset(){
            this.getFunctions()
        }
    },
    components: {
        'apply-accounts-window': ApplyAccountsWindow,
        'apply-roles-window': ApplyRolesWindow,
        'confirm-delete-window': ConfirmDeleteWindow
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
