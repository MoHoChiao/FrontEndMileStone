<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="32%" style="padding-top:12px;padding-bottom:12px">Function Name</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">View</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Add</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Delete</th>
                            <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Edit</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Function" aria-hidden="true" @click="addFunction"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
                    <table class="w3-table-all">
                        <tr :key="list_info.peopleuid+':'+list_info.objectuid" v-for="(list_info, index) in functionalList">
                            <td class="w3-center" width="32%" style="padding:6px 0px 0px 6px">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.objectuid" style="width:100%;padding:0px" @change="changeFunction(list_info.objectuid, index)">
                                        <template v-for="(obj, index) in allFunctionalObjs">
                                            <option :key="obj.id" v-if="obj.id === list_info.objectuid" :value="obj.id" selected>{{ obj.name }}</option>
                                            <option :key="obj.id" v-else-if="!objUids.includes(obj.id)" :value="obj.id">{{ obj.name }}</option>
                                        </template>
                                    </select>
                                </span>
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" v-model="list_info.view">
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" v-model="list_info.add">
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" v-model="list_info.delete">
                            </td>
                            <td class="w3-center" width="15%">
                                <input class="w3-check" type="checkbox" v-model="list_info.edit">
                            </td>
                            <td class="w3-center" width="8%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delFunction(index)"></i>
                            </td>
                        </tr>
                    </table>
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
            allFunctionalObjs: [],
            functionalList: [],
            objUids: null //Array for keeping the selected functional object uids
        }
    },
    mounted() {
        //Initial All Function Object
        let aliasFun = {
            "name":'Alias Reference',
            "id":'function-aliasref'
        }
        this.allFunctionalObjs.push(aliasFun)

        let agentFun = {
            "name":'JCS Agent',
            "id":'function-jcsagent'
        }
        this.allFunctionalObjs.push(agentFun)

        let connFun = {
            "name":'Connection',
            "id":'function-connection'
        }
        this.allFunctionalObjs.push(connFun)

        let domainFun = {
            "name":'Domain',
            "id":'function-domain'
        }
        this.allFunctionalObjs.push(domainFun)

        let ruleFun = {
            "name":'Extension Rule',
            "id":'function-extrule'
        }
        this.allFunctionalObjs.push(ruleFun)

        let filesourceFun = {
            "name":'File Source',
            "id":'function-filesource'
        }
        this.allFunctionalObjs.push(filesourceFun)

        let freqFun = {
            "name":'Frequency',
            "id":'function-frequency'
        }
        this.allFunctionalObjs.push(freqFun)

        let metadataFun = {
            "name":'Metadata',
            "id":'function-metadata'
        }
        this.allFunctionalObjs.push(metadataFun)

        let profileFun = {
            "name":'Profile',
            "id":'function-profile'
        }
        this.allFunctionalObjs.push(profileFun)

        let performanceFun = {
            "name":'Performance Viewer',
            "id":'function-performance'
        }
        this.allFunctionalObjs.push(performanceFun)

        let varFun = {
            "name":'Entity Variable',
            "id":'function-entityvar'
        }
        this.allFunctionalObjs.push(varFun)

        this.getFunctions()
    },
    props: {
        peopleUid: ''
    },
    methods: {
        getFunctions(){
            HTTPRepo.get(`access-right/findFunctionalPermissionByPeopleUid?peopleUid=`+this.peopleUid)
            .then(response => {
                this.functionalList = response.data
                this.objUids = []
                for (var i = 0, len = this.functionalList.length; i < len; i++) {
                    this.functionalList[i] = {
                        peopleuid: this.peopleUid,
                        objectuid: this.functionalList[i].objectuid,
                        view: Number(this.functionalList[i].view),
                        add: Number(this.functionalList[i].add),
                        delete: Number(this.functionalList[i].delete),
                        edit: Number(this.functionalList[i].edit),
                        run: Number(this.functionalList[i].run),
                        reRun: Number(this.functionalList[i].reRun),
                        grant: Number(this.functionalList[i].grant),
                        import_export: Number(this.functionalList[i].import_export)
                    };
                    this.objUids.push(this.functionalList[i].objectuid)
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
        changeFunction(uid,index){
            this.objUids.splice(index, 1, uid)
        },
        delFunction(index){
            this.functionalList.splice(index, 1)
            this.objUids.splice(index, 1)
        },
        addFunction(){
            let new_function= {
                peopleuid: this.peopleUid,
                objectuid: '',
                view: 0,
                add: 0,
                delete: 0,
                edit: 0,
                run: 0,
                reRun: 0,
                grant: 0,
                import_export: 0
            };
            this.functionalList.push(new_function)
            this.objUids.push('')
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
                    this.functionalList[i].peopleuid = null //在這裡的應用而言, 此欄位, 對後端無用, 減少一點傳輸量
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
