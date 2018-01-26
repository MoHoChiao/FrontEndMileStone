<template>
  <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
    <div class="w3-small w3-panel w3-card" slot="content">
        <div v-if="applyType[1]" class="w3-row-padding w3-section">
            <div class="w3-half">
                <div class="w3-responsive w3-card-0 w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center">Frequency Category</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="freqCategoryTable" class="w3-table-all w3-small">
                        <template v-for="(category, index) in freqCategories">
                        <tr :id="category.freqcategoryuid" :key="category.freqcategoryuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnFreqCategory(category.freqcategoryuid, index)">
                            <td class="w3-center">
                                <span>{{ category.freqcategoryname }}</span>
                            </td>
                        </tr>
                        </template>
                    </table>
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-responsive w3-card-0 w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center">Frequency</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="freqTable" class="w3-table-all w3-small">
                        <template v-for="(freq, index) in freqs">
                        <tr v-if="!frequencyUids.includes(freq.frequencyuid)" :id="freq.frequencyuid" :key="freq.frequencyuid" 
                                class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnFreq(freq.frequencyuid, index)">
                            <td class="w3-center">
                                <span>{{ freq.frequencyname }}</span>
                            </td>
                        </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
        <div v-else-if="applyType[2]" class="w3-row-padding w3-section">
            <div class="w3-third">
                <div class="w3-responsive w3-card-0 w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center">Entity</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="entityTable" class="w3-table-all w3-small">
                        <template v-for="(entity, index) in entities">
                        <tr :id="entity.busentityuid" :key="entity.busentityuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnEntity(entity.busentityuid, index)">
                            <td class="w3-center">
                                <span>{{ entity.busentityname }}</span>
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
                            <th class="w3-center">Category</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="categoryTable" class="w3-table-all w3-small">
                        <template v-for="(category, index) in categories">
                        <tr :id="category.categoryuid" :key="category.categoryuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnCategory(category.categoryuid, index)">
                            <td class="w3-center">
                                <span>{{ category.categoryname }}</span>
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
                            <th class="w3-center">Job</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="jobOrFlowTable" class="w3-table-all w3-small">
                        <template v-for="(jobOrFlow, index) in jobsOrFlows">
                        <tr v-if="!jobUids.includes(jobOrFlow.jobuid)" :id="jobOrFlow.jobuid" :key="jobOrFlow.jobuid" 
                                class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnJobOrFlow(jobOrFlow.jobuid, index)">
                            <td class="w3-center">
                                <span>{{ jobOrFlow.jobname }}</span>
                            </td>
                        </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
        <div v-else-if="applyType[3]" class="w3-row-padding w3-section">
            <div class="w3-third">
                <div class="w3-responsive w3-card-0 w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center">Entity</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="entityTable" class="w3-table-all w3-small">
                        <template v-for="(entity, index) in entities">
                        <tr :id="entity.busentityuid" :key="entity.busentityuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnEntity(entity.busentityuid, index)">
                            <td class="w3-center">
                                <span>{{ entity.busentityname }}</span>
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
                            <th class="w3-center">Category</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="categoryTable" class="w3-table-all w3-small">
                        <template v-for="(category, index) in categories">
                        <tr :id="category.categoryuid" :key="category.categoryuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnCategory(category.categoryuid, index)">
                            <td class="w3-center">
                                <span>{{ category.categoryname }}</span>
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
                            <th class="w3-center">Flow</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="jobOrFlowTable" class="w3-table-all w3-small">
                        <template v-for="(jobOrFlow, index) in jobsOrFlows">
                        <tr v-if="!flowUids.includes(jobOrFlow.jobflowuid)" :id="jobOrFlow.jobflowuid" :key="jobOrFlow.jobflowuid" class="w3-hover-blue-grey w3-hover-opacity" @click="clickOnJobOrFlow(jobOrFlow.jobflowuid, index)">
                            <td class="w3-center">
                                <span>{{ jobOrFlow.flowname }}</span>
                            </td>
                        </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div slot="footer">
        <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
  </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FormButton from '../../FormButton.vue'

