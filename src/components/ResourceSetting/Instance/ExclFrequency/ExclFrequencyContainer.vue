<template>
    <div>
        <excl-frequency-add-window :windowAlive="addWindowAlive"
                                   window-title="Add Exclude Frequency"
                                   :content="selectedRecord"
                                   :urlOp="operation"
                                   @closeAdd="saveAddWindow"
                                   @closeEdit="saveEditWindow">
        </excl-frequency-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive"
                               :deleteName="deleteName"
                               window-title="Confirm window"
                               window-bg-color="highway-schoolbus"
                               btn-color="signal-white"
                               @closeDelete="closeDeleteWindow"
                               @confirmDelete="deleteExclFreq">

        </confirm-delete-window>
        <excl-frequency-apply-window :windowAlive="applyWindowAlive"
                                     window-title="Apply Exclude Frequency To Other Object"
                                     :applyTimes="selectedRecord.excludefrequencylist"
                                     :excludefrequencyuid="selectedRecord.excludefrequencyuid"
                                     @closeApply="changeApplyWindowStatus">

        </excl-frequency-apply-window>
        <router-view name="content">
            <!--Global Excl Freq Window組件內容會在這裡渲染-->
        </router-view>
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
                                    <i v-if="showMode" class="fa fa-trash-o w3-button w3-right" title="Delete" aria-hidden="true" @click="showDeleteWindow"></i>
                                    <i v-if="showMode" class="fa fa-pencil w3-button w3-right" title="Edit" aria-hidden="true" @click="changeAddWindowStatus('edit')"></i>
                                    <i class="w3-right fa fa-plus w3-button" title="Add Exclude frequency" aria-hidden="true" @click="changeAddWindowStatus('add')"></i>
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
                                <img src="src/assets/images/resource_setter/exclude_frequency.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        Exclude Frequency
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                                   placeholder="Name" style="height:28px;max-width: 200px" @keyup.enter="applyQuery">
                            <i class="fa fa-search w3-button" title="Search" aria-hidden="true" @click="applyQuery"></i>
                            <!--<i v-if="showMode" class="w3-right fa fa-toggle-on w3-button" title="Switch to Content List" aria-hidden="true" @click="changeShowMode()"></i>
                            <i v-else class="w3-right fa fa-toggle-off w3-button" title="Switch to Grid List" aria-hidden="true" @click="changeShowMode()"></i>-->
                            <i class="w3-right fa fa-plus w3-button" title="Add Exclude frequency" aria-hidden="true" @click="changeAddWindowStatus('add')"></i>
                            <i class="w3-right fa fa-refresh w3-button" title="Reload" aria-hidden="true" @click="applyQuery"></i>
                        </div>
                        <p>
                            <div>
                                <div class="w3-responsive w3-card w3-round">
                                    <table class="w3-table-all">
                                        <tr class="w3-teal">
                                            <th :width="gridWidth[0]"></th>
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[1]" title="Order by Package Name" @click="applyOrder('excludefrequencyname')">
                                                Name
                                                &nbsp;
                                                <span v-if="this.orderFields['excludefrequencyname'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['excludefrequencyname'] == 'ASC'" class="w3-text-black">&#9650;</span>
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
                                            <th class="w3-btn w3-hover-none" :width="gridWidth[4]" title="Order by Update Time" @click="applyOrder('lastupdatetime')">
                                                Update Time
                                                &nbsp;
                                                <span v-if="this.orderFields['lastupdatetime'] == 'DESC'" class="w3-text-black">&#9660;</span>
                                                <span v-else-if="this.orderFields['lastupdatetime'] == 'ASC'" class="w3-text-black">&#9650;</span>
                                            </th>
                                        </tr>
                                    </table>
                                </div>
                                <div id="freqContainer" class="w3-responsive w3-card w3-round">
                                    <table id="freqTable" class="w3-table-all w3-left">
                                        <empty-grid v-if="allExclFreqObjs.length == 0"></empty-grid>
                                        <tr v-else :id="content.excludefrequencyuid" :key="content.excludefrequencyuid" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                            @click="clickOnFreqRecord(content.excludefrequencyuid, index)" v-for="(content, index) in sortedData">
                                            <td id="barsTD" :width="gridWidth[0]">
                                                <div class="w3-dropdown-hover w3-blue-grey" style="display:none;position:absolute;">
                                                    <i id="barsLabel" class="fa fa-bars"></i>
                                                    <div class="w3-dropdown-content w3-bar-block w3-card-4">
                                                        <button class="w3-bar-item w3-button w3-padding-small" @click.stop="showDeleteWindow"> Delete</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td :width="gridWidth[1]">
                                                <span style="text-decoration:underline;" @click.stop="clickOnFreqRecordName(content.excludefrequencyuid, index)">
                                                    {{ content.excludefrequencyname }}
                                                </span>
                                            </td>
                                            <td :width="gridWidth[2]">
                                                <span :title="content.description">{{ content.description.length > 50 ? content.description.substr(0, 50) + '...' : content.description }}</span>
                                            </td>
                                            <td :width="gridWidth[3]">
                                                <i v-if="content.activate == 1" class="fa fa-check-circle w3-text-green" />
                                                <i v-else class="fa fa-times-circle w3-text-red" />
                                            </td>
                                            <td :width="gridWidth[4]">
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
                <div :key="content.excludefrequencyuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allExclFreqObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="src/assets/images/resource_setter/exclude_frequency.png" alt="Exclude Frequency" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            <i v-if="content.excludefrequencyuid.trim() === 'global'" class="fa fa-globe fa-fw w3-text-blue"></i>
                            {{ content.excludefrequencyname }}
                        </p>
                        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                        <excl-frequency-apply-panel :key="content.excludefrequencyuid+'ApplyPanel'"
                                                    :applyTimes="content.excludefrequencylist" :excludefrequencyuid="content.excludefrequencyuid">
                        </excl-frequency-apply-panel>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <span class="w3-right">
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" title="Edit" @click="clickOnFreqPanel('edit', index, content)">
                                <i class="fa fa-pencil" />
                            </button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" title="Delete" @click="clickOnFreqPanel('delete', index, content)">
                                <i class="fa fa-trash-o" />
                            </button>
                        </span>
                    </div>
                    <excl-frequency-edit-panel v-else :key="content.excludefrequencyuid+'EditPanel1'"
                                               :index="index" :content="content" @closeEdit="changeEditable"></excl-frequency-edit-panel>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import FilterPanel from '../../FilterPanel.vue'
    import ExclFrequencyEditPanel from './ExclFrequencyEditPanel.vue'
    import ExclFrequencyApplyPanel from './ExclFrequencyApplyPanel.vue'
    import ExclFrequencyAddWindow from './ExclFrequencyAddWindow.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
    import ExclFrequencyApplyWindow from './ExclFrequencyApplyWindow.vue'
    import page from '../../page.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'

    export default {
        components: {
            'filter-panel': FilterPanel,
            'excl-frequency-edit-panel': ExclFrequencyEditPanel,
            'excl-frequency-apply-panel': ExclFrequencyApplyPanel,
            'excl-frequency-add-window': ExclFrequencyAddWindow,
            'confirm-delete-window': ConfirmDeleteWindow,
            'excl-frequency-apply-window': ExclFrequencyApplyWindow,
            'page': page,
            'empty-grid': EmptyGrid
        },
        data() {
            return {
                showMode: true, //switch content list or table list
                addWindowAlive: false,  //for add Exclude Frequency modal windows
                operation: 'add',   //keep which operation(add,edit) will be execute
                applyWindowAlive: false, //for modify Exclude Frequency Apply modal windows(Frequency, Job, Flow)
                deleteWindowAlive: false,  //for delete Exclude Frequency modal windows
                deleteName: '',     //store which obj name will be delete
                allExclFreqObjs: [], //store all Exclude Frequency
                editable: [],   //for all Exclude Frequency content edit panel
                selectedRecord: new Object(),   //store which excl freq apply button has been clicked.
                gridWidth: ['2%', '30%', '38%', '10%', '20%'],
                //about paging info
                totalPages: 1,
                selectedNum: 0,
                selectedSize: 10,
                //about ordering info
                orderFields: { //Ordering fields, only for UI
                    excludefrequencyname: "ASC",
                    description: "",
                    activate: "",
                    lastupdatetime: ""
                },
                orderField: 'excludefrequencyname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        mounted() {
            this.getExclFreq()
        },
        computed: {
            // if 'GLOBAL', show top in grid
            sortedData: function () {
                return _.sortBy(this.allExclFreqObjs, function (item) {
                    return item.excludefrequencyname === 'GLOBAL'? 0: 1
                });
            }
        },
        methods: {
            //When Grid List click on agent record
            clickOnFreqRecord(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr)
                let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.sortedData[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    if (id.trim() !== 'global') // 'GLOBAL' can not delete
                        menuBtn.style.display = 'block'
                } else {
                    tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                    menuBtn.style.display = 'none'
                }
            },
            clickOnFreqRecordName(id, index) {
                let tr = document.getElementById(id)

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    this.clearSelectedRecord(tr)

                    tr.className = 'w3-blue-grey'
                    this.selectedRecord = this.sortedData[index]
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    let menuBtn = tr.getElementsByClassName('w3-dropdown-hover w3-blue-grey')[0]
                    if (id.trim() !== 'global') // 'GLOBAL' can not delete
                        menuBtn.style.display = 'block'
                }

                this.changeAddWindowStatus('edit')
            },
            clickOnFreqPanel(which, index, content) {
                if (content) {
                    this.selectedRecord = content
                    this.selectedRecord.index = index //New prop is stores which agent obj will be deleted in UI

                    if (which == 'edit')
                        this.changeEditable(index)
                    else if (which == 'delete')
                        this.showDeleteWindow()
                }
            },
            getExclFreq(e) {
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

                HTTP_TRINITY.post(`excl-frequency/findByFilter`, params)
                    .then(response => {
                        this.editable.fill(false) //close all edit form
                        if (response.data.content !== undefined) {
                            this.allExclFreqObjs = response.data.content
                            this.totalPages = response.data.totalPages
                        } else {
                            this.allExclFreqObjs = response.data
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
                    this.allExclFreqObjs[index] = content
                }
            },
            changeApplyWindowStatus(record) {
                if (record)
                    this.selectedRecord = record
                this.applyWindowAlive = !this.applyWindowAlive
            },
            //above for delete window
            showDeleteWindow() {
                if ((this.selectedRecord.index || this.selectedRecord.index === 0)
                    && this.selectedRecord.excludefrequencyname) {
                    this.deleteWindowAlive = true
                    this.deleteName = this.selectedRecord.excludefrequencyname
                }
            },
            deleteExclFreq() {
                HTTP_TRINITY.get(`excl-frequency/delete`, {
                    params: {
                        uid: this.selectedRecord.excludefrequencyuid
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
                this.clearSelectedRecord()
            },
            changeAddWindowStatus(which) {
                if (which == 'edit') {
                    if (this.selectedRecord && this.selectedRecord.excludefrequencyuid && this.selectedRecord.excludefrequencyuid !== '') {
                        //Get Agent detail record
                        this.operation = which
                        this.addWindowAlive = !this.addWindowAlive
                    }
                } else {
                    this.operation = which
                    this.addWindowAlive = !this.addWindowAlive
                }
            },
            saveAddWindow(new_content) {
                if (new_content) {    //new_content !== undefined, it means from Window Save Click
                    this.allExclFreqObjs.unshift(new_content) //add object to the top of array
                    this.clearSelectedRecord()
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            saveEditWindow(new_content) {
                //new_content !== undefined, it means from Agent Window Save Click
                if (new_content && this.selectedRecord && (this.selectedRecord.index || this.selectedRecord.index === 0)) {
                    new_content.index = this.selectedRecord.index   //asign old index prop to new content
                    this.sortedData[this.selectedRecord.index] = new_content   //replace object to the array
                    this.selectedRecord = new_content
                }
                this.addWindowAlive = !this.addWindowAlive
            },
            //changeDeleteWindowStatus(index, excludefrequencyuid, excludefrequencyname) {
            //    this.deleteWindowAlive = !this.deleteWindowAlive

            //    /*
            //        store which obj be delete
            //    */
            //    this.deleteIndex = index
            //    this.deleteUid = excludefrequencyuid
            //    this.deleteName = excludefrequencyname
            //},
            //clear selected for UI
            clearSelectedRecord(tr) {
                let table = document.getElementById('freqTable')
                if (table && table.childNodes) {  //判斷是否是從Content List來的操作, 不成立表示由Grid List來的操作
                    for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有package row的class
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
                this.getExclFreq()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getExclFreq()
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

                this.getExclFreq()
            },
            applyQuery() {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.getExclFreq()
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

