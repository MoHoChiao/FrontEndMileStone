<template>
    <div class="w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-half">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="" width="77%" style="padding-top:12px;padding-bottom:12px">{{ $t('Form.ServerMonitor.UserAndID') }}</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">{{ $t('Form.Activate') }}</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" :title="$t('Container.Func.Add')" aria-hidden="true" @click="addUser"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:283px">
                    <table class="w3-table-all">
                        <tr :key="list_info.destinationuid" v-for="(list_info, index) in new_content.userlist">
                            <td class="w3-center" width="77%" style="padding:6px 0px 0px 0px">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.destinationuid" style="width:86%;padding:0px" @change="changeUser(list_info.destinationuid,index)">
                                        <template v-for="(user, index) in allUsers">
                                            <option v-if="user.useruid === list_info.destinationuid" :value="user.useruid" selected>{{ user.username }} ({{ user.userid }})</option>
                                            <option v-else-if="!userUids.includes(user.useruid)" :value="user.useruid">{{ user.username }} ({{ user.userid }})</option>
                                        </template>
                                    </select>
                                </span>
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" v-model="list_info.activate">
                            </td>
                            <td class="w3-center" width="8%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" :title="$t('Container.Func.Delete')" aria-hidden="true" @click="delUser(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="" width="77%" style="padding-top:12px;padding-bottom:12px">{{ $t('Form.ServerMonitor.UserGroup') }}</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">{{ $t('Form.Activate') }}</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" :title="$t('Container.Func.Add')" aria-hidden="true" @click="addGroup"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:283px">
                    <table class="w3-table-all">
                        <tr :key="list_info.destinationuid" v-for="(list_info, index) in new_content.grouplist">
                            <td class="w3-center" width="77%" style="padding:6px 0px 0px 0px">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.destinationuid" style="width:86%;padding:0px" @change="changeGroup(list_info.destinationuid,index)">
                                        <template v-for="(group, index) in allGroups">
                                            <option v-if="group.groupuid === list_info.destinationuid" :value="group.groupuid" selected>{{ group.groupname }}</option>
                                            <option v-else-if="!groupUids.includes(group.groupuid)" :value="group.groupuid">{{ group.groupname }}</option>
                                        </template>
                                    </select>
                                </span>
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" v-model="list_info.activate">
                            </td>
                            <td class="w3-center" width="8%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" :title="$t('Container.Func.Delete')" aria-hidden="true" @click="delGroup(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="w3-row">
                    <div class="w3-col m12 w3-center" style="padding-top:16px">
                        <button class="w3-button w3-round w3-teal" @click="reset">{{ $t('Container.Func.Reset') }}</button>
                        <button class="w3-button w3-round w3-teal" @click="save">{{ $t('Container.Func.Save') }}</button>
                    </div>
                </div>
        </div>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../util_js/axios_util'

export default {
    data() {
        return {
            inputClassList: ['w3-input','w3-border'],
            new_content: {
                notificationuid: 'JCSServer',
                notificationname: '',
                description: '',
                targetuid: 'JCSServer',
                notificationtype: 'M',
                notificationtiming: 'B',
                targettype: '',
                attachlog: '',
                userlist: new Array(),
                grouplist: new Array()
            },
            allUsers: [],   //store all trinity user in the db
            allGroups: [],   //store all user group in the db
            userUids: new Array(), //Array for keeping the selected user uids
            groupUids: new Array(), //Array for keeping the selected group uids
            userMap: new Map(),  // store key:user uid, value:user name and user id
            groupMap: new Map()  // store key:group uid, value:group name
        }
    },
    created(){
        
    },
    mounted() {
        this.getJCSServerNotice()
    },
    methods: {
        getAllUsers(){
            HTTP_TRINITY.get(`trinity-user/findAll`)
            .then(response => {
                this.allUsers = response.data

                this.userMap = new Map()
                for(let i=0;i<this.allUsers.length;i++){
                    let userInfo = {
                        "userid": this.allUsers[i].userid,
                        "username": this.allUsers[i].username
                    }
                    this.userMap.set(this.allUsers[i].useruid, userInfo)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getAllGroups(){
            let params = {
                "ordering":{
                    "orderType":'ASC',
                    "orderField":'groupname'
                }
            }

            HTTP_TRINITY.post(`user-group/findByFilter`, params)
            .then(response => {
                this.allGroups = response.data

                this.groupMap = new Map()
                for(let i=0;i<this.allGroups.length;i++){
                    this.groupMap.set(this.allGroups[i].groupuid, this.allGroups[i].groupname)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getJCSServerNotice(){
            HTTP_TRINITY.get(`notification/findByUid?notificationUid=JCSServer`)
            .then(response => {
                this.userUids = new Array()
                this.groupUids = new Array()

                if(response.data.notificationuid){  //成立表示此紀錄是存在的
                    this.new_content = response.data
                    if(this.new_content.userlist){
                        for(let i=0;i<this.new_content.userlist.length;i++){
                            this.userUids.push(this.new_content.userlist[i].destinationuid)
                        }
                    }
                
                    if(this.new_content.grouplist){
                        for(let i=0;i<this.new_content.grouplist.length;i++){
                            this.groupUids.push(this.new_content.grouplist[i].destinationuid)
                        }
                    }
                }else{
                    this.new_content.userlist = new Array()
                    this.new_content.grouplist = new Array()
                }
                
                this.getAllUsers()
                this.getAllGroups()
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        save(){
            if(this.userUids.indexOf('') > -1 || this.userUids.indexOf(undefined) > -1){
                let newStatus = {
                    "msg": "User Name(ID) must be selected!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
                return
            }

            if(this.groupUids.indexOf('') > -1 || this.groupUids.indexOf(undefined) > -1){
                let newStatus = {
                    "msg": "User Group Name must be selected!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
                return 
            }

            HTTP_TRINITY.post(`notification/modify`, this.new_content)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Resource Notification - JCSServer Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
        },
        reset(){            
            this.getJCSServerNotice()
        },
        changeUser(uid,index){
            this.userUids.splice(index, 1, uid)
        },
        delUser(index){
            this.new_content.userlist.splice(index, 1)
            this.userUids.splice(index, 1)
        },
        addUser(){
            let new_user= {
                notificationuid: 'JCSServer',
                destinationuid: '',
                activate: 1,
                destinationtype: 'U'
            };
            this.new_content.userlist.push(new_user)
            this.userUids.push('')
        },
        changeGroup(uid,index){
            this.groupUids.splice(index, 1, uid)
        },
        delGroup(index){
            this.new_content.grouplist.splice(index, 1)
            this.groupUids.splice(index, 1)
        },
        addGroup(){
            let new_group= {
                notificationuid: 'JCSServer',
                destinationuid: '',
                activate: 1,
                destinationtype: 'G'
            };
            this.new_content.grouplist.push(new_group)
            this.groupUids.push('')
        }
    }
}
</script>
<style scoped>
    select {
        height: 30px
    }
    input.w3-check {
        height: 16px
    }
</style>
