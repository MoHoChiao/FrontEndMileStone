<template>
    <div>
        <working-calendar-add-window :windowAlive="addWindowAlive"
                                     @closeAdd="saveWindowContentForAdd"
                                     @closeEdit="saveWindowContentForEdit"
                                     @closeCopy="saveWindowContentForAdd"
                                     :content="wcRecord"
                                     :urlOp="operation"
                                     style="padding-top:50px"
        ></working-calendar-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteWC"></confirm-delete-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div v-if="!showMode" class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                                <div class="w3-row">
                                    <span class="w3-left">
                                        <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                               placeholder="Name" style="text-transform:uppercase" @keyup.enter="applyQuery">
                                        <i class="fa fa-search w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                    </span>
                                    <i v-if="showMode" class="w3-right fa fa-toggle-on w3-button" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                    <i v-else class="w3-right fa fa-toggle-off w3-button" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                    <i class="w3-right fa fa-plus w3-button" title="Add Working Calendar" aria-hidden="true" @click="changeAddWindowStatus('add')"></i>
                                    <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
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
                                <img src="/src/assets/images/resource_setter/WorkingCalendar.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        Working Calendar
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                                   placeholder="Name" style="height:28px;max-width: 200px" @keyup.enter="applyQuery">
                            <i class="fa fa-search w3-button" title="Search" aria-hidden="true" @click="applyQuery"></i>
                            <i v-if="showMode" class="w3-right fa fa-toggle-on w3-button" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                            <i v-else class="w3-right fa fa-toggle-off w3-button" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                            <i class="w3-right fa fa-plus w3-button" title="Add Working Calendar" aria-hidden="true" @click="changeAddWindowStatus('add')"></i>
                            <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                        </div>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Package Name" @click="applyOrder('wcalendarname')">
                                                Name
                                                &nbsp;
                                                <span v-if="this.orderFields['wcalendarname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['wcalendarname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Activate" @click="applyOrder('description')">
                                                Description
                                                &nbsp;
                                                <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[3]" title="Order by Activate" @click="applyOrder('activate')">
                                                Activate
                                                &nbsp;
                                                <span v-if="this.orderFields['activate'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['activate'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                        </tr>
                                    </table>
                                </div>
                                <div id="packageContainer" class="w3-responsive w3-card w3-round">
                                    <table id="wcalTable" class="w3-table-all w3-left">
                                        <empty-grid v-if="allWCObjs.length == 0"></empty-grid>
                                        <tr v-else :id="content.wcalendaruid" :key="content.wcalendaruid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnPackageRecord(content.wcalendaruid, index)" v-for="(content, index) in sortedData">
                                            <td id="barsTD" :width="gridWidth[0]">
                                                <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute">
                                                    <i id="barsLabel" class="fa fa-bars"></i>
                                                    <div class="w3-dropdown-content w3-bar-block w3-border w3-card-4">
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="changeAddWindowStatus('copy')"> Copy</button>
                                                        <button class="w3-bar-item w3-button w3-padding-small w3-border-top" @click.stop="showDeleteWindow"> Delete</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td :width="gridWidth[1]">
                                                <span v-if="content.wcalendarname == 'SYSTEMDAY'">
                                                    {{ content.wcalendarname }}
                                                </span>
                                                <span v-else style="text-decoration:underline;" @click.stop="clickOnPackageRecordName(content.wcalendaruid, index)">
                                                    {{ content.wcalendarname }}
                                                </span>
                                            </td>
                                            <td :width="gridWidth[2]">
                                                <span :title="content.description">
                                                    {{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}
                                                </span>
                                            </td>
                                            <td :width="gridWidth[3]">
                                                <i v-if="content.activate == 1" class="fa fa-check-circle w3-text-green" />
                                                <i v-else class="fa fa-times-circle w3-text-red" />
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
            <!--<div v-else>
                <div :key="content.wcalendaruid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allWCObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/WorkingCalendar.png" alt="Working Calendar" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>{{ content.wcalendarname }}</p>
                        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                        <p>
                            <div v-if="content.wcalendarlist.length > 0" class="w3-small">
                                <div class="w3-responsive w3-card w3-round">
                                    <input :id="content.wcalendaruid+'SearchInput'" :key="content.wcalendaruid+'SearchInput'"
                                           class="w3-input w3-border w3-border-camo-black w3-grey" type="text" placeholder="Search For Workinf Calendar List..." @keyup="searchForList(content.wcalendaruid)">
                                </div>
                                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                                    <table :id="content.wcalendaruid+'ListTable'" :key="content.wcalendaruid+'ListTable'" class="w3-table-all">
                                        <tr :id="list_info.wcalendaruid + ':' + list_info.yearnum + '-' + list_info.monthnum + '-' + list_info.daynum" :key="list_info.wcalendaruid + ':' + list_info.yearnum + '-' + list_info.monthnum + '-' + list_info.daynum"
                                            class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in content.wcalendarlist">
                                            <td class="w3-center" width="100%">
                                                {{ list_info.yearnum + '-' + list_info.monthnum + '-' + list_info.daynum }}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </p>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i> Edit
                        </button>
                        <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.wcalendaruid, content.wcalendarname)">
                            <i class="fa fa-trash-o"></i> Delete
                        </button>
                    </div>
                    <working-calendar-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></working-calendar-edit-panel>
                </div>
            </div>-->
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import FilterPanel from '../../FilterPanel.vue'
    import WorkingCalendarEditPanel from './WorkingCalendarEditPanel.vue'
    import WorkingCalendarAddWindow from './WorkingCalendarAddWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        components: {
            'filter-panel': FilterPanel,
            'working-calendar-edit-panel': WorkingCalendarEditPanel,
            'working-calendar-add-window': WorkingCalendarAddWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'page': page,
            'empty-grid': EmptyGrid
        },
        data() {
            return {
                selectedRecord: new Object(),
                showMode: true, //switch content list or table list
                addWindowAlive: false,  //for add Working Calendar modal windows
                operation: 'add',
                deleteWindowAlive: false,  //for delete Working Calendar modal windows
                deleteName: '',     //store which obj name will be delete
                allWCObjs: [], //store all working calendar
                wcRecord: new Object(),
                editable: [],   //for all Working Calendar content edit panel
                gridWidth: ['2%', '30%', '58%', '10%'],
                //about paging info
                totalPages: 1,
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                orderFields: { //Ordering fields, only for UI
                    wcalendarname: "ASC",
                    description: "",
                    activate: ""
                },
                orderField: 'wcalendarname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        mounted() {
            this.getWCs()
        },
        computed: {
            // if 'SYSTEMDAY', show top in grid
            sortedData: function () {
                return _.sortBy(this.allWCObjs, function (item) {
                    return item.wcalendarname === 'SYSTEMDAY' ? 0 : 1
                });
            }
        },
        methods: {
            //When Grid List click on agent record
            clickOnPackageRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.sortedData[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    if (id.trim() !== 'SYSTEMDAY') // 'SYSTEMDAY' can not delete
                        menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnPackageRecordName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.sortedData[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    if (id.trim() !== 'SYSTEMDAY') // 'SYSTEMDAY' can not delete
                        menuBtn.style.display = 'block'
                }

                this.changeAddWindowStatus('edit')
            },
            getWCs(e) {
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

                HTTP_TRINITY.post(`working-calendar/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allWCObjs = response.data.content
                            this.totalPages = response.data.totalPages
                        } else {
                            this.allWCObjs = response.data
                            this.totalPages = 1
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            changeEditable(index, content) {
                if (this.sortedData[index] && this.sortedData[index].wcalendaruid &&
                    this.sortedData[index].wcalendaruid.trim() === 'SYSTEMDAY') {
                    let newStatus = {
                        "msg": "System day can not be edited!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

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
                    this.sortedData[index] = content
                }
            },
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.wcalendarname) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedRecord.wcalendarname
                }
            },
            deleteWC() {
                HTTP_TRINITY.get(`working-calendar/delete`, {
                    params: {
                        uid: this.selectedRecord.wcalendaruid
                    }
                }).then(response => {
                    this.sortedData.splice(this.selectedRecord.index, 1)
                    this.clearSelectedRecord()
                    this.closeDeleteWindow()
                }).catch(error => {
                    errorHandle(this.$store, error)
                })
            },
            closeDeleteWindow() {
                this.deleteWindowAlive = false
            },
            changeShowMode() {
                this.showMode = !this.showMode
            },
            changeAddWindowStatus(which) {
                if (which != 'add') {
                    if (this.selectedRecord && this.selectedRecord.wcalendaruid && this.selectedRecord.wcalendaruid !== '') {
                        //Get Agent detail record
                        HTTP_TRINITY.get(`working-calendar/findByUid?uid=` + this.selectedRecord.wcalendaruid)
                            .then(response => {
                                this.wcRecord = response.data
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
            //changeDeleteWindowStatus(index, wcalendaruid, wcalendarname) {
            //    if (wcalendaruid && wcalendaruid.trim() === 'SYSTEMDAY') {
            //        let newStatus = {
            //            "msg": "System day can not be removed!",
            //            "status": "Warn"
            //        }
            //        this.$store.dispatch('setSystemStatus', newStatus)
            //        return
            //    }

            //    this.deleteWindowAlive = !this.deleteWindowAlive

            //    /*
            //        store which obj be delete
            //    */
            //    this.deleteIndex = index
            //    this.deleteUid = wcalendaruid
            //    this.deleteName = wcalendarname
            //},
            searchForList(uid) {
                let input, filter, table, i
                input = document.getElementById(uid + 'SearchInput')
                filter = input.value.toUpperCase()
                table = document.getElementById(uid + 'ListTable')
                for (i = 0; i < table.rows.length; i++) {
                    let text = table.rows[i].cells[0].innerHTML
                    if (text.toUpperCase().indexOf(filter) > -1) {
                        table.rows[i].style.display = "";
                    } else {
                        table.rows[i].style.display = "none";
                    }
                }
            },
            //clear selected for UI
            clearSelectedRecord(tr) {
                let table = document.getElementById('wcalTable')
                if (table && table.childNodes) {
                    for (var i = 0; i < table.childNodes.length; i++) {
                        if (table.childNodes[i] !== tr) {
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
            saveWindowContentForAdd(new_content) {
                if (new_content) {
                    this.allWCObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedRecord()
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            saveWindowContentForEdit(new_content) {
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.sortedData[this.selectedRecord.index] = new_content   //replace object to the array
                    this.selectedRecord = new_content
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            //above for pagging, ordering, query
            changeNum(e, index) {
                this.selectedNum = Number(index) - 1
                this.getWCs()
            },
            changeSize(e) {
                this.pageNumSelected('1') 
                this.getWCs()
            },
            pageNumSelected(index) {
                this.selectedNum = Number(index) - 1
                if (this.$refs.paginate)
                    this.$refs.paginate.selected = Number(index) - 1
            },
            applyOrder(field) {
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

                this.getWCs()
            },
            applyQuery() {
                this.pageNumSelected('1')
                this.getWCs()
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
        height: 28px;
        width: 200px;
    }
    #barsTD {
        padding: 0px 0px;
    }

    #barsLabel {
        padding-top: 7px;
        padding-left: 8px;
    }
</style>

