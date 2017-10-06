<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.virtualagentname" type="text" maxlength="32" placeholder="Please Input Name">
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
                <label class="w3-right">Max Jobs</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.maxjobs" v-model="new_content.maximumjob" type="number" placeholder="Please Input 1~2048">
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
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:300px;">
                    <table class="w3-table-all">
                        <tr class="w3-blue-grey">
                            <th class="w3-center" width="7%" style="padding-top:18px">Seq</th>
                            <th class="w3-center" width="30%" style="padding-top:18px">Name</th>
                            <th class="w3-center" width="10%" style="padding-top:18px">Activate</th>
                            <th class="w3-center" width="45%" style="padding-top:18px">Description</th>
                            <th class="w3-center" width="8%">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Content/Table List Switch" aria-hidden="true" @click="changeShowMode()"></i>
                            </th>
                        </tr>
                        <tr class="w3-hover-blue-grey w3-hover-opacity" draggable="true" @dragover.prevent @drag="drag(index)" @drop="drop(index)" v-for="(content, index) in testlist">
                            <td style="padding-top:13px">{{ index + 1 }}</td>
                            <td style="padding-top:13px">
                                <span>{{ content.name }}</span>
                            </td>
                            <td class="w3-center">
                                <input class="w3-check" style="height:16px" type="checkbox" v-model="content.activate">
                            </td>
                            <td style="padding-top:13px" @dblclick="descDbclick(index)">
                                <span v-if="content.descEditable" @mouseout="descMouseout(index)"><input class="w3-input w3-border" style="height:30px" v-model="content.desc" type="text" maxlength="255" placeholder="Please Input Description"></span>
                                <span v-else>{{ content.desc }}</span>
                            </td>
                            <td class="w3-center">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true"></i>
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
                mode: this.content.mode
            },
            dragIndex: 0,
            testlist: [
                {name: "agent1", activate: 1, desc: "this. is agent1"},
                {name: "agent2", activate: 0, desc: "this. is agent2"},
                {name: "agent3", activate: 1, desc: "this. is agent3"}
            ]
        }
    },
    computed: {
        _classList() {
            return {
                name:  ['w3-input','w3-border']
            };
        },
        _invalidClassList() {
            return [
                'w3-input',
                'w3-border',
                'w3-text-red'
            ];
        }
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
                    mode: '0'
                }
            }
        },
        index: Number
    },
    methods: {
        drag(index){
            this.dragIndex = index
        },
        drop(index){
            if (this.testlist.length === 1) 
                return

            var temp = this.testlist[index];
            /*
                this.$set is for above :
                http://www.jianshu.com/p/358c1974d9a5
                https://jsfiddle.net/qnq2munr/2/
            */
            this.$set(this.testlist, index, this.testlist[this.dragIndex])
            this.$set(this.testlist, this.dragIndex, temp)
        },
        descDbclick(index){
            this.$set(this.testlist[index], 'descEditable', true)
        },
        descMouseout(index){
            this.$set(this.testlist[index], 'descEditable', false)
        },
        save(){
            this.clearInValid()

            if(this.new_content.virtualagentname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.maximumjob.toString().trim() === '' || isNaN(this.new_content.maximumjob) || 
                        (this.new_content.maximumjob <1 || this.new_content.maximumjob >2048)){
                this.inputClassList.maxjobs.splice(2, 1, 'w3-text-red')
            }else{
                this.new_content.activate = Number(this.new_content.activate)
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.virtualagentuid = this.content.virtualagentuid,
            this.new_content.virtualagentname = this.content.virtualagentname,
            this.new_content.description = this.content.description,
            this.new_content.maximumjob = this.content.maximumjob,
            this.new_content.activate = Number(this.content.activate),
            this.new_content.mode = this.content.mode
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.maxjobs.splice(2, 1)
        }
    }
}
</script>
<style scoped>
    th {
        padding-top:13px
    }
</style>
