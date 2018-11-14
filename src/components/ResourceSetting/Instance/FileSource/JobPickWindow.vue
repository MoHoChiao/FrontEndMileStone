<template>
    <modal-window v-if="this.windowAlive" :window-title="$t('Form.Fs.JobTrigger')" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div slot="content" class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Hierarchy</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">Search</div>
            </a>
            <div v-show="tabsFlag[0]" class="w3-row-padding w3-section">
                <p>
                    <div class="w3-third">
                        <div class="w3-responsive w3-card-0 w3-round">
                            <table class="w3-table-all w3-small">
                                <tr class="w3-teal">
                                    <th class="w3-center">{{ $t('Window.Resource.Entity') }}</th>
                                </tr>
                            </table>
                        </div>
                        <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:300px">
                            <table id="entityTable" class="w3-table-all w3-small" style="cursor: pointer">
                                <template v-for="(entity, index) in entities">
                                    <tr :id="entity.busentityuid" :key="entity.busentityuid" class="w3-hover-blue-grey w3-hover-opacity" 
                                        @click="clickOnEntity(entity.busentityuid, index)">
                                        <td class="w3-center">
                                            <span v-if="entity.busentityname.length > 25" :title="entity.busentityname">
                                                {{entity.busentityname.substr(0, 25) + '...'}}
                                            </span>
                                            <span v-else>{{ entity.busentityname }}</span>
                                        </td>
                                    </tr>
                                </template>
                            </table>
                        </div>
                    </div>
                    <div class="w3-third">
                        <div class="w3-responsive w3-card-0 w3-round">
                            <table class="w3-table-all w3-small">
                                <tr class="w3-teal">
                                    <th class="w3-center">{{ $t('Window.Resource.Category') }}</th>
                                </tr>
                            </table>
                        </div>
                        <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:300px">
                            <table id="categoryTable" class="w3-table-all w3-small" style="cursor: pointer">
                                <template v-for="(category, index) in categories">
                                    <tr :id="category.categoryuid" :key="category.categoryuid" class="w3-hover-blue-grey w3-hover-opacity"
                                        @click="clickOnCategory(category.categoryuid, index)">
                                        <td class="w3-center">
                                            <span v-if="category.categoryname.length > 25" :title="category.categoryname">
                                                {{category.categoryname.substr(0, 25) + '...'}}
                                            </span>
                                            <span v-else>{{ category.categoryname }}</span>
                                        </td>
                                    </tr>
                                </template>
                            </table>
                        </div>
                    </div>
                    <div class="w3-third">
                        <div class="w3-responsive w3-card-0 w3-round">
                            <table class="w3-table-all w3-small">
                                <tr class="w3-teal">
                                    <th class="w3-center">{{ $t('Window.Resource.Job') }}</th>
                                </tr>
                            </table>
                        </div>
                        <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:300px">
                            <table id="jobTable" class="w3-table-all w3-small" style="cursor: pointer">
                                <template v-for="(job, index) in jobs">
                                    <tr :id="job.jobuid" :key="job.jobuid" class="w3-hover-blue-grey w3-hover-opacity" 
                                        @click="clickOnJob(job.jobuid, index)">
                                        <td class="w3-center">
                                            <span v-if="job.jobname.length > 25" :title="job.jobname">{{job.jobname.substr(0, 25) + '...'}}</span>
                                            <span v-else>{{job.jobname}}</span>
                                        </td>
                                    </tr>
                                </template>
                            </table>
                        </div>
                    </div>
                </p>
            </div>
            <div v-show="tabsFlag[1]" class="w3-row-padding w3-section">
                <p>
                    <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="queryParam"
                           placeholder="Job Name" style="height:28px;max-width: 400px;text-transform:uppercase" @keyup.enter="applyQuery">
                    <i class="fa fa-search w3-button" aria-hidden="true" @click="applyQuery"></i>
                </p>
                <p>
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr class="w3-teal">
                                <th class="w3-hover-none" :width="gridWidth[0]" title="" @click="">
                                    {{ $t('Window.Resource.Entity') }}
                                    &nbsp;
                                </th>
                                <th class="w3-hover-none" :width="gridWidth[1]" title="" @click="">
                                    {{ $t('Window.Resource.Category') }}
                                    &nbsp;
                                </th>
                                <th class="w3-hover-none" :width="gridWidth[2]" title="" @click="">
                                    {{ $t('Window.Resource.Job') }}
                                    &nbsp;
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <empty-grid v-if="searchJobs.length == 0"></empty-grid>
                            <tr v-else v-for="(item, index) in searchJobs" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer"
                                @click="clickOnSearchJob(item)">
                                <td :width="gridWidth[0]">{{item.entityname}}</td>
                                <td :width="gridWidth[1]">{{item.categoryname}}</td>
                                <td :width="gridWidth[2]">
                                    <span v-if="item.jobname.length > 25" :title="item.jobname">{{item.jobname.substr(0, 25) + '...'}}</span>
                                    <span v-else>{{item.jobname}}</span>
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
                                <span class="w3-col m6 w3-hide-medium" style="padding-top:10px">
                                    {{ $t('Container.PageSize') }}
                                </span>
                                <span class="w3-col m6" style="padding-top:10px">
                                    <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize" disabled>
                                        <option value="-1" disabled selected>Size</option>
                                        <option value="10">10</option>
                                    </select>
                                </span>
                            </div>
                        </div>
                    </div>
                </p>
            </div>
        </div>
    </modal-window>
</template>

