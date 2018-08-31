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
                                    <div v-if="list_info.aliastype === 'Connection'">
                                        <div v-if="allConnections.length <= 0 && list_info.objectuid !== ''">
                                            <input class="w3-input w3-border" v-model="connectionObj.name" type="text" maxlength="255" readonly>
                                        </div>
                                        <div v-else>
                                            <select class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                                <template v-for="(targetObj, index) in allConnections">
                                                    <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-else-if="list_info.aliastype === 'Domain'">
                                        <div v-if="allDomains.length <= 0 && list_info.objectuid !== ''">
                                            <input class="w3-input w3-border" v-model="domainObj.name" type="text" maxlength="255" readonly>
                                        </div>
                                        <div v-else>
                                            <select class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                                <template v-for="(targetObj, index) in allDomains">
                                                    <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-else-if="list_info.aliastype === 'Agent'">
                                        <div v-if="allAgents.length <= 0 && list_info.objectuid !== ''">
                                            <input class="w3-input w3-border" v-model="agentObj.name" type="text" maxlength="255" readonly>
                                        </div>
                                        <div v-else>
                                            <select class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                                <template v-for="(targetObj, index) in allAgents">
                                                    <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-else-if="list_info.aliastype === 'Frequency'">
                                        <div v-if="allFrequencies.length <= 0 && list_info.objectuid !== ''">
                                            <input class="w3-input w3-border" v-model="frequencyObj.name" type="text" maxlength="255" readonly>
                                        </div>
                                        <div v-else>
                                            <select class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                                <template v-for="(targetObj, index) in allFrequencies">
                                                    <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-else-if="list_info.aliastype === 'Filesource'">
                                        <div v-if="allFilesources.length <= 0 && list_info.objectuid !== ''">
                                            <input class="w3-input w3-border" v-model="filesourceObj.name" type="text" maxlength="255" readonly>
                                        </div>
                                        <div v-else>
                                            <select class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px">
                                                <template v-for="(targetObj, index) in allFilesources">
                                                    <option :key="targetObj.uid" :value="targetObj.uid">{{ targetObj.name }}</option>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
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
import { HTTP_TRINITY,HTTP_AUTH,errorHandle } from '../../../../util_js/axios_util'

export default {
    data() {
        return {
            //下列存放各Resource的所有Object data(uid, name)
            allConnections: [],
            allDomains: [],
            allAgents: [],
            allFrequencies: [],
            allFilesources: [],
            //下列存放各Resource的舊資料
            connectionObj: new Object(),
            domainObj: new Object(),
            agentObj: new Object(),
            frequencyObj: new Object(),
            filesourceObj: new Object(),
            //以下是因為vue.js的v-for, 暫時不支援map collection, 所以額外宣告出來儲存所有key/value值
            allTargetObjectMap: new Map(),
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                busentityuid: this.content.busentityuid,
                busentityname: this.content.busentityname,
                alias: []
            }
        }
    },
    created() {
        this.cloneAlias()
        this.initialResourceArray()

        let url = ''

        url = 'connection/findAll'
        this.getTargetObjs(url, 'Connection', 'connectionuid', 'connectionname', 'functionName=agent&permissionFlag=view')

        url = 'domain/findAll?withoutDetail=true'
        this.getTargetObjs(url, 'Domain', 'domainuid', 'name')

        url = 'jcsagent/findAll'
        this.getTargetObjs(url, 'Agent', 'agentuid', 'agentname')

        url = 'frequency/findAll'
        this.getTargetObjs(url, 'Frequency', 'frequencyuid', 'frequencyname')

        url = 'file-source/findAll'
        this.getTargetObjs(url, 'Filesource', 'filesourceuid', 'filesourcename')
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
        getTargetObjs(url, aliastype, uidField, nameField, checkFunctionalView){
            HTTP_AUTH.get(`authorization/checkFuncPermission?functionName=` + aliastype.toLowerCase() + '&permissionFlag=view')
            .then(response => {
                if(response.data){
                    HTTP_TRINITY.get(url)
                    .then(response => {
                        let targetObjs = []
                        for(let i=0;i<response.data.length;i++){
                            let uid = response.data[i][uidField]
                            let name = response.data[i][nameField]

                            let targetObj = {
                                "uid": uid,
                                "name": name
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
            HTTP_TRINITY.get('vragent/findAll?withoutDetail=true', params)
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
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        delAlias(index){
            HTTP_AUTH.get(`authorization/checkFuncPermission`, {
                params: {
                    functionName: 'alias',
                    permissionFlag:'delete'
                }
            })
            .then(response => {
                if(response.data){
                    this.new_content.alias.splice(index, 1)
                }else{
                    let newStatus = {
                        "msg": "You do not have 'Delete' Permission!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        addAlias(){
            HTTP_AUTH.get(`authorization/checkFuncPermission`, {
                params: {
                    functionName: 'alias',
                    permissionFlag:'add'
                }
            })
            .then(response => {
                if(response.data){
                        let new_alias= {
                        parentuid: this.new_content.busentityuid,
                        aliasname: '$',
                        aliastype: 'Connection',
                        objectuid: '',
                        description: '',
                        addFlag: true   //新增特有的屬性
                    };
                    this.new_content.alias.push(new_alias)
                }else{
                    let newStatus = {
                        "msg": "You do not have 'Add' Permission!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
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
        },
        initialResourceArray(){
            for (var i = 0, len = this.new_content.alias.length; i < len; i++) {
                if(this.new_content.alias[i].aliastype === 'Connection'){
                    this.connectionObj.uid = this.new_content.alias[i].objectuid
                    this.connectionObj.name = this.new_content.alias[i].objectname
                }else if(this.new_content.alias[i].aliastype === 'Domain'){
                    this.domainObj.uid = this.new_content.alias[i].objectuid
                    this.domainObj.name = this.new_content.alias[i].objectname
                }else if(this.new_content.alias[i].aliastype === 'Agent'){
                    this.agentObj.uid = this.new_content.alias[i].objectuid
                    this.agentObj.name = this.new_content.alias[i].objectname
                }else if(this.new_content.alias[i].aliastype === 'Frequency'){
                    this.frequencyObj.uid = this.new_content.alias[i].objectuid
                    this.frequencyObj.name = this.new_content.alias[i].objectname
                }else if(this.new_content.alias[i].aliastype === 'Filesource'){
                    this.filesourceObj.uid = this.new_content.alias[i].objectuid
                    this.filesourceObj.name = this.new_content.alias[i].objectname
                }
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
