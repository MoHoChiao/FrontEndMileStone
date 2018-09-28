<template>
    <div>
        <role-edit-window v-if="roleWindowAlive" :windowAlive="roleWindowAlive"
                          @closeAdd="saveRoleWindowContentForAdd"
                          @closeEdit="saveRoleWindowContentForEdit"
                          :content="roleRecord"
                          :urlOp="operation"></role-edit-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteRole"></confirm-delete-window>
        <role-member-window v-if="applyWindowAlive" :windowAlive="applyWindowAlive"
                            :content="selectedRecord"
                            @closeApply="closeMemberWindow"></role-member-window>
        <functional-permission-window :windowAlive="applyPermissionWindowAlive"
                                      window-title="Apply Permission To "
                                      :peopleUid="selectedRecord.roleuid"
                                      :peopleName="selectedRecord.rolename"
                                      @closeApply="changePermissionWindowStatus"></functional-permission-window>
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
                                    <span class="w3-col m6 w3-right w3-hide-small w3-hide-medium">
                                        <!--i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i-->
                                        <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete Role" aria-hidden="true" @click="showDeleteWindow"></i>
                                        <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit Role" aria-hidden="true" @click="changeRoleWindowStatus('edit')"></i>
                                        <i class="fa fa-plus w3-button w3-right" title="Add Role" aria-hidden="true" @click="changeRoleWindowStatus('add')"></i>
                                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                        <span class="w3-dropdown-hover w3-right">
                                            <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                            <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                                <div v-if="showMode">
                                                    <i class="w3-bar-item fa fa-user w3-button" aria-hidden="true" @click="openMemberWindow()"> Apply Member</i>
                                                    <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus()"> Permission</i>
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
                                    <span class="w3-col m6 w3-right w3-hide-large">
                                        <!--i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i-->
                                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                        <span class="w3-dropdown-hover w3-right">
                                            <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                            <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                                <div v-if="showMode">
                                                    <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeRoleWindowStatus('add')"> Add Role</i>
                                                    <i class="w3-bar-item fa fa-pencil w3-button" aria-hidden="true" @click="changeRoleWindowStatus('edit')"> Edit Role</i>
                                                    <i class="w3-bar-item fa fa-trash-o w3-button" aria-hidden="true" @click="showDeleteWindow"> Delete Role</i>
                                                    <i class="w3-bar-item fa fa-user w3-button" aria-hidden="true" @click="openMemberWindow()"> Apply Member</i>
                                                    <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus()"> Permission</i>
                                                </div>
                                                <div v-else>
                                                    <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeRoleWindowStatus('add')"> Add Role</i>
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
                                <img src="src/assets/images/resource_setter/Role.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        Role
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                                   placeholder="Name" style="height:28px;max-width: 200px" @keyup.enter="applyQuery">
                            <i class="fa fa-search w3-button" title="Search" aria-hidden="true" @click="applyQuery"></i>
                            <i class="w3-right fa fa-plus w3-button" title="Add Package" aria-hidden="true" @click="changeRoleWindowStatus('add')"></i>
                            <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                        </div>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Group Name" @click="applyOrder('rolename')">
                                                Name
                                                &nbsp;
                                                <span v-if="this.orderFields['rolename'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['rolename'] == 'ASC'" class="w3-text-black">&#9650;</span>
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
                                <div id="roleContainer" class="w3-responsive w3-card w3-round">
                                    <table id="roleTable" class="w3-table-all w3-left">
                                        <empty-grid v-if="allRoleObjs.length == 0"></empty-grid>
                                        <tr v-else :id="content.roleuid" :key="content.roleuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnRoleRecord(content.roleuid, index)" v-for="(content, index) in allRoleObjs">
                                            <td id="barsTD" :width="gridWidth[0]">
                                                <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                                    <i id="barsLabel" class="fa fa-bars"></i>
                                                    <div class="w3-dropdown-content w3-bar-block w3-border w3-card-4">
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="openMemberWindow"> Member</button>
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changePermissionWindowStatus"> Permission</button>
                                                        <button class="w3-bar-item w3-button w3-padding-small w3-border-top" @click.stop="showDeleteWindow"> Delete</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td :width="gridWidth[1]">
                                                <span style="text-decoration:underline;" @click.stop="clickOnRoleRecordName(content.roleuid, index)">
                                                    {{ content.rolename }}
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
                <div :key="content.roleuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allRoleObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="src/assets/images/resource_setter/Role.png" alt="Role" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            <i v-if="content.roleuid.startsWith('Role')" class="fa fa-user-circle fa-fw w3-text-blue"></i>
                            {{ content.rolename }}
                        </p>
                        <br><br>
                        <role-member-panel :key="content.roleuid+'MemberPanel'" :roleuid="content.roleuid"></role-member-panel>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <span class="w3-right">
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit Role" @click="clickOnRolePanel('edit', index, content)">
                                <i class="fa fa-pencil"></i>
                            </button>
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Apply Permission" @click="clickOnRolePanel('permission', index, content)">
                                <i class="fa fa-universal-access"></i>
                            </button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete Role" @click="clickOnRolePanel('delete', index, content)">
                                <i class="fa fa-trash-o"></i>
                            </button>
                        </span>
                    </div>
                    <role-edit-panel v-else :key="content.roleuid+'EditPanel1'"
                                     :index="index" :content="content" @closeEdit="closeEditable"></role-edit-panel>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import { PermissionTable } from '../../../../util_js/auth'
    import RoleEditPanel from './RoleEditPanel.vue'
    import RoleMemberPanel from './RoleMemberPanel.vue'
    import RoleEditWindow from './RoleEditWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import RoleMemberWindow from './RoleMemberWindow.vue'
    import FunctionalPermissionWindow from '../../PermissionSetting/FunctionalPermissionWindow.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        data() {
            return {
                showMode: true, //switch content list or table list
                selectedRecord: new Object(),   //store which record has been selected.(Role)
                roleWindowAlive: false,  //for add/edit Role modal windows
                operation: 'add',   //keep which operation(add,edit) will be execute
                applyWindowAlive: false, //for modify Role Member modal windows
                applyPermissionWindowAlive: false, //for modify Role Functional Permission modal windows
                deleteWindowAlive: false,  //for delete Role modal windows
                deleteName: '',     //store which obj name will be delete
                allRoleObjs: [], //store all Role
                roleRecord: new Object(), //store detail role record
                editable: [],   //for all Role content edit panel
                gridWidth: ['2%', '30%', '48%', '20%'],
                //about paging info
                totalPages: 1,
                selectedPage: 1, //this is for UI use
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                orderFields: { //Ordering fields, only for UI
                    rolename: "ASC",
                    description: "",
                    lastupdatetime: ""
                },
                orderField: 'rolename',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        mounted() {
            this.getRole()
        },
        methods: {
            //When Grid List click on role record
            clickOnRoleRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allRoleObjs[index]
                    this.selectedRecord.index = index //New prop is stores which role obj will be deleted in UI
                    menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnRoleRecordName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allRoleObjs[index]
                    this.selectedRecord.index = index //New prop is stores which role obj will be deleted in UI
                    
                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    menuBtn.style.display = 'block'
                }

                this.changeRoleWindowStatus('edit')
            },
            //When Content List click on role operation button
            clickOnRolePanel(which, index, content) {
                if (content) {
                    this.selectedRecord = content
                    this.selectedRecord.index = index //New prop is stores which role obj will be deleted in UI

                    if (which == 'edit')
                        this.openEditable(index)
                    else if (which == 'permission')
                        this.changePermissionWindowStatus()
                    else if (which == 'delete')
                        this.showDeleteWindow()
                }
            },
            //Get All roles info
            getRole(e) {
                //用client端暫存的permission table去檢查是否具有權限
                if (!PermissionTable && !PermissionTable.root && !PermissionTable.admin)
                    return

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

                HTTP_TRINITY.post(`role/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allRoleObjs = response.data.content
                            if (response.data.totalPages <= 0)
                                this.totalPages = 1
                            this.totalPages = response.data.totalPages
                        } else {
                            this.allRoleObjs = response.data
                            this.totalPages = 1
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            //for Content List, edit panel
            openEditable(index) {
                HTTP_TRINITY.get(`role/findByUid?uid=` + this.selectedRecord.roleuid)
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
                            this.allRoleObjs[index] = response.data
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            closeEditable(index, content) {
                this.$set(this.editable, index, false)

                if (content) {
                    this.allRoleObjs[index] = content
                }

            },
            //above for delete window
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.rolename && this.selectedRecord.roleuid) {
                    if (!this.selectedRecord.roleuid.trim().startsWith('Role')) {
                        this.deleteWindowAlive = true
                        this.deleteName = this.selectedRecord.rolename
                    } else {
                        let newStatus = {
                            "msg": 'You cannot delete default roles!',
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                }
            },
            deleteRole() {
                HTTP_TRINITY.get(`role/delete`, {
                    params: {
                        uid: this.selectedRecord.roleuid
                    }
                })
                    .then(response => {
                        this.allRoleObjs.splice(this.selectedRecord.index, 1)
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
            //about for add/edit window
            changeRoleWindowStatus(which) {
                if (which != 'add') {
                    if (this.selectedRecord && this.selectedRecord.roleuid && this.selectedRecord.roleuid !== '') {
                        //Get role detail record
                        HTTP_TRINITY.get(`role/findByUid?uid=` + this.selectedRecord.roleuid)
                            .then(response => {
                                this.roleRecord = response.data
                                this.operation = which
                                this.roleWindowAlive = !this.roleWindowAlive
                            })
                            .catch(error => {
                                errorHandle(this.$store, error)
                            })
                    }
                } else {
                    this.operation = which
                    this.roleWindowAlive = !this.roleWindowAlive
                }
            },
            saveRoleWindowContentForAdd(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Role Window Save Click
                    this.allRoleObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedRecord()
                }
                this.roleWindowAlive = !this.roleWindowAlive
            },
            saveRoleWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Role Window Save Click
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.allRoleObjs[this.selectedRecord.index] = new_content   //replace object to the array
                    this.selectedRecord = new_content
                }
                this.roleWindowAlive = !this.roleWindowAlive
            },
            //above for open/close apply member window
            openMemberWindow() {
                if (this.selectedRecord && this.selectedRecord.roleuid) {
                    var msg = ""
                    if (this.selectedRecord.roleuid.trim() === 'Role1') {
                        if (PermissionTable.root) {
                            this.applyWindowAlive = true
                        } else {
                            let newStatus = {
                                "msg": "You do not have 'Root' Permission!",
                                "status": "Warn"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    } else {
                        if (PermissionTable.root || PermissionTable.admin) {
                            this.applyWindowAlive = true
                        } else {
                            let newStatus = {
                                "msg": "You do not have 'Root Or Admin' Permission!",
                                "status": "Warn"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    }
                }
            },
            closeMemberWindow() {
                if (this.selectedRecord && this.selectedRecord.roleuid) {
                    this.applyWindowAlive = false
                }
            },
            //about for change show mode(Grid List & Content List)
            changeShowMode() {
                this.showMode = !this.showMode
                this.selectedRecord = new Object()
            },
            clearSelectedRecord(tr) {
                let table = document.getElementById('roleTable')
                if (table && table.childNodes) {  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有group row的class
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
            //above for permission window
            changePermissionWindowStatus() {
                if (this.selectedRecord && this.selectedRecord.roleuid) {
                    if (this.selectedRecord.roleuid.trim() !== 'Role1') {
                        if (PermissionTable.root || PermissionTable.admin) {
                            this.selectedRecord.roleuid = this.selectedRecord.roleuid.trim()
                            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
                        } else {
                            let newStatus = {
                                "msg": "You do not have 'Root Or Admin' Permission!",
                                "status": "Warn"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    } else {
                        let newStatus = {
                            "msg": 'Administrator has all permissions and cannot be modified!',
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                }
            },
            //above for pagging, ordering, query
            changeNum(e, index) {
                //紀錄現在點擊的是那一頁
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.selectedPage = index   //for UI page num
                this.getRole()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getRole()
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
                this.getRole()
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

                this.getRole()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getRole()
            }
        },
        components: {
            'role-edit-panel': RoleEditPanel,
            'role-member-panel': RoleMemberPanel,
            'role-edit-window': RoleEditWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'role-member-window': RoleMemberWindow,
            'functional-permission-window': FunctionalPermissionWindow,
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
