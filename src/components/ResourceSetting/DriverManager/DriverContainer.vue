<template>
    <div>
        <driver-add-window v-if="addWindowAlive"
                           window-title="Add New Driver"
                           @closeAdd="saveAddWindow">
        </driver-add-window>
        <driver-edit-window :windowAlive="editWindowAlive"
                            window-title="Edit Driver"
                            :content="selectedRecord"
                            :driverClassList="driverClassList"
                            @closeEdit="closeEditWindow">
        </driver-edit-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               :is-loading="delButtonLoading"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteDriver">
        </confirm-delete-window>
        <driver-jar-window v-if="attachWindowAlive"
                           :window-title="'Attach Jar To ' + selectedRecord.name"
                           :driverName="selectedRecord.name"
                           :jarFiles="selectedRecord.jarFiles"
                           @closeApply="changeJarWindowStatus">
        </driver-jar-window>
        <publish-driver-window v-if="publishWindowAlive"
                               window-title="Publish Drivers To JCS"
                               @closeApply="changePublishWindowStatus">
        </publish-driver-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div v-if="!showMode" class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                                <div class="w3-row">
                                    <span class="w3-left">
                                        <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="inputStr"
                                               placeholder="Name" style="text-transform:uppercase" @keyup.enter="searchBy">
                                        <i class="fa fa-search w3-button w3-theme-d2" title="Reload" aria-hidden="true" @click="searchBy"></i>
                                    </span>
                                    <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                    <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                    <span class="w3-dropdown-hover w3-right">
                                        <i class="fa fa-file-archive-o w3-button" title="Import/Export/Publish" aria-hidden="true"></i>
                                        <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block w3-small">
                                            <div v-if="!allOverlayLoading">
                                                <form enctype="multipart/form-data" novalidate>
                                                    <label>
                                                        <i class="w3-bar-item fa fa-upload w3-button w3-right" title="Import Drivers" aria-hidden="true"> Import Drivers</i>
                                                        <input id="DriverInputFile" type="file" name="file"
                                                               @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                                                               accept=".zip" class="input-file">
                                                    </label>
                                                </form>
                                                <i class="w3-bar-item fa fa-download w3-button w3-right" title="Export Drivers" aria-hidden="true" @click="exportJDBC"> Export Drivers</i>
                                                <i class="w3-bar-item fa fa-share-square w3-button w3-right" title="Publish Drivers" aria-hidden="true" @click="changePublishWindowStatus"> Publish Drivers</i>
                                            </div>
                                        </div>
                                    </span>
                                    <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete" aria-hidden="true" @click="showDeleteWindow()"></i>
                                    <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit" aria-hidden="true" @click="changeEditWindowStatus('edit')"></i>
                                    <i class="fa fa-plus w3-button w3-right" title="Add New Driver" aria-hidden="true" @click="changeEditWindowStatus('add')"></i>
                                    <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getDrivers"></i>
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
                                <img src="/src/assets/images/resource_setter/driver.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        Driver Manager
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="inputStr"
                                   placeholder="Name" style="height:28px;max-width: 200px" @keyup.enter="searchBy">
                            <i class="fa fa-search w3-button" title="Search" aria-hidden="true" @click="searchBy"></i>

                            <!--<i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                            <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>-->
                            <span class="w3-dropdown-hover w3-right">
                                <i class="fa fa-file-archive-o w3-button" title="Import/Export/Publish" aria-hidden="true"></i>
                                <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block w3-small">
                                    <div v-if="!allOverlayLoading">
                                        <form enctype="multipart/form-data" novalidate>
                                            <label>
                                                <i class="w3-bar-item fa fa-upload w3-button w3-right" title="Import Drivers" aria-hidden="true"> Import Drivers</i>
                                                <input id="DriverInputFile" type="file" name="file"
                                                       @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                                                       accept=".zip" class="input-file">
                                            </label>
                                        </form>
                                        <i class="w3-bar-item fa fa-download w3-button w3-right" title="Export Drivers" aria-hidden="true" @click="exportJDBC"> Export Drivers</i>
                                        <i class="w3-bar-item fa fa-share-square w3-button w3-right" title="Publish Drivers" aria-hidden="true" @click="changePublishWindowStatus"> Publish Drivers</i>
                                    </div>
                                </div>
                            </span>
                            <i class="fa fa-plus w3-button w3-right" title="Add New Driver" aria-hidden="true" @click="changeEditWindowStatus('add')"></i>
                            <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getDrivers"></i>
                        </div>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Name" @click="sortBy('name')">
                                                Name
                                                &nbsp;&nbsp;
                                                <span v-if="this.sortKey == 'name' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.sortKey == 'name' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Driver" @click="sortBy('driver')">
                                                JDBC Driver
                                                &nbsp;&nbsp;
                                                <span v-if="this.sortKey == 'driver' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.sortKey == 'driver' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[3]" title="Order by Update Time" @click="sortBy('url')">
                                                JDBC URL
                                                &nbsp;&nbsp;
                                                <span v-if="this.sortKey == 'url' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.sortKey == 'url' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                        </tr>
                                    </table>
                                </div>
                                <div id="driverContainer" class="w3-responsive w3-card w3-round">
                                    <table id="driverTable" class="w3-table-all w3-left">
                                        <empty-grid v-if="sortedData.length == 0"></empty-grid>
                                        <tr v-else :id="content.name" :key="content.name" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnDriverRecord(content.name, index)" v-for="(content, index) in sortedData">
                                            <td id="barsTD" :width="gridWidth[0]">
                                                <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                                    <i id="barsLabel" class="fa fa-bars"></i>
                                                    <div class="w3-dropdown-content w3-bar-block w3-border w3-card-4">
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="showDeleteWindow"> Delete</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td :width="gridWidth[1]">
                                                <span style="text-decoration:underline;"  @click.stop="clickOnDriverRecordName(content.name, index)">
                                                    {{ content.name }}
                                                </span>
                                            </td>
                                            <td :width="gridWidth[2]">
                                                <span>{{ content.driver }}</span>
                                            </td>
                                            <td :width="gridWidth[3]">
                                                <span>{{ content.url }}</span>
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
                <div :key="content.name" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin loading-area" v-for="(content, index) in allDriverObjs">
                    <over-lay-loading-div v-if="editable[index] === undefined || !editable[index]" loadingSize="100px" textSize="30px">
                        <div slot="content">
                            <img src="/src/assets/images/resource_setter/driver.png" alt="Driver" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                            <span class="w3-right w3-opacity">{{content.owner}}</span>
                            <p>
                                {{ content.name }}
                            </p>
                            <p><span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-3deg)">{{ content.driver }}</span></p>
                            <driver-jar-panel :key="content.name+'JarPanel'" :driverName="content.name" :jarFiles="content.jarFiles"></driver-jar-panel>
                            <br>
                            <span class="w3-right">
                                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit" @click="clickOnDriverPanel('edit', index, content)">
                                    <i class="fa fa-pencil"></i>
                                </button>
                                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete" @click="clickOnDriverPanel('delete', index, content)">
                                    <i class="fa fa-trash-o"></i>
                                </button>
                            </span>
                        </div>
                    </over-lay-loading-div>
                    <driver-edit-panel v-else :key="content.name+'EditPanel1'"
                                       :index="index" :content="content" @closeEdit="changeEditable"></driver-edit-panel>
                </div>
            </div>
        </div>
        <over-lay-loading :is-loading="allOverlayLoading" :loading-text="allOverlayLoadingText"></over-lay-loading>
    </div>
