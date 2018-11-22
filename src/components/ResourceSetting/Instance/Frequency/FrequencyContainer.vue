<template>
    <div>
        <!-- For Add/Edit Category Window -->
        <frequency-category-edit-window v-if="editCategoryWindowAlive" :windowAlive="editCategoryWindowAlive"
                                        @closeAdd="saveCategoryWindowContentForAdd"
                                        @closeEdit="saveCategoryWindowContentForEdit"
                                        :content="selectedCategoryRecord"
                                        :urlOp="operation">
        </frequency-category-edit-window>
        <!-- For Add/Edit Frequency Window -->
        <frequency-edit-window v-if="editFrequencyWindowAlive" :windowAlive="editFrequencyWindowAlive"
                               @closeAdd="saveFrequencyWindowContentForAdd"
                               @closeEdit="saveFrequencyWindowContentForEdit"
                               @closeCopy="saveFrequencyWindowContentForCopy"
                               @closeMove="saveFrequencyWindowContentForMove"
                               :content="freqRecord"
                               :selectedCategoryRecord="selectedCategoryRecord"
                               :urlOp="operation">
        </frequency-edit-window>
        <!-- For Delete Confirm Window -->
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteObj">
        </confirm-delete-window>
        <div class="w3-col m9 w3-animate-opacity">
            <!-- Frequency Category Panel -->
            <div class="w3-small w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-container w3-card-4 w3-signal-white w3-round">
                        <p>
                            <div class="w3-row w3-border w3-round w3-padding">
                                <span>
                                    <img src="src/assets/images/resource_setter/frequency_category.png" alt="Frequency Category" class="w3-margin-right w3-left w3-hide-small" style="height:26px;width:26px">
                                </span>
                                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;/*transform:rotate(-5deg)*/">
                                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        {{ $t('Container.Title.FrequencyCate') }}
                                    </div>
                                </div>
                                <i class="fa fa-trash-o w3-button w3-right" :title="$t('Container.Func.Delete')" aria-hidden="true" @click="showDeleteCategoryWindow"></i>
                                <i class="fa fa-pencil w3-button w3-right" :title="$t('Container.Func.Edit')" aria-hidden="true" @click="changeCategoryWindowStatus('edit')"></i>
                                <i class="fa fa-plus w3-button w3-right" :title="$t('Container.Func.Add')" aria-hidden="true" @click="changeCategoryWindowStatus('add')"></i>
                                <i class="fa fa-refresh w3-button w3-right" :title="$t('Container.Func.Refresh')" aria-hidden="true" @click="getCategories"></i>
                            </div>
                        </p>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all w3-small">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th :width="gridWidth[1]">{{ $t('Container.Grid.Name') }}</th>
                                            <th :width="gridWidth[2]">{{ $t('Container.Grid.Description') }}</th>
                                            <th :width="gridWidth[3]">{{ $t('Container.Grid.UpdateTime') }}</th>
                                        </tr>
                                    </table>
                                </div>
                                <div id="categoryContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:107px">
                                    <table id="categoryTable" class="w3-table-all w3-small">
                                        <tr v-for="(content, index) in allCategoryObjs" :id="content.freqcategoryuid" :key="content.freqcategoryuid"
                                            class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnCategory(content.freqcategoryuid, index)">
                                            <td :width="gridWidth[0]"></td>
                                            <td :width="gridWidth[1]">
                                                <span>{{ content.freqcategoryname }}</span>
                                            </td>
                                            <td :width="gridWidth[2]">
                                                <span>{{ content.description }}</span>
                                            </td>
                                            <td :width="gridWidth[3]">
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
            <!-- Frequency Panel -->
            <div class="w3-small">
                <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
                    <div class="w3-panel w3-row w3-border w3-round w3-padding">
                        <span>
                            <img src="src/assets/images/resource_setter/frequency.png" class="w3-margin-right w3-left w3-hide-small"
                                 style="height:26px;width:32px">
                        </span>
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px;/*transform:rotate(-5deg)*/">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                {{ $t('Item.Frequency') }}
                            </div>
                        </div>
                        <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                               placeholder="Name" style="height:28px;max-width: 200px;text-transform:uppercase" @keyup.enter="applyQuery">
                        <i class="fa fa-search w3-button" :title="$t('Container.Func.Search')" aria-hidden="true" @click="applyQuery"></i>
                        <i class="fa fa-plus w3-button w3-right" :title="$t('Container.Func.Add')" aria-hidden="true" @click="changeFrequencyWindowStatus('add')"></i>
                        <i class="fa fa-refresh w3-button w3-right" :title="$t('Container.Func.Refresh')" aria-hidden="true" @click="applyQuery"></i>
                    </div>
                    <p>
                        <div>
                            <div class="w3-responsive w3-card w3-round">
                                <table class="w3-table-all w3-small">
                                    <tr class="w3-teal">
                                        <th :width="gridWidth[0]"></th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Connection Name" @click="applyOrder('frequencyname')">
                                            {{ $t('Container.Grid.Name') }}
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['frequencyname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['frequencyname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Description" @click="applyOrder('description')">
                                            {{ $t('Container.Grid.Description') }}
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[3]" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                            {{ $t('Container.Grid.UpdateTime') }}
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                            <div id="frequencyContainer" class="w3-responsive w3-card w3-round" style="overflow:inherit">
                                <table id="frequencyTable" class="w3-table-all">
                                    <empty-grid v-if="allFrequencyObjs.length == 0"></empty-grid>
                                    <tr v-else :id="content.frequencyuid" :key="content.frequencyuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                        @click="clickOnFrequency(content.frequencyuid, index)" v-for="(content, index) in allFrequencyObjs">
                                        <td id="barsTD" :width="gridWidth[0]">
                                            <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                                <i id="barsLabel" class="fa fa-bars"></i>
                                                <div class="w3-dropdown-content w3-bar-block w3-card-4">
                                                    <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changeFrequencyWindowStatus('copy')"> Copy</button>
                                                    <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changeFrequencyWindowStatus('move')"> Move</button>
                                                    <button class="w3-bar-item w3-button w3-padding-small w3-border-top" @click.stop="showdeleteFrequencyWindow"> Delete</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td :width="gridWidth[1]">
                                            <span v-if="selectedCategoryRecord && selectedCategoryRecord.freqcategoryname" style="text-decoration:underline;"
                                                  @click.stop="clickOnFrequencyName(content.frequencyuid, index)">
                                                {{selectedCategoryRecord.freqcategoryname === '/' ? selectedCategoryRecord.freqcategoryname : '/'+selectedCategoryRecord.freqcategoryname+'/'}}{{ content.frequencyname }}
                                            </span>
                                            <span v-else style="text-decoration:underline;" @click.stop="clickOnFrequencyName(content.frequencyuid, index)">
                                                {{content.categoryname === '/' ? content.categoryname : '/'+content.categoryname+'/'}}{{ content.frequencyname }}
                                            </span>
                                        </td>
                                        <td :width="gridWidth[2]">
                                            <span :title="content.description">
                                                {{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}
                                            </span>
                                        </td>
                                        <td :width="gridWidth[3]">
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
                                            {{ $t('Container.PageSize') }}
                                        </span>
                                        <span class="w3-col m6" style="padding-top:10px">
                                            <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize"
                                                    style="height: 30px;width: 86px;padding: 0px 0px 0px 0px">
                                                <option value="-1" disabled selected>Size</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </span>
                                    </div>
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
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import FrequencyCategoryEditWindow from './FrequencyCategory/FrequencyCategoryEditWindow.vue'
    import FrequencyEditWindow from './FrequencyEditWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        components: {
            'frequency-category-edit-window': FrequencyCategoryEditWindow,
            'frequency-edit-window': FrequencyEditWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'permission-window': PermissionWindow,
            'page': page,
            'empty-grid': EmptyGrid
        },
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
                allCategoryObjs: [], //store all remote data.(Frequency Categories)
                categoryRecord: new Object(),   //store detail category record
                allFrequencyObjs: [], //store all remote data.(Frequencies)
                freqRecord: new Object(), //store detail record
                gridWidth: ['2%', '30%', '48%', '20%'],
                //about paging info
                totalPages: 1,
                selectedPage: 1, //this is for UI use
                selectedNum: 0, //this is for backend use
                selectedSize: 10,
                //about connection ordering info
                orderFields: { //Ordering fields, only for UI
                    frequencyname: "ASC",
                    description: "",
                    lastupdatetime: ""
                },
                orderField: 'frequencyname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
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
            clickOnCategory(id, index) {
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

                this.changeSize()
            },
            clickOnFrequency(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedFrequencyRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedFrequencyRecord = this.allFrequencyObjs[index]
                    this.selectedFrequencyRecord.index = index //New prop is stores which category obj will be deleted in UI
                    menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnFrequencyName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedFrequencyRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedFrequencyRecord = this.allFrequencyObjs[index]
                    this.selectedFrequencyRecord.index = index

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    menuBtn.style.display = 'block'
                }

                this.changeFrequencyWindowStatus('edit')
            },
            /*
             * Above For All About Fetch Data Function
            */
            getCategories() {
                let params = {
                    "ordering": {
                        "orderType": "ASC",
                        "orderField": "freqcategoryname"
                    }
                }

                HTTP_TRINITY.post(`frequency-category/findByFilter`, params)
                    .then(response => {
                        this.allCategoryObjs = response.data

                        let rootCategory = {
                            "freqcategoryuid": "root",
                            "freqcategoryname": "/",
                            "description": "Root Directory",
                            "lastupdatetime": ""
                        }
                        this.allCategoryObjs.unshift(rootCategory)

                        //this.clearSelectedCategoryRecord()
                        this.clearSelectedFrequencyRecord()

                        this.changeSize()

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
            getFrequencies(e) {
                let urlPath = 'frequency/findByFilter'
                if (this.selectedCategoryRecord && this.selectedCategoryRecord.freqcategoryuid && this.selectedCategoryRecord.freqcategoryuid !== '')
                    urlPath += '?categoryUid=' + this.selectedCategoryRecord.freqcategoryuid

                let params = {
                    "paging": {
                        "number": this.selectedNum,
                        "size": this.selectedSize
                    },
                    "ordering": {
                        "orderType": this.orderType,
                        "orderField": this.orderField
                    },
                    "param": this.queryParam
                }

                HTTP_TRINITY.post(urlPath, params)
                    .then(response => {
                        if (response.data.content !== undefined) {
                            this.allFrequencyObjs = response.data.content
                            if (response.data.totalPages <= 0)
                                this.totalPages = 1
                            else
                                this.totalPages = response.data.totalPages
                        } else {
                            this.allFrequencyObjs = response.data
                            this.totalPages = 1
                        }
                        this.clearSelectedFrequencyRecord()
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },

            /*
             * Above For All About Add/Edit/Copy/Move Function
            */
            changeCategoryWindowStatus(which) {
                if (which === 'add') {
                    this.operation = which
                    this.editCategoryWindowAlive = !this.editCategoryWindowAlive
                } else {

                    if (this.selectedCategoryRecord && this.selectedCategoryRecord.freqcategoryuid && this.selectedCategoryRecord.freqcategoryuid !== '') {
                        this.operation = which

                        this.editCategoryWindowAlive = !this.editCategoryWindowAlive
                    }
                    if (this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid
                        && this.selectedCategoryRecord.freqcategoryuid !== '' && this.selectedCategoryRecord.freqcategoryuid !== 'root') {
                        HTTP_TRINITY.get(`frequency-category/findByUid?uid=` + this.selectedCategoryRecord.freqcategoryuid)
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
            changeFrequencyWindowStatus(which) {
                if (which !== 'add') {
                    if (this.selectedFrequencyRecord && this.selectedFrequencyRecord.frequencyuid && this.selectedFrequencyRecord.frequencyuid !== '') {
                        //Get Connection detail record
                        HTTP_TRINITY.get(`frequency/findByUid?uid=` + this.selectedFrequencyRecord.frequencyuid)
                            .then(response => {
                                this.freqRecord = response.data

                                //above for pass category info to connection form, if no category data, pass default value
                                if (this.freqRecord.categoryname == undefined || this.freqRecord.categoryname.trim() == '')
                                    this.freqRecord.categoryname = '/'
                                if (this.freqRecord.categoryuid == undefined || this.freqRecord.categoryuid.trim() == '')
                                    this.freqRecord.categoryuid = 'root'

                                this.operation = which
                                this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
                            })
                            .catch(error => {
                                errorHandle(this.$store, error)
                            })
                    }
                } else {
                    this.operation = which
                    this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
                }
            },
            saveCategoryWindowContentForAdd(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Frequency Category Window Save Click
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
            saveCategoryWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Frequency Category Window Save Click
                if (new_content && this.selectedCategoryRecord && (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)) {
                    new_content.index = this.selectedCategoryRecord.index   //asign old index prop to new content
                    this.allCategoryObjs[this.selectedCategoryRecord.index] = new_content   //replace object to the array
                    this.selectedCategoryRecord = new_content
                }
                this.editCategoryWindowAlive = !this.editCategoryWindowAlive
            },
            saveFrequencyWindowContentForAdd(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Frequency Window Save Click
                    this.allFrequencyObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedFrequencyRecord()
                }
                this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
            },
            saveFrequencyWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Frequency Window Save Click
                if (new_content && this.selectedFrequencyRecord && (this.selectedFrequencyRecord.index || this.selectedFrequencyRecord.index === 0)) {
                    new_content.index = this.selectedFrequencyRecord.index   //asign old index prop to new content
                    this.allFrequencyObjs[this.selectedFrequencyRecord.index] = new_content   //replace object to the array
                    this.selectedFrequencyRecord = new_content
                }
                this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
            },
            saveFrequencyWindowContentForCopy(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Frequency Window Save Click
                    //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆Frequency
                    if (this.selectedCategoryRecord.freqcategoryuid === undefined ||
                        this.selectedCategoryRecord.freqcategoryuid === new_content.frequencyuid) {
                        this.allFrequencyObjs.unshift(new_content) //add object to the top of array
                    }
                    this.clearSelectedFrequencyRecord()
                }
                this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
            },
            saveFrequencyWindowContentForMove(new_content) {
                //new_content !== undefined, it means from Frequency Window Save Click
                if (new_content && this.selectedFrequencyRecord && (this.selectedFrequencyRecord.index || this.selectedFrequencyRecord.index === 0)) {
                    if (this.selectedCategoryRecord.freqcategoryuid === undefined ||
                        this.selectedCategoryRecord.freqcategoryuid === new_content.categoryuid) {
                        new_content.index = this.selectedFrequencyRecord.index   //asign old index prop to new content
                        this.allFrequencyObjs[this.selectedFrequencyRecord.index] = new_content   //replace object to the array
                        this.selectedFrequencyRecord = new_content
                    } else {
                        this.allFrequencyObjs.splice(this.selectedFrequencyRecord.index, 1)
                        this.clearSelectedFrequencyRecord()
                    }
                }
                this.editFrequencyWindowAlive = !this.editFrequencyWindowAlive
            },

            /*
             * Above For All About Delete Function
            */
            deleteObj() {
                if (this.deleteWhich === 'Category')
                    this.deleteCategory()
                else
                    this.deleteFrequency()
            },
            deleteCategory() {
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
            deleteFrequency() {
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
            showDeleteCategoryWindow() {
                if ((this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)
                    && this.selectedCategoryRecord.freqcategoryname) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedCategoryRecord.freqcategoryname
                    this.deleteWhich = 'Category'
                }
            },
            showdeleteFrequencyWindow() {
                if ((this.selectedFrequencyRecord.index || this.selectedFrequencyRecord.index === 0)
                    && this.selectedFrequencyRecord.frequencyname) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedFrequencyRecord.frequencyname
                    this.deleteWhich = 'Frequency'
                }
            },
            closeDeleteWindow() {
                this.deleteWindowAlive = false
            },

            /*
             * Above For All About Util Function
            */
            clearSelectedCategoryRecord(tr) {
                let table = document.getElementById('categoryTable')
                for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有category row的class
                    if (table.childNodes[i] !== tr) {   //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                    }
                }
                this.selectedCategoryRecord = new Object()
            },
            clearSelectedFrequencyRecord(tr) {
                let table = document.getElementById('frequencyTable')
                for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有frequency row的class
                    if (table.childNodes[i] !== tr) {   //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'

                        if (table.childNodes[i].nodeName !== 'DIV') {   // not empty grid
                            let menuBtn = table.childNodes[i].getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                            menuBtn.style.display = 'none'
                        }
                    }
                }
                this.selectedFrequencyRecord = new Object()
            },

            //above for pagging, ordering, query
            changeNum(e, index) {
                //紀錄現在點擊的是那一頁
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.selectedPage = index   //for UI page num
                this.getFrequencies()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getFrequencies()
            },
            pageNumSelected(index) {
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.selectedPage = Number(index)   //for UI page num
                if (this.$refs.paginate) //對content list而言, 其this.$refs.paginate可能為undefined
                    this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
            },
            pageNumSelectedComboBox() {  //for Page select box
                this.selectedNum = Number(this.selectedPage) - 1
                if (this.$refs.paginate) //對content list而言, 其this.$refs.paginate可能為undefined
                    this.$refs.paginate.selected = Number(this.selectedPage) - 1
                this.getFrequencies()
            },
            applyOrder(field) {
                //先清除所有排序方式, only for UI display
                for (var x in this.orderFields) {
                    if (x !== field)
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

                this.getFrequencies()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getFrequencies()
            }

        }
    }
</script>
<style scoped>
    #barsTD {
        padding: 0px 0px;
    }

    #barsLabel {
        padding-top: 7px;
        padding-left: 8px;
    }
</style>