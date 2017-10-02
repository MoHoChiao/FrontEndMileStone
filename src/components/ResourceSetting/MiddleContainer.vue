<template>
<div>
  <add-modal-window v-if="windowAlive" 
                    window-title="Add JCS Agent" 
                    @closeAdd="changeWindowStatus" 
  ></add-modal-window>
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <h6 class="w3-opacity">The current path is as follows :</h6>
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> JCSAgent</i>
                        <i class="fa fa-list-alt w3-button w3-right" title="Table List" aria-hidden="true"></i></button>
                        <i class="fa fa-list w3-button w3-right" title="Content List" aria-hidden="true"></i>
                        <i class="fa fa-plus w3-button w3-right" title="Add Agent" aria-hidden="true" @click="changeWindowStatus()"></i>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getAgents"></i></button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in objs">
        <div v-if="editable[index] === undefined || !editable[index]">
            <img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right" style="height:48px;width:48px">
            <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
            <p>{{ content.agentname }}</p>
            <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ 'Host:' + content.host }}</span>
            <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ 'Port:' + content.port }}</span>
            <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
            <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
            <hr class="w3-border-black w3-clear">
            <p class="w3-small">{{ content.description }}</p>
            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)"><i class="fa fa-pencil"></i> Edit</button>
            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="deleteAgent(index, content.agentuid)"><i class="fa fa-trash-o"></i> Delete</button>
        </div>
        <agent-edit v-else :index="index" :content="content" @closeEdit="changeEditable"></agent-edit>
    </div>
  </div>
  <filter-container ref="filter" @fromFilter="getAgents"></filter-container>
</div>
</template>
<script>
import { HTTPRepo } from '../../axios/http-common'
import FilterContainer from './FilterContainer.vue'
import JCSAgentEdit from './JCSAgentEdit.vue'
import AddModalWindow from './AddModalWindow.vue'

export default {
    data() {
        return {
            windowAlive: false,
            objs: new Object(),
            editable: [],
        }
    },
    mounted() {
        this.getAgents()
    },
    methods: {
        getAgents(e){
            let params = {
                "paging":{
                    "number":this.$refs.filter.selectedNum,
                    "size":this.$refs.filter.selectedSize
                }
            }
            
            if(this.$refs.filter.isOrder){
                params.ordering = {
                    "orderType":this.$refs.filter.orderType,
                    "orderField":this.$refs.filter.orderField
                }
            }

            if(this.$refs.filter.isQuery){
                params.querying = {
                    "queryType":this.$refs.filter.queryType,
                    "queryField":this.$refs.filter.queryField,
                    "queryString":this.$refs.filter.queryString,
                    "ignoreCase":this.$refs.filter.ignoreCase
                }
            }

            HTTPRepo.post(`jcsagent/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.objs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.objs = response.data
                    this.$refs.filter.totalPages = 1
                }
            })
            .catch(error => {
                if(e.target.title === 'Apply Order')
                    this.$refs.filter.isOrder = true
                else if(e.target.title === 'Apply Query')
                    this.$refs.filter.isQuery = true
                else if(e.target.title === 'Cancel Order')
                    this.$refs.filter.isOrder = false
                else if(e.target.title === 'Cancel Query')
                    this.$refs.filter.isQuery = false

                if (error.response) {
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
        changeEditable(index, content){
            /*
                this.$set is for above :
                http://www.jianshu.com/p/358c1974d9a5
                https://jsfiddle.net/qnq2munr/2/
            */
            if(this.editable[index] === undefined){
                this.$set(this.editable, index, true) 
            }else{
                this.$set(this.editable, index, !this.editable[index])
            }

            if(content !== undefined){
                this.objs[index] = content
            }
        },
        deleteAgent(index, agentuid){
            HTTPRepo.get(`jcsagent/delete`, {
                params: {
                    agentuid: agentuid
                }
            })
            .then(response => {
                this.objs.splice(index, 1)
                this.editable.splice(index, 1)
            })
            .catch(error => {
                if (error.response) {
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
        changeWindowStatus(content){
            this.windowAlive = !this.windowAlive
            this.editable
            if(content !== undefined){
                this.objs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        }
    },
    components: {
        'filter-container': FilterContainer,
        'agent-edit': JCSAgentEdit,
        'add-modal-window': AddModalWindow
    }
}
</script>

