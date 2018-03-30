<template>
<div>
  <!-- For Add/Edit Category Window -->
  <file-source-category-edit-window :windowAlive="editCategoryWindowAlive" 
                    window-title="Edit File Source Category" 
                    @closeAdd="saveCategoryWindowContentForAdd" 
                    @closeEdit="saveCategoryWindowContentForEdit" 
                    :content="selectedCategoryRecord" 
                    :urlOp="operation" 
  ></file-source-category-edit-window>
  <!-- For Add/Edit File Source Window -->
  <file-source-edit-window :windowAlive="editFileSourceWindowAlive" 
                    @closeAdd="saveFileSourceWindowContentForAdd" 
                    @closeEdit="saveFileSourceWindowContentForEdit" 
                    @closeCopy="saveFileSourceWindowContentForCopy" 
                    @closeMove="saveFileSourceWindowContentForMove" 
                    :content="selectedFileSourceRecord" 
                    :selectedCategoryRecord="selectedCategoryRecord" 
                    :urlOp="operation" 
  ></file-source-edit-window>
  <!-- For Delete Confirm Window -->
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus"
                    btn-color="signal-white" 
                    @closeDelete="closeDeleteWindow" 
                    @confirmDelete="deleteObj" 
  ></confirm-delete-window>
  <!-- File Source Path Header -->
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> File Source</i>
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
                    <span><img src="/src/assets/images/resource_setter/filesource_category.png" alt="File Source Category" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                    <span class="w3-medium">All Categories</span>
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete File Source Category" aria-hidden="true" @click="showDeleteCategoryWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit File Source Category" aria-hidden="true" @click="changeCategoryWindowStatus('edit')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add File Source Category" aria-hidden="true" @click="changeCategoryWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload File Source Category" aria-hidden="true" @click="getCategories"></i>
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
                <div id="categoryContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:107px">
                    <table id="categoryTable" class="w3-table-all w3-small">
                        <template v-for="(content, index) in allCategoryObjs">
                        <tr :id="content.fscategoryuid" :key="content.fscategoryuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnCategory(content.fscategoryuid, index)">
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
                        </template>
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
                    <span><img src="/src/assets/images/resource_setter/filesource.png" alt="File Source" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                    <span v-if="selectedCategoryRecord && selectedCategoryRecord.fscategoryname">
                        <span class="w3-medium">File Sources</span> ({{ selectedCategoryRecord.fscategoryname }})</span>
                    <span v-else class="w3-medium">File Sources</span>
                    <span class="w3-dropdown-hover w3-right w3-hide-large">
                        <i class="fa fa-bars w3-button" title="Copy/Move/Edit/Delete" aria-hidden="true"></i>
                        <div class="w3-dropdown-content w3-card-4 w3-bar-block">
                            <i class="w3-bar-item fa fa-clone w3-button" title="Copy File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('copy')"> Copy File Source</i>
                            <i class="w3-bar-item fa fa-clipboard w3-button" title="Move File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('move')"> Move File Source</i>
                            <i class="w3-bar-item fa fa-pencil w3-button" title="Edit File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('edit')"> Edit File Source</i>
                            <i class="w3-bar-item fa fa-trash-o w3-button" title="Delete File Source" aria-hidden="true" @click="showDeleteFileSourceWindow"> Delete File Source</i>
                        </div>
                    </span>
                    <i class="fa fa-trash-o w3-button w3-right w3-hide-medium w3-hide-small" title="Delete File Source" aria-hidden="true" @click="showDeleteFileSourceWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right w3-hide-medium w3-hide-small" title="Edit File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('edit')"></i>
                    <i class="fa fa-clipboard w3-button w3-right w3-hide-medium w3-hide-small" title="Move File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('move')"></i>
                    <i class="fa fa-clone w3-button w3-right w3-hide-medium w3-hide-small" title="Copy File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('copy')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add File Source" aria-hidden="true" @click="changeFileSourceWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload File Source" aria-hidden="true" @click="getFileSources"></i>
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
                <div id="filesourceContainer" class="w3-responsive w3-card w3-round" style="min-height:350px">
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
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getFileSources"></filter-panel>
</div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import FilterPanel from '../../FilterPanel.vue'
import FileSourceCategoryEditWindow from './FileSourceCategory/FileSourceCategoryEditWindow.vue'
import FileSourceEditWindow from './FileSourceEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            selectedCategoryRecord: new Object(),   //store which record has been selected.(File Source Categories)
            selectedFileSourceRecord: new Object(),   //store which record has been selected.(File Sources)
            editCategoryWindowAlive: false,  //for add/edit file source category modal windows
            editFileSourceWindowAlive: false,  //for add/edit file source modal windows
            operation: 'add',   //keep which operation(add,edit,copy,move) will be execute
            deleteWindowAlive: false,  //show or not show delete modal windows
            deleteName: '', //store delete object name
            deleteWhich: '', //store delete Category or FileSource
            allCategoryObjs: new Object(), //store all remote data.(File Source Categories)
            allFileSourceObjs: new Object(), //store all remote data.(File Sources)
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "filesourcename"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "filesourcename"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getCategories()
        // this.getFileSources()    //不需要, 因為getCategories()裡就會呼叫到getFileSources()
    },
    methods: {
        /*
         * Above For All About Click Table Row Function
        */
        clickOnCategory(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedCategoryRecord(tr)
            this.clearSelectedFileSourceRecord()
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedCategoryRecord = this.allCategoryObjs[index]
                this.selectedCategoryRecord.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.$refs.filter.pageNumSelected('1')  //每次'點擊'category刷新時, 重載filesources都讓filter的page number回到第一頁
            this.getFileSources()   //refresh file sources content
        },
        clickOnFileSource(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedFileSourceRecord(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedFileSourceRecord = this.allFileSourceObjs[index]
                this.selectedFileSourceRecord.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },

        /*
         * Above For All About Fetch Data Function
        */
        getCategories(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"fscategoryname"
                }
            }

            HTTPRepo.post(`file-source-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data

                this.clearSelectedCategoryRecord()
                this.clearSelectedFileSourceRecord()
                this.$refs.filter.pageNumSelected('1')  //每次category刷新時, 重載filesources都讓filter的page number回到第一頁
                this.getFileSources()   //refresh file sources content
                
                /*
                 * if fetch category records success, scroll to top
                */
                let categoryContainer = this.$el.querySelector("#categoryContainer")
                categoryContainer.scrollTop = -categoryContainer.scrollHeight
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
        getFileSources(e){
            let urlPath = 'file-source/findByFilter?categoryUid='
            if(this.selectedCategoryRecord && this.selectedCategoryRecord.fscategoryuid && this.selectedCategoryRecord.fscategoryuid !== '')
                urlPath += this.selectedCategoryRecord.fscategoryuid
            
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
            
            HTTPRepo.post(urlPath, params)
            .then(response => {
                if (response.data.content !== undefined) {
                    this.allFileSourceObjs = response.data.content
                    if(response.data.totalPages <= 0)
                        response.data.totalPages = 1
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allFileSourceObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
                this.clearSelectedFileSourceRecord()
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

        /*
         * Above For All About Add/Edit/Copy/Move Function
        */
        changeCategoryWindowStatus(which){
            if(which === 'add'){
                this.operation = which
                this.editCategoryWindowAlive = !this.editCategoryWindowAlive
            }else{
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.fscategoryuid && this.selectedCategoryRecord.fscategoryuid !== ''){
                    this.operation = which
                    this.editCategoryWindowAlive = !this.editCategoryWindowAlive
                }
            }
        },
        changeFileSourceWindowStatus(which){
            if(which != 'add'){
                if(this.selectedFileSourceRecord && this.selectedFileSourceRecord.filesourceuid && this.selectedFileSourceRecord.filesourceuid !== ''){
                    this.operation = which
                    this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
                }
            }else{
                this.operation = which
                this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
            } 
        },
        saveCategoryWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from File Source Category Window Save Click
                this.allCategoryObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedCategoryRecord()
                this.getFileSources()   //refresh file sources content

                /*
                 * if add category record success, scroll to top
                */
                let categoryContainer = this.$el.querySelector("#categoryContainer")
                categoryContainer.scrollTop = -categoryContainer.scrollHeight
            }
            this.editCategoryWindowAlive = !this.editCategoryWindowAlive
        },
        saveCategoryWindowContentForEdit(new_content){
            //new_content !== undefined, it means from File Source Category Window Save Click
            if(new_content && this.selectedCategoryRecord && (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)){
                new_content.index = this.selectedCategoryRecord.index   //asign old index prop to new content
                this.allCategoryObjs[this.selectedCategoryRecord.index] = new_content   //replace object to the array
                this.selectedCategoryRecord = new_content
            }
            this.editCategoryWindowAlive = !this.editCategoryWindowAlive
        },
        saveFileSourceWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from File Source Window Save Click
                this.allFileSourceObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedFileSourceRecord()
            }
            this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
        },
        saveFileSourceWindowContentForEdit(new_content){
            //new_content !== undefined, it means from File Source Window Save Click
            if(new_content && this.selectedFileSourceRecord && (this.selectedFileSourceRecord.index || this.selectedFileSourceRecord.index === 0)){
                new_content.index = this.selectedFileSourceRecord.index   //asign old index prop to new content
                this.allFileSourceObjs[this.selectedFileSourceRecord.index] = new_content   //replace object to the array
                this.selectedFileSourceRecord = new_content
            }
            this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
        },
        saveFileSourceWindowContentForCopy(fscategoryuid, new_content){
            if(new_content){    //new_content !== undefined, it means from File Source Window Save Click
                //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆filesource
                if(this.selectedCategoryRecord.fscategoryuid === fscategoryuid){
                    this.allFileSourceObjs.unshift(new_content) //add object to the top of array
                }
                this.clearSelectedFileSourceRecord()
            }
            this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
        },
        saveFileSourceWindowContentForMove(fscategoryuid, new_content){
            //new_content !== undefined, it means from File Source Window Save Click
            if(new_content && this.selectedFileSourceRecord && (this.selectedFileSourceRecord.index || this.selectedFileSourceRecord.index === 0)){
                if(this.selectedCategoryRecord.fscategoryuid === fscategoryuid){
                    new_content.index = this.selectedFileSourceRecord.index   //asign old index prop to new content
                    this.allFileSourceObjs[this.selectedFileSourceRecord.index] = new_content   //replace object to the array
                    this.selectedFileSourceRecord = new_content
                }else{
                    this.allFileSourceObjs.splice(this.selectedFileSourceRecord.index, 1)
                    this.clearSelectedFileSourceRecord()
                }
            }
            this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
        },

        /*
         * Above For All About Delete Function
        */
        deleteObj(){
            if(this.deleteWhich === 'Category')
                this.deleteCategory()
            else
                this.deleteFileSource()
        },
        deleteCategory(){
            HTTPRepo.get(`file-source-category/delete`, {
                params: {
                    uid: this.selectedCategoryRecord.fscategoryuid
                }
            })
            .then(response => {
                this.allCategoryObjs.splice(this.selectedCategoryRecord.index, 1)
                this.clearSelectedCategoryRecord()
                this.closeDeleteWindow()
                this.getFileSources()   //refresh file sources content
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
        deleteFileSource(){
            HTTPRepo.get(`file-source/delete`, {
                params: {
                    uid: this.selectedFileSourceRecord.filesourceuid
                }
            })
            .then(response => {
                this.allFileSourceObjs.splice(this.selectedFileSourceRecord.index, 1)
                this.clearSelectedFileSourceRecord()
                this.closeDeleteWindow()
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
        showDeleteCategoryWindow(){
            if( (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0) 
                    && this.selectedCategoryRecord.fscategoryname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedCategoryRecord.fscategoryname
                this.deleteWhich = 'Category'
            }
        },
        showDeleteFileSourceWindow(){
            if( (this.selectedFileSourceRecord.index || this.selectedFileSourceRecord.index === 0) 
                    && this.selectedFileSourceRecord.filesourcename) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedFileSourceRecord.filesourcename
                this.deleteWhich = 'FileSource'
            }
        },
        closeDeleteWindow(){
            this.deleteWindowAlive = false
        },

        /*
         * Above For All About Util Function
        */
        clearSelectedCategoryRecord(tr){
            let table = document.getElementById('categoryTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有category row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedCategoryRecord = new Object()
        },
        clearSelectedFileSourceRecord(tr){
            let table = document.getElementById('filesourceTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有filesource row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedFileSourceRecord = new Object()
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'file-source-category-edit-window': FileSourceCategoryEditWindow,
        'file-source-edit-window': FileSourceEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>

