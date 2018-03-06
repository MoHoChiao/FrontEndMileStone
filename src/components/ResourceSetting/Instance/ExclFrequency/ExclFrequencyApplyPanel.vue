<template>
    <div>
        <apply-selection-window :windowAlive="applyWindowAlive" 
            window-title="Frequency Exclude Apply" 
            :tabsFlag="tabsFlag" 
            :frequencyUids="frequencyUids" 
            :jobUids="jobUids" 
            :flowUids="flowUids" 
            :excludefrequencyuid="excludefrequencyuid"  
            @closeApply="changeApplyWindowStatus" 
            @applyFrequency="getFreqExclude" 
            @applyJob="getJobExclude" 
            @applyFlow="getFlowExclude"
        ></apply-selection-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive" 
            :deleteName="deleteName" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteWindowStatus" 
            @confirmDelete="deleteApply" 
        ></confirm-delete-window>
        <div class="w3-small">
            <div v-if="excludefrequencyuid.trim().toUpperCase() !== 'GLOBAL'" class="w3-row">
                <a href="javascript:void(0)" @click="openTab(0)">
                    <div :class="tabsClass[0]">Time List</div>
                </a>
                <a href="javascript:void(0)" @click="openTab(1)">
                    <div :class="tabsClass[1]">Applay Freq</div>
                </a>
                <a href="javascript:void(0)" @click="openTab(2)">
                    <div :class="tabsClass[2]">Applay Job</div>
                </a>
                <a href="javascript:void(0)" @click="openTab(3)">
                    <div :class="tabsClass[3]">Applay Flow</div>
                </a>
            </div>
            <br>
            <div v-show="tabsFlag[0]">
                <div class="w3-row">
                    <div class="w3-col m12">
                        <input id="SearchTimeInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                            placeholder="Search For Exclude Frequency List..." @keyup="searchForList('Time')">
                    </div>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                    <table id="TimeListTable" class="w3-table-all">
                        <tr :key="list_index+'TimeListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in applyTimes">
                            <td class="w3-center" width="100%">
                                {{ compositionTime(list_info) }}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-show="tabsFlag[1]">
                <div class="w3-row">
                    <div class="w3-col m10">
                        <input id="SearchFreqInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                            placeholder="Search For Apply Frequency List..." @keyup="searchForList('Freq')">
                    </div>
                    <div class="w3-col m2 w3-border w3-border-camo-black w3-grey w3-center">
                        <i class="fa fa-plus-square w3-button w3-hover-none" title="Apply Frequency" aria-hidden="true" @click="changeApplyWindowStatus"></i>
                    </div>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                    <table id="FreqListTable" class="w3-table-all">
                        <tr :key="list_index+'FreqListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in applyFrequencies">
                            <td class="w3-center" width="84%">
                                {{ compositionName(list_info) }}
                            </td>
                            <td class="w3-center" width="16%" style="padding-top:0px;padding-bottom:0px">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                    aria-hidden="true" @click="changeDeleteWindowStatus(list_index, list_info)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-show="tabsFlag[2]">
                <div class="w3-row">
                    <div class="w3-col m10">
                        <input id="SearchJobInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                            placeholder="Search For Apply Job..." @keyup="searchForList('Job')">
                    </div>
                    <div class="w3-col m2 w3-border w3-border-camo-black w3-grey w3-center">
                        <i class="fa fa-plus-square w3-button w3-hover-none" title="Apply Frequency" aria-hidden="true" @click="changeApplyWindowStatus"></i>
                    </div>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                    <table id="JobListTable" class="w3-table-all">
                        <tr :key="list_index+'JobListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in applyJobs">
                            <td class="w3-center" width="84%">
                                {{ compositionName(list_info) }}
                            </td>
                            <td class="w3-center" width="16%" style="padding-top:0px;padding-bottom:0px">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                    aria-hidden="true" @click="changeDeleteWindowStatus(list_index, list_info)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-show="tabsFlag[3]">
                <div class="w3-row">
                    <div class="w3-col m10">
                        <input id="SearchFlowInput" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                            placeholder="Search For Apply Flow..." @keyup="searchForList('Flow')">
                    </div>
                    <div class="w3-col m2 w3-border w3-border-camo-black w3-grey w3-center">
                        <i class="fa fa-plus-square w3-button w3-hover-none" title="Apply Frequency" aria-hidden="true" @click="changeApplyWindowStatus"></i>
                    </div>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                    <table id="FlowListTable" class="w3-table-all">
                        <tr :key="list_index+'FlowListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in applyFlows">
                            <td class="w3-center" width="84%">
                                {{ compositionName(list_info) }}
                            </td>
                            <td class="w3-center" width="16%" style="padding-top:0px;padding-bottom:0px">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                    aria-hidden="true" @click="changeDeleteWindowStatus(list_index, list_info)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ApplySelectionWindow from './ApplySelectionWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false, false, false],
            applyFrequencies: [],
            frequencyUids: [],
            applyJobs: [],
            jobUids: [],
            applyFlows: [],
            flowUids: [],
            whichTab: 0,
            applyWindowAlive: false,
            deleteWindowAlive: false,  //for delete windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: ''     //store which obj name will be delete
        }
    },
    props:{
        applyTimes:{
            type: Array
        },
        excludefrequencyuid: ''
    },
    watch: {
        /*
         * 這是為了在父元件中只要按下reload相關的功能時, applyTimes會改變, 利用這個改變來使用watch
         * 使得每次按下reload相關的功能時, 都能讓tab回到第一個
        */
        applyTimes: function(newValue) {
            this.openTab(0)
        }
    },
    methods: {
        openTab(numOfTab) {
            if(this.whichTab === numOfTab)
                return

            this.whichTab = numOfTab

            for (let i = 0; i < this.tabsFlag.length; i++) {
                this.$set(this.tabsFlag, i, false)
            }
            this.$set(this.tabsFlag, this.whichTab, true)

            for (let i = 0; i < this.tabsClass.length; i++) {
                this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
            }
            this.$set(this.tabsClass, this.whichTab, this.tabsClass[this.whichTab] + " w3-border-theme")

            if(this.tabsFlag[1]){
                this.getFreqExclude()
            }else if(this.tabsFlag[2]){
                this.getJobExclude()
            }else if(this.tabsFlag[3]){
                this.getFlowExclude()
            }
        },
        searchForList(which) {
            let input, filter, table, i
            input = document.getElementById('Search'+which+'Input')
            filter = input.value.toUpperCase()
            table = document.getElementById(which+'ListTable')
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[0].innerHTML
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
        },
        getFreqExclude(){
            if(this.excludefrequencyuid && this.excludefrequencyuid !== ''){
                HTTPRepo.get(`freq-exclude/findFullPathByExcludeFrequencyUid`, {params:{uid: this.excludefrequencyuid}})
                .then(response => {
                    this.applyFrequencies = response.data
                    this.frequencyUids = []
                    for(let i=0; i<this.applyFrequencies.length; i++){
                        this.frequencyUids.push(this.applyFrequencies[i].frequencyuid)
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        let msg = error.response.data

                        if(error.response.data.message){
                            msg = error.response.data.error
                            msg += ". " + error.response.data.message
                            if(error.response.data.exception)
                                msg = error.response.data.exception + ' [' + msg +']'
                        }

                        let newStatus = {
                            "msg": msg,
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
            }
            
        },
        getJobExclude(){
            if(this.excludefrequencyuid && this.excludefrequencyuid !== ''){
                HTTPRepo.get(`job-exclude/findFullPathByExcludeFrequencyUid`, {params:{uid: this.excludefrequencyuid}})
                .then(response => {
                    this.applyJobs = response.data
                    this.jobUids = []
                    for(let i=0; i<this.applyJobs.length; i++){
                        this.jobUids.push(this.applyJobs[i].jobuid)
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        let msg = error.response.data

                        if(error.response.data.message){
                            msg = error.response.data.error
                            msg += ". " + error.response.data.message
                            if(error.response.data.exception)
                                msg = error.response.data.exception + ' [' + msg +']'
                        }

                        let newStatus = {
                            "msg": msg,
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
            }
            
        },
        getFlowExclude(){
            if(this.excludefrequencyuid && this.excludefrequencyuid !== ''){
                HTTPRepo.get(`jobflow-exclude/findFullPathByExcludeFrequencyUid`, {params:{uid: this.excludefrequencyuid}})
                .then(response => {
                    this.applyFlows = response.data
                    this.flowUids = []
                    for(let i=0; i<this.applyFlows.length; i++){
                        this.flowUids.push(this.applyFlows[i].jobflowuid)
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        let msg = error.response.data

                        if(error.response.data.message){
                            msg = error.response.data.error
                            msg += ". " + error.response.data.message
                            if(error.response.data.exception)
                                msg = error.response.data.exception + ' [' + msg +']'
                        }

                        let newStatus = {
                            "msg": msg,
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
            }
            
        },
        changeApplyWindowStatus(){
            this.applyWindowAlive = !this.applyWindowAlive
        },
        changeDeleteWindowStatus(index, list_info){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            if(list_info){
                this.deleteIndex = index
                if(this.tabsFlag[1]){
                    this.deleteUid = list_info.frequencyuid
                    this.deleteName = 'Apply Frequency - ' + this.compositionName(list_info)
                }else if(this.tabsFlag[2]){
                    this.deleteUid = list_info.jobuid
                    this.deleteName = 'Apply Job - ' + this.compositionName(list_info)
                }else if(this.tabsFlag[3]){
                    this.deleteUid = list_info.jobflowuid
                    this.deleteName = 'Apply Flow - ' + this.compositionName(list_info)
                }
            }else{
                this.deleteIndex = -1
                this.deleteUid = ''
                this.deleteName = ''
            }
            
        },
        deleteApply(){
            if(this.deleteIndex === -1)
                return
            if(!this.deleteUid || this.deleteUid === '')
                return
                
            let urlPath = ''
            if(this.tabsFlag[1]){
                urlPath = 'freq-exclude/deleteByFrequencyUid?uid='+this.deleteUid
            }else if(this.tabsFlag[2]){
                urlPath = 'job-exclude/deleteByJobUid?uid='+this.deleteUid
            }else if(this.tabsFlag[3]){
                urlPath = 'jobflow-exclude/deleteByFlowUid?uid='+this.deleteUid
            }
            
            HTTPRepo.get(urlPath)
            .then(response => {
                if(this.tabsFlag[1]){
                    this.applyFrequencies.splice(this.deleteIndex, 1)
                    this.frequencyUids.splice(this.deleteIndex, 1)
                }else if(this.tabsFlag[2]){
                    this.applyJobs.splice(this.deleteIndex, 1)
                    this.jobUids.splice(this.deleteIndex, 1)
                }else if(this.tabsFlag[3]){
                    this.applyFlows.splice(this.deleteIndex, 1)
                    this.flowUids.splice(this.deleteIndex, 1)
                }
                
                this.changeDeleteWindowStatus()
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
        compositionName(list_info){
            if(this.tabsFlag[1]){
                if(list_info.freqcategoryname !== null && list_info.freqcategoryname){
                    return list_info.freqcategoryname + '.' + list_info.frequencyname
                }else{
                    return list_info.frequencyname
                }
            }else if(this.tabsFlag[2]){
                return list_info.busentityname + '.' + list_info.categoryname + '.' + list_info.jobname
            }else if(this.tabsFlag[3]){
                return list_info.busentityname + '.' + list_info.categoryname + '.' + list_info.flowname
            }
        },
        compositionTime(list_info){
            let starttime = list_info.starttime + ''
            let endtime = list_info.endtime + ''
            if(starttime.length === 12){
                starttime = starttime.slice(0, 4) + "-" + starttime.slice(4, 6) + "-" + starttime.slice(6, 8) + " " 
                    + starttime.slice(8, 10) + ":" + starttime.slice(10, 12)
            }
            if(endtime.length === 12){
                endtime = endtime.slice(0, 4) + "-" + endtime.slice(4, 6) + "-" + endtime.slice(6, 8) + " " 
                    + endtime.slice(8, 10) + ":" + endtime.slice(10, 12)
            }
            return starttime + ' ~ ' + endtime
        }
    },
    components: {
        'apply-selection-window': ApplySelectionWindow,
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

