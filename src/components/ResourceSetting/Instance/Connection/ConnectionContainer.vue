<template>
    <div>
        <!-- For Add/Edit Category Window -->
        <connection-category-edit-window v-if="editCategoryWindowAlive" :windowAlive="editCategoryWindowAlive"
                                         @closeAdd="saveCategoryWindowContentForAdd"
                                         @closeEdit="saveCategoryWindowContentForEdit"
                                         :content="categoryRecord"
                                         :urlOp="operation"></connection-category-edit-window>
        <!-- For Add/Edit/Copy/Move Connection Window -->
        <connection-edit-window v-if="editConnectionWindowAlive" :windowAlive="editConnectionWindowAlive"
                                @closeAdd="saveConnectionWindowContentForAdd"
                                @closeEdit="saveConnectionWindowContentForEdit"
                                @closeCopy="saveConnectionWindowContentForCopy"
                                @closeMove="saveConnectionWindowContentForMove"
                                :content="connectionRecord"
                                :selectedCategoryRecord="selectedCategoryRecord"
                                :urlOp="operation"></connection-edit-window>
        <!-- For Delete Confirm Window -->
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteObj"></confirm-delete-window>
        <!-- For Apply Permission Window -->
        <permission-window v-if="applyPermissionWindowAlive" :windowAlive="applyPermissionWindowAlive"
                           window-title="Apply Permission To "
                           :objectUid="selectedConnectionRecord.connectionuid"
                           :objectName="selectedConnectionRecord.connectionname"
                           @closeApply="changePermissionWindowStatus"></permission-window>
        <!-- Connection Path Header -->
        <div class="w3-col m9 w3-animate-opacity">
            <!-- Connection Category Panel -->
            <div class="w3-small w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-container w3-card-4 w3-signal-white w3-round">
                        <p>
                            <div class="w3-row w3-border w3-round w3-padding">
                                <span><img src="src/assets/images/resource_setter/connection_category.png" alt="Connection Category" class="w3-margin-right w3-left w3-hide-small" style="height32px;width:32px"></span>
                                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;/*transform:rotate(-5deg)*/">
                                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        {{ $t('Container.Title.ConnCate') }}
                                    </div>
                                </div>
                                <i class="fa fa-trash-o w3-button w3-right" :title="$t('Container.Func.Delete')" aria-hidden="true" @click="showDeleteCategoryWindow"></i>
                                <i class="fa fa-pencil w3-button w3-right" :title="$t('Container.Func.Edit')" aria-hidden="true" @click="changeCategoryWindowStatus('edit')"></i>
                                <i class="fa fa-plus w3-button w3-right" :title="$t('Container.Func.Add')" aria-hidden="true" @click="changeCategoryWindowStatus('add')"></i>
                                <i class="fa fa-refresh w3-button w3-right" :title="$t('Container.Func.Refresh')" aria-hidden="true" @click="getCategories"></i>
                            </div>
                        </p>
                        <p>
                            <div class="w3-responsive w3-card w3-round">
                                <table class="w3-table-all">
                                    <tr class="w3-teal">
                                        <th :width="gridWidth[0]"></th>
                                        <th :width="gridWidth[1]">{{ $t('Container.Grid.Name') }}</th>
                                        <th :width="gridWidth[2]">{{ $t('Container.Grid.Description') }}</th>
                                        <th :width="gridWidth[3]">{{ $t('Container.Grid.UpdateTime') }}</th>
                                    </tr>
                                </table>
                            </div>
                            <div id="categoryContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:107px">
                                <table id="categoryTable" class="w3-table-all">
                                    <empty-grid v-if="allCategoryObjs.length <= 0"></empty-grid>
                                    <template v-else v-for="(content, index) in allCategoryObjs">
                                        <tr :id="content.conncategoryuid" :key="content.conncategoryuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnCategory(content.conncategoryuid, index)">
                                            <td :width="gridWidth[0]"></td>
                                            <td :width="gridWidth[1]">
                                                <span>{{ content.conncategoryname }}</span>
                                            </td>
                                            <td :width="gridWidth[2]">
                                                <span :title="content.description">{{ content.description.length > 25 ? content.description.substr(0, 25) + '...' : content.description }}</span>
                                            </td>
                                            <td :width="gridWidth[3]">
                                                <span>{{ content.lastupdatetime }}</span>
                                            </td>
                                        </tr>
                                    </template>
                                </table>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            <!-- Connection Panel -->
            <div class="w3-small">
                <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
                    <div class="w3-panel w3-row w3-border w3-round w3-padding">
                        <span>
                            <img src="src/assets/images/resource_setter/connection.png" class="w3-margin-right w3-left w3-hide-small"
                                 style="height:26px;width:32px">
                        </span>
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px;/*transform:rotate(-5deg)*/">
                            <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                {{ $t('Item.Connection') }}
                            </div>
                        </div>
                        <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                               placeholder="Name" style="height:28px;max-width: 200px;text-transform:uppercase" @keyup.enter="applyQuery">
                        <i class="fa fa-search w3-button" :title="$t('Container.Func.Search')" aria-hidden="true" @click="applyQuery"></i>
                        <i class="fa fa-plus w3-button w3-right" :title="$t('Container.Func.Add')" aria-hidden="true" @click="changeConnectionWindowStatus('add')"></i>
                        <i class="fa fa-refresh w3-button w3-right" :title="$t('Container.Func.Refresh')" aria-hidden="true" @click="applyQuery"></i>
                    </div>
                    <p>
                        <div class="w3-responsive w3-card w3-round">
                            <table class="w3-table-all">
                                <tr class="w3-teal">
                                    <th :width="gridWidth[0]"></th>
                                    <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Connection Name" @click="applyOrder('connectionname')">
                                        {{ $t('Container.Grid.Name') }}
                                        &nbsp;
                                        <span v-if="this.orderFields['connectionname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.orderFields['connectionname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                    <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Description" @click="applyOrder('description')">
                                        {{ $t('Container.Grid.Description') }}
                                        &nbsp;
                                        <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                    <th class="w3-btn w3-hover-none" :width="gridWidth[3]" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                        {{ $t('Container.Grid.UpdateTime') }}
                                        &nbsp;
                                        <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div id="connectionContainer" class="w3-responsive w3-card w3-round">
                            <table id="connectionTable" class="w3-table-all">
                                <empty-grid v-if="allConnectionObjs.length == 0"></empty-grid>
                                <tr v-else :id="content.connectionuid" :key="content.connectionuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                    @click="clickOnConnection(content.connectionuid, index)" v-for="(content, index) in allConnectionObjs">
                                    <td id="barsTD" :width="gridWidth[0]">
                                        <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                            <i id="barsLabel" class="fa fa-bars"></i>
                                            <div class="w3-dropdown-content w3-bar-block w3-card-4">
                                                <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changeConnectionWindowStatus('copy')"> {{ $t('Container.Func.Copy') }}</button>
                                                <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changeConnectionWindowStatus('move')"> {{ $t('Container.Func.Move') }}</button>
                                                <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changePermissionWindowStatus"> {{ $t('Container.Func.Permission') }}</button>
                                                <button class="w3-bar-item w3-button w3-padding-small w3-border-top" @click.stop="showDeleteConnectionWindow"> {{ $t('Container.Func.Delete') }}</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td :width="gridWidth[1]">
                                        <span v-if="selectedCategoryRecord && selectedCategoryRecord.conncategoryname" style="text-decoration:underline;" 
                                              @click.stop="clickOnConnectionName(content.connectionuid, index)">
                                            {{selectedCategoryRecord.conncategoryname === '/' ? selectedCategoryRecord.conncategoryname : '/'+selectedCategoryRecord.conncategoryname+'/'}}{{ content.connectionname }}
                                        </span>
                                        <span v-else style="text-decoration:underline;" @click.stop="clickOnConnectionName(content.connectionuid, index)">
                                            {{content.categoryname === '/' ? content.categoryname : '/'+content.categoryname+'/'}}{{ content.connectionname }}
                                        </span>
                                        &nbsp;
                                        <span class="w3-tiny w3-badge w3-indigo">{{ content.connectiontype }}</span>
                                    </td>
                                    <td :width="gridWidth[2]">
                                        <span :title="content.description">{{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}</span>
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
                                        <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize">
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
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import { PermissionTable } from '../../../../util_js/auth'
    import FilterPanel from '../../FilterPanel.vue'
    import ConnectionCategoryEditWindow from './ConnectionCategory/ConnectionCategoryEditWindow.vue'
    import ConnectionEditWindow from './ConnectionEditWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        data() {
            return {
                selectedCategoryRecord: new Object(),   //store which record has been selected.(Connection Categories)
                selectedConnectionRecord: new Object(),   //store which record has been selected.(Connections)
                editCategoryWindowAlive: false,  //for add/edit Connection category modal windows
                editConnectionWindowAlive: false,  //for add/edit/copy/move Connection modal windows
                applyPermissionWindowAlive: false, //for modify Permission modal windows
                operation: 'add',   //keep which operation(add,edit,copy,move) will be execute
                deleteWindowAlive: false,  //show or not show delete modal windows
                deleteName: '', //store delete object name
                deleteWhich: '', //store delete Category or Connection
                allCategoryObjs: [], //store all remote data.(Connection Categories)
                categoryRecord: new Object(),   //store detail connection category record
                allConnectionObjs: [], //store all remote data.(Connections)
                connectionRecord: new Object(), //store detail connection record
                gridWidth: ['2%', '30%', '48%', '20%'],
                //about paging info
                totalPages: 1,
                selectedPage: 1, //this is for UI use
                selectedNum: 0, //this is for backend use
                selectedSize: 10,
                //about connection ordering info
                orderFields: { //Ordering fields, only for UI
                    connectionname: "ASC",
                    host: "",
                    description: "",
                    lastupdatetime: ""
                },
                orderField: 'connectionname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
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
            clickOnCategory(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedCategoryRecord(tr)
                this.clearSelectedConnectionRecord()

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedCategoryRecord = this.allCategoryObjs[index]
                    this.selectedCategoryRecord.index = index //New prop stores which category obj will be deleted in UI
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                }

                this.changeSize()
                // this.pageNumSelected('1')  //每次'點擊'category刷新時, 重載connections都讓filter的page number回到第一頁
                // this.getConnections()   //refresh Connections content
            },
            clickOnConnection(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedConnectionRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedConnectionRecord = this.allConnectionObjs[index]
                    this.selectedConnectionRecord.index = index //New prop is stores which category obj will be deleted in UI
                    menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnConnectionName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedConnectionRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedConnectionRecord = this.allConnectionObjs[index]
                    this.selectedConnectionRecord.index = index //New prop is stores which category obj will be deleted in UI

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    menuBtn.style.display = 'block'
                }

                this.changeConnectionWindowStatus('edit')
            },
            /*
             * Above For All About Fetch Data Function
            */
            getCategories() {
                if (!PermissionTable.root && !PermissionTable.admin) {
                    if (!PermissionTable.connection_func || !PermissionTable.connection_func.view)
                        return
                }


                let params = {
                    "ordering": {
                        "orderType": "ASC",
                        "orderField": "conncategoryname"
                    }
                }

                HTTP_TRINITY.post(`connection-category/findByFilter`, params)
                    .then(response => {
                        this.allCategoryObjs = response.data

                        let rootCategory = {
                            "conncategoryuid": "root",
                            "conncategoryname": "/",
                            "description": "Root Directory",
                            "lastupdatetime": ""
                        }
                        this.allCategoryObjs.unshift(rootCategory)

                        // this.clearSelectedCategoryRecord()
                        this.clearSelectedConnectionRecord()

                        this.changeSize()
                        // this.pageNumSelected('1')  //每次category刷新時, 重載connections都讓filter的page number回到第一頁
                        // this.getConnections()   //refresh Connections content

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
            getConnections(e) {
                if (!PermissionTable.root && !PermissionTable.admin) {
                    if (!PermissionTable.connection_func || !PermissionTable.connection_func.view)
                        return
                }

                let urlPath = 'connection/findByFilter'
                if (this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid && this.selectedCategoryRecord.conncategoryuid !== '')
                    urlPath += '?categoryUid=' + this.selectedCategoryRecord.conncategoryuid

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
                            this.allConnectionObjs = response.data.content
                            if (response.data.totalPages <= 0)
                                this.totalPages = 1
                            else
                                this.totalPages = response.data.totalPages
                        } else {
                            this.allConnectionObjs = response.data
                            this.totalPages = 1
                        }
                        this.clearSelectedConnectionRecord()
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
                    if (this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid
                        && this.selectedCategoryRecord.conncategoryuid !== '' && this.selectedCategoryRecord.conncategoryuid !== 'root') {
                        HTTP_TRINITY.get(`connection-category/findByUid?uid=` + this.selectedCategoryRecord.conncategoryuid)
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
            changeConnectionWindowStatus(which) {
                if (which != 'add') {
                    if (this.selectedConnectionRecord && this.selectedConnectionRecord.connectionuid && this.selectedConnectionRecord.connectionuid !== '') {
                        //Get Connection detail record
                        HTTP_TRINITY.get(`connection/findByUid?uid=` + this.selectedConnectionRecord.connectionuid)
                            .then(response => {
                                this.connectionRecord = response.data

                                //above for pass category info to connection form, if no category data, pass default value
                                if (this.connectionRecord.categoryname == undefined || this.connectionRecord.categoryname.trim() == '')
                                    this.connectionRecord.categoryname = '/'
                                if (this.connectionRecord.categoryuid == undefined || this.connectionRecord.categoryuid.trim() == '')
                                    this.connectionRecord.categoryuid = 'root'

                                this.operation = which
                                this.editConnectionWindowAlive = !this.editConnectionWindowAlive
                            })
                            .catch(error => {
                                errorHandle(this.$store, error)
                            })
                    }
                } else {
                    this.operation = which
                    this.editConnectionWindowAlive = !this.editConnectionWindowAlive
                }
            },
            changePermissionWindowStatus() {
                if (this.selectedConnectionRecord && this.selectedConnectionRecord.connectionuid && this.selectedConnectionRecord.connectionuid !== '') {
                    this.selectedConnectionRecord.connectionuid = this.selectedConnectionRecord.connectionuid.trim()
                    this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
                }
            },
            saveCategoryWindowContentForAdd(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Connection Category Window Save Click
                    this.allCategoryObjs.splice(1, 0, new_content) //add object to the second position of array
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
            saveCategoryWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Connection Category Window Save Click
                if (new_content && this.selectedCategoryRecord && (this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)) {
                    new_content.index = this.selectedCategoryRecord.index   //asign old index prop to new content
                    this.allCategoryObjs[this.selectedCategoryRecord.index] = new_content   //replace object to the array
                    this.selectedCategoryRecord = new_content
                }
                this.editCategoryWindowAlive = !this.editCategoryWindowAlive
            },
            saveConnectionWindowContentForAdd(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Connection Window Save Click
                    this.allConnectionObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedConnectionRecord()
                }
                this.editConnectionWindowAlive = !this.editConnectionWindowAlive
            },
            saveConnectionWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Connection Window Save Click
                if (new_content && this.selectedConnectionRecord && (this.selectedConnectionRecord.index || this.selectedConnectionRecord.index === 0)) {
                    new_content.index = this.selectedConnectionRecord.index   //asign old index prop to new content
                    this.allConnectionObjs[this.selectedConnectionRecord.index] = new_content   //replace object to the array
                    this.selectedConnectionRecord = new_content
                }
                this.editConnectionWindowAlive = !this.editConnectionWindowAlive
            },
            saveConnectionWindowContentForCopy(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Connection Window Save Click
                    //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆connection
                    if (this.selectedCategoryRecord.conncategoryuid === undefined ||
                        this.selectedCategoryRecord.conncategoryuid === new_content.categoryuid) {
                        this.allConnectionObjs.unshift(new_content) //add object to the top of array
                    }
                    this.clearSelectedConnectionRecord()
                }
                this.editConnectionWindowAlive = !this.editConnectionWindowAlive
            },
            saveConnectionWindowContentForMove(new_content) {
                //new_content !== undefined, it means from Connection Window Save Click
                if (new_content && this.selectedConnectionRecord && (this.selectedConnectionRecord.index || this.selectedConnectionRecord.index === 0)) {
                    /*
                     *  this.selectedCategoryRecord.conncategoryuid === undefined, 表示沒有點選任何目錄, 即所有的connection都要出現,
                     *  this.selectedCategoryRecord.conncategoryuid === new_content.categoryuid, 表示move過去的目標category, 即目前所在的category(即目前所選擇的category)
                     *  以上兩種情形, 一律替換掉舊object即可
                    */
                    if (this.selectedCategoryRecord.conncategoryuid === undefined ||
                        this.selectedCategoryRecord.conncategoryuid === new_content.categoryuid) {
                        new_content.index = this.selectedConnectionRecord.index   //asign old index prop to new content
                        this.allConnectionObjs[this.selectedConnectionRecord.index] = new_content   //replace object to the array
                        this.selectedConnectionRecord = new_content
                    } else {
                        this.allConnectionObjs.splice(this.selectedConnectionRecord.index, 1)
                        this.clearSelectedConnectionRecord()
                    }
                }
                this.editConnectionWindowAlive = !this.editConnectionWindowAlive
            },

            /*
             * Above For All About Delete Function
            */
            deleteObj() {
                if (this.deleteWhich === 'Category')
                    this.deleteCategory()
                else
                    this.deleteConnection()
            },
            deleteCategory() {
                HTTP_TRINITY.get(`connection-category/delete`, {
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
            deleteConnection() {
                HTTP_TRINITY.get(`connection/delete`, {
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
            showDeleteCategoryWindow() {
                if ((this.selectedCategoryRecord.index || this.selectedCategoryRecord.index === 0)
                    && this.selectedCategoryRecord.conncategoryname && this.selectedCategoryRecord.conncategoryname !== '/') {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedCategoryRecord.conncategoryname
                    this.deleteWhich = 'Category'
                }
            },
            showDeleteConnectionWindow() {
                if ((this.selectedConnectionRecord.index || this.selectedConnectionRecord.index === 0)
                    && this.selectedConnectionRecord.connectionname) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedConnectionRecord.connectionname
                    this.deleteWhich = 'Connection'
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
                    if (table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                }
                this.selectedCategoryRecord = new Object()
            },
            clearSelectedConnectionRecord(tr) {
                let table = document.getElementById('connectionTable')
                for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有connection row的class
                    if (table.childNodes[i] !== tr) {  //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'

                        if (table.childNodes[i].nodeName !== 'DIV') {   // not empty grid
                            let menuBtn = table.childNodes[i].getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                            menuBtn.style.display = 'none'
                        }
                    }
                }
                this.selectedConnectionRecord = new Object()
            },
            //above for pagging, ordering, query
            changeNum(e, index) {
                //紀錄現在點擊的是那一頁
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.selectedPage = index   //for UI page num
                this.getConnections()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getConnections()
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
                this.getConnections()
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

                this.getConnections()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getConnections()
            }
        },
        components: {
            'filter-panel': FilterPanel,
            'connection-category-edit-window': ConnectionCategoryEditWindow,
            'connection-edit-window': ConnectionEditWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'permission-window': PermissionWindow,
            'page': page,
            'empty-grid': EmptyGrid
        }
    }
</script>
<style scoped>
    select {
        height: 30px;
        width: 86px;
        padding: 0px 0px 0px 0px;
    }
    input {
        height: 31px;
        width: 260px;
    }
    #barsTD {
        padding: 0px 0px;
    }
    #barsLabel {
        padding-top: 7px;
        padding-left: 8px;
    }
</style>