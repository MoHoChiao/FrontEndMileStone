<template>
    <div class="w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-half">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="77%" style="padding-top:12px;padding-bottom:12px">User Name (User ID)</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Activate</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add User" aria-hidden="true" @click="addUser"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
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
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delUser(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="77%" style="padding-top:12px;padding-bottom:12px">User Group Name</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Activate</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add User" aria-hidden="true" @click="addGroup"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
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
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delGroup(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="w3-row">
                    <div class="w3-col m12 w3-center" style="padding-top:16px">
                        <button class="w3-button w3-round w3-teal" @click="reset">Reset</button>
                        <button class="w3-button w3-round w3-teal" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'

export default {
    data() {
        return {
            inputClassList: ['w3-input','w3-border'],
            new_content: {
                notificationuid: this.content.notificationuid,
                notificationname: this.content.notificationname,
                description: this.content.description,
                targetuid: this.content.targetuid,
                notificationtype: this.content.notificationtype,
                notificationtiming: this.content.notificationtiming,
                targettype: this.content.targettype,
                attachlog: this.content.attachlog,
                content: this.content.content,
                subject: this.content.subject,
                userlist: null,
                grouplist: null
            },
            allUsers: [],   //store all trinity user in the db
            allGroups: [],   //store all user group in the db
            userUids: [], //Array for keeping the selected user uids
            groupUids: [], //Array for keeping the selected group uids
            userMap: new Map(),  // store key:user uid, value:user name and user id
            groupMap: new Map()  // store key:group uid, value:group name
        }
    },
    mounted() {
        this.getJCSServerNotice()
        
        this.getAllUsers()
        this.getAllGroups()
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    notificationuid: '',
                    notificationname: '',
                    description: '',
                    targetuid: '',
                    notificationtype: '',
                    notificationtiming: '',
                    targettype: '',
                    attachlog: '',
                    content: '',
                    subject: '',
                    userlist: [],
                    grouplist: []
                }
            }
        }
    },
    methods: {
        changeUser(uid,index){
            this.userUids.splice(index, 1, uid)
        },
        changeGroup(uid,index){
            this.groupUids.splice(index, 1, uid)
        },
        getAllUsers(){
            let params = {
                "ordering":{
                    "orderType":'ASC',
                    "orderField":'username'
                }
            }

            HTTPRepo.post(`trinity-user/findByFilter`, params)
            .then(response => {
                this.allUsers = response.data
                console.log(this.allUsers)
                for(let i=0;i<this.allUsers.length;i++){
                    let userInfo = {
                        "userid": this.allUsers[i].userid,
                        "username": this.allUsers[i].username
                    }
                    this.userMap.set(this.allUsers[i].useruid, userInfo)
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
        getAllGroups(){
            let params = {
                "ordering":{
                    "orderType":'ASC',
                    "orderField":'groupname'
                }
            }

            HTTPRepo.post(`user-group/findByFilter`, params)
            .then(response => {
                this.allGroups = response.data
                console.log(this.allGroups)
                for(let i=0;i<this.allGroups.length;i++){
                    this.groupMap.set(this.allGroups[i].groupuid, this.allGroups[i].groupname)
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
        getJCSServerNotice(){
            HTTPRepo.get(`notification/findByUid?notificationUid=JCSServer`)
            .then(response => {
                this.new_content = response.data
                console.log(new_content)
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
        save(){
            delete this.selectedMonitorConfig.lastupdatetime  //不需要傳送
            delete this.selectedMonitorConfig.xml  //不需要傳送
            if(!this.selectedMonitorConfig.resourcemonitor){
                this.selectedMonitorConfig.cpu = 0
                this.selectedMonitorConfig.memory = 0
                this.selectedMonitorConfig.disk = []
            }else{
                if(this.selectedMonitorConfig.cpu < 0)
                    this.selectedMonitorConfig.cpu = 0

                if(this.selectedMonitorConfig.cpu > 100)
                    this.selectedMonitorConfig.cpu = 100

                if(this.selectedMonitorConfig.memory < 0)
                    this.selectedMonitorConfig.memory = 0

                if(this.selectedMonitorConfig.memory > 100)
                    this.selectedMonitorConfig.memory = 100

                for(let i=0;i<this.selectedMonitorConfig.disk.length;i++){
                    if(!this.selectedMonitorConfig.disk[i].path.match(this.pattern)){
                        let newStatus = {
                            "msg": "File System Path Format Error!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }
                    
                    if(this.selectedMonitorConfig.disk[i].value < 0){
                        this.selectedMonitorConfig.disk[i].value = 0
                    }

                    if(this.selectedMonitorConfig.disk[i].value > 2147483647){
                        this.selectedMonitorConfig.disk[i].value = 2147483647
                    }
                }
            }

            HTTPRepo.post(`monitor-config/modify`, this.selectedMonitorConfig)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Resource Monitor - " + this.selectedMachineName + " Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.selectedMonitorConfig = response.data
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
        reset(){
            this.new_content.notificationuid = this.content.notificationuid
            this.new_content.notificationname = this.content.notificationname
            this.new_content.description = this.content.description
            this.new_content.targetuid = this.content.targetuid
            this.new_content.notificationtype = this.content.notificationtype
            this.new_content.notificationtiming = this.content.notificationtiming
            this.new_content.targettype = this.content.targettype
            this.new_content.attachlog = this.content.attachlog
            this.new_content.content = this.content.content
            this.new_content.subject = this.content.subject
            //Reset Clone userlist
            this.cloneUserList()
            //Reset Clone grouplist
            this.cloneGroupList()
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
        },
        cloneUserList(){
            //for reset method, keep userUids's size is equals to Original size
            this.userUids = new Array(this.content.userlist.length)

            //Create a new array from this.content.userlist, Avoid array to call by reference.
            this.new_content.userlist = new Array(this.content.userlist.length)
            /*
                Copy all new objs from this.content.userlist's objs into this.new_content.userlist
                Avoid objs to call by reference.
            */
            for (var i = 0, len = this.content.userlist.length; i < len; i++) {
                this.new_content.userlist[i] = {
                    notificationuid: this.content.userlist[i].notificationuid,
                    destinationuid: this.content.userlist[i].destinationuid,
                    activate: Number(this.content.userlist[i].activate),
                    destinationtype: this.content.userlist[i].destinationtype
                };
            }
        },
        cloneGroupList(){
            //for reset method, keep jcsAgentUids's size is equals to Original size
            this.groupUids = new Array(this.content.grouplist.length)

            //Create a new array from this.content.agentlist, Avoid array to call by reference.
            this.new_content.grouplist = new Array(this.content.grouplist.length)
            /*
                Copy all new objs from this.content.agentlist's objs into this.new_content.agentlist
                Avoid objs to call by reference.
            */
            for (var i = 0, len = this.content.grouplist.length; i < len; i++) {
                this.new_content.grouplist[i] = {
                    notificationuid: this.content.grouplist[i].notificationuid,
                    destinationuid: this.content.grouplist[i].destinationuid,
                    activate: Number(this.content.grouplist[i].activate),
                    destinationtype: this.content.grouplist[i].destinationtype
                };
            }
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
