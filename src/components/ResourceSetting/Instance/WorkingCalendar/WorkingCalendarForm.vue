<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.wcalendarname" type="text" maxlength="32" placeholder="Please Input Name">
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
            <div class="w3-col m12">

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
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                wcalendaruid: this.content.wcalendaruid,
                wcalendarname: this.content.wcalendarname,
                description: this.content.description,
                activate: Number(this.content.activate),
                wcalendarlist: null
            }
        }
    },
    mounted() {
        
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    wcalendaruid: '',
                    wcalendarname: '',
                    description: '',
                    activate: '0',
                    wcalendarlist: []
                }
            }
        },
        index: Number
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.wcalendarname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else{
                this.new_content.activate = Number(this.new_content.activate)
                return this.new_content
            }
                // if(this.jcsAgentUids.length <= 0){
                //     let newStatus = {
                //         "msg": "Agent List can not be empty!",
                //         "status": "Warn"
                //     }
                //     this.$store.dispatch('setSystemStatus', newStatus)
                // }else{
                //     this.new_content.agentlist.forEach(function(element) {  //activate value must be cast to integer 0 or 1
                //         element.activate = Number(element.activate)
                //     });
                //     return this.new_content
                // }
        },
        reset(){
            this.clearInValid()
            
            this.new_content.wcalendaruid = this.content.wcalendaruid
            this.new_content.wcalendarname = this.content.wcalendarname
            this.new_content.description = this.content.description
            this.new_content.activate = Number(this.content.activate)
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
        }
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>
