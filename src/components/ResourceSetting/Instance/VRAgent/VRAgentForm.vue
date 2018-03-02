<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.virtualagentname" type="text" 
                    maxlength="32" placeholder="Please Input Name" style="text-transform:uppercase">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.activate" style="width:40px;" type="checkbox">
                <label>Activate</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Max Jobs</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.maxjobs" v-model="new_content.maximumjob" type="number" min="0" max="2048">
            </div>
            <div class="w3-col m6 w3-right">
                <span>
                    <input class="w3-radio" type="radio" value="0" checked v-model="new_content.mode">
                    <label>Load Balance</label>
                </span>
                <span>
                    <input class="w3-radio" type="radio" value="1" v-model="new_content.mode">
                    <label>By Seq</label>
                </span>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center" width="7%" style="padding-top:12px;padding-bottom:12px">Seq</th>
                            <th class="w3-center" width="30%" style="padding-top:12px;padding-bottom:12px">Name</th>
                            <th class="w3-center" width="10%" style="padding-top:12px;padding-bottom:12px">Activate</th>
                            <th class="w3-center" width="45%" style="padding-top:12px;padding-bottom:12px">Description</th>
                            <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add JCS Agent" aria-hidden="true" @click="addAgent"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
                    <table class="w3-table-all">
                        <tr :key="list_info.agentuid" draggable="true" @dragover.prevent @drag="dragAgent(index)" @drop="dropAgent(index)" v-for="(list_info, index) in new_content.agentlist">
                            <td width="7%" style="padding-top:13px">{{ index + 1 }}</td>
                            <td class="w3-center" width="30%" style="padding:6px 0px 0px 0px">
                                <span>
                                    <select class="w3-select w3-border w3-round" v-model="list_info.agentuid" style="width:100%;padding:0px" @change="changeAgent(list_info.agentuid,index)">
                                        <template v-for="(jcsagent, index) in allJCSAgents">
                                            <option v-if="jcsagent.agentuid === list_info.agentuid" :value="jcsagent.agentuid" selected>{{ jcsagent.agentname }}</option>
                                            <option v-else-if="!jcsAgentUids.includes(jcsagent.agentuid)" :value="jcsagent.agentuid">{{ jcsagent.agentname }}</option>
                                        </template>
                                    </select>
                                </span>
                            </td>
                            <td class="w3-center" width="10%">
                                <input class="w3-check" type="checkbox" v-model="list_info.activate">
                            </td>
                            <td width="45%" style="padding:6px 0px 0px 0px">
                                <span>
                                    <input class="w3-input w3-border" style="width:100%" v-model="list_info.description" type="text" maxlength="255" placeholder="Please Input Description">
                                </span>
                            </td>
                            <td class="w3-center" width="8%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delAgent(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'

