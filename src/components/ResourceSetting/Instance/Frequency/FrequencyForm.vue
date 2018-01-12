<template>
    <div class="w3-container w3-small" style="overflow:auto;max-height:485px">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div :class="[(urlOp === 'add' || urlOp === 'edit') ? 'w3-col m9' : 'w3-col m4']">
                <input :class="inputClassList.frequencyname" v-model="new_content.frequencyname" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
            <div v-if="urlOp !== 'add' && urlOp !== 'edit'">
                <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                    <label class="w3-right"><span class="w3-text-red">*</span>Category</label>
                </div>
                <div class="w3-col m3">
                    <select :class="inputClassList.freqcategoryuid" v-model="freqcategoryuid" style="padding:0px">
                        <option value="" selected>/</option>
                        <template v-for="category in allCategoryObjs">
                            <option :value="category.freqcategoryuid">{{ category.freqcategoryname }}</option>
                        </template>
                    </select>
                </div>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Date Type</label>
            </div>
            <div :class="[(urlOp === 'add' || urlOp === 'edit') ? 'w3-col m6' : 'w3-col m4']">
                <select :class="inputClassList.datetype" v-model="datetype" @click="clickDateType" style="padding:0px">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Calendar">Calendar</option>
                    <option value="WorkingCalendar">Working Calendar</option>
                    <option value="Manually">Manually</option>
                </select>
            </div>
            <div :class="[(urlOp === 'add' || urlOp === 'edit') ? 'w3-col m3 w3-right' : 'w3-col m5 w3-right']">
                <input class="w3-check" v-model="new_content.activate" style="width:40px;" type="checkbox">
                <label>Activate</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.description" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <hr class="w3-border-black">
        <div v-show="dateTypeFlag['Daily']" class="w3-row"></div>
        <div v-show="dateTypeFlag['Weekly']">
            <div class="w3-row-padding w3-section">
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Monday" value="1" v-model="checkedWeekday">
                    <label for="Monday">Monday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Tuesday" value="2" v-model="checkedWeekday">
                    <label for="Tuesday">Tuesday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Wednesday" value="3" v-model="checkedWeekday">
                    <label for="Wednesday">Wednesday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Thursday" value="4" v-model="checkedWeekday">
                    <label for="Thursday">Thursday</label>
                </div>
            </div>
            <div class="w3-row-padding w3-section">
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Friday" value="5" v-model="checkedWeekday">
                    <label for="Friday">Friday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Saturday" value="6" v-model="checkedWeekday">
                    <label for="Saturday">Saturday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Sunday" value="0" v-model="checkedWeekday">
                    <label for="Sunday">Sunday</label>
                </div>
            </div>
            <span>Checked Weekday: {{ checkedWeekday }}</span>
        </div>
        <div v-show="dateTypeFlag['Monthly']">
            
        </div>
        <div v-show="dateTypeFlag['Calendar']">
            
        </div>
        <div v-show="dateTypeFlag['WorkingCalendar']">

        </div>
        <div v-show="dateTypeFlag['Pattern']">
            
        </div>
        <div v-show="dateTypeFlag['Manually']">
            
        </div>
        <div v-if="datetype != 'Manually'" class="w3-row">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Time Type</label>
            </div>
            <div class="w3-col m4">
                <select :class="inputClassList.timetype" v-model="timetype" @click="clickTimeType" style="padding:0px">
                    <option value="EveryHour">Every Hour</option>
                    <option value="SelectedTime">Selected Time</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'

