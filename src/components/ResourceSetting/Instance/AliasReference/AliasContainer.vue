<template>
    <div>
        <!-- For Add/Edit Virtual Agent Window -->
        <alias-table-edit-window v-if="aliasWindowAlive"
                                 :content="selectedRecord"
                                 @closeEdit="saveAliasWindowContentForEdit"></alias-table-edit-window>
        <!-- For Delete Confirm Window -->
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteAlias"></confirm-delete-window>
        <alias-table-permission-window v-if="applyPermissionWindowAlive"
                                       :busentityname="selectedRecord.busentityname"
                                       :alias="selectedRecord.alias"
                                       @closeApplyPermission="applyPermission"></alias-table-permission-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div v-if="!showMode" class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                                <div class="w3-row">
                                    <span class="w3-col m6 w3-left">
                                        <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                               placeholder="Search For Name" style="text-transform:uppercase">
                                        <i class="fa fa-search w3-button w3-theme-d2" title="Search For Name" aria-hidden="true" @click="applyQuery"></i>
                                    </span>
                                    <span class="w3-col m6 w3-right">
                                        <!--i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button-->
                                        <i v-if="showMode" class="fa fa-trash-o w3-button w3-hide-small w3-hide-medium w3-right" title="Delete All Alias" aria-hidden="true" @click="showDeleteWindow"></i>
                                        <i v-if="showMode" class="fa fa-pencil w3-button w3-hide-small w3-hide-medium w3-right" title="Edit Alias" aria-hidden="true" @click="changeAliasWindowStatus()"></i>
                                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getEntities"></i>
                                        <span class="w3-dropdown-hover w3-right">
                                            <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                            <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                                <div v-if="showMode">
                                                    <i class="w3-bar-item fa fa-pencil w3-button w3-hide-large" aria-hidden="true" @click="changeAliasWindowStatus()"> Edit Alias</i>
                                                    <i class="w3-bar-item fa fa-trash-o w3-button w3-hide-large" aria-hidden="true" @click="changePermissionWindowStatus()"> Delete All Alias</i>
                                                    <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="applyPermission()"> Apply Permission</i>
                                                </div>
                                                <hr v-if="showMode" class="w3-border-black" style="padding:0px;margin:0px">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode" class="w3-small w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-container w3-card-4 w3-signal-white w3-round">
                        <div class="w3-panel w3-border w3-round w3-padding">
                            <span>
                                <img src="src/assets/images/resource_setter/entity.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        All Entitie
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                                   placeholder="Name" style="height:28px;max-width: 200px" @keyup.enter="applyQuery">
                            <i class="fa fa-search w3-button" title="Search" aria-hidden="true" @click="applyQuery"></i>
                            <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                        </div>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Entity Name" @click="applyOrder('busentityname')">
                                                Name
                                                &nbsp;
                                                <span v-if="this.orderFields['busentityname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['busentityname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Description" @click="applyOrder('description')">
                                                Description
                                                &nbsp;
                                                <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[3]" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                                Update Time
                                                &nbsp;
                                                <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                        </tr>
                                    </table>
                                </div>
                                <div id="entityContainer" class="w3-responsive w3-card w3-round">
                                    <table id="entityTable" class="w3-table-all w3-left">
                                        <empty-grid v-if="allEntityObjs.length <= 0"></empty-grid>
                                        <tr v-else :id="content.busentityuid" :key="content.busentityuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnEntityRecord(content.busentityuid, index)" v-for="(content, index) in allEntityObjs">
                                            <td id="barsTD" :width="gridWidth[0]">
                                                <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                                    <i id="barsLabel" class="fa fa-bars"></i>
                                                    <div class="w3-dropdown-content w3-bar-block w3-card-4">
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="showDeleteWindow"> Clear All Alias</button>
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="applyPermission"> Permission</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td :width="gridWidth[1]">
                                                <span style="text-decoration:underline;" @click.stop="clickOnEntityRecordName(content.busentityuid, index)">
                                                    {{ content.busentityname }}
                                                </span>
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
                                                Page Size
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
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            <div v-else class="w3-small">
                <div :key="content.busentityuid+'table'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allEntityObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="src/assets/images/resource_setter/entity.png" alt="Entity Name" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>{{ content.busentityname }}</p>
                        <br>
                        <alias-table-panel :alias="content.alias"></alias-table-panel>
                        <hr class="w3-border-black w3-clear">
                        <p>{{ content.description }}</p>
                        <span class="w3-right">
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit Alias" @click="clickOnEntityPanel('edit', index, content)">
                                <i class="fa fa-pencil"></i>
                            </button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete All Alias" @click="clickOnEntityPanel('delete', index, content)">
                                <i class="fa fa-trash-o"></i>
                            </button>
                        </span>
                    </div>
                    <alias-table-edit-panel v-else :index="index" :content="content" @closeEdit="closeEditable"></alias-table-edit-panel>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import { PermissionTable } from '../../../../util_js/auth'
    import AliasTableEditPanel from './AliasTableEditPanel.vue'
    import AliasTableEditWindow from './AliasTableEditWindow.vue'
    import AliasTablePermissionWindow from './AliasTablePermissionWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import AliasTablePanel from './AliasTablePanel.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        data() {
            return {
                showMode: true, //switch content list or table list
                selectedRecord: new Object(),   //store which record has been selected.(Business Entity)
                aliasWindowAlive: false,  //for edit Alias modal windows
                deleteWindowAlive: false,  //for delete all alias under entity modal windows
                applyPermissionWindowAlive: false, //for modify Permission modal windows
                deleteName: '',     //store which obj name will be delete
                allEntityObjs: [], //store all Entities
                editable: [],   //for all virtual agents content edit panel
                gridWidth: ['2%', '30%', '48%', '20%'],
                //about paging info
                totalPages: 1,
                selectedPage: 1, //this is for UI use
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                orderFields: { //Ordering fields, only for UI
                    busentityname: "ASC",
                    description: "",
                    lastupdatetime: ""
                },
                orderField: 'busentityname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        mounted() {
            this.getEntities()
        },
        methods: {
            //When Grid List click on entity record
            clickOnEntityRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allEntityObjs[index]
                    this.selectedRecord.index = index //New prop is stores which entity obj will be deleted in UI
                    menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnEntityRecordName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allEntityObjs[index]
                    this.selectedRecord.index = index //New prop is stores which entity obj will be deleted in UI

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    menuBtn.style.display = 'block'
                }

                this.changeAliasWindowStatus()
            },
            //When Content List click on vragent operation button
            clickOnEntityPanel(which, index, content) {
                if (content) {
                    this.selectedRecord = content
                    this.selectedRecord.index = index //New prop stores which entity alias obj will be deleted in UI

                    if (which == 'edit')
                        this.openEditable(index)
                    else if (which == 'delete')
                        this.showDeleteWindow()
                }
            },
            //Get All business entity info
            getEntities() {
                if (!PermissionTable.root && !PermissionTable.admin) {
                    if (!PermissionTable.alias_func || !PermissionTable.alias_func.view)
                        return
                }

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

                HTTP_TRINITY.post(`busentity/findByFilter?withAlias=true`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allEntityObjs = response.data.content
                            this.totalPages = response.data.totalPages
                        } else {
                            this.allEntityObjs = response.data
                            this.totalPages = 1
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            //for Content List, edit panel
            openEditable(index) {
                //Get Virtual Agent detail record
                HTTP_TRINITY.get(`busentity/findByUid?withAlias=true&uid=` + this.selectedRecord.busentityuid)
                    .then(response => {
                        /*
                            this.$set is for above :
                            http://www.jianshu.com/p/358c1974d9a5
                            https://jsfiddle.net/qnq2munr/2/
                        */
                        if (this.editable[index] === undefined) {
                            this.$set(this.editable, index, true)
                        } else {
                            this.$set(this.editable, index, !this.editable[index])
                        }

                        if (response.data !== undefined) {
                            this.allEntityObjs[index] = response.data
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            closeEditable(index, content) {
                this.$set(this.editable, index, false)

                if (content) {
                    this.allEntityObjs[index] = content
                }
            },
            //above for delete window
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.busentityname && this.selectedRecord.busentityuid) {
                    this.deleteWindowAlive = true
                    this.deleteName = 'all aliases under ' + this.selectedRecord.busentityname
                }
            },
            deleteAlias() {
                HTTP_TRINITY.get(`objectalias/deleteByParentUid`, {
                    params: {
                        parentUid: this.selectedRecord.busentityuid.trim()
                    }
                })
                    .then(response => {
                        this.allEntityObjs[this.selectedRecord.index].alias = []
                        this.clearSelectedRecord()
                        this.closeDeleteWindow()
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            closeDeleteWindow() {
                this.deleteWindowAlive = false
            },
            //about for alias edit window
            changeAliasWindowStatus() {
                if (this.selectedRecord && this.selectedRecord.busentityuid && this.selectedRecord.busentityuid !== '') {
                    //Get Virtual Agent detail record
                    HTTP_TRINITY.get(`objectalias/findExtraByParentUid?parentUid=` + this.selectedRecord.busentityuid)
                        .then(response => {
                            this.selectedRecord.alias = response.data
                            this.aliasWindowAlive = !this.aliasWindowAlive
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                }
            },
            saveAliasWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Agent Window Save Click
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.allEntityObjs[this.selectedRecord.index].alias = new_content   //replace object to the array
                    this.selectedRecord.alias = new_content
                }
                this.aliasWindowAlive = !this.aliasWindowAlive
            },
            //about Apply Permission Window for grid list
            applyPermission() {
                if (this.selectedRecord && this.selectedRecord.busentityuid && this.selectedRecord.busentityuid !== '') {
                    if (this.selectedRecord.alias && this.selectedRecord.alias.length > 0) {
                        if (PermissionTable.root || PermissionTable.admin || (PermissionTable.alias_func && PermissionTable.alias_func.modify)) {
                            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
                        } else {
                            let newStatus = {
                                "msg": "You do not have 'Edit' Permission!",
                                "status": "Warn"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    } else {
                        let newStatus = {
                            "msg": "Empty Alias! Please add alias object first.",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                }
            },
            //about for change show mode(Grid List & Content List)
            changeShowMode() {
                this.showMode = !this.showMode
                this.selectedRecord = new Object()
            },
            clearSelectedRecord(tr) {
                let table = document.getElementById('entityTable')
                if (table && table.childNodes) {  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有agent row的class
                        if (table.childNodes[i] !== tr) { //等於自己的(即點到的那一列)不用重設
                            table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'

                            if (table.childNodes[i].nodeName !== 'DIV') {   // not empty grid
                                let menuBtn = table.childNodes[i].getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                                menuBtn.style.display = 'none'
                            }
                        }
                    }
                }

                this.selectedRecord = new Object()
            },
            //above for pagging, ordering, query
            changeNum(e, index) {
                //紀錄現在點擊的是那一頁
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.selectedPage = index   //for UI page num
                this.getEntities()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getEntities()
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
                this.getEntities()
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

                this.getEntities()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getEntities()
            }
        },
        components: {
            'alias-table-edit-panel': AliasTableEditPanel,
            'alias-table-edit-window': AliasTableEditWindow,
            'alias-table-permission-window': AliasTablePermissionWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'alias-table-panel': AliasTablePanel,
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
        width: 210px;
    }
    #barsTD {
        padding: 0px 0px;
    }

    #barsLabel {
        padding-top: 7px;
        padding-left: 8px;
    }
</style>