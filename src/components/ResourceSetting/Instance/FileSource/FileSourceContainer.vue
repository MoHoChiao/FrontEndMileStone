<template>
<div>
  <!-- For Add or Edit Window -->
  <file-source-category-edit-window :windowAlive="editWindowAlive" 
                    window-title="Add File Source Category" 
                    @closeAdd="saveWindowContentForAdd" 
                     @closeEdit="saveWindowContentForEdit" 
                    :content="selectedCategoryRecords" 
  ></file-source-category-edit-window>
  <!-- For Delete Confirm Window -->
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="selectedCategoryRecords.fscategoryname" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus"
                    btn-color="signal-white" 
                    @closeDelete="closeDeleteWindow" 
                    @confirmDelete="deleteCategory" 
  ></confirm-delete-window>
  <!-- File Source Path Header -->
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
    <!-- File Source Category Panel -->
    <div>
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div class="w3-small">
                    <span><img src="/src/assets/images/resource_setter/filesource_category.png" alt="File Source Category" class="w3-margin-right w3-left w3-hide-small" style="height32px;width:32px"></span>
                    <span class="w3-large">All Categories</span>
                    <i v-if="isCategoryApplyFilter" class="fa fa-toggle-on w3-button w3-right" title="Cancel filter" aria-hidden="true" @click="changeCategoryApplyFilter()"></i></button>
                    <i v-else class="fa fa-toggle-off w3-button w3-right" title="Apply Filter" aria-hidden="true" @click="changeCategoryApplyFilter()"></i></button>
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete File Source Category" aria-hidden="true" @click="showDeleteWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit File Source Category" aria-hidden="true" @click="changeWindowStatusForEdit()"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add File Source Category" aria-hidden="true" @click="changeWindowStatusForAdd()"></i>
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
                    <table id="categoryTable" class="w3-table-all w3-small">
                        <tr :id="content.fscategoryuid" :key="content.fscategoryuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnCategory(content.fscategoryuid, index)" v-for="(content, index) in allCategoryObjs">
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
    <!-- File Source Panel -->
    <div>
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div class="w3-small">
                    <span><img src="/src/assets/images/resource_setter/filesource.png" alt="File Source" class="w3-margin-right w3-left w3-hide-small" style="height32px;width:32px"></span>
                    <span class="w3-large">File Sources</span><span> (File Sources)</span>
                    <i v-if="isFileSourceApplyFilter" class="fa fa-toggle-on w3-button w3-right" title="Cancel filter" aria-hidden="true" @click="changeFileSourceApplyFilter()"></i></button>
                    <i v-else class="fa fa-toggle-off w3-button w3-right" title="Apply Filter" aria-hidden="true" @click="changeFileSourceApplyFilter()"></i></button>
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete File Source Category" aria-hidden="true" @click="showDeleteWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit File Source Category" aria-hidden="true" @click="changeWindowStatusForEdit()"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add File Source Category" aria-hidden="true" @click="changeWindowStatusForAdd()"></i>
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
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:500px">
                    <table id="filesourceTable" class="w3-table-all w3-small">
                        <tr :id="content.filesourceuid" :key="content.filesourceuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnFileSource(content.filesourceuid, index)" v-for="(content, index) in allFileSourceObjs">
                            <td class="w3-center" width="32%">
                                <span>{{ content.filesourcename }}</span>
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
import FileSourceCategoryEditWindow from './FileSourceCategoryEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            isCategoryApplyFilter: true, //turn on/off filter function.(File Source Categories)
            isFileSourceApplyFilter: true,  //turn on/off filter function.(File Sources)
            selectedCategoryRecords: new Object(),   //store which record has been selected.(File Source Categories)
            selectedFileSourceRecords: new Object(),   //store which record has been selected.(File Sources)
            editWindowAlive: false,  //for edit file source category modal windows
            deleteWindowAlive: false,  //for delete file source category modal windows
            allCategoryObjs: new Object(), //store all remote data.(File Source Categories)
            allFileSourceObjs: new Object(), //store all remote data.(File Sources)
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
        this.getFileSources()
    },
    methods: {
        clickOnCategory(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedCategoryRecords(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedCategoryRecords = this.allCategoryObjs[index]
                this.selectedCategoryRecords.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        clickOnFileSource(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedFileSourceRecords(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedFileSourceRecords = this.allCategoryObjs[index]
                this.selectedCategoryRecords.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        getCategories(e){
            if(!this.isCategoryApplyFilter)
                return

            HTTPRepo.post(`file-source-category/findByFilter`, this.getFilterParams())
            .then(response => {
                if (response.data.content !== undefined) {
                    this.allCategoryObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allCategoryObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
            })
            .catch(error => {
                this.showErrorMsg(e, error)
            })
        },
        getFileSources(e){
            if(!this.isFileSourceApplyFilter)
                return

            HTTPRepo.post(`file-source/findByFilter`, this.getFilterParams())
            .then(response => {
                if (response.data.content !== undefined) {
                    this.allFileSourceObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allFileSourceObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
            })
            .catch(error => {
                this.showErrorMsg(e, error)
            })
        },
        getFilterParams(){
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
            return params
        },
        showErrorMsg(e, error){
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
        },
        deleteCategory(){
            HTTPRepo.get(`file-source-category/delete`, {
                params: {
                    uid: this.selectedCategoryRecords.fscategoryuid
                }
            })
            .then(response => {
                this.allCategoryObjs.splice(this.selectedCategoryRecords.index, 1)
                this.clearselectedCategoryRecords()
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
        changeCategoryApplyFilter(){
            this.isCategoryApplyFilter = !this.isCategoryApplyFilter
        },
        changeFileSourceApplyFilter(){
            this.isFileSourceApplyFilter = !this.isFileSourceApplyFilter
        },
        changeWindowStatusForAdd(){
            this.clearSelectedCategoryRecords()
            this.editWindowAlive = !this.editWindowAlive
        },
        changeWindowStatusForEdit(){
            if(this.selectedCategoryRecords && this.selectedCategoryRecords.fscategoryuid && this.selectedCategoryRecords.fscategoryuid !== ''){
                this.editWindowAlive = !this.editWindowAlive
            }
        },
        saveWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from Edit Window Save Click
                this.allCategoryObjs.unshift(new_content) //add object to the top of array
            }
            this.editWindowAlive = !this.editWindowAlive
        },
        saveWindowContentForEdit(new_content){
            if(new_content && this.selectedCategoryRecords && (this.selectedCategoryRecords.index || this.selectedCategoryRecords.index === 0)){    //new_content !== undefined, it means from Edit Window Save Click
                this.allCategoryObjs[this.selectedCategoryRecords.index] = new_content   //replace object to the array
            }
            this.clearSelectedCategoryRecords()
            this.editWindowAlive = !this.editWindowAlive
        },
        showDeleteWindow(){
            if(this.selectedCategoryRecords.index || this.selectedCategoryRecords.index === 0)
                this.deleteWindowAlive = true
        },
        closeDeleteWindow(){
            this.deleteWindowAlive = false
        },
        clearSelectedCategoryRecords(tr){
            let table = document.getElementById('categoryTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有category row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedCategoryRecords = new Object()
        },
        clearSelectedFileSourceRecords(tr){
            let table = document.getElementById('filesourceTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有category row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedFileSourceRecords = new Object()
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'file-source-category-edit-window': FileSourceCategoryEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>