<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import ModalWindow from '../../../Common/window/ModalWindow.vue'
    import EmptyGrid from '../../../Common/EmptyGrid.vue'
    import page from '../../page.vue'

    export default {
        components: {
            'modal-window': ModalWindow,
            'empty-grid': EmptyGrid,
            'page': page
        },
        props: {
            windowAlive: {
                type: Boolean,
                default: false
            },
            windowBgColor: {
                type: String,
                default: 'camo-black'
            },
        },
        data() {
            return {
                tabsClass: [
                    'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                    'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'
                ],
                tabsFlag: [true, false],
                gridWidth: ['33%', '33%', '33%'],
                selectedEntityRecord: null, //store which is selected entity
                selectedCategoryRecord: null, //store which is selected job category
                selectedJobRecord: null, //store which is selected job
                entities: [],
                categories: [],
                jobs: [],
                searchJobs: [],
                //about paging info
                totalPages: 1,
                selectedPage: 1, //this is for UI use
                selectedNum: 0, //this is for backend use
                selectedSize: 10,
                //about connection ordering info
                orderFields: { //Ordering fields, only for UI
                    entityname: "ASC",
                    categoryname: "",
                    jobname: ""
                },
                orderField: 'entityname',   //send to backend
                orderType: 'ASC',  //send to backend
                //about query param
                queryParam: ''
            }
        },
        created() {
            this.getEntities()
        },
        methods: {
            openTab(whichTab) {
                for (let i = 0; i < this.tabsFlag.length; i++) {
                    this.$set(this.tabsFlag, i, false)
                }
                this.$set(this.tabsFlag, whichTab, true)

                for (let i = 0; i < this.tabsClass.length; i++) {
                    this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
                }
                this.$set(this.tabsClass, whichTab, this.tabsClass[whichTab] + " w3-border-theme")
            },
            getEntities() {
                //Fetch all business entities objs is above
                HTTP_TRINITY.get(`busentity/findAll`)
                    .then(response => {
                        this.entities = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getCategories() {
                if (!this.selectedEntityRecord || !this.selectedEntityRecord.busentityuid || this.selectedEntityRecord.busentityuid === '') {
                    //在沒選擇entity的情況下,則category和job一定要讓它們為空的
                    this.categories = []
                    this.jobs = []
                    this.selectedCategoryRecord = new Object()
                    this.selectedJobRecord = new Object()
                    return
                }

                let urlPath = 'job-category/findByFilter?entityUid=' + this.selectedEntityRecord.busentityuid
                let params = {
                    "ordering": {
                        "orderType": "ASC",
                        "orderField": "categoryname"
                    }
                }

                HTTP_TRINITY.post(urlPath, params)
                    .then(response => {
                        this.categories = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getJobs() {
                if (!this.selectedCategoryRecord || !this.selectedCategoryRecord.categoryuid || this.selectedCategoryRecord.categoryuid === '') {
                    //在沒選擇category的情況下,則job一定要讓它為空的
                    this.jobs = []
                    this.selectedJobRecord = new Object()
                    return
                }

                let urlPath = 'job/findByFilter?categoryUid=' + this.selectedCategoryRecord.categoryuid
                let params = {
                    "ordering": {
                        "orderType": "ASC",
                        "orderField": "jobname"
                    }
                }

                HTTP_TRINITY.post(urlPath, params)
                    .then(response => {
                        this.jobs = response.data.content
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            clickOnEntity(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr, 'entityTable')

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedEntityRecord = this.entities[index]
                    this.selectedCategoryRecord = new Object()  //撰擇了Entity之後,category必須重選
                    this.selectedJobRecord = new Object()   //撰擇了Entity之後,job也必須重選
                    this.getCategories()   //refresh Job Category content
                    this.getJobs()   //refresh Job content
                }
            },
            clickOnCategory(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr, 'categoryTable')

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedCategoryRecord = this.categories[index]
                    this.selectedJobRecord = new Object()   //撰擇了category之後,job必須重選
                    this.getJobs()   //refresh Job content
                }
            },
            clickOnJob(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr, 'jobTable')

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedJobRecord = this.jobs[index]
                    this.namePath = this.selectedEntityRecord.busentityname + ':' + this.selectedCategoryRecord.categoryname + '.' + this.selectedJobRecord.jobname

                    this.$emit('setTriggerJob', this.selectedJobRecord.jobuid, this.namePath);
                    this.clearData()
                }
            },
            clickOnSearchJob(record) {
                this.namePath = record.entityname + ':' + record.categoryname + '.' + record.jobname
                this.$emit('setTriggerJob', record.jobuid, this.namePath);
                this.clearData()
            },
            clearSelectedRecord(tr, whichTable) {
                let table = document.getElementById(whichTable)

                for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有category row的class
                    if (table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                }
            },
            clearData() {
                this.selectedEntityRecord = null
                this.selectedCategoryRecord = null
                this.selectedJobRecord = null
                this.categories = []
                this.jobs = []
                this.searchJobs = []
                this.queryParam = ''
            },
            //above for pagging, ordering, query
            changeNum(e, index) {
                //紀錄現在點擊的是那一頁
                this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
                this.selectedPage = index   //for UI page num
                this.applyQuery()
            },
            changeSize(e) {
                this.pageNumSelected('1')   //每一次的查詢, 都要讓page number先回到第一頁
                this.applyQuery()
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
                this.applyQuery()
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
            },
            applyQuery() {
                let urlPath = 'job/findByFilter'
                let params = {
                    "paging": {
                        "number": this.selectedNum,
                        "size": this.selectedSize
                    },
                    "ordering": {
                        "orderType": "ASC",
                        "orderField": "jobname"
                    },
                    "param": this.queryParam
                }

                HTTP_TRINITY.post(urlPath, params)
                    .then(response => {
                        this.searchJobs = response.data.content
                        if (response.data.totalPages <= 0)
                            this.totalPages = 1
                        else
                            this.totalPages = response.data.totalPages
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            cancel() {
                this.$emit('closePick')
            }
        }
    }
</script>