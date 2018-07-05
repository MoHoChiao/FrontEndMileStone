<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="25%" style="padding-top:12px;padding-bottom:12px">Alias Name</th>
                            <th class="w3-center" width="18%" style="padding-top:12px;padding-bottom:12px">Type</th>
                            <th class="w3-center" width="24%" style="padding-top:12px;padding-bottom:12px">Target</th>
                            <th class="w3-center" width="25%" style="padding-top:12px;padding-bottom:12px">Description</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Alias" aria-hidden="true" @click="addAlias"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:238px;word-break:break-all">
                    <table class="w3-table-all">
                        <tr :key="list_info.agentuid" v-for="(list_info, index) in new_content.alias">
                            <td class="w3-center" width="25%">
                                <input v-if="list_info.addFlag" class="w3-input w3-border" v-model="list_info.aliasname" type="text" 
                                    maxlength="32" style="text-transform:uppercase" placeholder="Please Input Alias Name">
                                <input v-else class="w3-input w3-border" v-model="list_info.aliasname" type="text" 
                                    maxlength="32" readonly style="text-transform:uppercase" placeholder="Please Input Alias Name">
                            </td>
                            <td class="w3-center" width="18%">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.aliastype" style="width:100%;padding:0px" @change="changeType(index, list_info)">
                                        <option value="Connection">Connection</option>
                                        <option value="Domain">Domain</option>
                                        <option value="Agent">Agent</option>
                                        <option value="Frequency">Frequency</option>
                                        <option value="Filesource">Filesource</option>
                                    </select>
                                </span>
                            </td>
                            <td class="w3-center" width="24%">
                                <span>
                                    <select v-if="list_info.aliastype === 'Connection'" class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                        <template v-for="(targetObj, index) in allConnections">
                                            <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                        </template>
                                    </select>
                                    <select v-else-if="list_info.aliastype === 'Domain'" class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                        <template v-for="(targetObj, index) in allDomains">
                                            <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                        </template>
                                    </select>
                                    <select v-else-if="list_info.aliastype === 'Agent'" class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                        <template v-for="(targetObj, index) in allAgents">
                                            <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                        </template>
                                    </select>
                                    <select v-else-if="list_info.aliastype === 'Frequency'" class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                        <template v-for="(targetObj, index) in allFrequencies">
                                            <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                        </template>
                                    </select>
                                    <select v-else-if="list_info.aliastype === 'Filesource'" class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                        <template v-for="(targetObj, index) in allFilesources">
                                            <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                        </template>
                                    </select>
                                </span>
                            </td>
                            <td width="25%">
                                <span>
                                    <input class="w3-input w3-border" style="width:100%" v-model="list_info.description" type="text" maxlength="255" placeholder="Please Input Description">
                                </span>
                            </td>
                            <td class="w3-center" width="8%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delAlias(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'

