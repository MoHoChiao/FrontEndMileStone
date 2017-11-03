<template>
<div>
  <file-source-add-window :windowAlive="addWindowAlive" 
                    window-title="Add Virtual Agent" 
                    @closeAdd="changeAddWindowStatus" 
  ></file-source-add-window>
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="selectedRecord.fscategoryname" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus"
                    btn-color="signal-white" 
                    @closeDelete="closeDeleteWindow" 
                    @confirmDelete="deleteCategory" 
  ></confirm-delete-window>
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <h6 class="w3-opacity">The current path is as follows :</h6>
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> File Source</i>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div class="w3-small">
                    <span><img src="/src/assets/images/resource_setter/filesource_category.png" alt="File Source Category" class="w3-margin-right w3-left w3-hide-small" style="height32px;width:32px"></span>
                    <span class="w3-large">All Categories</span>
                    <i v-if="isApplyFilter" class="fa fa-toggle-on w3-button w3-right" title="Cancel filter" aria-hidden="true" @click="changeApplyFilter()"></i></button>
                    <i v-else class="fa fa-toggle-off w3-button w3-right" title="Apply Filter" aria-hidden="true" @click="changeApplyFilter()"></i></button>
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete File Source Category" aria-hidden="true" @click="showDeleteWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit File Source Category" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add File Source Category" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getCategories"></i>
                </div>
            </p>
            <p>
              <div>
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center" width="32%">Name</th>
                            <th class="w3-center" width="46%">Description</th>
                            <th class="w3-center" width="22%">Update Time</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px">
                    <table class="w3-table-all w3-small">
                        <tr :id="content.fscategoryuid" :key="content.fscategoryuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnCategory(content.fscategoryuid, index)" v-for="(content, index) in allDataObjs">
                            <td class="w3-center" width="32%">
                                <span>{{ content.fscategoryname }}</span>
                            </td>
                            <td width="46%">
                                <span>{{ content.description }}</span>
                            </td>
                            <td class="w3-center" width="22%">
                                <span>{{ content.lastupdatetime }}</span>
                            </td>
                        </tr>
                    </table>
                </div>
              </div>
            </p>
        </div>
    </div>
  </div>
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getCategories"></filter-panel>
</div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import FilterPanel from '../../FilterPanel.vue'
import FileSourceAddWindow from './FileSourceAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import CheckBoxIcon from '../../../Common/form/CheckBoxIcon.vue'

export default {
    data() {
        return {
            isApplyFilter: true, //switch content list or table list
            selectedRecord: new Object(),
            addWindowAlive: false,  //for add virtual agent modal windows
            deleteWindowAlive: false,  //for delete virtual agent modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allDataObjs: new Object(), //store all remote data
            editable: [],   //for all virtual agents content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "fscategoryname"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "fscategoryname"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getCategories()
    },
    methods: {
        clickOnCategory(id, index){
            let tr = document.getElementById(id)

            for(var i=0;i<tr.parentElement.childNodes.length;i++){  //先重設所有category row的class
                if(tr.parentElement.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    tr.parentElement.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedRecord = this.allDataObjs[index]
                this.selectedRecord.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                this.selectedRecord = ''
            }
        },
        getCategories(e){
            if(!this.isApplyFilter)
                return

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

            HTTPRepo.post(`file-source-category/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allDataObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allDataObjs = response.data
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
        deleteCategory(){
            HTTPRepo.get(`file-source-category/delete`, {
                params: {
                    uid: this.selectedRecord.fscategoryuid
                }
            })
            .then(response => {
                this.allDataObjs.splice(this.selectedRecord.index, 1)
                this.selectedRecord = ''
                this.closeDeleteWindow()
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
        changeApplyFilter(){
            this.isApplyFilter = !this.isApplyFilter
        },
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            if(content !== undefined){
                this.allDataObjs.unshift(content) //add object to the top of array
            }
        },
        showDeleteWindow(){
            if( (this.selectedRecord.index || this.selectedRecord.index === 0) 
                 && this.selectedRecord.fscategoryuid && this.selectedRecord.fscategoryuid !== ''
                 && this.selectedRecord.fscategoryname && this.selectedRecord.fscategoryname !== '')
                this.deleteWindowAlive = true
        },
        closeDeleteWindow(){
            this.deleteWindowAlive = false
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'file-source-add-window': FileSourceAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'check-box-icon': CheckBoxIcon
    }
}
</script>

