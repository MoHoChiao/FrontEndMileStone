<template>
    <div>
        <apply-members-window v-if="applyWindowAlive" :windowAlive="applyWindowAlive" 
            window-title="Apply Members To Role" 
            :memberUids="memberUids" 
            :roleuid="roleuid"  
            :rolename="rolename" 
            @closeApply="changeApplyWindowStatus" 
            @applyMembers="getMembers" 
        ></apply-members-window>
        <confirm-delete-window v-if="deleteWindowAlive" :windowAlive="deleteWindowAlive" 
            :deleteName="deleteName" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteWindowStatus" 
            @confirmDelete="deleteApply" 
        ></confirm-delete-window>
        <div class="w3-small">
            <div class="w3-row">
                <div class="w3-col m10">
                    <input :id="'SearchUserInput' + roleuid" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                        :placeholder="$t('Window.Member.SearchUser')" @keyup="searchForUser()">
                </div>
                <div class="w3-col m2 w3-border w3-border-camo-black w3-camo-grey w3-center">
                    <i class="fa fa-plus-square w3-button w3-hover-none" :title="$t('Window.Member.Apply')" aria-hidden="true" @click="changeApplyWindowStatus"></i>
                    <!--<i class="fa fa-refresh w3-button w3-hover-none" :title="$t('Window.Member.Reload')" aria-hidden="true" @click="getMembers"></i>-->
                </div>
            </div>
            <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                <table :id="'UserListTable' + roleuid" class="w3-table-all">
                    <tr :key="list_index+'UserListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in applyMembers">
                        <td class="w3-left" width="84%">
                            {{ compositionName(list_info) }}
                        </td>
                        <td class="w3-center" width="16%" style="padding:3px 0px 0px 0px">
                            <i class="fa fa-minus-circle w3-button w3-hover-none" :title="$t('Container.Func.Delete')" 
                                aria-hidden="true" @click="changeDeleteWindowStatus(list_index, list_info)"></i>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import { PermissionTable } from '../../../../util_js/auth'
import ApplyMembersWindow from './ApplyMembersWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            applyMembers: [],
            memberUids: [],
            applyWindowAlive: false,
            deleteWindowAlive: false,  //for delete windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: ''     //store which obj name will be delete
        }
    },
    props:{
        roleuid: '',
        rolename: ''
    },
    created(){
        this.getMembers()
    },
    methods: {
        searchForUser() {
            let input, filter, table, i
            input = document.getElementById('SearchUserInput'+this.roleuid)
            filter = input.value.toUpperCase()
            table = document.getElementById('UserListTable'+this.roleuid)
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[0].innerHTML
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
        },
        getMembers(){
            if(this.roleuid && this.roleuid !== ''){
                if(PermissionTable.root || PermissionTable.admin){
                    HTTP_TRINITY.get(`role-member/findFullNameByRoleUid`, {params:{uid: this.roleuid}})
                    .then(response => {
                        this.applyMembers = response.data
                        this.memberUids = []
                        for(let i=0; i<this.applyMembers.length; i++){
                            this.memberUids.push(this.applyMembers[i].useruid)
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
                }
            }
        },
        changeApplyWindowStatus(){
            if(PermissionTable.root || PermissionTable.admin){
                this.applyWindowAlive = !this.applyWindowAlive
            }else{
                let newStatus = {
                    "msg": "You do not have 'Root Or Admin' Permission!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
            }
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
        deleteApply(){
            if(this.deleteIndex === -1)
                return
            if(!this.deleteUid || this.deleteUid === '')
                return
            
            if(PermissionTable.root || PermissionTable.admin){
                HTTP_TRINITY.get('role-member/deleteByPKUids?roleUid='+this.roleuid+'&userUid='+this.deleteUid)
                .then(response => {
                    this.applyMembers.splice(this.deleteIndex, 1)
                    this.memberUids.splice(this.deleteIndex, 1)
                    
                    this.changeDeleteWindowStatus()
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }else{
                let newStatus = {
                    "msg": "You do not have 'Root Or Admin' Permission!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
            }
            
        },
        compositionName(list_info){
            return list_info.username + ' (' + list_info.userid + ')'
        }
    },
    components: {
        'apply-members-window': ApplyMembersWindow,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

