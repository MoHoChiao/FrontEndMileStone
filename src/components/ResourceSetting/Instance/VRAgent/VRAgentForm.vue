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
            <div class="w3-col m4">
                <input :class="inputClassList.maxjobs" v-model="new_content.maximumjob" type="number" placeholder="Please Input 1~2048">
            </div>
            <div class="w3-col m5 w3-right">
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
            }
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