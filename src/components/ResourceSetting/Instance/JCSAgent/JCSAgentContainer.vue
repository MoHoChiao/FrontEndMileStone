<template>
    <div>
        <agent-add-window :windowAlive="addWindowAlive"
                          @eAdd="saveAddWindow"
                          @eEdit="saveEditWindow"
                          @eCopy="saveCopyWindow"
                          @eClose="closeAddWindow"
                          :content="selectedAgentRecord"
                          :urlOp="operation"></agent-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDelWindow"
                               @confirmDelete="deleteAgent"></confirm-delete-window>
        <permission-window :windowAlive="applyPermissionWindowAlive"
                           window-title="Apply Permission To "
                           :objectUid="selectedRecord.agentuid"
                           :objectName="selectedRecord.agentname"
                           @closeApply="changePermissionWindowStatus"></permission-window>

        <div class="w3-row-padding">
            <div class="w3-col m12">
                <div class="w3-card-4 w3-round w3-signal-white">
                    <div class="w3-container">
                        <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                            <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                            <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> JCSAgent</i>
                            <span class="w3-right">
                                <!--<i class="fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="getAgents" />-->
                                <i v-if="!showMode" class="fa fa-plus w3-button" title="Add" aria-hidden="true" @click="openAddWindow('add')" />
                                <!--<i v-if="showMode" class="fa fa-toggle-on w3-button" title="Switch to Table List" aria-hidden="true" @click="changeShowMode()" />
                                <i v-else class="fa fa-toggle-off w3-button" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()" />-->
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showMode" class="w3-small">
            <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
                <p>
                    <div>
                        <span><img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                        <span>
                            <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white" style="padding:3px;transform:rotate(-5deg)">
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                    JCS Agents
                                </i>
                            </i>
                        </span>
                        <span class="w3-right">
                            <i class="w3-button fa fa-refresh" title="Reload" aria-hidden="true" @click="getAgents"></i>
                            <i class="w3-button fa fa-plus" title="Add" aria-hidden="true" @click="openAddWindow('add')" />
                            <i class="w3-button fa fa-clipboard" title="Copy" aria-hidden="true" @click="openAddWindow('copy')" />
                            <i class="w3-button fa fa-pencil" title="Edit" aria-hidden="true" @click="openAddWindow('edit')" />
                            <i class="w3-button fa fa-universal-access" title="Apply Permission" aria-hidden="true" @click="changePermissionWindowStatus(content)" />
                            <i class="w3-button fa fa-trash-o" title="Delete" aria-hidden="true" @click="confirmDelWindow()" />
                        </span>
                    </div>
                </p>
                <p>
                    <div>
                        <div class="w3-responsive w3-card w3-round">
                            <table class="w3-table-all">
                                <tr class="w3-teal">
                                    <th class="w3-left" width="25%">Name</th>
                                    <th class="w3-left" width="15%">IP Address</th>
                                    <th class="w3-left" width="38%">Description</th>
                                    <th class="w3-left" width="22%">Update Time</th>
                                </tr>
                            </table>
                        </div>
                        <div id="agentContainer" class="w3-responsive w3-card w3-round" style="min-height:450px">
                            <table id="agentTable" class="w3-table-all w3-left">
                                <tr :id="content.agentuid" :key="content.agentuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                    @click="clickOnAgent(content.agentuid, index)" v-for="(content, index) in allJCSAgentObjs">
                                    <td width="25%">
                                        <span>{{ content.agentname }}</span>
                                    </td>
                                    <td width="15%">
                                        <span>{{ content.host }}</span>
                                    </td>
                                    <td width="38%">
                                        <span>{{ content.description }}</span>
                                    </td>
                                    <td width="22%">
                                        <span>{{ content.lastupdatetime }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <!--<page ref="paginate" :page-count="totalPages" :clickHandler="changeNum"></page>-->
                    </div>
                </p>
            </div>
        </div>
        <div v-else class="w3-small">
            <div :key="content.agentuid+'content'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allJCSAgentObjs">
                <div v-if="editable[index] === undefined || !editable[index]">
                    <img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                    <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                    <p>{{ content.agentname }}</p>
                    <span class="w3-tag w3-theme-l2" style="transform:rotate(-5deg)">{{ 'Host:' + content.host }}</span>
                    <span class="w3-tag w3-theme-l3" style="transform:rotate(-5deg)">{{ 'Port:' + content.port }}</span>
                    <span class="w3-tag w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                    <span class="w3-tag w3-theme-l4 w3-hide-medium w3-hide-small" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
                    <hr class="w3-border-black w3-clear">
                    <p>{{ content.description }}</p>
                    <span class="w3-right">
                        <button class="w3-button w3-theme-d1 w3-round w3-margin-bottom fa fa-clipboard" title="Copy" @click="openAddWindow('copyPanel', content)" />
                        <button class="w3-button w3-theme-d1 w3-round w3-margin-bottom fa fa-pencil" title="Edit" @click="changeEditable(index)" />
                        <button class="w3-button w3-theme-d1 w3-round w3-margin-bottom fa fa-lock" title="Permission" @click="changePermissionWindowStatus(content)" />
                        <button class="w3-button w3-theme-d1 w3-round w3-margin-bottom fa fa-trash-o" title="Delete" @click="confirmDelWindow(content)" />
                    </span>
                </div>
                <agent-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></agent-edit-panel>
            </div>
        </div>

        <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getAgents"></filter-panel>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import FilterPanel from '../../FilterPanel.vue'
    import JCSAgentEditPanel from './JCSAgentEditPanel.vue'
    import JCSAgentAddWindow from './JCSAgentAddWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'
    import page from '../../page.vue'

    export default {
        data() {
            return {
                showMode: true, //switch content list or table list
                selectedAgentRecord: new Object(),   //store which record has been selected.(JCSAgents)
                addWindowAlive: false,  //for add agent modal windows
                deleteWindowAlive: false,  //for delete agent modal windows
                applyPermissionWindowAlive: false, //for modify Permission modal windows
                operation: 'add',   //keep which operation(add,edit,copy,move) will be execute
                deleteName: '',     //store which obj name will be delete
                allJCSAgentObjs: new Object(), //store all agents
                editable: [],   //for all agents content edit panel
                orderFields: [  //for ordering filter fields
                    { name: "Update Time", value: "lastupdatetime" },
                    { name: "Name", value: "agentname" },
                    { name: "Activate", value: "activate" },
                    { name: "Host", value: "host" },
                    { name: "Port", value: "port" }
                ],
                queryFields: [  //for querying filter fields
                    { name: "Name", value: "Agentname" },
                    { name: "Activate", value: "activate" },
                    { name: "Host", value: "host" },
                    { name: "Port", value: "port" },
                    { name: "Desc", value: "Description" }
                ],
                copyContent: undefined,   //for copy click, pass copyContent to Add Window
                selectedRecord: new Object()   //store which JCSAgent has been clicked.
            }
        },
        mounted() {
            this.getAgents()
        },
        methods: {
            getAgents(e) {
                let params = {
                    "paging": {
                        "number": this.$refs.filter.selectedNum,
                        "size": this.$refs.filter.selectedSize
                    }
                }

                if (this.$refs.filter.isOrder) {
                    params.ordering = {
                        "orderType": this.$refs.filter.orderType,
                        "orderField": this.$refs.filter.orderField
                    }
                }

                if (this.$refs.filter.isQuery) {
                    params.querying = {
                        "queryType": this.$refs.filter.queryType,
                        "queryField": this.$refs.filter.queryField,
                        "queryString": this.$refs.filter.queryString,
                        "ignoreCase": this.$refs.filter.ignoreCase
                    }
                }

                HTTP_TRINITY.post(`jcsagent/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allJCSAgentObjs = response.data.content
                            this.$refs.filter.totalPages = response.data.totalPages
                        } else {
                            this.allJCSAgentObjs = response.data
                            this.$refs.filter.totalPages = 1
                        }
                    })
                    .catch(error => {
                        if (e) {
                            if (e.target.title === 'Apply Order')
                                this.$refs.filter.isOrder = true
                            else if (e.target.title === 'Apply Query')
                                this.$refs.filter.isQuery = true
                            else if (e.target.title === 'Cancel Order')
                                this.$refs.filter.isOrder = false
                            else if (e.target.title === 'Cancel Query')
                                this.$refs.filter.isQuery = false
                        }

                        errorHandle(this.$store, error)
                    })
            },
            deleteAgent() {
                if (this.selectedAgentRecord.agentuid === '')
                    return

                HTTP_TRINITY.get(`jcsagent/delete`, {
                    params: {
                        uid: this.selectedAgentRecord.agentuid
                    }
                })
                    .then(response => {
                        this.allJCSAgentObjs.splice(this.selectedAgentRecord.index, 1)
                        //this.editable.splice(this.deleteIndex, 1)
                        //this.editable.fill(false) //close all edit form
                        this.clearSelectedAgentRecord()
                        this.deleteWindowAlive = false
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })

            },
            changeShowMode() {
                this.showMode = !this.showMode
            },
            openAddWindow(which, content) {
                this.operation = which

                if (which == 'add') {
                    this.addWindowAlive = !this.addWindowAlive
                } else if (which == 'copyPanel') {
                    this.selectedAgentRecord = content
                    this.addWindowAlive = !this.addWindowAlive
                } else {
                    if (this.selectedAgentRecord && this.selectedAgentRecord.agentuid && this.selectedAgentRecord.agentuid !== '') {
                        this.addWindowAlive = !this.addWindowAlive
                    }
                }
            },
            confirmDelWindow(content) {
                if (content) {
                    this.selectedAgentRecord = content
                }

                if (this.selectedAgentRecord.agentname != null) {
                    this.deleteName = this.selectedAgentRecord.agentname
                    this.deleteWindowAlive = true
                }
            },
            closeAddWindow() {
                this.addWindowAlive = false
            },
            closeDelWindow() {
                this.deleteWindowAlive = false
            },
            /*
             * grid mode
             */
            clickOnAgent(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedAgentRecord(tr)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedAgentRecord = this.allJCSAgentObjs[index]
                    this.selectedAgentRecord.index = index //New prop is stores which agent obj will be deleted in UI
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                }
            },
            saveAddWindow(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Frequency Window Save Click
                    this.allJCSAgentObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedAgentRecord()
                }
                this.closeAddWindow()
            },
            saveEditWindow(new_content) {
                //new_content !== undefined, it means from Frequency Window Save Click
                if (new_content && this.selectedAgentRecord && (this.selectedAgentRecord.index || this.selectedAgentRecord.index === 0)) {
                    new_content.index = this.selectedAgentRecord.index   //asign old index prop to new content
                    this.allJCSAgentObjs[this.selectedAgentRecord.index] = new_content   //replace object to the array
                    this.selectedAgentRecord = new_content
                }
                this.closeAddWindow()
            },
            saveCopyWindow(agentuid, new_content) {
                if (new_content) {    //new_content !== undefined, it means from Frequency Window Save Click
                    //如果相等, 表示copy過去的目標category, 即目前所在的category(即目前所選擇的category), 則立刻在最上列加一筆Frequency
                    if (this.selectedAgentRecord.agentuid === agentuid) {
                        this.allJCSAgentObjs.unshift(new_content) //add object to the top of array
                    }
                    this.clearSelectedAgentRecord()
                }
                this.closeAddWindow()
            },
            changePermissionWindowStatus(record) {
                if (record) {
                    this.selectedRecord = record
                    this.selectedRecord.agentuid = this.selectedRecord.agentuid.trim()
                }

                this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
            },
            clearSelectedAgentRecord(tr) {
                let table = document.getElementById('agentTable')

                if (table != null) {
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有agent row的class
                        if (table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                            table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                    }
                }
                
                this.selectedAgentRecord = new Object()
            },
            /*
             * panel mode
             */
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
                    this.allJCSAgentObjs[index] = content
                }
            }
        },
        components: {
            'filter-panel': FilterPanel,
            'agent-edit-panel': JCSAgentEditPanel,
            'agent-add-window': JCSAgentAddWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'permission-window': PermissionWindow,
            'page': page
        }
    }
</script>

