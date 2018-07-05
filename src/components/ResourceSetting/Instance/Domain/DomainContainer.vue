<template>
<div>
  <domain-add-window :windowAlive="addWindowAlive" 
                    window-title="Add Domain" 
                    @closeAdd="saveAddWindowContent" 
                    :content="copyContent" 
  ></domain-add-window>
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeDelete="changeDeleteWindowStatus" 
                    @confirmDelete="deleteDomain" 
  ></confirm-delete-window>
  <router-view name="content">
  <!--Global Domain組件內容會在這裡渲染-->
  </router-view>
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Domain</i>
                        <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i></button>
                        <i class="fa fa-plus w3-button w3-right" title="Add Domain" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getDomains"></i></button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showMode">
        <div :key="content.domainuid+'content'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allDomainObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/domain.png" alt="Domain" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>
                    <i v-if="content.domainuid.trim() === 'global'" class="fa fa-globe fa-fw w3-text-blue"></i>
                    {{ content.name }}
                </p>
                <br>
                <var-resource-panel :domainuid="content.domainuid" :domainVars="content.domainVars" :domainResources="content.domainResources" :viewMode="true"></var-resource-panel>
                <hr class="w3-border-black w3-clear">
                <p class="w3-small">{{ content.description }}</p>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeAddWindowStatus(content)">
                    <i class="fa fa-clone"></i> Copy</button>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i> Edit</button>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.domainuid, content.name)">
                    <i class="fa fa-trash-o"></i> Delete</button>
            </div>
            <domain-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></domain-edit-panel>
        </div>
    </div>
    <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
        <li :key="content.domainuid+'table'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allDomainObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/domain.png" alt="Domain" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.name }}</p>
                <button type="button" title="Delete This Domain" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.domainuid, content.name)">
                    <i class="fa fa-trash-o"></i>
                    <span class="w3-hide-medium w3-hide-small"> Delete</span>
                </button>
                <button type="button" title="Edit This Domain" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i>
                    <span class="w3-hide-medium w3-hide-small"> Edit</span>
                </button>
                <button type="button" title="Copy This Domain" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeAddWindowStatus(content)">
                    <i class="fa fa-clone"></i>
                    <span class="w3-hide-medium w3-hide-small"> Copy</span>
                </button>
            </div>
            <domain-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></domain-edit-panel>
        </li>
    </ul>

  </div>
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getDomains"></filter-panel>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import DomainEditPanel from './DomainEditPanel.vue'
import DomainAddWindow from './DomainAddWindow.vue'
import VarAndResourcePanel from './VarAndResourcePanel.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add domain modal windows
            deleteWindowAlive: false,  //for delete domain modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allDomainObjs: new Object(), //store all domain
            editable: [],   //for all domain content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "name"},
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "name"},
                {name: "Desc",value: "Description"}
            ],
            copyContent: undefined   //for copy click, pass copyContent to Add Window
        }
    },
    mounted() {
        this.getDomains()
    },
    methods: {
        getDomains(e){
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

            HTTP_TRINITY.post(`domain/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allDomainObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allDomainObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
            })
            .catch(error => {
                if(e){
                    if(e.target.title === 'Apply Order')
                        this.$refs.filter.isOrder = true
                    else if(e.target.title === 'Apply Query')
                        this.$refs.filter.isQuery = true
                    else if(e.target.title === 'Cancel Order')
                        this.$refs.filter.isOrder = false
                    else if(e.target.title === 'Cancel Query')
                        this.$refs.filter.isQuery = false
                }

                errorHandle(this.$store, error)
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
                this.allDomainObjs[index] = content
            }
        },
        deleteDomain(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            if(this.deleteUid.trim().toUpperCase() === 'DEFAULT'){
                let newStatus = {
                    "msg": "Default Domain can not be reomved!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
                return
            }

            if(this.deleteUid.trim().toUpperCase() === 'GLOBAL'){
                let newStatus = {
                    "msg": "Global Domain can not be removed!",
                    "status": "Warn"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
                return
            }

            HTTP_TRINITY.get(`domain/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allDomainObjs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '', '')
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
            
        },
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeAddWindowStatus(old_content){
            this.addWindowAlive = !this.addWindowAlive  //change add window open/close
            if(old_content){    //old_content !== undefined, it means from Copy Click
                this.copyContent = new Object()
                this.copyContent.name = ''
                this.copyContent.description = ''
                this.copyContent.domainVars = old_content.domainVars
                this.copyContent.domainResources = old_content.domainResources
            }
        },
        saveAddWindowContent(new_content){
            this.copyContent = undefined //Reset Add Window Content is empty
            this.changeAddWindowStatus()    //Add Window open/close

            if(new_content){    //new_content !== undefined, it means from Add Window Save Click
                this.allDomainObjs.unshift(new_content) //add object to the top of array
                this.editable.fill(false) //close all edit form
            }
        },
        changeDeleteWindowStatus(index, domainuid, domainname){
            this.deleteWindowAlive = !this.deleteWindowAlive
            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = domainuid
            this.deleteName = domainname
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'domain-edit-panel': DomainEditPanel,
        'domain-add-window': DomainAddWindow,
        'var-resource-panel': VarAndResourcePanel,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>