</template>
<script>
    import { HTTP_TRINITY, HTTP_TRINITY_Download, HTTP_TRINITY_Upload, errorHandle } from '../../../util_js/axios_util'
    import DriverEditPanel from './DriverEditPanel.vue'
    import DriverJarPanel from './DriverJarPanel.vue'
    import DriverAddWindow from './DriverAddWindow.vue'
    import DriverEditWindow from './DriverEditWindow.vue'
    import PublishDriverWindow from './PublishDriverWindow.vue'
    import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue'
    import DriverJarWindow from './DriverJarWindow.vue'
    import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
    import OverlayLoading from '../../Common/Loading/OverlayLoading.vue'
    import page from '../page.vue'
    import { wait, NON_SPEED, SLOW_SPEED, FAST_SPEED } from '../../../util_js/utils'
    import EmptyGrid from '../../Common/EmptyGrid.vue'

    export default {
        components: {
            'driver-edit-panel': DriverEditPanel,
            'driver-jar-panel': DriverJarPanel,
            'driver-add-window': DriverAddWindow,
            'driver-edit-window': DriverEditWindow,
            'publish-driver-window': PublishDriverWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'driver-jar-window': DriverJarWindow,
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
                addWindowAlive: false,  //for add driver modal windows
                editWindowAlive: false,
                attachWindowAlive: false, //for upload jar file modal windows
                publishWindowAlive: false, //for publish driver file modal windows
                deleteWindowAlive: false,  //for delete driver modal windows
                deleteIndex: -1,    //store which index will be delete
                deleteUid: '',      //store which obj will be delete
                deleteName: '',     //store which obj name will be delete
                allDriverObjs: [], //store all drivers info
                driverClassList: [],
                editable: [],   //for all driver content edit panel
                selectedRecord: new Object(),   //store which driver attach button has been clicked.
                searchText: '',
                gridWidth: ['2%', '18%', '30%', '50%'],
                //about paging info
                totalPages: 1,
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                sortKey: 'name',
                sortOrder: 'ASC',
                //about query param
                inputStr: '',
                queryStr: ''
            }
        },
        mounted() {
            this.getDrivers()
        },
        computed: {
            sortedData: function () {
                return _.orderBy(this.filterData, this.sortKey, this.sortOrder.toLowerCase());
            },
            filterData: function () {
                if (this.queryStr.length == 0)
                    return this.allDriverObjs;

                var qs = this.queryStr;

                if (_.startsWith(this.queryStr, '%') && _.endsWith(this.queryStr, '%')) {
                    qs = qs.slice(1);
                    qs = qs.slice(0, -1); // %xxx% => xxx
                } else if (_.startsWith(this.queryStr, '%')) {
                    qs = qs.slice(1) + '$'; // %xxx => xxx$
                } else if (_.endsWith(this.queryStr, '%')) {
                    qs = '^' + qs.slice(0, -1); // xxx% => ^xxx
                } else {
                    qs = '^' + qs + '$'; // xxx => ^xxx$
                }

                var reg = new RegExp(qs, 'i');

                return _.filter(this.allDriverObjs, obj => { return reg.test(obj.name); });
            }
        },
        methods: {
            searchBy: function () {
                this.queryStr = this.inputStr;
            },
            sortBy: function (key) {
                if (key == this.sortKey) {
                    this.sortOrder = (this.sortOrder == 'ASC') ? 'DESC' : 'ASC';
                } else {
                    this.sortKey = key;
                    this.sortOrder = 'ASC';
                }
            },
            //When Grid List click on agent record
            clickOnDriverRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allDriverObjs[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI
                    menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnDriverRecordName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allDriverObjs[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    menuBtn.style.display = 'block'
                }

                this.changeEditWindowStatus('edit')
            },
            //When Content List click on agent operation button
            clickOnDriverPanel(which, index, content) {
                if (content) {
                    this.selectedRecord = content
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    if (which == 'edit')
                        this.changeEditable(index)
                    else if (which == 'delete')
                        this.showDeleteWindow()
                }
            },
            getDrivers(e) {
                HTTP_TRINITY.get(`driver-manager/findDriversProp?driverName=` + this.searchText.trim())
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        this.allDriverObjs = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            changeEditable(index) {
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
                    content.jarFiles = this.allDriverObjs[index].jarFiles   //由於後端不會再回傳jar files, 因此這裡把舊的代入
                    this.allDriverObjs[index] = content
                }
            },
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.name) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedRecord.name
                }
            },
            changeJarWindowStatus(record) {
                if (record)
                    this.selectedRecord = record
                this.attachWindowAlive = !this.attachWindowAlive
            },
            changePublishWindowStatus() {
                this.publishWindowAlive = !this.publishWindowAlive
            },
            deleteDriver() {
                if (this.deleteIndex === -1)
                    return
                if (this.deleteUid === '')
                    return

                this.delButtonLoading = true
                HTTP_TRINITY.get(`driver-manager/deleteDriverFolderAndProp`, {
                    params: {
                        driverName: this.deleteUid
                    }
                })
                    .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s
                    .then(response => {
                        this.allDriverObjs.splice(this.deleteIndex, 1)
                        this.editable.splice(this.deleteIndex, 1)
                        this.editable.fill(false) //close all edit form
                        this.delButtonLoading = false
                        this.closeDeleteWindow()
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
                if (which == 'edit') {
                    if (this.selectedRecord && this.selectedRecord.name && this.selectedRecord.name !== '') {
                        //Get detail record
                        HTTP_TRINITY.get(`driver-manager/findDriverClassByDriverName?driverName=` + this.selectedRecord.name)
                            .then(wait(FAST_SPEED)) // DEV ONLY: wait for 0.5s
                            .then(response => {
                                this.driverClassList = response.data
                                this.isLoading = false
                                this.editWindowAlive = true
                            })
                            .catch(error => {
                                this.isLoading = false
                                errorHandle(this.$store, error)
                            })
                    }
                } else {
                    this.addWindowAlive = !this.addWindowAlive
                }
            },
            saveAddWindow(new_content) {
                let index = -1
                if (new_content) {    //new_content !== undefined, it means from Window Save Click
                    for (let i = 0; i < this.allDriverObjs.length; i++) {
                        if (this.allDriverObjs[i].name === content.name) {
                            index = i
                            break
                        }
                    }
                    if (index !== -1) {   //若不為-1, 表示UI上有driver name相同的紀錄
                        this.allDriverObjs.splice(index, 1) //刪掉同名的driver, 免得在UI的呈現上出現重覆
                    }

                    this.allDriverObjs.unshift(content) //add object to the top of array
                    this.editable.fill(false) //close all edit form
                    // this.editable.unshift(false)
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            saveEditWindow(new_content) {
                //new_content !== undefined, it means from Agent Window Save Click
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.allDriverObjs[this.selectedRecord.index] = new_content   //replace object to the array
                    this.selectedRecord = new_content
                }
                this.editWindowAlive = !this.editWindowAlive
            },
            closeEditWindow() {
                this.editWindowAlive = false
            },
            exportJDBC() {
                this.allOverlayLoadingText = 'Export ZIP File - jdbc.zip...'
                this.allOverlayLoading = true

                HTTP_TRINITY_Download.get(`driver-manager/exportDriverZIP`)
                    .then(response => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'jdbc.zip');
                        document.body.appendChild(link);
                        link.click();
                        this.allOverlayLoading = false

                        let newStatus = {
                            "msg": "Export ZIP File - jdbc.zip Success.",
                            "status": "Success"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    })
                    .catch(error => {
                        this.allOverlayLoading = false
                        let newStatus = {
                            "msg": 'Export jdbc.zip error! Please look at the error log.',
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    })
            },
            importJDBC(fileName, formData) {
                this.allOverlayLoadingText = 'Import ZIP File - ' + fileName + '...'
                this.allOverlayLoading = true

                HTTP_TRINITY_Upload.post(`driver-manager/importDriverZIP`, formData)
                    .then(response => {
                        this.allOverlayLoading = false
                        if (response.data === true) {
                            this.allOverlayLoading = false
                            this.getDrivers()
                            let newStatus = {
                                "msg": "Import ZIP File - jdbc.zip Success.",
                                "status": "Success"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        } else {
                            this.getDrivers()
                            let newStatus = {
                                "msg": "Import jdbc.zip error! Please look at the error log.",
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    })
                    .catch(error => {
                        this.allOverlayLoading = false
                        this.getDrivers()
                        errorHandle(this.$store, error)
                    });
            },
            filesChange(fieldName, fileList) {
                // handle file changes
                var formData = new FormData()

                if (!fileList.length !== 1) return

                var fileName = fileList[0].name
                if (fileName.toLowerCase().indexOf('.zip') === -1) return

                // append the files to FormData
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        formData.append(fieldName, fileList[x], fileList[x].name);
                    });

                // preview it
                this.importJDBC(fileName, formData);

                //清掉file input內容, 讓它可以再次選擇相同的檔案名稱
                let input = document.getElementById("DriverInputFile")
                input.value = ''
            },
            //clear selected for UI
            clearSelectedRecord(tr) {
                let table = document.getElementById('driverTable')
                if (table && table.childNodes) {  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有driver row的class
                        if (table.childNodes[i] !== tr) {  //等於自己的(即點到的那一列)不用重設
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
                this.getDrivers()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getDrivers()
            },
            pageNumSelected(index) {
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getDrivers()
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
    .loading-area {
        position: relative
    }
    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 0px;
        height: 0px;
        position: absolute;
        visibility: hidden
    }
    #barsTD {
        padding: 0px 0px;
    }
    #barsLabel {
        padding-top: 7px;
        padding-left: 8px;
    }
</style>