export default {
    data() {
        return {
            selectedFreqCategoryRecord: new Object(),
            selectedFreqRecord: new Object(),
            selectedEntityRecord: new Object(), //store which is selected entity
            selectedCategoryRecord: new Object(), //store which is selected job category
            selectedJobOrFlowRecord: new Object(), //store which is selected job            
            freqCategories: [],
            freqs: [],
            entities: [],
            categories: [],
            jobsOrFlows: [],
            applyType: this.tabsFlag
        }
    },
    watch: {
        applyType: function(newValue) {
            this.applyType = newValue
            if(this.applyType[1]){   //apply freq
                this.getFreqCategories()
                this.getFreq()
            }else if(this.applyType[2] || this.applyType[3]){ //apply job or flow
                this.getEntities()
            }
        }
    },
    props: {
        tabsFlag: {
            type: Array,
            default: () => []
        },
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        excludefrequencyuid: '',
        frequencyUids: {
            type: Array,
            default: () => []
        },
        jobUids: {
            type: Array,
            default: () => []
        },
        flowUids: {
            type: Array,
            default: () => []
        },
    },
    methods: {
        cancel(){
            this.reset()
            this.$emit('closeApply')
        },
        clickOnFreqCategory(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'freqCategoryTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedFreqCategoryRecord = this.freqCategories[index]
            }else{
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
                this.selectedFreqCategoryRecord = new Object()
            }
            this.selectedFreqRecord = new Object()  //不論選取或不選取Frequency Category,frequency都必須重選
            this.getFreq()   //refresh Frequency content 
        },
        clickOnFreq(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'freqTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedFreqRecord = this.freqs[index]
            }
            
        },
        clickOnEntity(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'entityTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedEntityRecord = this.entities[index]
                this.selectedCategoryRecord = new Object()  //撰擇了Entity之後,category必須重選
                this.selectedJobOrFlowRecord = new Object()   //撰擇了Entity之後,job也必須重選
                this.getCategories()   //refresh Job Category content
                this.getJobsOrFlows()   //refresh Job content
            }
            
        },
        clickOnCategory(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'categoryTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedCategoryRecord = this.categories[index]
                this.selectedJobOrFlowRecord = new Object()   //撰擇了category之後,job必須重選
                this.getJobsOrFlows()   //refresh Job content
            }
            
        },
        clickOnJobOrFlow(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedRecord(tr, 'jobOrFlowTable')
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedJobOrFlowRecord = this.jobsOrFlows[index]
            }
            
        },
        getFreqCategories(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"freqcategoryname"
                }
            }

            HTTPRepo.post(`frequency-category/findByFilter`, params)
            .then(response => {
                this.freqCategories = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        getFreq(){
            let urlPath = 'frequency/findByFilter?categoryUid='
            if(this.selectedFreqCategoryRecord && this.selectedFreqCategoryRecord.freqcategoryuid && this.selectedFreqCategoryRecord.freqcategoryuid !== '')
                urlPath += this.selectedFreqCategoryRecord.freqcategoryuid

            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"frequencyname"
                }
            }

            HTTPRepo.post(urlPath, params)
            .then(response => {
                this.freqs = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        getEntities(){
            //Fetch all business entities objs is above
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"busentityname"
                }
            }

            HTTPRepo.post(`busentity/findByFilter`, params)
            .then(response => {
                this.entities = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        getCategories(){
            if(!this.selectedEntityRecord || !this.selectedEntityRecord.busentityuid || this.selectedEntityRecord.busentityuid === ''){
                //在沒選擇entity的情況下,則category和job一定要讓它們為空的
                this.categories = []
                this.jobsOrFlows = []
                this.selectedCategoryRecord = new Object()
                this.selectedJobOrFlowRecord = new Object()
                return
            }
            
            let urlPath = 'job-category/findByFilter?entityUid=' + this.selectedEntityRecord.busentityuid
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"categoryname"
                }
            }

            HTTPRepo.post(urlPath, params)
            .then(response => {
                this.categories = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        getJobsOrFlows(){
            if(!this.selectedCategoryRecord || !this.selectedCategoryRecord.categoryuid || this.selectedCategoryRecord.categoryuid === ''){
                //在沒選擇category的情況下,則job一定要讓它為空的
                this.jobsOrFlows = []
                this.selectedJobOrFlowRecord = new Object()
                return
            }
            
            let urlPath = 'job/findByFilter?categoryUid=' + this.selectedCategoryRecord.categoryuid
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"jobname"
                }
            }

            if(this.applyType[3]){
                urlPath = 'jobflow/findByFilter?categoryUid=' + this.selectedCategoryRecord.categoryuid
                params = {
                    "ordering":{
                        "orderType":"ASC",
                        "orderField":"flowname"
                    }
                }
            }

            HTTPRepo.post(urlPath, params)
            .then(response => {
                this.jobsOrFlows = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        },
        clearSelectedRecord(tr, whichTable){
            let table = document.getElementById(whichTable)
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        reset(){
            if(this.applyType[1]){   //apply freq
                //清掉freq category相關
                this.selectedFreqCategoryRecord = new Object()  //取消對frequency category的選取(Data)
                this.clearSelectedRecord(null, 'freqCategoryTable') //取消對frequency category的選取(UI)
                
                this.getFreq()  //需要把freqs恢復成預設, 即不在任何frequency category的frequency
                this.selectedFreqRecord = new Object()  //取消對frequency的選取
            }else if(this.applyType[2] || this.applyType[3]){ //apply job or flow
                //清掉entity相關
                this.selectedEntityRecord = new Object()
                this.clearSelectedRecord(null, 'entityTable')
                //清掉category相關
                this.categories = []
                this.selectedCategoryRecord = new Object()
                //清掉job相關
                this.jobsOrFlows = []
                this.selectedJobOrFlowRecord = new Object()
            }
        },
        save(){
            if(this.applyType[1]){  //for freq exclude
                if(this.selectedFreqRecord && this.selectedFreqRecord.frequencyuid && 
                        this.selectedFreqRecord.frequencyuid !== '' && this.excludefrequencyuid !== ''){     
                    HTTPRepo.post('freq-exclude/addOne', {
                        "frequencyuid": this.selectedFreqRecord.frequencyuid,
                        "excludefrequencyuid": this.excludefrequencyuid
                    })
                    .then(response => {
                        this.$emit('applyFrequency')
                        this.cancel()
                    })
                    .catch(error => {
                        if (error.response && error.response.data) {
                            let newStatus = {
                                "msg": error.response.data,
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        } else {
                            let newStatus = {
                                "msg": error.message,
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    })
                }else{
                    let newStatus = {
                        "msg": "Please choose Any One Frequency!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            }else if(this.applyType[2]){  //for job exclude
                if(this.selectedJobOrFlowRecord && this.selectedJobOrFlowRecord.jobuid && 
                        this.selectedJobOrFlowRecord.jobuid !== '' && this.excludefrequencyuid !== ''){     
                    HTTPRepo.post('job-exclude/addOne', {
                        "jobuid": this.selectedJobOrFlowRecord.jobuid,
                        "excludefrequencyuid": this.excludefrequencyuid
                    })
                    .then(response => {
                        this.$emit('applyJob')
                        this.cancel()
                    })
                    .catch(error => {
                        if (error.response && error.response.data) {
                            let newStatus = {
                                "msg": error.response.data,
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        } else {
                            let newStatus = {
                                "msg": error.message,
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    })
                }else{
                    let newStatus = {
                        "msg": "Please choose Any One Job!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            }else if(this.applyType[3]){  //for jobflow exclude
                if(this.selectedJobOrFlowRecord && this.selectedJobOrFlowRecord.jobflowuid && 
                        this.selectedJobOrFlowRecord.jobflowuid !== '' && this.excludefrequencyuid !== ''){     
                    HTTPRepo.post('jobflow-exclude/addOne', {
                        "jobflowuid": this.selectedJobOrFlowRecord.jobflowuid,
                        "excludefrequencyuid": this.excludefrequencyuid
                    })
                    .then(response => {
                        this.$emit('applyFlow')
                        this.cancel()
                    })
                    .catch(error => {
                        if (error.response && error.response.data) {
                            let newStatus = {
                                "msg": error.response.data,
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        } else {
                            let newStatus = {
                                "msg": error.message,
                                "status": "Error"
                            }
                            this.$store.dispatch('setSystemStatus', newStatus)
                        }
                    })
                }else{
                    let newStatus = {
                        "msg": "Please choose Any One Flow!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            }       
        }
    },
    components: {
        'modal-window': ModalWindow,
        'form-button': FormButton
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