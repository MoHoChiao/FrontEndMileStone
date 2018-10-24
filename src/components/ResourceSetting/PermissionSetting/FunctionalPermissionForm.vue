<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="" width="30%">{{ $t('Window.Role.Permission.FuncName') }}</th>
                            <th class="w3-center" width="15%" @click="checkView" style="cursor:pointer">{{ $t('Window.Role.Permission.View') }}</th>
                            <th class="w3-center" width="15%" @click="checkAdd" style="cursor:pointer">{{ $t('Window.Role.Permission.Add') }}</th>
                            <th class="w3-center" width="15%" @click="checkDelete" style="cursor:pointer">{{ $t('Window.Role.Permission.Delete') }}</th>
                            <th class="w3-center" width="15%" @click="checkEdit" style="cursor:pointer">{{ $t('Window.Role.Permission.Edit') }}</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto">
                    <table class="w3-table-all">
                        <tr :id="funcObj.objectuid" v-for="(funcObj, index) in newFuncList">
                            <td class="" width="30%">
                                <label>{{ funcObj.name }}</label>
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" :true-value="1" :false-value="0" v-model="funcObj.view">
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" :true-value="1" :false-value="0" v-model="funcObj.add">
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" :true-value="1" :false-value="0" v-model="funcObj.delete">
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" :true-value="1" :false-value="0" v-model="funcObj.edit">
                            </td>
                        </tr> 
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_AUTH, errorHandle } from '../../../util_js/axios_util'

    export default {
        data() {
            return {
                newFuncList: [
                    {
                        "name": 'Alias Reference',
                        "objectuid": 'function-aliasref',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Connection',
                        "objectuid": 'function-connection',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Domain',
                        "objectuid": 'function-domain',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Entity Variable',
                        "objectuid": 'function-entityvar',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Extension Rule',
                        "objectuid": 'function-extrule',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'File Source',
                        "objectuid": 'function-filesource',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Frequency',
                        "objectuid": 'function-frequency',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'JCS Agent',
                        "objectuid": 'function-jcsagent',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Metadata',
                        "objectuid": 'function-metadata',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Performance Viewer',
                        "objectuid": 'function-performance',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    },
                    {
                        "name": 'Profile',
                        "objectuid": 'function-profile',
                        "view": "0",
                        "add": "0",
                        "delete": "0",
                        "edit": "0",
                        "run": "0",
                        "reRun": "0",
                        "grant": "0",
                        "import_export": "0"
                    }
                ],
                oldFuncList: []
            }
        },
        mounted() {
            this.getFunctions()
        },
        props: {
            peopleUid: ''
        },
        methods: {
            getFunctions() {
                HTTP_AUTH.get(`authorization/findFunctionalPermissionByPeopleUid?peopleUid=` + this.peopleUid)
                    .then(response => {
                        this.oldFuncList = response.data
                        
                        for (var i = 0; i < this.newFuncList.length; i++) {
                            for (var j = 0; j < this.oldFuncList.length; j++) {
                                if (this.newFuncList[i].objectuid == this.oldFuncList[j].objectuid) {
                                    this.newFuncList[i].view = this.oldFuncList[j].view
                                    this.newFuncList[i].add = this.oldFuncList[j].add
                                    this.newFuncList[i].delete = this.oldFuncList[j].delete
                                    this.newFuncList[i].edit = this.oldFuncList[j].edit
                                    this.newFuncList[i].run = this.oldFuncList[j].run
                                    this.newFuncList[i].reRun = this.oldFuncList[j].reRun
                                    this.newFuncList[i].grant = this.oldFuncList[j].grant
                                    this.newFuncList[i].import_export = this.oldFuncList[j].import_export
                                    break
                                }
                            }
                        } 
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                        this.$emit('cancel')
                    })
            },
            checkView() {
                let allCheck = true

                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (this.newFuncList[i].view == '0') {
                        allCheck = false
                        break
                    }
                }
                
                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (allCheck) {
                        this.newFuncList[i].view = '0'
                    } else {
                        this.newFuncList[i].view = '1'
                    }
                }
            },
            checkAdd() {
                let allCheck = true

                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (this.newFuncList[i].add == '0') {
                        allCheck = false
                        break
                    }
                }
                
                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (allCheck) {
                        this.newFuncList[i].add = '0'
                    } else {
                        this.newFuncList[i].add = '1'
                    }
                }
            },
            checkDelete() {
                let allCheck = true

                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (this.newFuncList[i].delete == '0') {
                        allCheck = false
                        break
                    }
                }
                
                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (allCheck) {
                        this.newFuncList[i].delete = '0'
                    } else {
                        this.newFuncList[i].delete = '1'
                    }
                }
            },
            checkEdit() {
                let allCheck = true

                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (this.newFuncList[i].edit == '0') {
                        allCheck = false
                        break
                    }
                }
                
                for (var i = 0; i < this.newFuncList.length; i++) {
                    if (allCheck) {
                        this.newFuncList[i].edit = '0'
                    } else {
                        this.newFuncList[i].edit = '1'
                    }
                }
            },
            //changeFunction(uid, index) {
            //    this.objUids.splice(index, 1, uid)
            //},
            //delFunction(index) {
            //    this.oldFuncList.splice(index, 1)
            //    this.objUids.splice(index, 1)
            //},
            //addFunction() {
            //    let new_function = {
            //        peopleuid: this.peopleUid,
            //        objectuid: '',
            //        view: 0,
            //        add: 0,
            //        delete: 0,
            //        edit: 0,
            //        run: 0,
            //        reRun: 0,
            //        grant: 0,
            //        import_export: 0
            //    };
            //    this.oldFuncList.push(new_function)
            //    this.objUids.push('')
            //},
            save() {
                for (var i = 0; i < this.newFuncList.length; i++) {
                    let match = false

                    for (var j = 0; j < this.oldFuncList.length; j++) {
                        if (this.newFuncList[i].objectuid == this.oldFuncList[j].objectuid) {
                            this.oldFuncList[j].view = this.newFuncList[i].view
                            this.oldFuncList[j].add = this.newFuncList[i].add
                            this.oldFuncList[j].delete = this.newFuncList[i].delete
                            this.oldFuncList[j].edit = this.newFuncList[i].edit

                            match = true
                            break
                        }
                    }

                    if (!match) {
                        if (this.newFuncList[i].view != '0'
                            || this.newFuncList[i].add != '0'
                            || this.newFuncList[i].delete != '0'
                            || this.newFuncList[i].edit != '0') {
                            this.oldFuncList.push(this.newFuncList[i])
                        }
                    }
                }

                return this.oldFuncList
            },
            reset() {
                this.getFunctions()
            }
        }
    }
</script>
<style scoped>
    input, select {
        height: 24px
    }

    input.w3-check, input.w3-radio {
        height: 16px;
        top: 2px
    }
</style>
