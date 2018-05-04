<template>
<div>
  <!-- For Add/Edit Category Window -->
  <connection-category-edit-window :windowAlive="editCategoryWindowAlive" 
                    window-title="Edit Connection Category" 
                    @closeAdd="saveCategoryWindowContentForAdd" 
                    @closeEdit="saveCategoryWindowContentForEdit" 
                    :content="selectedCategoryRecord" 
                    :urlOp="operation" 
  ></connection-category-edit-window>
  <!-- For Add/Edit Connection Window -->
  <connection-edit-window :windowAlive="editConnectionWindowAlive" 
                    @closeAdd="saveConnectionWindowContentForAdd" 
                    @closeEdit="saveConnectionWindowContentForEdit" 
                    @closeCopy="saveConnectionWindowContentForCopy" 
                    @closeMove="saveConnectionWindowContentForMove" 
                    :content="selectedConnectionRecord" 
                    :selectedCategoryRecord="selectedCategoryRecord" 
                    :urlOp="operation" 
  ></connection-edit-window>
  <!-- For Delete Confirm Window -->
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus" 
                    btn-color="signal-white" 
                    @closeDelete="closeDeleteWindow" 
                    @confirmDelete="deleteObj" 
  ></confirm-delete-window>
  <!-- For Apply Permission Window -->
  <permission-window :windowAlive="applyPermissionWindowAlive" 
                    window-title="Apply Permission To "
                    :objectUid="selectedConnectionRecord.connectionuid" 
                    :objectName="selectedConnectionRecord.connectionname" 
                    @closeApply="changePermissionWindowStatus" 
  ></permission-window>
  <!-- Connection Path Header -->
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Connection</i>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <!-- Connection Category Panel -->
    <div>
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <p>
                <div class="w3-small">
                    <span><img src="/src/assets/images/resource_setter/connection_category.png" alt="Connection Category" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                    <span>
                        <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                All Categories
                            </div>
                        </div>
                    </span>
                    <i class="fa fa-trash-o w3-button w3-right" title="Delete Connection Category" aria-hidden="true" @click="showDeleteCategoryWindow"></i>
                    <i class="fa fa-pencil w3-button w3-right" title="Edit Connection Category" aria-hidden="true" @click="changeCategoryWindowStatus('edit')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add Connection Category" aria-hidden="true" @click="changeCategoryWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload Connection Category" aria-hidden="true" @click="getCategories"></i>
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
                        <tr :id="content.conncategoryuid" :key="content.conncategoryuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnCategory(content.conncategoryuid, index)">
                            <td class="w3-center" width="32%">
                                <span>{{ content.conncategoryname }}</span>
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
                    <span><img src="/src/assets/images/resource_setter/connection.png" alt="Connection" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:26px"></span>
                    <span v-if="selectedCategoryRecord && selectedCategoryRecord.conncategoryname">
                        <span>
                            <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                                <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                    Connections
                                </div>
                            </div>
                        </span> 
                        {{ selectedCategoryRecord.conncategoryname }}
                    </span>
                    <span v-else>
                        <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                Connections
                            </div>
                        </div>
                    </span>
                    <span class="w3-dropdown-hover w3-right w3-hide-large">
                        <i class="fa fa-bars w3-button" title="Copy/Move/Edit/Delete" aria-hidden="true"></i>
                        <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block">
                            <div>
                                <i class="w3-bar-item fa fa-clone w3-button" title="Copy Connection" aria-hidden="true" @click="changeConnectionWindowStatus('copy')"> Copy Connection</i>
                                <i class="w3-bar-item fa fa-clipboard w3-button" title="Move Connection" aria-hidden="true" @click="changeConnectionWindowStatus('move')"> Move Connection</i>
                                <i class="w3-bar-item fa fa-pencil w3-button" title="Edit Connection" aria-hidden="true" @click="changeConnectionWindowStatus('edit')"> Edit Connection</i>
                                <i class="w3-bar-item fa fa-trash-o w3-button" title="Delete Connection" aria-hidden="true" @click="showdeleteConnectionWindow"> Delete Connection</i>
                            </div>
                        </div>
                    </span>
                    <i class="fa fa-trash-o w3-button w3-right w3-hide-medium w3-hide-small" title="Delete Connection" aria-hidden="true" @click="showdeleteConnectionWindow"></i>
                    <i class="fa fa-universal-access w3-button w3-right" title="Apply Permission To Connection" aria-hidden="true" @click="changePermissionWindowStatus()"></i>
                    <i class="fa fa-pencil w3-button w3-right w3-hide-medium w3-hide-small" title="Edit Connection" aria-hidden="true" @click="changeConnectionWindowStatus('edit')"></i>
                    <i class="fa fa-clipboard w3-button w3-right w3-hide-medium w3-hide-small" title="Move Connection" aria-hidden="true" @click="changeConnectionWindowStatus('move')"></i>
                    <i class="fa fa-clone w3-button w3-right w3-hide-medium w3-hide-small" title="Copy Connection" aria-hidden="true" @click="changeConnectionWindowStatus('copy')"></i>
                    <i class="fa fa-plus w3-button w3-right" title="Add Connection" aria-hidden="true" @click="changeConnectionWindowStatus('add')"></i>
                    <i class="fa fa-refresh w3-button w3-right" title="Reload Connection" aria-hidden="true" @click="getConnections"></i>
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
                <div id="connectionContainer" class="w3-responsive w3-card w3-round" style="min-height:350px">
                    <table id="connectionTable" class="w3-table-all w3-small">
                        <tr :id="content.connectionuid" :key="content.connectionuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                @click="clickOnConnection(content.connectionuid, index)" v-for="(content, index) in allConnectionObjs">
                            <td width="36%">
                                <span class="w3-badge w3-indigo">{{ content.connectiontype }}</span>
                                &nbsp;
                                <span>{{ content.connectionname }}</span>
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
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getConnections"></filter-panel>
</div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import ConnectionCategoryEditWindow from './ConnectionCategory/ConnectionCategoryEditWindow.vue'
import ConnectionEditWindow from './ConnectionEditWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'

