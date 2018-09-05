<template>
<div>
  <!-- For Add/Edit Category Window -->
  <file-source-category-edit-window v-if="editCategoryWindowAlive" :windowAlive="editCategoryWindowAlive" 
                    @closeAdd="saveCategoryWindowContentForAdd" 
                    @closeEdit="saveCategoryWindowContentForEdit" 
                    :content="categoryRecord" 
                    :urlOp="operation" 
  ></file-source-category-edit-window>
  <!-- For Add/Edit/Copy/Move File Source Window -->
  <file-source-edit-window v-if="editFileSourceWindowAlive" :windowAlive="editFileSourceWindowAlive" 
                    @closeAdd="saveFileSourceWindowContentForAdd" 
                    @closeEdit="saveFileSourceWindowContentForEdit" 
                    @closeCopy="saveFileSourceWindowContentForCopy" 
                    @closeMove="saveFileSourceWindowContentForMove" 
                    :content="filesourceRecord" 
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
  <div class="w3-col m9 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                        <div class="w3-row">
                            <span class="w3-col m12 w3-left">
                                <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                    placeholder="Search For File Source Name" style="text-transform:uppercase">
                                <i class="fa fa-search w3-button w3-theme-d2" title="Search For File Source Name" aria-hidden="true" @click="applyQuery"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- File Source Category Panel -->
    <div class="w3-small">
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <span><img src="/src/assets/images/resource_setter/filesource_category.png" alt="File Source Category" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                <span>
                    <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                            Filesource Categories
                        </div>
                    </div>
                </span>
                <i class="fa fa-trash-o w3-button w3-right" title="Delete File Source Category" aria-hidden="true" @click="showDeleteCategoryWindow"></i>
                <i class="fa fa-pencil w3-button w3-right" title="Edit File Source Category" aria-hidden="true" @click="changeCategoryWindowStatus('edit')"></i>
                <i class="fa fa-plus w3-button w3-right" title="Add File Source Category" aria-hidden="true" @click="changeCategoryWindowStatus('add')"></i>
                <i class="fa fa-refresh w3-button w3-right" title="Reload File Source Category" aria-hidden="true" @click="getCategories"></i>
            </p>
            <p>
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
                        <empty-grid v-if="allCategoryObjs.length <= 0"></empty-grid>
                        <template v-else v-for="(content, index) in allCategoryObjs">
                            <tr :id="content.fscategoryuid" :key="content.fscategoryuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                    @click="clickOnCategory(content.fscategoryuid, index)">
                                <td width="32%">
                                    <span>{{ content.fscategoryname }}</span>
                                </td>
                                <td width="46%">
                                    <span :title="content.description">{{ content.description.length > 25 ? content.description.substr(0, 25) + '...' : content.description }}</span>
                                </td>
                                <td width="22%">
                                    <span>{{ content.lastupdatetime }}</span>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </p>
        </div>
    </div>
    <!-- File Source Panel -->
    <div class="w3-small">
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <span><img src="/src/assets/images/resource_setter/filesource.png" alt="File Source" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                        File Sources
                    </div>
                </div>
                <span class="w3-col m6 w3-right w3-hide-small w3-hide-medium">
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete Filesource" aria-hidden="true" @click="showDeleteFileSourceWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit Filesource" aria-hidden="true" @click="changeFileSourceWindowStatus('edit')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add Filesource" aria-hidden="true" @click="changeFileSourceWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload Filesource" aria-hidden="true" @click="applyQuery"></i>
                    <span class="w3-dropdown-hover w3-right">
                        <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                        <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                            <div>
                                <i class="w3-bar-item fa fa-clone w3-button" aria-hidden="true" @click="changeFileSourceWindowStatus('copy')"> Copy Filesource</i>
                                <i class="w3-bar-item fa fa-clipboard w3-button" aria-hidden="true" @click="changeFileSourceWindowStatus('move')"> Move Filesource</i>
                            </div>
                            <hr class="w3-border-black" style="padding:0px;margin:0px">
                            <div class="w3-row-padding w3-small">
                                <span class="w3-col m5" style="padding-top:13px">Page Num</span>
                                <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Number" 
                                        v-model="selectedPage" @change="pageNumSelectedComboBox">
                                    <template v-for="n in totalPages">
                                        <option :key="n" :value="n" selected>{{ n }}</option>
                                    </template>
                                </select>
                            </div>
                            <div class="w3-row-padding w3-small" style="padding-bottom:10px">
                                <span class="w3-col m5" style="padding-top:13px">Page Size</span>
                                <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Size" 
                                        v-model="selectedSize" @change="changeSize">
                                    <option value="-1" disabled selected>Page Size</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="500">500</option>
                                </select>
                            </div>
                        </div>
                    </span>
                </span>
                <span class="w3-col m6 w3-right w3-hide-large">
                    <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                    <span class="w3-dropdown-hover w3-right">
                        <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                        <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                            <div>
                                <i class="w3-bar-item fa fa-pencil w3-button" aria-hidden="true" @click="changeFileSourceWindowStatus('edit')"> Edit Connection</i>
                                <i class="w3-bar-item fa fa-trash-o w3-button" aria-hidden="true" @click="showDeleteFileSourceWindow"> Delete Connection</i>
                                <i class="w3-bar-item fa fa-clone w3-button" aria-hidden="true" @click="changeFileSourceWindowStatus('copy')"> Copy Connection</i>
                                <i class="w3-bar-item fa fa-clipboard w3-button" aria-hidden="true" @click="changeFileSourceWindowStatus('move')"> Move Connection</i>
                            </div>
                            <hr class="w3-border-black" style="padding:0px;margin:0px">
                            <div class="w3-row-padding w3-small">
                                <span class="w3-col m5" style="padding-top:13px">Page Num</span>
                                <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Number" 
                                        v-model="selectedPage" @change="pageNumSelectedComboBox">
                                    <template v-for="n in totalPages">
                                        <option :key="n" :value="n" selected>{{ n }}</option>
                                    </template>
                                </select>
                            </div>
                            <div class="w3-row-padding w3-small" style="padding-bottom:10px">
                                <span class="w3-col m5" style="padding-top:13px">Page Size</span>
                                <select class="w3-select w3-col m7 w3-border w3-round w3-tiny" style="margin-top:10px;height:24px" title="Page Size" 
                                        v-model="selectedSize" @change="changeSize">
                                    <option value="-1" disabled selected>Page Size</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="500">500</option>
                                </select>
                            </div>
                        </div>
                    </span>
                </span>
            </p>
            <p>
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th class="w3-center w3-btn w3-hover-none" width="38%" title="Order by Filesource Name" @click="applyOrder('filesourcename')">
                                Name
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['filesourcename'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['filesourcename'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                            <th class="w3-center w3-btn w3-hover-none" width="40%" title="Order by Description" @click="applyOrder('description')">
                                Description
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                            <th class="w3-center w3-btn w3-hover-none" width="22%" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                Update Time
                                &nbsp;&nbsp;
                                <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                            </th>
                        </tr>
                    </table>
                </div>
                <div id="filesourceContainer" class="w3-responsive w3-card w3-round">
                    <table id="filesourceTable" class="w3-table-all">
                        <empty-grid v-if="allFileSourceObjs.length <= 0"></empty-grid>
                        <tr v-else :id="content.filesourceuid" :key="content.filesourceuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnFileSource(content.filesourceuid, index)" v-for="(content, index) in allFileSourceObjs">
                            <td width="38%">
                                <span v-if="selectedCategoryRecord && selectedCategoryRecord.fscategoryname">
                                    {{selectedCategoryRecord.fscategoryname === '/' ? selectedCategoryRecord.fscategoryname : '/'+selectedCategoryRecord.fscategoryname+'/'}}{{ content.filesourcename }}
                                </span>
                                <span v-else>
                                    {{content.categoryname === '/' ? content.categoryname : '/'+content.categoryname+'/'}}{{ content.filesourcename }}
                                </span>
                            </td>
                            <td width="40%">
                                <span :title="content.description">{{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}</span>
                            </td>
                            <td width="22%">
                                <span>{{ content.lastupdatetime }}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="w3-row-padding">
                    <div class="w3-col m9 w3-center" style="padding-top:10px">
                        <page ref="paginate" :page-count="totalPages" :clickHandler="changeNum"></page>
                    </div>
                    <div class="w3-col m3">
                        <div class="w3-row w3-right">
                            <span class="w3-col m6 w3-hide-medium" style="padding-top:15px">
                                Page Size
                            </span>
                            <span class="w3-col m6" style="padding-top:10px">
                                <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize">
                                    <option value="-1" disabled selected>Size</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="500">500</option>
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
            </p>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import { PermissionTable,loadPermissionTable } from '../../../../util_js/auth'
import FileSourceCategoryEditWindow from './FileSourceCategory/FileSourceCategoryEditWindow.vue'
import FileSourceEditWindow from './FileSourceEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import page from '../../page.vue'
import EmptyGrid from '../../../Common/EmptyGrid.vue'

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
            allCategoryObjs: [], //store all remote data.(File Source Categories)
            categoryRecord: new Object(),   //store detail filesource category record
            allFileSourceObjs: [], //store all remote data.(File Sources)
            filesourceRecord: new Object(), //store detail filesource record
            //about paging info
            totalPages: 1,
            selectedPage: 1, //this is for UI use
            selectedNum: 0, //this is for backend use
            selectedSize: 10,
            //about connection ordering info
            orderFields: { //Ordering fields, only for UI
                filesourcename: "ASC",
                description: "",
                lastupdatetime: ""
            },
            orderField: 'filesourcename',   //send to backend
            orderType: 'ASC',  //send to backend
            //about query param
            queryParam: ''
        }
    },
    mounted() {
        loadPermissionTable.then((successMessage) => {
            this.getCategories()
            // this.getFileSources()    //不需要, 因為getCategories()裡就會呼叫到getFileSources()
        });
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
                this.selectedCategoryRecord.index = index //New prop stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }

            this.changeSize()
            // this.pageNumSelected('1')  //每次'點擊'category刷新時, 重載filesources都讓filter的page number回到第一頁
            // this.getFileSources()   //refresh file sources content
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
            if(!PermissionTable.root && !PermissionTable.admin){
                if(!PermissionTable.filesource_func || !PermissionTable.filesource_func.view)
                    return
            }

            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"fscategoryname"
                }
            }

            HTTP_TRINITY.post(`file-source-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data

                let rootCategory = {
                    "fscategoryuid": "root",
                    "fscategoryname":"/",
                    "description":"Root Directory",
                    "lastupdatetime": ""
                }
                this.allCategoryObjs.unshift(rootCategory)

                // this.clearSelectedCategoryRecord()
                this.clearSelectedFileSourceRecord()
                this.changeSize()
                // this.pageNumSelected('1')  //每次category刷新時, 重載filesources都讓filter的page number回到第一頁
                // this.getFileSources()   //refresh file sources content
                
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
        getFileSources(e){
            if(!PermissionTable.root && !PermissionTable.admin){
                if(!PermissionTable.filesource_func || !PermissionTable.filesource_func.view)
                    return
            }

            let urlPath = 'file-source/findByFilter'
            if(this.selectedCategoryRecord && this.selectedCategoryRecord.fscategoryuid && this.selectedCategoryRecord.fscategoryuid !== '')
                urlPath += '?categoryUid=' + this.selectedCategoryRecord.fscategoryuid
            
            let params = {
                "paging":{
                    "number":this.selectedNum,
                    "size":this.selectedSize
                },
                "ordering":{
                    "orderType":this.orderType,
                    "orderField":this.orderField
                },
                "param":this.queryParam
            }
            
            HTTP_TRINITY.post(urlPath, params)
            .then(response => {
                if (response.data.content !== undefined) {
                    this.allFileSourceObjs = response.data.content
                    if(response.data.totalPages <= 0)
                        this.totalPages = 1
                    else
                        this.totalPages = response.data.totalPages
                } else {
                    this.allFileSourceObjs = response.data
                    this.totalPages = 1
                }
                this.clearSelectedFileSourceRecord()
            })
            .catch(error => {
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
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.fscategoryuid 
                        && this.selectedCategoryRecord.fscategoryuid !== '' && this.selectedCategoryRecord.fscategoryuid !== 'root'){
                    HTTP_TRINITY.get(`file-source-category/findByUid?uid=` + this.selectedCategoryRecord.fscategoryuid)
                    .then(response => {
                        this.categoryRecord = response.data
                        this.operation = which
                        this.editCategoryWindowAlive = !this.editCategoryWindowAlive
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
                }
            }
        },
        changeFileSourceWindowStatus(which){
            if(which != 'add'){
                if(this.selectedFileSourceRecord && this.selectedFileSourceRecord.filesourceuid && this.selectedFileSourceRecord.filesourceuid !== ''){
                    //Get filesource detail record
                    HTTP_TRINITY.get(`file-source/findByUid?uid=` + this.selectedFileSourceRecord.filesourceuid)
                    .then(response => {
                        this.filesourceRecord = response.data

                        //above for pass category info to connection form, if no category data, pass default value
                        if(this.filesourceRecord.categoryname == undefined || this.filesourceRecord.categoryname.trim() == '')
                            this.filesourceRecord.categoryname = '/'
                        if(this.filesourceRecord.categoryuid == undefined || this.filesourceRecord.categoryuid.trim() == '')
                            this.filesourceRecord.categoryuid = 'root'

                        this.operation = which
                        this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
                }
            }else{
                this.operation = which
                this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
            } 
        },
        saveCategoryWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from File Source Category Window Save Click
                this.allCategoryObjs.splice(1, 0, new_content) //add object to the second position of array
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
        saveFileSourceWindowContentForCopy(new_content){
            if(new_content){    //new_content !== undefined, it means from File Source Window Save Click
                //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆filesource
                if(this.selectedCategoryRecord.fscategoryuid === undefined || 
                        this.selectedCategoryRecord.fscategoryuid === new_content.categoryuid){
                    this.allFileSourceObjs.unshift(new_content) //add object to the top of array
                }
                this.clearSelectedFileSourceRecord()
            }
            this.editFileSourceWindowAlive = !this.editFileSourceWindowAlive
        },
        saveFileSourceWindowContentForMove(new_content){
            //new_content !== undefined, it means from File Source Window Save Click
            if(new_content && this.selectedFileSourceRecord && (this.selectedFileSourceRecord.index || this.selectedFileSourceRecord.index === 0)){
                /*
                 *  this.selectedCategoryRecord.conncategoryuid === undefined, 表示沒有點選任何目錄, 即所有的connection都要出現, 
                 *  this.selectedCategoryRecord.conncategoryuid === new_content.categoryuid, 表示move過去的目標category, 即目前所在的category(即目前所選擇的category)
                 *  以上兩種情形, 一律替換掉舊object即可
                */
                if(this.selectedCategoryRecord.fscategoryuid === undefined || 
                        this.selectedCategoryRecord.fscategoryuid === new_content.categoryuid){
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
            HTTP_TRINITY.get(`file-source-category/delete`, {
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
                errorHandle(this.$store, error)
            })
        },
        deleteFileSource(){
            HTTP_TRINITY.get(`file-source/delete`, {
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
                errorHandle(this.$store, error)
            })
        },
        showDeleteCategoryWindow(){
            if( (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0) 
                    && this.selectedCategoryRecord.fscategoryname && this.selectedCategoryRecord.fscategoryname !== '/') {
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
        },
        //above for pagging, ordering, query
        changeNum(e, index){
            //紀錄現在點擊的是那一頁
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.selectedPage = index   //for UI page num
            this.getFileSources()
        },
        changeSize(e){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getFileSources()
        },
        pageNumSelected(index){
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.selectedPage = Number(index)   //for UI page num
            if(this.$refs.paginate) //對content list而言, 其this.$refs.paginate可能為undefined
                this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
        },
        pageNumSelectedComboBox (){  //for Page select box
            this.selectedNum = Number(this.selectedPage) - 1
            if(this.$refs.paginate) //對content list而言, 其this.$refs.paginate可能為undefined
                this.$refs.paginate.selected = Number(this.selectedPage) - 1
            this.getFileSources()
        },
        applyOrder(field){
            //先清除所有排序方式, only for UI display
            for(var x in this.orderFields){
                if(x !== field)
                    this.orderFields[x] = ''
            }

            this.orderField = field
            if (this.orderFields[field] === 'ASC') {
                this.orderFields[field] = 'DESC' //only for UI display
                this.orderType = 'DESC'
            } else {
                this.orderFields[field] = 'ASC'    //only for UI display
                this.orderType = 'ASC'
            }

            this.getFileSources()
        },
        applyQuery(){
            this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
            this.getFileSources()
        }
    },
    components: {
        'file-source-category-edit-window': FileSourceCategoryEditWindow,
        'file-source-edit-window': FileSourceEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'page': page,
        'empty-grid': EmptyGrid
    }
}
</script>
<style scoped>
    select {
        height: 30px;
        width: 86px;
        padding:0px 0px 0px 0px;
    }
    input {
        height: 31px;
        width: 260px;
    }
</style>
