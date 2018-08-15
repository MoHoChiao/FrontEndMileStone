<template>
    <div>
        <package-add-window :windowAlive="addWindowAlive"
                            window-title="Add New External Package"
                            :content="packageRecord"
                            :urlOp="operation"
                            @close="close"
                            @closeAdd="saveAddWindow"
                            @closeEdit="saveEditWindow">
        </package-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               :is-loading="delButtonLoading"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deletePackage">
        </confirm-delete-window>
        <files-rules-window v-if="attachWindowAlive"
                            :window-title="'Attach Rule Files To ' + selectedPackageRecord.packagename"
                            :packageuid="selectedPackageRecord.packageuid"
                            :files="selectedPackageRecord.files"
                            @closeApply="changeJarWindowStatus"></files-rules-window>
        <publish-rule-window v-if="publishWindowAlive"
                             @closePublish="changePublishWindowStatus"></publish-rule-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                                <div class="w3-row">
                                    <span class="w3-left">
                                        <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                               placeholder="Package Name" style="text-transform:uppercase" @keyup.enter="applyQuery">
                                        <i class="fa fa-search w3-button w3-theme-d2" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                    </span>
                                    <i v-if="showMode" class="w3-right fa fa-toggle-on w3-button" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                    <i v-else class="w3-right fa fa-toggle-off w3-button" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                    <i class="w3-right w3-bar-item fa fa-share-square w3-button w3-right" title="Publish Rules to JCS Agent" aria-hidden="true" @click="changePublishWindowStatus"></i>
                                    <span class="w3-right">
                                        <form enctype="multipart/form-data" novalidate>
                                            <label>
                                                <i class="w3-bar-item fa fa-upload w3-button w3-right" title="Import Package" aria-hidden="true"></i>
                                                <input id="ExternalRuleInputFile" type="file" name="file"
                                                       @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                                                       accept=".jar" class="input-file" hidden>
                                            </label>
                                        </form>
                                    </span>
                                    <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete Package" aria-hidden="true" @click="showDeleteWindow"></i>
                                    <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit Package" aria-hidden="true" @click="changeEditWindowStatus('edit')"></i>
                                    <i class="w3-right fa fa-plus w3-button" title="Add Package" aria-hidden="true" @click="changeEditWindowStatus('add')"></i>
                                    <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode" class="w3-small">
                <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
                    <p>
                        <div>
                            <span><img src="/src/assets/images/resource_setter/package.png" alt="External Rule" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                            <span>
                                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        External Rule
                                    </div>
                                </div>
                            </span>
                        </div>
                    </p>
                    <p>
                        <div>
                            <div class="w3-responsive w3-card w3-round">
                                <table class="w3-table-all">
                                    <tr class="w3-teal">
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[0]" title="Order by Package Name" @click="applyOrder('packagename')">
                                            Package Name
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['packagename'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['packagename'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Description" @click="applyOrder('description')">
                                            Description
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                            Update Time
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                            <div id="packageContainer" class="w3-responsive w3-card w3-round">
                                <table id="packageTable" class="w3-table-all w3-left">
                                    <empty-grid v-if="allPackageObjs.length == 0"></empty-grid>
                                    <tr :id="content.packageuid" :key="content.packageuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                        @click="clickOnPackageRecord(content.packageuid, index)" v-for="(content, index) in allPackageObjs">
                                        <td :width="gridWidth[0]">
                                            <span>{{ content.packagename }}</span>
                                        </td>
                                        <td :width="gridWidth[1]">
                                            <span :title="content.description">{{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}</span>
                                        </td>
                                        <td :width="gridWidth[2]">
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
                                        <span class="w3-col m6 w3-hide-medium" style="padding-top:16px">
                                            Page Size
                                        </span>
                                        <span class="w3-col m6" style="padding-top:8px">
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
                        </div>
                    </p>
                </div>
            </div>
            <div v-else class="w3-small">
                <div :key="content.packageuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin loading-area" v-for="(content, index) in allPackageObjs">
                    <over-lay-loading-div v-if="editable[index] === undefined || !editable[index]" loadingSize="100px" textSize="20px">
                        <div slot="content">
                            <img src="/src/assets/images/resource_setter/package.png" alt="Package" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                            <span class="w3-right w3-opacity">{{content.lastupdatetime}}</span>
                            <p>
                                {{ content.packagename }}
                            </p>
                            <files-rules-panel :key="content.packageuid+'FilePanel'" :packageuid="content.packageuid" :files="content.files"></files-rules-panel>
                            <hr class="w3-border-black w3-clear">
                            <p class="w3-small">{{ content.description }}</p>
                            <span class="w3-right">
                                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit" @click="clickOnPackagePanel('edit', index, content)">
                                    <i class="fa fa-pencil" />
                                </button>
                                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete" @click="clickOnPackagePanel('delete', index, content)">
                                    <i class="fa fa-trash-o" />
                                </button>
                            </span>
                        </div>
                    </over-lay-loading-div>
                    <package-edit-panel v-else :key="content.packageuid+'EditPanel1'"
                                        :index="index" :content="content" @closeEdit="changeEditable"></package-edit-panel>
                </div>
            </div>
        </div>
        <over-lay-loading :is-loading="allOverlayLoading" :loading-text="allOverlayLoadingText"></over-lay-loading>
    </div>
</template>
<script>
    import { HTTP_TRINITY, HTTP_TRINITY_Download, HTTP_TRINITY_Upload, errorHandle } from '../../../util_js/axios_util'
    import PackageEditPanel from './PackageEditPanel.vue'
    import FilesAndRulesPanel from './FilesAndRulesPanel.vue'
    import PackageAddWindow from './PackageAddWindow.vue'
    import PublishRuleWindow from './PublishRuleWindow.vue'
    import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue'
    import FilesAndRulesWindow from './FilesAndRulesWindow.vue'
    import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
    import OverlayLoading from '../../Common/Loading/OverlayLoading.vue'
    import page from '../page.vue'
    import { wait, NON_SPEED, SLOW_SPEED, FAST_SPEED } from '../../../util_js/utils'
    import EmptyGrid from '../../Common/EmptyGrid.vue'

    export default {
        components: {
            'package-edit-panel': PackageEditPanel,
            'files-rules-panel': FilesAndRulesPanel,
            'package-add-window': PackageAddWindow,
            'publish-rule-window': PublishRuleWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'files-rules-window': FilesAndRulesWindow,
            'over-lay-loading-div': OverlayLoadingDIV,
            'over-lay-loading': OverlayLoading,
            'page': page,
            'empty-grid': EmptyGrid
        },
        data() {
            return {
                delButtonLoading: false,    //control the status of delete window buttons
                allOverlayLoading: false,    //control the status of all page overlay loading
                allOverlayLoadingText: 'Loading',    //control the status of all page overlay loading
                showMode: true, //switch content list or table list
                addWindowAlive: false,  //for add Package modal windows
                operation: 'add',
                attachWindowAlive: false, //for upload jar file modal windows
                publishWindowAlive: false, //for publish Package file modal windows
                deleteWindowAlive: false,  //for delete Package modal windows
                deleteName: '',     //store which obj name will be delete
                allPackageObjs: [], //store all Package info
                editable: [],   //for all Package content edit panel
                selectedPackageRecord: new Object(),   //store which Package has been clicked.
                packageRecord: new Object(), //store detail record
                searchText: '',
                gridWidth: ['30%', '45%', '25%'],
                //about paging info
                totalPages: 1,
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                orderFields: { //Ordering fields, only for UI
                    packagename: "ASC",
                    description: "",
                    lastupdatetime: ""
                },
                orderField: 'packagename',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        mounted() {
            this.getPackages()
        },
        methods: {
            //When Grid List click on record
            clickOnPackageRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allPackageObjs[index]
                    this.selectedRecord.index = index //New prop is stores which obj will be deleted in UI
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                }
            },
            clickOnPackagePanel(which, index, content) {
                if (content) {
                    this.selectedRecord = content
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    if (which == 'edit')
                        this.changeEditable(index)
                    else if (which == 'delete')
                        this.showDeleteWindow()
                }
            },
            getPackages(e) {
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

                HTTP_TRINITY.post(`dm-ext-package/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allPackageObjs = response.data.content
                            this.totalPages = response.data.totalPages
                        } else {
                            this.allPackageObjs = response.data
                            this.totalPages = 1
                        }
                        this.clearSelectedRecord()
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            changeEditable(index, content) {
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

                if (content !== undefined) {
                    content.files = this.allPackageObjs[index].files   //由於後端不會再回傳jar files, 因此這裡把舊的代入
                    this.allPackageObjs[index] = content
                }
            },
            changeJarWindowStatus(record) {
                if (record)
                    this.selectedPackageRecord = record
                this.attachWindowAlive = !this.attachWindowAlive
            },
            changePublishWindowStatus() {
                this.publishWindowAlive = !this.publishWindowAlive
            },
            //above for delete window
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.packagename) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedRecord.packagename
                }
            },
            deletePackage() {
                this.delButtonLoading = true
                HTTP_TRINITY.get(`dm-ext-package/delete`, {
                    params: {
                        uid: this.selectedRecord.packageuid
                    }
                })
                    .then(response => {
                        this.allPackageObjs.splice(this.selectedRecord.index, 1)
                        this.clearSelectedRecord()
                        this.closeDeleteWindow()
                        this.delButtonLoading = false
                    })
                    .catch(error => {
                        this.delButtonLoading = false
                        errorHandle(this.$store, error)
                    })
            },
            closeDeleteWindow() {
                this.deleteWindowAlive = false
            },
            changeShowMode() {
                this.showMode = !this.showMode
                this.clearSelectedRecord()
            },
            changeEditWindowStatus(which) {
                if (which != 'add') {
                    if (this.selectedRecord && this.selectedRecord.packageuid && this.selectedRecord.packageuid !== '') {
                        //Get detail record
                        HTTP_TRINITY.get(`dm-ext-package/findByUid?uid=` + this.selectedRecord.packageuid)
                            .then(response => {
                                this.packageRecord = response.data
                                this.operation = which
                                this.addWindowAlive = !this.addWindowAlive
                            })
                            .catch(error => {
                                errorHandle(this.$store, error)
                            })
                    }
                } else {
                    this.operation = which
                    this.addWindowAlive = !this.addWindowAlive
                }
            },
            close() {
                this.addWindowAlive = false
            },
            saveAddWindow(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Window Save Click
                    this.allPackageObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedRecord()
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            saveEditWindow(new_content) {
                //new_content !== undefined, it means from Agent Window Save Click
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.allPackageObjs[this.selectedRecord.index] = new_content   //replace object to the array
                    this.selectedRecord = new_content
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            importPackage(fileName, formData) {
                this.allOverlayLoadingText = 'Import Jar File - ' + fileName + '...'
                this.allOverlayLoading = true

                HTTP_TRINITY_Upload.post(`dm-ext-package/import`, formData)
                    .then(response => {
                        this.allOverlayLoading = false
                        if (response.data === true) {
                            this.allOverlayLoading = false

                            this.getPackages()
                            let newStatus = {
                                "msg": "Import Jar File - " + fileName + " Success.",
                                "status": "Success"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                            return
                        } else {
                            this.getPackages()
                            let newStatus = {
                                "msg": "Import " + fileName + " error! Please look at the error log.",
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                            return
                        }

                    })
                    .catch(error => {
                        this.allOverlayLoading = false
                        this.getPackages()
                        errorHandle(this.$store, error)
                    });
            },
            filesChange(fieldName, fileList) {
                // handle file changes
                var formData = new FormData()

                if (fileList.length !== 1) return

                var fileName = fileList[0].name
                if (fileName.toLowerCase().indexOf('.jar') === -1) return

                // append the files to FormData
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        formData.append(fieldName, fileList[x], fileList[x].name);
                    });

                this.importPackage(fileName, formData);

                //清掉file input內容, 讓它可以再次選擇相同的檔案名稱
                let input = document.getElementById("ExternalRuleInputFile")
                input.value = ''
            },
            //clear selected for UI
            clearSelectedRecord(tr) {
                let table = document.getElementById('packageTable')
                if (table && table.childNodes) {  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有package row的class
                        if (table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                            table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                    }
                }

                this.selectedRecord = new Object()
            },
            //above for pagging, ordering, query
            changeNum(e, index) {
                //紀錄現在點擊的是那一頁
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.getPackages()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getPackages()
            },
            pageNumSelected(index) {
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                if (this.$refs.paginate)
                    this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
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

                this.getPackages()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getPackages()
            }
        }
    }
</script>
<style scoped>
    select {
        height: 35px;
        width: 86px;
    }

    input {
        height: 31px;
        width: 210px;
    }
</style>

