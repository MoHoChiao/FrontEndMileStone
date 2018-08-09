<template>
    <div>
        <working-calendar-add-window :windowAlive="addWindowAlive"
                                     window-title="Add Working Calendar"
                                     @closeAdd="changeAddWindowStatus"></working-calendar-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="changeDeleteWindowStatus"
                               @confirmDelete="deleteWC"></confirm-delete-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <div class="w3-panel w3-col m12 w3-border w3-round w3-padding">
                                <div class="w3-row">
                                    <span class="w3-left">
                                        <input class="w3-input w3-border w3-border w3-small w3-left" type="text" maxlength="32" v-model="queryParam"
                                               placeholder="Name" style="text-transform:uppercase" @keyup.enter="applyQuery">
                                        <i class="fa fa-search w3-button w3-theme-d2" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                    </span>
                                    <i v-if="showMode" class="w3-right fa fa-toggle-on w3-button" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                                    <i v-else class="w3-right fa fa-toggle-off w3-button" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>
                                    <i class="w3-right fa fa-plus w3-button" title="Add Working Calendar" aria-hidden="true" @click="changeAddWindowStatus"></i>
                                    <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                                </div>
                            </div>
                            <!--<p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Working Calendar</i>
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i class="fa fa-plus w3-button w3-right" title="Add Working Calendar" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getWCs"></i>
                            </p>-->
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode" class="w3-small">
                <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
                    <p>
                        <div>
                            <span><img src="/src/assets/images/resource_setter/WorkingCalendar.png" alt="Working Calendar" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                            <span>
                                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        Working Calendar
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
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[0]" title="Order by Package Name" @click="applyOrder('wcalendarname')">
                                            Name
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['wcalendarname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['wcalendarname'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Activate" @click="applyOrder('description')">
                                            Description
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['description'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['description'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-btn w3-hover-none" :width="gridWidth[2]" title="Order by Activate" @click="applyOrder('activate')">
                                            Activate
                                            &nbsp;&nbsp;
                                            <span v-if="this.orderFields['activate'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.orderFields['activate'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                            <div id="packageContainer" class="w3-responsive w3-card w3-round" style="min-height:420px">
                                <table id="wcalTable" class="w3-table-all w3-left">
                                    <tr :id="content.wcalendaruid" :key="content.wcalendaruid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                        @click="clickOnPackageRecord(content.wcalendaruid, index)" v-for="(content, index) in allWCObjs">
                                        <td :width="gridWidth[0]">
                                            <span>{{ content.wcalendarname }}</span>
                                        </td>
                                        <td :width="gridWidth[1]">
                                            <span :title="content.description">{{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}</span>
                                        </td>
                                        <td :width="gridWidth[2]">
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
            <div v-else>
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
            </div>
            <!--<ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
                <li :id="content.wcalendaruid+'List'" :key="content.wcalendaruid+'List'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allWCObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/WorkingCalendar.png" alt="Working Calendar" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>{{ content.wcalendarname }}</p>
                        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                        <button title="Delete This Working Calendar" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.wcalendaruid, content.wcalendarname)">
                            <i class="fa fa-trash-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Delete</span>
                        </button>
                        <button title="Edit This Working Calendar" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i>
                            <span class="w3-hide-medium w3-hide-small"> Edit</span>
                        </button>
                    </div>
                    <working-calendar-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></working-calendar-edit-panel>
                </li>
            </ul>-->
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

    export default {
        components: {
            'filter-panel': FilterPanel,
            'working-calendar-edit-panel': WorkingCalendarEditPanel,
            'working-calendar-add-window': WorkingCalendarAddWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'page': page
        },
        data() {
            return {
                showMode: true, //switch content list or table list
                addWindowAlive: false,  //for add Working Calendar modal windows
                deleteWindowAlive: false,  //for delete Working Calendar modal windows
                deleteIndex: -1,    //store which index will be delete
                deleteUid: '',      //store which obj will be delete
                deleteName: '',     //store which obj name will be delete
                allWCObjs: [], //store all working calendar
                editable: [],   //for all Working Calendar content edit panel
                gridWidth: ['30%', '60%', '10%'],
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
        methods: {
            //When Grid List click on agent record
            clickOnPackageRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.allWCObjs[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                }
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
                if (this.allWCObjs[index] && this.allWCObjs[index].wcalendaruid &&
                    this.allWCObjs[index].wcalendaruid.trim() === 'SYSTEMDAY') {
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
                    this.allWCObjs[index] = content
                }
            },
            deleteWC() {
                if (this.deleteIndex === -1)
                    return
                if (this.deleteUid === '')
                    return

                HTTP_TRINITY.get(`working-calendar/delete`, {
                    params: {
                        uid: this.deleteUid
                    }
                })
                    .then(response => {
                        this.allWCObjs.splice(this.deleteIndex, 1)
                        this.editable.splice(this.deleteIndex, 1)
                        this.editable.fill(false) //close all edit form
                        this.changeDeleteWindowStatus(-1, '', '')
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })

            },
            changeShowMode() {
                this.showMode = !this.showMode
            },
            changeAddWindowStatus(content) {
                this.addWindowAlive = !this.addWindowAlive
                //if (content !== undefined) {
                //    this.allWCObjs.unshift(content) //add object to the top of array
                //    this.editable.fill(false) //close all edit form
                //    // this.editable.unshift(false)
                //}
            },
            changeDeleteWindowStatus(index, wcalendaruid, wcalendarname) {
                if (wcalendaruid && wcalendaruid.trim() === 'SYSTEMDAY') {
                    let newStatus = {
                        "msg": "System day can not be removed!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

                this.deleteWindowAlive = !this.deleteWindowAlive

                /*
                    store which obj be delete
                */
                this.deleteIndex = index
                this.deleteUid = wcalendaruid
                this.deleteName = wcalendarname
            },
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
                this.getWCs()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getWCs()
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

                this.getWCs()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
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
        height: 31px;
        width: 210px;
    }
</style>