export default {
    data() {
        return {
            dateTypeFlag: { Daily:true, Weekly:false, Monthly:false, Calendar:false, WorkingCalendar:false, Pattern:false, Manually:false },
            timeTypeFlag: { EveryHour:true, SelectedTime:false },
            inputClassList: {
                frequencyname: ['w3-input','w3-border'],
                description: ['w3-input','w3-border'],
                datetype: ['w3-select','w3-border','w3-round'],
                timetype: ['w3-select','w3-border','w3-round'],
                freqcategoryuid: ['w3-select','w3-border','w3-round']
            },
            freqcategoryuid: '',  //store categoryuid for copy/move operation
            datetype: 'Daily',
            timetype: 'EveryHour',
            allCategoryObjs: new Object(), //store all remote data.(Frequency Categories) for copy/move operation
            allFrequencyLists: new Object(),    //store all remote data.(Frequency Lists)
            checkedWeekday: [],
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                frequencyuid: this.content.frequencyuid,
                frequencyname: this.content.frequencyname,
                description: this.content.description,
                activate: Number(this.content.activate),
                manuallyedit: this.content.manuallyedit,
                bywcalendar: this.content.bywcalendar,
                wcalendaruid: this.content.wcalendaruid
            }
        }
    },
    created() {
        this.getFrequencyList()

        if(this.urlOp === 'copy' || this.urlOp === 'move'){
            this.getCategories()    //取得所有可供選擇的frequency categories

            if(this.urlOp === 'copy'){
                //copy動作, 把name和description設空值
                this.new_content.frequencyname = ''
                this.new_content.description = ''
            }
        }

        if(this.urlOp !== 'add'){    //如果不是add, 表示datetype必定有值,要把dateTypeFlag中對應的datetype值改為true
            this.clickDateType()
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    frequencyuid: '',
                    frequencyname: '',
                    description: '',
                    activate: '0',
                    manuallyedit: '0',
                    bywcalendar: '0',
                    wcalendaruid: ''
                }
            }
        },
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        clickDateType() {
            this.dateTypeFlag = new Array()
            this.dateTypeFlag[this.datetype] = true
        },
        clickTimeType() {
            this.timeTypeFlag = new Array()
            this.timeTypeFlag[this.timetype] = true
        },
        save(){
            this.clearInValid()
            
            //check form value
            if(this.new_content.connectionname === undefined || this.new_content.connectionname.trim().length <= 0){
                this.inputClassList.connectionname.splice(2, 1, 'w3-red')
                return
            }
            
            if(this.new_content.userid === undefined || this.new_content.userid.trim().length <= 0){
                this.inputClassList.userid.splice(2, 1, 'w3-red')
                return
            }

            if(this.new_content.password === undefined || this.new_content.password.trim().length <= 0){
                this.inputClassList.password.splice(2, 1, 'w3-red')
                return
            }

            if(this.new_content.withpim){
                if(this.new_content.pimendpointtype === undefined || this.new_content.pimendpointtype.trim().length <= 0){
                    this.inputClassList.pimendpointtype.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.pimendpointname === undefined || this.new_content.pimendpointname.trim().length <= 0){
                    this.inputClassList.pimendpointname.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.pimaccountcontainer === undefined || this.new_content.pimaccountcontainer.trim().length <= 0){
                    this.inputClassList.pimaccountcontainer.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.pimaccountname === undefined || this.new_content.pimaccountname.trim().length <= 0){
                    this.inputClassList.pimaccountname.splice(2, 1, 'w3-red')
                    return
                }
            }

            if(this.new_content.connectiontype === 'D'){
                if(this.new_content.server === undefined || this.new_content.server.trim().length <= 0){
                    this.inputClassList.server.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'F'){
                if(this.new_content.server === undefined || this.new_content.server.trim().length <= 0){
                    this.inputClassList.server.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'J'){
                if(this.new_content.jdbc_driver === undefined || this.new_content.jdbc_driver.trim().length <= 0){
                    this.inputClassList.jdbc_driver.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.jdbc_url === undefined || this.new_content.jdbc_url.trim().length <= 0){
                    this.inputClassList.jdbc_url.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'M'){
        
            }else if(this.new_content.connectiontype === 'O'){

            }else if(this.new_content.connectiontype === 'S'){
                if(this.new_content.sapSystemName === undefined || this.new_content.sapSystemName.trim().length <= 0){
                    this.inputClassList.sapSystemName.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.sapHostIP === undefined || this.new_content.sapHostIP.trim().length <= 0){
                    this.inputClassList.sapHostIP.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.sapClient === undefined || this.new_content.sapClient.trim().length <= 0){
                    this.inputClassList.sapClient.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.sapSystemNumber === undefined || this.new_content.sapSystemNumber.trim().length <= 0){
                    this.inputClassList.sapSystemNumber.splice(2, 1, 'w3-red')
                    return
                }
            }else if(this.new_content.connectiontype === 'N'){
                if(this.new_content.notesHostIP === undefined || this.new_content.notesHostIP.trim().length <= 0){
                    this.inputClassList.notesHostIP.splice(2, 1, 'w3-red')
                    return
                }else if(this.new_content.notesDBName === undefined || this.new_content.notesDBName.trim().length <= 0){
                    this.inputClassList.notesDBName.splice(2, 1, 'w3-red')
                    return
                }
            }

            //collect basic necessary value
            let returnValue = {
                "connectionuid":this.new_content.connectionuid,
                "connectionname":this.new_content.connectionname,
                "connectiontype":this.new_content.connectiontype,
                "description":this.new_content.description,
                "withpim":Number(this.new_content.withpim),
                "pimendpointtype":this.new_content.pimendpointtype,
                "pimendpointname":this.new_content.pimendpointname,
                "pimaccountcontainer":this.new_content.pimaccountcontainer,
                "pimaccountname":this.new_content.pimaccountname,
            }
            
            //conncategoryuid這個值只為了如果是move/copy的情況下, 需要把值傳回去前個元件, 才能知道目前選擇的是那一個category
            if(this.conncategoryuid && this.conncategoryuid.trim().length > 0)
                returnValue.conncategoryuid = this.conncategoryuid

            //collect form value(to be continue)
            if(this.new_content.connectiontype === 'D'){
                returnValue.server = this.new_content.server
                returnValue.password = this.new_content.password
                returnValue.userid = this.new_content.userid
            }else if(this.new_content.connectiontype === 'F'){
                returnValue.server = this.new_content.server
                returnValue.password = this.new_content.password
                returnValue.userid = this.new_content.userid
                returnValue.targetdir = this.new_content.targetdir
            }else if(this.new_content.connectiontype === 'J'){
                returnValue.jdbc_dbType = this.new_content.jdbc_dbType
                returnValue.jdbc_password = this.new_content.password
                returnValue.jdbc_driver = this.new_content.jdbc_driver
                returnValue.jdbc_url = this.new_content.jdbc_url
                returnValue.jdbc_userid = this.new_content.userid
            }else if(this.new_content.connectiontype === 'M'){
                returnValue.mailssl = Number(this.new_content.mailssl)
                returnValue.password = this.new_content.password
                returnValue.mailtls = Number(this.new_content.mailtls)
                returnValue.port = this.new_content.port
                returnValue.host = this.new_content.host
                returnValue.user = this.new_content.userid
            }else if(this.new_content.connectiontype === 'O'){
                returnValue.password = this.new_content.password
                returnValue.port = this.new_content.port
                returnValue.userid = this.new_content.userid
            }else if(this.new_content.connectiontype === 'S'){
                returnValue.sapCodePage = this.new_content.sapCodePage
                returnValue.sapSystemNumber = this.new_content.sapSystemNumber
                returnValue.sapSystemName = this.new_content.sapSystemName
                returnValue.sapHostIP = this.new_content.sapHostIP
                returnValue.sapClient = this.new_content.sapClient
                returnValue.userid = this.new_content.userid
                returnValue.password = this.new_content.password
                returnValue.saplanguage = this.new_content.saplanguage
            }else if(this.new_content.connectiontype === 'N'){
                returnValue.notesIor = this.new_content.notesIor
                returnValue.notesHostIP = this.new_content.notesHostIP
                returnValue.notesServerName = this.new_content.notesServerName
                returnValue.password = this.new_content.password
                returnValue.notesDBName = this.new_content.notesDBName
                returnValue.userid = this.new_content.userid
            }

            return returnValue
        },
        reset(){
            //clear red font
            this.clearInValid()

            //reset value to initial
            if(this.urlOp === 'copy'){  //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
                this.new_content.frequencyname = ''
                this.new_content.description = ''
            }else{
                this.new_content.frequencyname = this.content.frequencyname
                this.new_content.description = this.content.description
            }

            this.new_content.frequencyuid = this.content.frequencyuid
            this.new_content.activate = this.content.activate,
            this.new_content.manuallyedit = this.content.manuallyedit,
            this.new_content.bywcalendar = this.content.bywcalendar,
            this.new_content.wcalendaruid = this.content.wcalendaruid

            //當connectiontype值變了之後, 尚需要改變UI的功能選項
            this.clickDateType()
        },
        clearInValid(){
            this.inputClassList.frequencyname.splice(2, 1)
        },
        getCategories(){    //Get all connection category
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"freqcategoryuid"
                }
            }

            HTTPRepo.post(`frequency-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data
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
        getFrequencyList(){    //Get frequency list by freqUid
            if(this.new_content.manuallyedit === "0" || this.new_content.manuallyedit === "2"){
                this.getDistinctDateFrequencyList()
            }else if(this.new_content.manuallyedit === "1"){
                this.getAllFrequencyList()
            }
        },
        getDistinctDateFrequencyList(){
            HTTPRepo.get(`frequency-list/findDistinctDateByFrequencyUid`, {params:{uid: this.new_content.frequencyuid}})
            .then(response => {
                // console.log(response.data)
                this.allFrequencyLists = response.data
                if(!this.allFrequencyLists[0])  //if empth array
                    return
                    
                if(this.allFrequencyLists[0].yearnum != -1 && this.allFrequencyLists[0].monthnum != -1 && this.allFrequencyLists[0].daynum != -1 && 
                        this.allFrequencyLists[0].weekdaynum === -1 && this.new_content.manuallyedit !== "2"){ //by calendar
                    this.datetype = "Calendar"
                }else if(this.allFrequencyLists[0].yearnum === -1 && this.allFrequencyLists[0].monthnum === -1 && 
                        this.allFrequencyLists[0].daynum != -1 && this.allFrequencyLists[0].weekdaynum === -1){   //by month
                    this.datetype = "Monthly"
                }else if(this.allFrequencyLists[0].yearnum === -1 && this.allFrequencyLists[0].monthnum === -1 && 
                        this.allFrequencyLists[0].daynum === -1 && this.allFrequencyLists[0].weekdaynum != -1){   //by week
                    this.datetype = "Weekly"
                }else if(this.allFrequencyLists[0].yearnum === -1 && this.allFrequencyLists[0].monthnum === -1 && 
                        this.allFrequencyLists[0].daynum === -1 && this.allFrequencyLists[0].weekdaynum === -1){   //by day
                    this.datetype = "Daily"
                }else if(this.allFrequencyLists[0].yearnum === -2 && this.allFrequencyLists[0].monthnum === -2 && 
                        this.allFrequencyLists[0].daynum === -2 && this.allFrequencyLists[0].weekdaynum === -2){   //by working calendar
                    this.datetype = "WorkingCalendar"
                }else if(this.new_content.bywcalendar === "2"){
                    this.datetype = "Pattern"
                }
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
        getAllFrequencyList(){
            HTTPRepo.get(`frequency-list/findByFrequencyUid`, {params:{uid: this.new_content.frequencyuid}})
            .then(response => {
                this.allFrequencyLists = response.data
                this.datetype = "Manually"
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
        }
    }
}
</script>
<style scoped>
    input, select {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>
