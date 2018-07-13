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

        <div class="w3-row-padding">
            <div class="w3-col m12">
                <div class="w3-card-4 w3-round w3-signal-white">
                    <div class="w3-container">
                        <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                            <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                            <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Working Calendar</i>
                            <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                            <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                            <i class="fa fa-plus w3-button w3-right" title="Add Working Calendar" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                            <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getWCs"></i>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showMode">
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
        <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
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
        </ul>

        <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getWCs"></filter-panel>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import FilterPanel from '../../FilterPanel.vue'
    import WorkingCalendarEditPanel from './WorkingCalendarEditPanel.vue'
    import WorkingCalendarAddWindow from './WorkingCalendarAddWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

    export default {
        data() {
            return {
                showMode: true, //switch content list or table list
                addWindowAlive: false,  //for add Working Calendar modal windows
                deleteWindowAlive: false,  //for delete Working Calendar modal windows
                deleteIndex: -1,    //store which index will be delete
                deleteUid: '',      //store which obj will be delete
                deleteName: '',     //store which obj name will be delete
                allWCObjs: new Object(), //store all working calendar
                editable: [],   //for all Working Calendar content edit panel
                orderFields: [  //for ordering filter fields
                    { name: "Name", value: "wcalendarname" },
                    { name: "Activate", value: "activate" }
                ],
                queryFields: [  //for querying filter fields
                    { name: "Name", value: "wcalendarname" },
                    { name: "Activate", value: "activate" },
                    { name: "Desc", value: "Description" }
                ]
            }
        },
        mounted() {
            this.getWCs()
        },
        methods: {
            getWCs(e) {
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

                HTTP_TRINITY.post(`working-calendar/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allWCObjs = response.data.content
                            this.$refs.filter.totalPages = response.data.totalPages
                        } else {
                            this.allWCObjs = response.data
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
                if (content !== undefined) {
                    this.allWCObjs.unshift(content) //add object to the top of array
                    this.editable.fill(false) //close all edit form
                    // this.editable.unshift(false)
                }
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
            }
        },
        components: {
            'filter-panel': FilterPanel,
            'working-calendar-edit-panel': WorkingCalendarEditPanel,
            'working-calendar-add-window': WorkingCalendarAddWindow,
            'confirm-delete-window': ConfirmDeleteWindow
        }
    }
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

