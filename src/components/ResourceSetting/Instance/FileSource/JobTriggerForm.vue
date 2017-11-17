<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2">&nbsp;</div>
            <div class="w3-col m8">
                <input class="w3-check" v-model="new_content.filetrigger" type="checkbox">
                <label>File Trigger</label>
            </div>
            <div class="w3-col m2">&nbsp;</div>
        </div>
        <div v-if="new_content.filetrigger" class="w3-row-padding w3-section">
            <div class="w3-third">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center">Entity Name</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;max-height:300px">
                    <table id="entityTable" class="w3-table-all w3-small">
                        <tr :id="entity.busentityuid" :key="entity.busentityuid" class="w3-hover-blue-grey w3-hover-opacity" v-for="(entity, index) in entities">
                            <td class="w3-center">
                                <span>{{ entity.busentityname }}</span>
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
                filename: ['w3-input','w3-border'],
                startposition: ['w3-input','w3-border'],
                endposition: ['w3-input','w3-border'],
                checksumfe: ['w3-input','w3-border'],
                minfile: ['w3-input','w3-border'],
                maxfile: ['w3-input','w3-border'],
                timeout: ['w3-input','w3-border'],
                ftpremotedir: ['w3-input','w3-border'],
                ftpmovedir: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                filetrigger: this.content.filetrigger,
                txdateformat: this.content.txdateformat,
                triggerjobuid: this.content.triggerjobuid,
                txdateendpos: this.content.txdateendpos,
                txdatestartpos: this.content.txdatestartpos
            },
            cfs: [],    //store all Implementation Class and display name
            entities: []
        }
    },
    mounted() {        
        //Fetch all business entities objs is above
        let params = {
            "ordering":{
                "orderType":"ASC",
                "orderField":"busentityname"
            }
        }
        HTTPRepo.post(`busentity/findByFilter`, params)
            .then(response => {
                this.entities = response.data
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
                    filetrigger: 0,

                }
            }
        },
        index: Number
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.agentname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.host.trim().length <= 0){
                this.inputClassList.host.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.port.toString().trim() === '' || isNaN(this.new_content.port)){
                this.inputClassList.port.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.cpuweight.toString().trim() === '' || isNaN(this.new_content.cpuweight)){
                this.inputClassList.cpu.splice(2, 1, 'w3-text-red')
            }else if(this.new_content.memweight.toString().trim() === '' || isNaN(this.new_content.memweight)){
                this.inputClassList.mem.splice(2, 1, 'w3-text-red')
            }else{
                this.new_content.activate = Number(this.new_content.activate)
                this.new_content.compresstransfer = Number(this.new_content.compresstransfer)
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.agentuid = this.content.agentuid
            this.new_content.agentname = this.content.agentname
            this.new_content.description = this.content.description
            this.new_content.host = this.content.host
            this.new_content.port = this.content.port
            this.new_content.maximumjob = this.content.maximumjob
            this.new_content.activate = Number(this.content.activate)
            this.new_content.ostype = this.content.ostype
            this.new_content.osname = this.content.osname
            this.new_content.deadperiod = this.content.deadperiod
            this.new_content.memweight = this.content.memweight
            this.new_content.compresstransfer = Number(this.content.compresstransfer)
            this.new_content.encoding = this.content.encoding
            this.new_content.monitortime = this.content.monitortime
            this.new_content.cpuweight = this.content.cpuweight
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.host.splice(2, 1)
            this.inputClassList.port.splice(2, 1)
            this.inputClassList.cpu.splice(2, 1)
            this.inputClassList.mem.splice(2, 1)
        }
    }
}
</script>
<style scoped>
    input,select {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>