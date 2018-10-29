<template>
    <div>
        <!-- For Add/Edit Virtual Agent Window -->
        <vr-agent-edit-window v-if="agentWindowAlive" :windowAlive="agentWindowAlive"
                              @closeAdd="saveAgentWindowContentForAdd"
                              @closeEdit="saveAgentWindowContentForEdit"
                              :content="agentRecord"
                              :urlOp="operation"></vr-agent-edit-window>
        <!-- For Delete Confirm Window -->
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteAgent"></confirm-delete-window>
        <!-- For Apply Permission Window -->
        <permission-window :windowAlive="applyPermissionWindowAlive"
                           window-title="Apply Permission To "
                           :objectUid="selectedRecord.virtualagentuid"
                           :objectName="selectedRecord.virtualagentname"
                           @closeApply="changePermissionWindowStatus"></permission-window>
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
                                        <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete Virtual Agent" aria-hidden="true" @click="showDeleteWindow"></i>
                                        <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit Virtual Agent" aria-hidden="true" @click="changeAgentWindowStatus('edit')"></i>
                                        <i class="fa fa-plus w3-button w3-right" title="Add Virtual Agent" aria-hidden="true" @click="changeAgentWindowStatus('add')"></i>
                                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                        <span class="w3-dropdown-hover w3-right">
                                            <i class="fa fa-bars w3-button" title="Menu" aria-hidden="true"></i>
                                            <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block" style="min-width:205px">
                                                <div v-if="showMode">
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
                                                    <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeAgentWindowStatus('add')"> Add Virtual Agent</i>
                                                    <i class="w3-bar-item fa fa-pencil w3-button" aria-hidden="true" @click="changeAgentWindowStatus('edit')"> Edit Virtual Agent</i>
                                                    <i class="w3-bar-item fa fa-trash-o w3-button" aria-hidden="true" @click="showDeleteWindow"> Delete Virtual Agent</i>
                                                    <i class="w3-bar-item fa fa-universal-access w3-button" aria-hidden="true" @click="changePermissionWindowStatus()"> Permission</i>
                                                </div>
                                                <div v-else>
                                                    <i class="w3-bar-item fa fa-plus w3-button" aria-hidden="true" @click="changeAgentWindowStatus('add')"> Add Virtual Agent</i>
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
                                <img src="src/assets/images/resource_setter/VrAgent_128.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        {{ $t('Item.VirtualAgent') }}
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                                   placeholder="Name" style="height:28px;max-width: 200px" @keyup.enter="applyQuery">
                            <i class="fa fa-search w3-button" :title="$t('Container.Func.Search')" aria-hidden="true" @click="applyQuery"></i>
                            <i class="w3-right fa fa-plus w3-button" :title="$t('Container.Func.Add')" aria-hidden="true" @click="changeAgentWindowStatus('add')"></i>
                            <i class="w3-right fa fa-refresh w3-button" :title="$t('Container.Func.Refresh')" aria-hidden="true" @click="applyQuery"></i>
                        </div>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Virtual Name" @click="applyOrder('virtualagentname')">
                                                {{ $t('Container.Grid.Name') }}
                                                &nbsp;
                                                <span v-if="this.orderFields['virtualagentname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['virtualagentname'] == 'ASC'" class="w3-text-black">&#9650;</span>
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
                                <div id="virtualAgentContainer" class="w3-responsive w3-card w3-round">
                                    <table id="virtualAgentTable" class="w3-table-all w3-left">
                                        <empty-grid v-if="allVRAgentObjs.length <= 0"></empty-grid>
                                        <tr v-else :id="content.virtualagentuid" :key="content.virtualagentuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnAgentRecord(content.virtualagentuid, index)" v-for="(content, index) in allVRAgentObjs">
                                            <td id="barsTD" :width="gridWidth[0]">
                                                <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                                    <i id="barsLabel" class="fa fa-bars"></i>
                                                    <div class="w3-dropdown-content w3-bar-block w3-border w3-card-4">
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changePermissionWindowStatus"> {{ $t('Container.Func.Permission') }}</button>
                                                        <button class="w3-bar-item w3-button w3-padding-small w3-border-top" @click.stop="showDeleteWindow"> {{ $t('Container.Func.Delete') }}</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td :width="gridWidth[1]">
                                                <span style="text-decoration:underline;" @click.stop="clickOnAgentRecordName(content.virtualagentuid, index)">
                                                    {{ content.virtualagentname }}
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
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            <div v-else class="w3-small">
                <div :key="content.virtualagentuid+'table'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allVRAgentObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="src/assets/images/resource_setter/VrAgent_128.png" alt="Virtual Agent" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>{{ content.virtualagentname }}</p>
                        <span class="w3-tag w3-theme-l3" style="transform:rotate(-5deg)">{{ (content.mode == 0) ? 'Load Balance' : 'By Seq' }}</span>
                        <p>
                            <div v-if="content.agentlist.length > 0">
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th class="w3-center" width="7%">Seq</th>
                                            <th class="w3-center" width="33%">Name</th>
                                            <th class="w3-center" width="10%">Activate</th>
                                            <th class="w3-center" width="50%">Description</th>
                                        </tr>
                                    </table>
                                </div>
                                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px;word-break:break-all">
                                    <table class="w3-table-all">
                                        <tr :key="list_info.virtualagentuid+':'+list_info.agentuid" class="w3-hover-blue-grey w3-hover-opacity" draggable="true" v-for="(list_info, list_index) in content.agentlist">
                                            <td width="7%">{{ list_index + 1 }}</td>
                                            <td class="w3-center" width="33%">
                                                <span>{{ list_info.agentname }}</span>
                                            </td>
                                            <td class="w3-center" width="10%">
                                                <i v-if="list_info.activate === '1'" class="fa fa-check-square-o" title="Activate" aria-hidden="true"></i>
                                                <i v-else class="fa fa-square-o" title="Deactivate" aria-hidden="true"></i>
                                            </td>
                                            <td width="50%">
                                                <span>{{ list_info.description }}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </p>
                        <hr class="w3-border-black w3-clear">
                        <p>{{ content.description }}</p>
                        <span class="w3-right">
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit Agent" @click="clickOnAgentPanel('edit', index, content)">
                                <i class="fa fa-pencil"></i>
                            </button>
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Apply Permission" @click="clickOnAgentPanel('permission', index, content)">
                                <i class="fa fa-universal-access"></i>
                            </button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete Agent" @click="clickOnAgentPanel('delete', index, content)">
                                <i class="fa fa-trash-o"></i>
                            </button>
                        </span>
                    </div>
                    <vr-agent-edit-panel v-else :index="index" :content="content" @closeEdit="closeEditable"></vr-agent-edit-panel>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import { PermissionTable } from '../../../../util_js/auth'
    import VRAgentEditPanel from './VRAgentEditPanel.vue'
    import VRAgentEditWindow from './VRAgentEditWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        data() {
            return {
                showMode: true, //switch content list or table list
                selectedRecord: new Object(),   //store which record has been selected.(Virtual Agent)
                agentWindowAlive: false,  //for add/edit/copy/move Connection modal windows
                operation: 'add',   //keep which operation(add,edit,copy) will be execute
                deleteWindowAlive: false,  //for delete vragent modal windows
                applyPermissionWindowAlive: false, //for modify Permission modal windows
                deleteName: '',     //store which obj name will be delete
                allVRAgentObjs: [], //store all virtual agents
                agentRecord: new Object(), //store detail vragent record
                editable: [],   //for all virtual agents content edit panel
                gridWidth: ['2%', '30%', '48%', '20%'],
                //about paging info
                totalPages: 1,
                selectedPage: 1, //this is for UI use
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                orderFields: { //Ordering fields, only for UI
                    virtualagentname: "ASC",
                    description: "",
                    lastupdatetime: ""
                },
                orderField: 'virtualagentname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        mounted() {
            this.getVRAgents()
        },
        methods: {
            //When Grid List click on vragent record
            clickOnAgentRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allVRAgentObjs[index]
                    this.selectedRecord.index = index //New prop is stores which vragent obj will be deleted in UI
                    menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnAgentRecordName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allVRAgentObjs[index]
                    this.selectedRecord.index = index //New prop is stores which vragent obj will be deleted in UI

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    menuBtn.style.display = 'block'
                }

                this.changeAgentWindowStatus('edit')
            },
            //When Content List click on vragent operation button
            clickOnAgentPanel(which, index, content) {
                if (content) {
                    this.selectedRecord = content
                    this.selectedRecord.index = index //New prop is stores which vragent obj will be deleted in UI

                    if (which == 'edit')
                        this.openEditable(index)
                    else if (which == 'permission')
                        this.changePermissionWindowStatus()
                    else if (which == 'delete')
                        this.showDeleteWindow()
                }
            },
            //Get All virtual Agents info
            getVRAgents(e) {
                if (!PermissionTable.root && !PermissionTable.admin) {
                    if (!PermissionTable.agent_func || !PermissionTable.agent_func.view)
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

                HTTP_TRINITY.post(`vragent/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allVRAgentObjs = response.data.content
                            if (response.data.totalPages <= 0)
                                this.totalPages = 1
                            else
                                this.totalPages = response.data.totalPages
                        } else {
                            this.allVRAgentObjs = response.data
                            this.totalPages = 1
                        }
                        this.clearSelectedRecord()
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            //for Content List, edit panel
            openEditable(index) {
                //Get Virtual Agent detail record
                HTTP_TRINITY.get(`vragent/findByUid?uid=` + this.selectedRecord.virtualagentuid)
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
                            this.allVRAgentObjs[index] = response.data
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            closeEditable(index, content) {
                this.$set(this.editable, index, false)

                if (content) {
                    this.allVRAgentObjs[index] = content
                }

            },
            //above for delete window
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.virtualagentname) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedRecord.virtualagentname
                }
            },
            deleteAgent() {
                HTTP_TRINITY.get(`vragent/delete`, {
                    params: {
                        uid: this.selectedRecord.virtualagentuid
                    }
                })
                    .then(response => {
                        this.allVRAgentObjs.splice(this.selectedRecord.index, 1)
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
            //about for add/edit/copy window
            changeAgentWindowStatus(which) {
                if (which != 'add') {
                    if (this.selectedRecord && this.selectedRecord.virtualagentuid && this.selectedRecord.virtualagentuid !== '') {
                        //Get Virtual Agent detail record
                        HTTP_TRINITY.get(`vragent/findByUid?uid=` + this.selectedRecord.virtualagentuid)
                            .then(response => {
                                this.agentRecord = response.data
                                this.operation = which
                                this.agentWindowAlive = !this.agentWindowAlive
                            })
                            .catch(error => {
                                errorHandle(this.$store, error)
                            })
                    }
                } else {
                    this.operation = which
                    this.agentWindowAlive = !this.agentWindowAlive
                }
            },
            saveAgentWindowContentForAdd(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Agent Window Save Click
                    this.allVRAgentObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedRecord()
                }
                this.agentWindowAlive = !this.agentWindowAlive
            },
            saveAgentWindowContentForEdit(new_content) {
                //new_content !== undefined, it means from Agent Window Save Click
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.allVRAgentObjs[this.selectedRecord.index] = new_content   //replace object to the array
                    this.selectedRecord = new_content
                }
                this.agentWindowAlive = !this.agentWindowAlive
            },
            //above for permission window
            changePermissionWindowStatus() {
                if (this.selectedRecord && this.selectedRecord.virtualagentuid && this.selectedRecord.virtualagentuid !== '') {
                    this.selectedRecord.virtualagentuid = this.selectedRecord.virtualagentuid.trim()
                    this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
                }
            },
            //about for change show mode(Grid List & Content List)
            changeShowMode() {
                this.showMode = !this.showMode
                this.selectedRecord = new Object()
            },
            clearSelectedRecord(tr) {
                let table = document.getElementById('virtualAgentTable')
                if (table && table.childNodes) {  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有agent row的class
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
                this.selectedPage = index   //for UI page num
                this.getVRAgents()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getVRAgents()
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
                this.getVRAgents()
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

                this.getVRAgents()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getVRAgents()
            }
        },
        components: {
            'vr-agent-edit-panel': VRAgentEditPanel,
            'vr-agent-edit-window': VRAgentEditWindow,
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
