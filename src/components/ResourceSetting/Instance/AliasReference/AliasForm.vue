<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="" width="25%" style="padding-top:12px;padding-bottom:12px">{{ $t('Container.Grid.AliasName') }}</th>
                            <th class="" width="18%" style="padding-top:12px;padding-bottom:12px">{{ $t('Container.Grid.Type') }}</th>
                            <th class="" width="24%" style="padding-top:12px;padding-bottom:12px">{{ $t('Container.Grid.Target') }}</th>
                            <th class="" width="25%" style="padding-top:12px;padding-bottom:12px">{{ $t('Container.Grid.Description') }}</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" :title="$t('Window.Resource.AddAlias')" aria-hidden="true" @click="addAlias"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:238px;word-break:break-all">
                    <table class="w3-table-all">
                        <tr v-for="(list_info, index) in new_content.alias">
                            <td class="w3-center" width="25%">
                                <input :name="'name' + index" v-validate="'required|min:2|regex:^\\$'"
                                       :class="['w3-input', 'w3-border', {'w3-pale-red': errors.has('name' + index)}]"
                                       v-model="list_info.aliasname" type="text"
                                       maxlength="32" style="text-transform:uppercase" placeholder="" :disabled="!list_info.addFlag">
                            </td>
                            <td class="w3-center" width="18%">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.aliastype" style="width:100%;padding:0px"
                                            @change="changeType(index, list_info)" :disabled="!list_info.use || !list_info.addFlag">
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
                                    <!--{{list_info.objectuid}}-->
                                    <select :name="'target' + index" v-validate="'required|excluded:-1'"
                                            :class="['w3-select', 'w3-border', 'w3-round', {'w3-pale-red': errors.has('target' + index)}]"
                                            v-model="list_info.objectuid" style="width:100%;padding:0px" :disabled="!list_info.use">
                                        <option value="-1" disabled selected></option>
                                        <option v-for="(targetObj, index) in currentTarget(list_info.aliastype)" :key="targetObj.uid" :value="targetObj.uid" :disabled="!targetObj.use">
                                            {{ targetObj.name }}
                                        </option>
                                    </select>
                                </span>
                            </td>
                            <td width="25%">
                                <span>
                                    <input class="w3-input w3-border" style="width:100%" v-model="list_info.description" type="text" maxlength="255" placeholder="" :readonly="!list_info.use">
                                </span>
                            </td>
                            <td class="w3-center" width="8%">
                                <i v-if="list_info.use" class="fa fa-minus-circle w3-button w3-hover-none" :title="$t('Container.Func.Delete')" aria-hidden="true" @click="delAlias(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import { PermissionTable } from '../../../../util_js/auth'

    export default {
        data() {
            return {
                //下列存放各Resource的所有Object data(uid, name)
                allConnections: [],
                allDomains: [],
                allAgents: [],
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
                    alias: []
                }
            }
        },
        created() {
            this.cloneAlias()

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
                default() {
                    return {
                        busentityuid: '',
                        busentityname: '',
                        alias: []
                    }
                }
            }
        },
        methods: {
            changeType(index, list_info) {
                list_info.objectuid = undefined
                list_info.objectname = undefined
                this.$set(this.new_content.alias, index, list_info)
            },
            currentTarget(aliastype) {
                if (aliastype === 'Connection') {
                    return this.allConnections
                } else if (aliastype === 'Domain') {
                    return this.allDomains
                } else if (aliastype === 'Agent') {
                    return this.allAgents
                } else if (aliastype === 'Frequency') {
                    return this.allFrequencies
                } else if (aliastype === 'Filesource') {
                    return this.allFilesources
                }
            },
            getTargetObjs(url, aliastype, uidField, nameField, checkFunctionalView) {
                let functionPermission = aliastype.toLowerCase() + '_func'
                if (PermissionTable.root || PermissionTable.admin || (PermissionTable[functionPermission] && PermissionTable[functionPermission].view)) {
                    HTTP_TRINITY.get(url)
                        .then(response => {
                            let targetObjs = []
                            for (let i = 0; i < response.data.length; i++) {
                                let uid = response.data[i][uidField]
                                let name = response.data[i][nameField]

                                let targetObj = {
                                    "uid": uid,
                                    "name": name,
                                    "use": this.checkUseRight(uid)
                                }
                                targetObjs.push(targetObj)
                                //儲存所有target obj的uid和name之對應關係, 以供取target name用
                                this.allTargetObjectMap.set(uid, name)
                            }

                            if (aliastype === 'Connection') {
                                this.allConnections = targetObjs
                            } else if (aliastype === 'Domain') {
                                this.allDomains = targetObjs
                            } else if (aliastype === 'Agent') {
                                this.allAgents = targetObjs
                                this.getVirtualAgentObjs()
                            } else if (aliastype === 'Frequency') {
                                this.allFrequencies = targetObjs
                            } else if (aliastype === 'Filesource') {
                                this.allFilesources = targetObjs
                            }
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                }
            },
            getVirtualAgentObjs() {
                let params = {
                    "ordering": {
                        "orderType": 'ASC',
                        "orderField": 'virtualagentname'
                    }
                }
                HTTP_TRINITY.get('vragent/findAll?withoutDetail=true', params)
                    .then(response => {
                        for (let i = 0; i < response.data.length; i++) {
                            let uid = response.data[i].virtualagentuid
                            let name = response.data[i].virtualagentname + '(Virtual)'

                            let targetObj = {
                                "uid": uid,
                                "name": name,
                                "use": this.checkUseRight(uid)
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
            delAlias(index) {
                if (this.new_content.alias[index].addFlag) {
                    this.new_content.alias.splice(index, 1)
                } else if (PermissionTable.root || PermissionTable.admin
                    || (PermissionTable.alias_func && PermissionTable.alias_func.delete)) {

                    HTTP_TRINITY.post(`objectalias/checkIsRefBy`, this.new_content.alias[index])
                        .then(response => {
                            if (response.data == '1') {
                                let newStatus = {
                                    "msg": "Referenced by job",
                                    "status": "Warn"
                                }
                                this.$store.dispatch('setSystemStatus', newStatus)
                            } else if (response.data == '2') {
                                let newStatus = {
                                    "msg": "Referenced by jobstep",
                                    "status": "Warn"
                                }
                                this.$store.dispatch('setSystemStatus', newStatus)
                            } else {
                                this.new_content.alias.splice(index, 1)
                            }
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                } else {
                    let newStatus = {
                        "msg": "No Permission",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            },
            addAlias() {
                if (PermissionTable.root || PermissionTable.admin || (PermissionTable.alias_func && PermissionTable.alias_func.add)) {
                    let new_alias = {
                        parentuid: this.new_content.busentityuid,
                        aliasname: '$',
                        aliastype: 'Connection',
                        objectuid: '',
                        description: '',
                        use: true,
                        addFlag: true   //新增特有的屬性
                    };
                    this.new_content.alias.push(new_alias)
                } else {
                    let newStatus = {
                        "msg": "No 'Add' Permission",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            },
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                } else {
                    let return_alias = []
                    let aliasNames = []
                    for (let i = 0; i < this.new_content.alias.length; i++) {
                        this.new_content.alias[i].aliasname = this.new_content.alias[i].aliasname.trim().toUpperCase()

                        if (aliasNames.includes(this.new_content.alias[i].aliasname)) {
                            let newStatus = {
                                "msg": "Duplicate Alias Name",
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
                }
            },
            reset() {
                this.new_content.busentityuid = this.content.busentityuid
                this.new_content.busentityname = this.content.busentityname
                //Reset Clone Alias
                this.cloneAlias()
            },
            cloneAlias() {
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
                        objectname: this.content.alias[i].objectname,
                        use: this.checkUseRight(this.content.alias[i].objectuid)
                    };
                }
            },
            checkUseRight(objUid) {
                let use = false

                if (PermissionTable.root || PermissionTable.admin)
                    use = true
                else if (PermissionTable.object_map[objUid])
                    use = PermissionTable.object_map[objUid].add

                return use
            }
        }
    }
</script>
<style scoped>


    input, select {
        height: 30px
    }
</style>