export default {
    data() {
        return {
            allConnections: [],
            allDomains: [],
            allAgents: [],
            allVirtualAgents: [],
            allFrequencies: [],
            allFilesources: [],
            //以下是因為vue.js的v-for, 暫時不支援map collection, 所以額外宣告出來儲存所有key/value值
            allTargetObjectMap: new Map(),
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                busentityuid: this.content.busentityuid,
                busentityname: this.content.busentityname,
                alias: null
            }
        }
    },
    created() {
        let params = {
                "ordering":{
                "orderType":'ASC'
            }
        }
        let url = ''

        params.orderField = 'connectionname'
        url = 'connection/findByFilter'
        this.getTargetObjs(url, params, 'Connection', 'connectionuid', 'connectionname')

        params.orderField = 'name'
        url = 'domain/findByFilter?withoutDetail=true'
        this.getTargetObjs(url, params, 'Domain', 'domainuid', 'name')

        params.orderField = 'agentname'
        url = 'jcsagent/findByFilter'
        this.getTargetObjs(url, params, 'Agent', 'agentuid', 'agentname')

        params.orderField = 'frequencyname'
        url = 'frequency/findByFilter'
        this.getTargetObjs(url, params, 'Frequency', 'frequencyuid', 'frequencyname')

        params.orderField = 'filesourcename'
        url = 'file-source/findByFilter'
        this.getTargetObjs(url, params, 'Filesource', 'filesourceuid', 'filesourcename')
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    busentityuid: '',
                    busentityname: '',
                    alias: []
                }
            }
        }
    },
    methods: {
        changeType(index, list_info){
            this.$set(this.new_content.alias, index, list_info)
        },
        getTargetObjs(url, params, aliastype, uidField, nameField){
            HTTP_TRINITY.post(url, params)
            .then(response => {
                let targetObjs = []
                for(let i=0;i<response.data.length;i++){
                    let uid = response.data[i][uidField]
                    let name = response.data[i][nameField]

                    let targetObj = {
                        "uid": uid,
                        "name": name,
                    }
                    targetObjs.push(targetObj)
                    //儲存所有target obj的uid和name之對應關係, 以供取target name用
                    this.allTargetObjectMap.set(uid, name)
                }

                if(aliastype === 'Connection'){
                    this.allConnections = targetObjs
                }else if(aliastype === 'Domain'){
                    this.allDomains = targetObjs
                }else if(aliastype === 'Agent'){
                    this.allAgents = targetObjs
                    this.getVirtualAgentObjs()
                }else if(aliastype === 'Frequency'){
                    this.allFrequencies = targetObjs
                }else if(aliastype === 'Filesource'){
                    this.allFilesources = targetObjs
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getVirtualAgentObjs(){
            let params = {
                "ordering":{
                    "orderType":'ASC',
                    "orderField": 'virtualagentname'
                }
            }

            HTTP_TRINITY.post('vragent/findByFilter?withoutDetail=true', params)
            .then(response => {
                for(let i=0;i<response.data.length;i++){
                    let uid = response.data[i].virtualagentuid
                    let name = response.data[i].virtualagentname + '(Virtual)'

                    let targetObj = {
                        "uid": uid,
                        "name": name
                    }
                    this.allAgents.push(targetObj)
                    //儲存所有target obj的uid和name之對應關係, 以供取target name用
                    this.allTargetObjectMap.set(uid, name)
                }
                //initial alias[]要放在這裡才行, 否則objectuid有時會是undefined
                this.cloneAlias()
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        delAlias(index){
            this.new_content.alias.splice(index, 1)
        },
        addAlias(){
            let new_alias= {
                parentuid: this.new_content.busentityuid,
                aliasname: '$',
                aliastype: 'Connection',
                objectuid: '',
                description: '',
                addFlag: true   //新增特有的屬性
            };
            this.new_content.alias.push(new_alias)
        },
        save(){
            let return_alias = []
            let aliasNames = []
            for(let i=0;i<this.new_content.alias.length;i++){
                this.new_content.alias[i].aliasname = this.new_content.alias[i].aliasname.trim().toUpperCase()

                if(this.new_content.alias[i].aliasname.length < 2){
                    let newStatus = {
                        "msg": "Alias Name can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

                if(this.new_content.alias[i].aliasname.indexOf("$") !== 0){
                    let newStatus = {
                        "msg": "Alias Name must be start with '$'!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

                

                if(aliasNames.includes(this.new_content.alias[i].aliasname)){
                    let newStatus = {
                        "msg": "Duplicate Alias Name!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

                if(!this.new_content.alias[i].objectuid){
                    let newStatus = {
                        "msg": "Target Object can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }
                
                aliasNames.push(this.new_content.alias[i].aliasname)
                
                let alias = {
                    "aliasname": this.new_content.alias[i].aliasname,
                    "aliastype": this.new_content.alias[i].aliastype,
                    "objectuid": this.new_content.alias[i].objectuid,
                    "description": this.new_content.alias[i].description,
                    //補/objectname, 這是為了後端回傳回來的資料中, objectname不為null
                    "objectname": this.allTargetObjectMap.get(this.new_content.alias[i].objectuid)
                }
                return_alias.push(alias)
            }
            
            return return_alias
        },
        reset(){
            this.new_content.busentityuid = this.content.busentityuid
            this.new_content.busentityname = this.content.busentityname
            //Reset Clone Alias
            this.cloneAlias()
        },
        cloneAlias(){
            //Create a new array from this.content.alias, Avoid array to call by reference.
            this.new_content.alias = new Array(this.content.alias.length)
            /*
                Copy all new objs from this.content.agentlist's objs into this.new_content.agentlist
                Avoid objs to call by reference.
            */
            for (var i = 0, len = this.content.alias.length; i < len; i++) {
                this.new_content.alias[i] = {
                    parentuid: this.content.alias[i].parentuid,
                    aliasname: this.content.alias[i].aliasname,
                    aliastype: this.content.alias[i].aliastype,
                    objectuid: this.content.alias[i].objectuid,
                    description: this.content.alias[i].description,
                    objectname: this.content.alias[i].objectname
                };
            }
        }
    }
}
</script>
<style scoped>
    input,select {
        height: 30px
    }
</style>
