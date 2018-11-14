<template>
    <div>
        <job-pick-window :windowAlive="isShowSelectedTable"
                         @closePick="changeSelectedTableStatus"
                         @setTriggerJob="setTriggerJob" >
        </job-pick-window>
        <div class="w3-small w3-panel w3-card">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m4">
                    <input class="w3-check" v-model="new_content.filetrigger" type="checkbox">
                    <label>{{ $t('Form.Fs.JobTrigger') }}</label>
                </div>
                <div v-if="new_content.filetrigger" class="w3-col m8">
                    <input name="namePath" :class="[inputClassList.common, errors.has('namePath')? inputClassList.invalid: '']"
                           v-validate="'required'" v-model="namePath" type="text" @click="changeSelectedTableStatus" readonly>
                </div>
            </div>
            <div v-if="new_content.filetrigger" class="w3-row-padding w3-section">
                <div class="w3-col m6">
                    <input class="w3-check" v-model="isOverrideTxDate" type="checkbox">
                    <label>{{ $t('Form.Fs.OverrideTXDate') }}</label>
                </div>
            </div>
            <div v-if="isOverrideTxDate && new_content.filetrigger" class="w3-row-padding w3-section">
                <div class="w3-col m4">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.DateFormat') }}</label>
                    <input name="txdateformat" :class="[inputClassList.common, errors.has('txdateformat')? inputClassList.invalid: '']"
                           v-validate="'required'" v-model="new_content.txdateformat" type="text" placeholder="e.g. YYYYMMDD">
                </div>
                <div class="w3-col m4">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.StartPosition') }}</label>
                    <input name="txdatestartpos" :class="[inputClassList.common, errors.has('txdatestartpos')? inputClassList.invalid: '']"
                           v-validate="'required|between:0,32767'" ref="startpos" 
                           v-model="new_content.txdatestartpos" type="number" min="0" max="32767">
                </div>
                <div class="w3-col m4">
                    <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.EndPosition') }}</label>
                    <input name="txdateendpos" :class="[inputClassList.common, errors.has('txdateendpos')? inputClassList.invalid: '']"
                           v-validate="'required|between:0,32767|isBigger:startpos'" v-model="new_content.txdateendpos" type="number" min="0" max="32767">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import JobPickWindow from './JobPickWindow.vue'

    export default {
        components: {
            'job-pick-window': JobPickWindow
        },
        data() {
            return {
                isShowSelectedTable: false,
                inputClassList: {
                    common: 'w3-input w3-border',
                    invalid: 'w3-pale-red'
                },
                selectedEntityRecord: new Object(), //store which is selected entity
                selectedCategoryRecord: new Object(), //store which is selected job category
                selectedJobRecord: new Object(), //store which is selected job
                namePath: '',   //store "entityname:categoryname.jobname"
                isOverrideTxDate: false,
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    filetrigger: Number(this.content.filetrigger),
                    txdateformat: this.content.txdateformat,
                    triggerjobuid: this.content.triggerjobuid,
                    txdatestartpos: this.content.txdatestartpos,
                    txdateendpos: this.content.txdateendpos

                },
                cfs: [],    //store all Implementation Class and display name
                entities: [],
                categories: [],
                jobs: []
            }
        },
        mounted() {
            //fetch all entities
            this.getEntities()
            //fetch trigger job full path
            this.getJobFullPath()
            //reset isOverrideTxDate value
            if (this.new_content.txdateformat.trim() === '' &&
                this.new_content.txdatestartpos == 0 &&
                this.new_content.txdateendpos == 0) {
                this.isOverrideTxDate = false
            } else {
                this.isOverrideTxDate = true
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        filetrigger: 0,
                        triggerjobuid: '',
                        txdateformat: '',
                        txdatestartpos: 0,
                        txdateendpos: 1
                    }
                }
            },
            index: Number
        },
        methods: {
            clickOnEntity(id, index) {
                let tr = document.getElementById(id)
                this.clearSelectedRecord(tr, 'entityTable')

                if (tr.className.indexOf('w3-blue-grey') == -1) {
                    tr.className = 'w3-blue-grey'
                    this.selectedEntityRecord = this.entities[index]
                    this.selectedCategoryRecord = new Object()  //撰擇了Entity之後,category必須重選
                    this.selectedJobRecord = new Object()   //撰擇了Entity之後,job也必須重選
                    this.new_content.triggerjobuid = '' //撰擇了Entity之後,job uid要清空
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
                    this.new_content.triggerjobuid = '' //撰擇了category之後,job uid要清空
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
                    this.new_content.triggerjobuid = this.selectedJobRecord.jobuid
                }

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
                        this.jobs = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            changeSelectedTableStatus() {
                this.isShowSelectedTable = !this.isShowSelectedTable
            },
            getJobFullPath() {
                if (!this.new_content.triggerjobuid || this.new_content.triggerjobuid.trim() === '')
                    return

                HTTP_TRINITY.get(`job/findJobFullPathByUid`, {
                    params: {
                        uid: this.new_content.triggerjobuid
                    }
                })
                    .then(response => {
                        if (!response.data.jobuid || response.data.jobuid.trim() === '') {
                            this.namePath = ''
                            this.new_content.triggerjobuid = ''
                        } else {
                            this.namePath = response.data.busentityname + ':' + response.data.categoryname + '.' + response.data.jobname
                        }
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            clearSelectedRecord(tr, whichTable) {
                let table = document.getElementById(whichTable)
                for (var i = 0; i < table.childNodes.length; i++) {  //先重設所有category row的class
                    if (table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                        table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                }
            },
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                } else {
                    //當沒有勾選override txdate或filetrigger時, 要強制讓txdateformat='',txdatestartpos=0,txdateendpos=0
                    if (!this.new_content.filetrigger || !this.isOverrideTxDate) {
                        this.new_content.txdateformat = ''
                        this.new_content.txdatestartpos = 0
                        this.new_content.txdateendpos = 0
                    }

                    //把所有true or false值的checkbox欄位轉換為數字
                    this.new_content.filetrigger = Number(this.new_content.filetrigger)

                    return this.new_content
                }
            },
            reset() {
                //reset value to initial
                this.new_content.filetrigger = this.content.filetrigger
                this.new_content.txdateformat = this.content.txdateformat
                this.new_content.triggerjobuid = this.content.triggerjobuid
                this.new_content.txdatestartpos = this.content.txdatestartpos
                this.new_content.txdateendpos = this.content.txdateendpos
                if (this.content.txdateformat === '')
                    this.isOverrideTxDate = false
            },
            setTriggerJob(uid, namePath) {
                this.new_content.triggerjobuid = uid
                this.namePath = namePath
                this.changeSelectedTableStatus()
            }
        }
    }
</script>
<style scoped>
    input,select {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>