export default {
    data() {
        return {
            inputClassList: {
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border'],
                maxjobs: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                virtualagentuid: this.content.virtualagentuid,
                virtualagentname: this.content.virtualagentname,
                description: this.content.description,
                maximumjob: this.content.maximumjob,
                activate: Number(this.content.activate),
                mode: this.content.mode,
                agentlist: null
            },
            dragIndex: 0,
            allJCSAgents: [],   //store all jcsagent in the db
            jcsAgentUids: null, //Array for keeping the selected jcsagent uids
            jcsAgentMap: new Map()
        }
    },
    mounted() {
        //Initial Clone AgentList
        this.cloneAgentList()

        //Initial to get all jcsagent for select boxes
        let params = {
                "ordering":{
                    "orderType":'ASC',
                    "orderField":'agentname'
                }
            }
        HTTPRepo.post(`jcsagent/findByFilter`, params)
            .then(response => {
                this.allJCSAgents = response.data
                for(let i=0;i<this.allJCSAgents.length;i++){
                    this.jcsAgentMap.set(this.allJCSAgents[i].agentuid, this.allJCSAgents[i].agentname)
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
    props: {
        content: {
            type: Object,
            default () {
                return {
                    virtualagentuid: '',
                    virtualagentname: '',
                    description: '',
                    maximumjob: 5,
                    activate: '0',
                    mode: '0',
                    agentlist: []
                }
            }
        },
        index: Number
    },
    methods: {
        changeAgent(uid,index){
            
            this.jcsAgentUids.splice(index, 1, uid)
        },
        delAgent(index){
            this.new_content.agentlist.splice(index, 1)
            this.jcsAgentUids.splice(index, 1)
        },
        addAgent(){
            let new_agent= {
                virtualagentuid: this.new_content.virtualagentuid,
                agentuid: '',
                activate: 0,
                description: '',
                seq: this.new_content.agentlist.length + 1
            };
            this.new_content.agentlist.push(new_agent)
            this.jcsAgentUids.push('')
        },
        dragAgent(index){
            this.dragIndex = index
        },
        dropAgent(index){
            if (this.new_content.agentlist.length === 1) 
                return

            var temp = this.new_content.agentlist[index];
            /*
                this.$set is for above :
                http://www.jianshu.com/p/358c1974d9a5
                https://jsfiddle.net/qnq2munr/2/
            */
            this.$set(this.new_content.agentlist, index, this.new_content.agentlist[this.dragIndex])
            this.$set(this.new_content.agentlist, this.dragIndex, temp)
        },
        save(){
            this.clearInValid()

            this.new_content.virtualagentname = this.new_content.virtualagentname.trim().toUpperCase()

            if(this.new_content.virtualagentname.length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else if(this.new_content.maximumjob.toString().trim() === '' || isNaN(this.new_content.maximumjob) || 
                        (this.new_content.maximumjob <1 || this.new_content.maximumjob >2048)){
                this.inputClassList.maxjobs.splice(2, 1, 'w3-red')
            }else{
                this.new_content.activate = Number(this.new_content.activate)
                
                if(this.jcsAgentUids.length <= 0){
                    let newStatus = {
                        "msg": "Agent List can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }else{
                    let new_agentlist = []
                    for(let i=0;i<this.new_content.agentlist.length;i++){
                        if(this.new_content.agentlist[i].agentuid){
                            //補agent name給list, 這是為了回傳回來的list資料中, 讓agent name不為null
                            this.new_content.agentlist[i].agentname = this.jcsAgentMap.get(this.new_content.agentlist[i].agentuid)
                            //把virtualagentuid設為null值, 因為後端不需要這個值, 減少傳輸量
                            this.new_content.agentlist[i].virtualagentuid = null
                            //activate value must be cast to integer 0 or 1
                            this.new_content.agentlist[i].activate = Number(this.new_content.agentlist[i].activate)
                            //重新取得按照UI次序之seq之值
                            this.new_content.agentlist[i].seq = i + 1

                            new_agentlist.push(this.new_content.agentlist[i])
                        }
                    }
                    this.new_content.agentlist = []
                    this.new_content.agentlist = new_agentlist
                    return this.new_content
                }
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.virtualagentuid = this.content.virtualagentuid
            this.new_content.virtualagentname = this.content.virtualagentname
            this.new_content.description = this.content.description
            this.new_content.maximumjob = this.content.maximumjob
            this.new_content.activate = Number(this.content.activate)
            this.new_content.mode = this.content.mode
            //Reset Clone agentlist
            this.cloneAgentList()
        },
        cloneAgentList(){
            //for reset method, keep jcsAgentUids's size is equals to Original size
            this.jcsAgentUids = new Array(this.content.agentlist.length)

            //Create a new array from this.content.agentlist, Avoid array to call by reference.
            this.new_content.agentlist = new Array(this.content.agentlist.length)
            /*
                Copy all new objs from this.content.agentlist's objs into this.new_content.agentlist
                Avoid objs to call by reference.
            */
            for (var i = 0, len = this.content.agentlist.length; i < len; i++) {
                this.new_content.agentlist[i] = {
                    virtualagentuid: this.content.agentlist[i].virtualagentuid,
                    agentuid: this.content.agentlist[i].agentuid,
                    activate: Number(this.content.agentlist[i].activate),
                    description: this.content.agentlist[i].description,
                    seq: this.content.agentlist[i].seq
                };
            }
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.maxjobs.splice(2, 1)
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
