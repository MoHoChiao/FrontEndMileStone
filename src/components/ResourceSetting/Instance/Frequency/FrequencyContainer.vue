<template>
<div>
  <!-- For Add/Edit Category Window -->
  <frequency-category-edit-window v-if="editCategoryWindowAlive" :windowAlive="editCategoryWindowAlive" 
                    window-title="Edit Frequency Category" 
                    @closeAdd="saveCategoryWindowContentForAdd" 
                    @closeEdit="saveCategoryWindowContentForEdit" 
                    :content="selectedCategoryRecord" 
                    :urlOp="operation" 
  ></frequency-category-edit-window>
  <!-- For Add/Edit Frequency Window -->
  <frequency-edit-window v-if="editFrequencyWindowAlive" :windowAlive="editFrequencyWindowAlive" 
                    @closeAdd="saveFrequencyWindowContentForAdd" 
                    @closeEdit="saveFrequencyWindowContentForEdit" 
                    @closeCopy="saveFrequencyWindowContentForCopy" 
                    @closeMove="saveFrequencyWindowContentForMove" 
                    :content="selectedFrequencyRecord" 
                    :selectedCategoryRecord="selectedCategoryRecord" 
                    :urlOp="operation" 
  ></frequency-edit-window>
  <!-- For Delete Confirm Window -->
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeDelete="closeDeleteWindow" 
                    @confirmDelete="deleteObj" 
  ></confirm-delete-window>
  <!-- Frequency Path Header -->
  <div class="w3-col m9 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Frequency</i>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <!-- Frequency Category Panel -->
    <div>
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div class="w3-small">
                    <span><img src="/src/assets/images/resource_setter/frequency_category.png" alt="Frequency Category" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                    <span>
                        <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                All Categories
                            </div>
                        </div>
                    </span>
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete Frequency Category" aria-hidden="true" @click="showDeleteCategoryWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit Frequency Category" aria-hidden="true" @click="changeCategoryWindowStatus('edit')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add Frequency Category" aria-hidden="true" @click="changeCategoryWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload Frequency Category" aria-hidden="true" @click="getCategories"></i>
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
                        <tr :id="content.freqcategoryuid" :key="content.freqcategoryuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnCategory(content.freqcategoryuid, index)">
                            <td class="w3-center" width="32%">
                                <span>{{ content.freqcategoryname }}</span>
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
    <!-- Connection Panel -->
    <div>
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div class="w3-small">
                    <span><img src="/src/assets/images/resource_setter/frequency.png" alt="Frequency" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                    <span v-if="selectedCategoryRecord && selectedCategoryRecord.freqcategoryname">
                        <span>
                            <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                                <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                    Frequencies
                                </div>
                            </div>
                        </span> 
                        {{ selectedCategoryRecord.freqcategoryname }}
                    </span>
                    <span v-else>
                        <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                Frequencies
                            </div>
                        </div>
                    </span>
                    <span class="w3-dropdown-hover w3-right w3-hide-large">
                        <i class="fa fa-bars w3-button" title="Copy/Move/Edit/Delete" aria-hidden="true"></i>
                        <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block">
                            <div>
                                <i class="w3-bar-item fa fa-clone w3-button" title="Copy Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('copy')"> Copy Frequency</i>
                                <i class="w3-bar-item fa fa-clipboard w3-button" title="Move Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('move')"> Move Frequency</i>
                                <i class="w3-bar-item fa fa-pencil w3-button" title="Edit Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('edit')"> Edit Frequency</i>
                                <i class="w3-bar-item fa fa-trash-o w3-button" title="Delete Frequency" aria-hidden="true" @click="showdeleteFrequencyWindow"> Delete Frequency</i>
                            </div>
                        </div>
                    </span>
                    <i class="fa fa-trash-o w3-button w3-right w3-hide-medium w3-hide-small" title="Delete Frequency" aria-hidden="true" @click="showdeleteFrequencyWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right w3-hide-medium w3-hide-small" title="Edit Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('edit')"></i>
                    <i class="fa fa-clipboard w3-button w3-right w3-hide-medium w3-hide-small" title="Move Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('move')"></i>
                    <i class="fa fa-clone w3-button w3-right w3-hide-medium w3-hide-small" title="Copy Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('copy')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add Frequency" aria-hidden="true" @click="changeFrequencyWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload Frequency" aria-hidden="true" @click="getFrequencies"></i>
                </div>
            </p>
            <p>
              <div>
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center" width="36%">Name</th>
                            <th class="w3-center" width="42%">Description</th>
                            <th class="w3-center" width="22%">Update Time</th>
                        </tr>
                    </table>
                </div>
                <div id="frequencyContainer" class="w3-responsive w3-card w3-round" style="min-height:350px">
                    <table id="frequencyTable" class="w3-table-all w3-small">
                        <tr :id="content.frequencyuid" :key="content.frequencyuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnFrequency(content.frequencyuid, index)" v-for="(content, index) in allFrequencyObjs">
                            <td width="36%">
                                <span>{{ content.frequencyname }}</span>
                            </td>
                            <td width="42%">
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
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getFrequencies"></filter-panel>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import FrequencyCategoryEditWindow from './FrequencyCategory/FrequencyCategoryEditWindow.vue'
import FrequencyEditWindow from './FrequencyEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            selectedCategoryRecord: new Object(),   //store which record has been selected.(Frequency Categories)
            selectedFrequencyRecord: new Object(),   //store which record has been selected.(Frequencies)
            editCategoryWindowAlive: false,  //for add/edit Frequency category modal windows
            editFrequencyWindowAlive: false,  //for add/edit Frequency modal windows
            operation: 'add',   //keep which operation(add,edit,copy,move) will be execute
            deleteWindowAlive: false,  //show or not show delete modal windows
            deleteName: '', //store delete object name
            deleteWhich: '', //store delete Category or Frequency
            allCategoryObjs: new Object(), //store all remote data.(Frequency Categories)
            allFrequencyObjs: new Object(), //store all remote data.(Frequencies)
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "frequencyname"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "frequencyname"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getCategories()
        // this.getFrequencies()    //不需要, 因為getCategories()裡就會呼叫到getFrequencies()
    },
    methods: {
        /*
         * Above For All About Click Table Row Function
        */
        clickOnCategory(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedCategoryRecord(tr)
            this.clearSelectedFrequencyRecord()
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedCategoryRecord = this.allCategoryObjs[index]
                this.selectedCategoryRecord.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.$refs.filter.pageNumSelected('1')  //每次'點擊'category刷新時, 重載connections都讓filter的page number回到第一頁
            this.getFrequencies()   //refresh Frequencies content
        },
        clickOnFrequency(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedFrequencyRecord(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedFrequencyRecord = this.allFrequencyObjs[index]
                this.selectedFrequencyRecord.index = index //New prop is stores which category obj will be deleted in UI
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
                    "orderField":"freqcategoryname"
                }
            }

            HTTP_TRINITY.post(`frequency-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data

                this.clearSelectedCategoryRecord()
                this.clearSelectedFrequencyRecord()
                this.$refs.filter.pageNumSelected('1')  //每次category刷新時, 重載Frequencies都讓filter的page number回到第一頁
                this.getFrequencies()   //refresh Frequencies content
                
                /*
                 * if fetch category records success, scroll to top
                */
                let categoryContainer = this.$el.querySelector("#categoryContainer")
                categoryContainer.scrollTop = -categoryContainer.scrollHeight
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getFrequencies(e){
            let urlPath = 'frequency/findByFilter?categoryUid='
            if(this.selectedCategoryRecord && this.selectedCategoryRecord.freqcategoryuid && this.selectedCategoryRecord.freqcategoryuid !== '')
                urlPath += this.selectedCategoryRecord.freqcategoryuid
            
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

            HTTP_TRINITY.post(urlPath, params)
            .then(response => {
                if (response.data.content !== undefined) {
                    this.allFrequencyObjs = response.data.content
                    if(response.data.totalPages <= 0)
                        response.data.totalPages = 1
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allFrequencyObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
                this.clearSelectedFrequencyRecord()
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

        /*
         * Above For All About Add/Edit/Copy/Move Function
        */
        changeCategoryWindowStatus(which){
            if(which === 'add'){
                this.operation = which
                this.editCategoryWindowAlive = !this.editCategoryWindowAlive
            }else{
                
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.freqcategoryuid && this.selectedCategoryRecord.freqcategoryuid !== ''){
                    this.operation = which
                    
                    this.editCategoryWindowAlive = !this.editCategoryWindowAlive
                }
            }
        },
        changeFrequencyWindowStatus(which){
            if(which !== 'add'){
                if(this.selectedFrequencyRecord && this.selectedFrequencyRecord.frequencyuid && this.selectedFrequencyRecord.frequencyuid !== ''){
                    this.operation = which
                    this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
                }
            }else{
                this.operation = which
                this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
            } 
        },
        saveCategoryWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from Frequency Category Window Save Click
                this.allCategoryObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedCategoryRecord()
                this.getFrequencies()   //refresh Frequencies content

                /*
                 * if add category record success, scroll to top
                */
                let categoryContainer = this.$el.querySelector("#categoryContainer")
                categoryContainer.scrollTop = -categoryContainer.scrollHeight
            }
            this.editCategoryWindowAlive = !this.editCategoryWindowAlive
        },
        saveCategoryWindowContentForEdit(new_content){
            //new_content !== undefined, it means from Frequency Category Window Save Click
            if(new_content && this.selectedCategoryRecord && (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)){
                new_content.index = this.selectedCategoryRecord.index   //asign old index prop to new content
                this.allCategoryObjs[this.selectedCategoryRecord.index] = new_content   //replace object to the array
                this.selectedCategoryRecord = new_content
            }
            this.editCategoryWindowAlive = !this.editCategoryWindowAlive
        },
        saveFrequencyWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from Frequency Window Save Click
                this.allFrequencyObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedFrequencyRecord()
            }
            this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
        },
        saveFrequencyWindowContentForEdit(new_content){
            //new_content !== undefined, it means from Frequency Window Save Click
            if(new_content && this.selectedFrequencyRecord && (this.selectedFrequencyRecord.index || this.selectedFrequencyRecord.index === 0)){
                new_content.index = this.selectedFrequencyRecord.index   //asign old index prop to new content
                this.allFrequencyObjs[this.selectedFrequencyRecord.index] = new_content   //replace object to the array
                this.selectedFrequencyRecord = new_content
            }
            this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
        },
        saveFrequencyWindowContentForCopy(freqcategoryuid, new_content){
            if(new_content){    //new_content !== undefined, it means from Frequency Window Save Click
                //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆Frequency
                if(this.selectedCategoryRecord.freqcategoryuid === freqcategoryuid){
                    this.allFrequencyObjs.unshift(new_content) //add object to the top of array
                }
                this.clearSelectedFrequencyRecord()
            }
            this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
        },
        saveFrequencyWindowContentForMove(freqcategoryuid, new_content){
            //new_content !== undefined, it means from Frequency Window Save Click
            if(new_content && this.selectedFrequencyRecord && (this.selectedFrequencyRecord.index || this.selectedFrequencyRecord.index === 0)){
                if(this.selectedCategoryRecord.freqcategoryuid === freqcategoryuid){
                    new_content.index = this.selectedFrequencyRecord.index   //asign old index prop to new content
                    this.allFrequencyObjs[this.selectedFrequencyRecord.index] = new_content   //replace object to the array
                    this.selectedFrequencyRecord = new_content
                }else{
                    this.allFrequencyObjs.splice(this.selectedFrequencyRecord.index, 1)
                    this.clearSelectedFrequencyRecord()
                }
            }
            this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
        },

        /*
         * Above For All About Delete Function
        */
        deleteObj(){
            if(this.deleteWhich === 'Category')
                this.deleteCategory()
            else
                this.deleteFrequency()
        },
        deleteCategory(){
            HTTP_TRINITY.get(`frequency-category/delete`, {
                params: {
                    uid: this.selectedCategoryRecord.freqcategoryuid
                }
            })
            .then(response => {
                this.allCategoryObjs.splice(this.selectedCategoryRecord.index, 1)
                this.clearSelectedCategoryRecord()
                this.closeDeleteWindow()
                this.getFrequencies()   //refresh Frequencies content
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        deleteFrequency(){
            HTTP_TRINITY.get(`frequency/delete`, {
                params: {
                    uid: this.selectedFrequencyRecord.frequencyuid
                }
            })
            .then(response => {
                this.allFrequencyObjs.splice(this.selectedFrequencyRecord.index, 1)
                this.clearSelectedFrequencyRecord()
                this.closeDeleteWindow()
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        showDeleteCategoryWindow(){
            if( (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0) 
                    && this.selectedCategoryRecord.freqcategoryname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedCategoryRecord.freqcategoryname
                this.deleteWhich = 'Category'
            }
        },
        showdeleteFrequencyWindow(){
            if( (this.selectedFrequencyRecord.index || this.selectedFrequencyRecord.index === 0) 
                    && this.selectedFrequencyRecord.frequencyname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedFrequencyRecord.frequencyname
                this.deleteWhich = 'Frequency'
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
        clearSelectedFrequencyRecord(tr){
            let table = document.getElementById('frequencyTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有frequency row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedFrequencyRecord = new Object()
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'frequency-category-edit-window': FrequencyCategoryEditWindow,
        'frequency-edit-window': FrequencyEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>