export default {
    data() {
        return {
            selectedCategoryRecord: new Object(),   //store which record has been selected.(Connection Categories)
            selectedConnectionRecord: new Object(),   //store which record has been selected.(Connections)
            editCategoryWindowAlive: false,  //for add/edit Connection category modal windows
            editConnectionWindowAlive: false,  //for add/edit Connection modal windows
            applyPermissionWindowAlive: false, //for modify Permission modal windows
            operation: 'add',   //keep which operation(add,edit,copy,move) will be execute
            deleteWindowAlive: false,  //show or not show delete modal windows
            deleteName: '', //store delete object name
            deleteWhich: '', //store delete Category or Connection
            allCategoryObjs: new Object(), //store all remote data.(Connection Categories)
            allConnectionObjs: new Object(), //store all remote data.(Connections)
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "connectionname"},
                {name: "Type",value: "connectiontype"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "connectionname"},
                {name: "Type",value: "connectiontype"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getCategories()
        // this.getConnections()    //不需要, 因為getCategories()裡就會呼叫到getConnections()
    },
    methods: {
        /*
         * Above For All About Click Table Row Function
        */
        clickOnCategory(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedCategoryRecord(tr)
            this.clearSelectedConnectionRecord()
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedCategoryRecord = this.allCategoryObjs[index]
                this.selectedCategoryRecord.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.$refs.filter.pageNumSelected('1')  //每次'點擊'category刷新時, 重載connections都讓filter的page number回到第一頁
            this.getConnections()   //refresh Connections content
        },
        clickOnConnection(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedConnectionRecord(tr)

            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedConnectionRecord = this.allConnectionObjs[index]
                this.selectedConnectionRecord.index = index //New prop is stores which category obj will be deleted in UI
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
                    "orderField":"conncategoryname"
                }
            }

            HTTPRepo.post(`connection-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data

                this.clearSelectedCategoryRecord()
                this.clearSelectedConnectionRecord()
                this.$refs.filter.pageNumSelected('1')  //每次category刷新時, 重載connections都讓filter的page number回到第一頁
                this.getConnections()   //refresh Connections content
                
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
        getConnections(e){
            let urlPath = 'connection/findByFilter?categoryUid='
            if(this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid && this.selectedCategoryRecord.conncategoryuid !== '')
                urlPath += this.selectedCategoryRecord.conncategoryuid
            
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
                    this.allConnectionObjs = response.data.content
                    if(response.data.totalPages <= 0)
                        response.data.totalPages = 1
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allConnectionObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
                this.clearSelectedConnectionRecord()
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
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid && this.selectedCategoryRecord.conncategoryuid !== ''){
                    this.operation = which
                    this.editCategoryWindowAlive = !this.editCategoryWindowAlive
                }
            }
        },
        changeConnectionWindowStatus(which){
            if(which != 'add'){
                if(this.selectedConnectionRecord && this.selectedConnectionRecord.connectionuid && this.selectedConnectionRecord.connectionuid !== ''){
                    this.operation = which
                    this.editConnectionWindowAlive = !this.editConnectionWindowAlive
                }
            }else{
                this.operation = which
                this.editConnectionWindowAlive = !this.editConnectionWindowAlive
            } 
        },
        changePermissionWindowStatus(){
            if(this.selectedConnectionRecord && this.selectedConnectionRecord.connectionuid && this.selectedConnectionRecord.connectionuid !== ''){
                this.selectedConnectionRecord.connectionuid = this.selectedConnectionRecord.connectionuid.trim()
                this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
            }
        },
        saveCategoryWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from Connection Category Window Save Click
                this.allCategoryObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedCategoryRecord()
                this.getConnections()   //refresh Connections content

                /*
                 * if add category record success, scroll to top
                */
                let categoryContainer = this.$el.querySelector("#categoryContainer")
                categoryContainer.scrollTop = -categoryContainer.scrollHeight
            }
            this.editCategoryWindowAlive = !this.editCategoryWindowAlive
        },
        saveCategoryWindowContentForEdit(new_content){
            //new_content !== undefined, it means from Connection Category Window Save Click
            if(new_content && this.selectedCategoryRecord && (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)){
                new_content.index = this.selectedCategoryRecord.index   //asign old index prop to new content
                this.allCategoryObjs[this.selectedCategoryRecord.index] = new_content   //replace object to the array
                this.selectedCategoryRecord = new_content
            }
            this.editCategoryWindowAlive = !this.editCategoryWindowAlive
        },
        saveConnectionWindowContentForAdd(new_content){
            if(new_content){    //new_content !== undefined, it means from Connection Window Save Click
                this.allConnectionObjs.unshift(new_content) //add object to the top of array
                this.clearSelectedConnectionRecord()
            }
            this.editConnectionWindowAlive = !this.editConnectionWindowAlive
        },
        saveConnectionWindowContentForEdit(new_content){
            //new_content !== undefined, it means from Connection Window Save Click
            if(new_content && this.selectedConnectionRecord && (this.selectedConnectionRecord.index || this.selectedConnectionRecord.index === 0)){
                new_content.index = this.selectedConnectionRecord.index   //asign old index prop to new content
                this.allConnectionObjs[this.selectedConnectionRecord.index] = new_content   //replace object to the array
                this.selectedConnectionRecord = new_content
            }
            this.editConnectionWindowAlive = !this.editConnectionWindowAlive
        },
        saveConnectionWindowContentForCopy(conncategoryuid, new_content){
            if(new_content){    //new_content !== undefined, it means from Connection Window Save Click
                //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆connection
                if(this.selectedCategoryRecord.conncategoryuid === conncategoryuid){
                    this.allConnectionObjs.unshift(new_content) //add object to the top of array
                }
                this.clearSelectedConnectionRecord()
            }
            this.editConnectionWindowAlive = !this.editConnectionWindowAlive
        },
        saveConnectionWindowContentForMove(conncategoryuid, new_content){
            //new_content !== undefined, it means from Connection Window Save Click
            if(new_content && this.selectedConnectionRecord && (this.selectedConnectionRecord.index || this.selectedConnectionRecord.index === 0)){
                if(this.selectedCategoryRecord.conncategoryuid === conncategoryuid){
                    new_content.index = this.selectedConnectionRecord.index   //asign old index prop to new content
                    this.allConnectionObjs[this.selectedConnectionRecord.index] = new_content   //replace object to the array
                    this.selectedConnectionRecord = new_content
                }else{
                    this.allConnectionObjs.splice(this.selectedConnectionRecord.index, 1)
                    this.clearSelectedConnectionRecord()
                }
            }
            this.editConnectionWindowAlive = !this.editConnectionWindowAlive
        },

        /*
         * Above For All About Delete Function
        */
        deleteObj(){
            if(this.deleteWhich === 'Category')
                this.deleteCategory()
            else
                this.deleteConnection()
        },
        deleteCategory(){
            HTTPRepo.get(`connection-category/delete`, {
                params: {
                    uid: this.selectedCategoryRecord.conncategoryuid
                }
            })
            .then(response => {
                this.allCategoryObjs.splice(this.selectedCategoryRecord.index, 1)
                this.clearSelectedCategoryRecord()
                this.closeDeleteWindow()
                this.getConnections()   //refresh Connections content
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        deleteConnection(){
            HTTPRepo.get(`connection/delete`, {
                params: {
                    uid: this.selectedConnectionRecord.connectionuid
                }
            })
            .then(response => {
                this.allConnectionObjs.splice(this.selectedConnectionRecord.index, 1)
                this.clearSelectedConnectionRecord()
                this.closeDeleteWindow()
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        showDeleteCategoryWindow(){
            if( (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0) 
                    && this.selectedCategoryRecord.conncategoryname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedCategoryRecord.conncategoryname
                this.deleteWhich = 'Category'
            }
        },
        showdeleteConnectionWindow(){
            if( (this.selectedConnectionRecord.index || this.selectedConnectionRecord.index === 0) 
                    && this.selectedConnectionRecord.connectionname) {
                this.deleteWindowAlive = true
                this.deleteName = this.selectedConnectionRecord.connectionname
                this.deleteWhich = 'Connection'
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
        clearSelectedConnectionRecord(tr){
            let table = document.getElementById('connectionTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有connection row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedConnectionRecord = new Object()
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'connection-category-edit-window': ConnectionCategoryEditWindow,
        'connection-edit-window': ConnectionEditWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'permission-window': PermissionWindow
    }
}
</script>