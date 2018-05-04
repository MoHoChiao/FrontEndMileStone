<template>
  <div>
    <calendar-pattern-window :windowAlive="patternWindowAlive" 
                    window-title="Generate Date By Pattern" 
                    @closeAdd="changePatternWindowStatus" 
                    @generate="generateByPattern"
    ></calendar-pattern-window>
    <div class="w3-container w3-small" style="overflow:auto;max-height:480px">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div :class="[(urlOp === 'add' || urlOp === 'edit') ? 'w3-col m9' : 'w3-col m4']">
                <input :class="inputClassList.frequencyname" v-model="new_content.frequencyname" type="text" 
                    maxlength="32" placeholder="Please Input Name" style="text-transform:uppercase">
            </div>
            <div v-if="urlOp !== 'add' && urlOp !== 'edit'">
                <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                    <label class="w3-right"><span class="w3-text-red">*</span>Category</label>
                </div>
                <div class="w3-col m3">
                    <select :class="inputClassList.freqcategoryuid" v-model="freqcategoryuid" style="padding:0px">
                        <option value="" selected>/</option>
                        <template v-for="category in allCategoryLists">
                            <option :value="category.freqcategoryuid">{{ category.freqcategoryname }}</option>
                        </template>
                    </select>
                </div>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Date Type</label>
            </div>
            <div :class="[(urlOp === 'add' || urlOp === 'edit') ? 'w3-col m6' : 'w3-col m4']">
                <select :class="inputClassList.datetype" v-model="datetype" style="padding:0px">
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
        <div class="w3-row-padding">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.description" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div v-show="datetype === 'Daily'" class="w3-row-padding"></div>
        <div v-show="datetype === 'Weekly'">
            <hr class="w3-border-black">
            <div class="w3-row-padding">
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Monday" :value="Number('1')" v-model="checkedWeekday">
                    <label for="Monday">Monday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Tuesday" :value="Number('2')" v-model="checkedWeekday">
                    <label for="Tuesday">Tuesday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Wednesday" :value="Number('3')" v-model="checkedWeekday">
                    <label for="Wednesday">Wednesday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Thursday" :value="Number('4')" v-model="checkedWeekday">
                    <label for="Thursday">Thursday</label>
                </div>
            </div>
            <div class="w3-row-padding">
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Friday" :value="Number('5')" v-model="checkedWeekday">
                    <label for="Friday">Friday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Saturday" :value="Number('6')" v-model="checkedWeekday">
                    <label for="Saturday">Saturday</label>
                </div>
                <div class="w3-col m3">
                    <input class="w3-check" type="checkbox" id="Sunday" :value="Number('0')" v-model="checkedWeekday">
                    <label for="Sunday">Sunday</label>
                </div>
            </div>
        </div>
        <div v-show="datetype === 'Monthly'">
            <hr class="w3-border-black">
            <div class="w3-row-padding">
                <div class="w3-col m1" v-for="n in 31">
                    <input class="w3-check" type="checkbox" :id="n" :value="n" v-model="checkedDay">
                    <label for="Monday">{{ n }}</label>
                </div>
                <div class="w3-col m5">
                    <input class="w3-check" type="checkbox" id="0" :value="Number('0')" v-model="checkedDay">
                    <label for="Monday">The end of the month</label>
                </div>
            </div>
        </div>
        <div v-show="datetype === 'WorkingCalendar'">
            <hr class="w3-border-black">
            <div class="w3-row-padding">
                <div class="w3-col m8">
                    <span class="w3-text-red">*</span><label>All Working Calendar</label>
                    <select :class="inputClassList.wcalendaruid" v-model="new_content.wcalendaruid" style="padding:0px">
                        <template v-for="wc in allWCLists">
                            <option :value="wc.wcalendaruid">{{ wc.wcalendarname }}</option>
                        </template>
                    </select>
                </div>
            </div>
        </div>
        <div v-show="datetype === 'Calendar'">
            <hr class="w3-border-black">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <datetime-picker ref="datetimePicker" :date="startTime" :option="option" :limit="limit" :inputMode="false" @change="save"></datetime-picker>
                </div>
            </div>
            <div class="w3-row-padding">
                <div class="w3-col m12 w3-center">
                    <button class="w3-button w3-round w3-teal" @click="changePatternWindowStatus">By Pattern</button>
                    <button class="w3-button w3-round w3-teal" @click="clearAllDate">Clear All</button>
                </div>
            </div>
        </div>
        <div v-show="datetype === 'Manually'">
            <div class="w3-row-padding w3-section">
                <hr class="w3-border-black">
                <div class="w3-col m12">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr class="w3-teal">
                                <th class="w3-center" width="17%" style="padding-top:12px;padding-bottom:12px">Year</th>
                                <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Month</th>
                                <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Day</th>
                                <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Weekday</th>
                                <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Hour</th>
                                <th class="w3-center" width="15%" style="padding-top:12px;padding-bottom:12px">Minute</th>
                                <th class="w3-center" width="8%" style="padding-top:7px;padding-bottom:7px">
                                    <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Manually Time" aria-hidden="true" @click="addManuallyTime"></i>
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr :key="list_info.frequencyuid + ':' + index" v-for="(list_info, index) in allFrequencyLists">
                                <td class="w3-center" width="17%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="list_info.yearnum" style="width:95%;padding:0px">
                                            <option :value="Number(-1)">All</option>
                                            <template v-for="n in yearRange">
                                                <option :value="n">{{ n }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="15%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="list_info.monthnum" style="width:95%;padding:0px">
                                            <option :value="Number(-1)">All</option>
                                            <template v-for="n in 12">
                                                <option :value="n">{{ n }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="15%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="list_info.daynum" style="width:95%;padding:0px">
                                            <option :value="Number(-1)">All</option>
                                            <template v-for="n in 31">
                                                <option :value="n">{{ n }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="15%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="list_info.weekdaynum" style="width:95%;padding:0px">
                                            <option :value="Number(-1)" selected>All</option>
                                            <option value="0">Sun.</option>
                                            <option value="1">Mon.</option>
                                            <option value="2">Tues.</option>
                                            <option value="3">Wed.</option>
                                            <option value="4">Thurs.</option>
                                            <option value="5">Fri.</option>
                                            <option value="6">Sat.</option>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="15%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="list_info.hour" style="width:95%;padding:0px">
                                            <option :value="Number(-1)">All</option>
                                            <template v-for="n in 24">
                                                <option :value="n - 1">{{ n - 1 }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="15%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="list_info.minute" style="width:95%;padding:0px">
                                            <template v-for="n in 60">
                                                <option :value="n - 1">{{ n - 1 }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="8%">
                                    <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delManuallyTime(index)"></i>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="datetype != 'Manually'">
            <div class="w3-row-padding">
                <hr class="w3-border-black">
                <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                    <label class="w3-right">Time Type</label>
                </div>
                <div class="w3-col m4">
                    <select :class="inputClassList.timetype" v-model="timetype" style="padding:0px">
                        <option value="EveryHour">Every Hour</option>
                        <option value="SelectedTime">Selected Time</option>
                    </select>
                </div>
            </div>
            <div v-show="timetype === 'EveryHour'" class="w3-row-padding w3-section">
                <div class="w3-col m1" v-for="n in [0,5,10,15,20,25,30,35,40,45,50,55]">
                    <input class="w3-check" type="checkbox" :id="n" :value="n" v-model="checkedMinutes">
                    <label for="Monday">{{ n }}</label>
                </div>
            </div>
            <div v-show="timetype === 'SelectedTime'" class="w3-row-padding w3-section">
                <div class="w3-col m12">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr class="w3-teal">
                                <th class="w3-center" width="45%" style="padding-top:12px;padding-bottom:12px">Hour</th>
                                <th class="w3-center" width="45%" style="padding-top:12px;padding-bottom:12px">Minute</th>
                                <th class="w3-center" width="10%" style="padding-top:7px;padding-bottom:7px">
                                    <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Selected Time" aria-hidden="true" @click="addSelectedTime"></i>
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr :key="time_info.hour + ':' + time_info.minute" v-for="(time_info, index) in selectedTime">
                                <td class="w3-center" width="45%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="time_info.hour" style="width:95%;padding:0px">
                                            <template v-for="n in 24">
                                                <option :value="n-1">{{ n-1 }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="45%" style="padding:6px 0px 0px 0px">
                                    <span>
                                        <select class="w3-select w3-border w3-round" v-model="time_info.minute" style="width:95%;padding:0px">
                                            <template v-for="n in 60">
                                                <option :value="n-1">{{ n-1 }}</option>
                                            </template>
                                        </select>
                                    </span>
                                </td>
                                <td class="w3-center" width="10%">
                                    <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delSelectedTime(index)"></i>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util'
import myDatepicker from '../DatetimePicker.vue'
import CalendarPatternWindow from '../CalendarPatternWindow.vue'

var moment = require('moment')

export default {
    data() {
        return {
            inputClassList: {
                frequencyname: ['w3-input','w3-border'],
                description: ['w3-input','w3-border'],
                datetype: ['w3-select','w3-border','w3-round'],
                timetype: ['w3-select','w3-border','w3-round'],
                freqcategoryuid: ['w3-select','w3-border','w3-round'],
                wcalendaruid: ['w3-select','w3-border','w3-round']
            },
            freqcategoryuid: '',  //store categoryuid for copy/move operation
            datetype: 'Daily',  //store which date type has been selected
            timetype: 'EveryHour',  //store which time type has been selected
            allCategoryLists: [], //store all remote data.(Frequency Categories) for copy/move operation
            allFrequencyLists: [],    //store all remote data.(All Frequency Lists)
            distinctDateLists: [],    //store all remote data.(Distinct By Date Frequency Lists)
            distinctTimeLists: [],    //store all remote data.(Distinct By Time Frequency Lists)
            allWCLists: [],   //store all remote data.(all working calendar)
            checkedWeekday: [], //store all remote data.(checked weekday - 0 ~ 6)
            checkedDay: [], //store all remote data.(checked day - 0 ~ 31)
            checkedMinutes: [], //store all remote data.(checked minutes - 0,5,10,15,20,25,30,35,40,45,50,55)
            selectedTime: [], //store all remote data.(selected time - hour:0~23, minute:0~59)
            yearRange: [],  //store year range for year select box of the mamually mode
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
            },
            patternWindowAlive: false,  //for add Working Calendar modal windows
            startTime: {
                time: '[""]'
            },
            option: {
                type: 'multi-day',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format: 'YYYY-MM-DD',
                placeholder: 'when?',
                inputStyle: {
                    'display': 'inline-block',
                    'padding': '6px',
                    'line-height': '22px',
                    'font-size': '16px',
                    'border': '2px solid #fff',
                    'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
                    'border-radius': '2px',
                    'color': '#5F5F5F'
                },
                color: {
                    header: '#ccc',
                    headerText: '#f00'
                },
                buttons: {
                    ok: 'Ok',
                    cancel: 'Cancel'
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true // as true as default
            },
            limit: [{type: '', available: [1, 2, 3, 4, 5]}, {type: 'fromto', from: '', to: ''}]
        }
    },
    mounted() {
        this.getAllWCs()    //取得所有的working calendar資料
        // 
        if(this.urlOp === 'add'){
            //新增時, 不用取得frequency list
            this.setDatetimePicker('[]')
        }else{
            //取得此frequency底下的所有frequency list, 且根據list中的值來判斷決定date type為何
            this.getFrequencyList()
        }
        
        if(this.urlOp === 'copy' || this.urlOp === 'move'){
            this.getCategories()    //取得所有可供選擇的frequency categories

            if(this.urlOp === 'copy'){
                //copy動作, 把name和description設空值
                this.new_content.frequencyname = ''
                this.new_content.description = ''
            }
        }

        //initial yearRange for year select box of the mamually mode
        this.getYearNumbers()
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
        picked(){
            this.$refs.datetimePicker.picked()
        },
        save(datetime){
            this.clearInValid()
            if(this.new_content.frequencyname === undefined || this.new_content.frequencyname.trim().length <= 0){
                this.inputClassList.frequencyname.splice(2, 1, 'w3-red')
                return
            }
            
            //collect basic necessary value
            let returnValue = {
                "frequencyuid":this.new_content.frequencyuid,
                "frequencyname":this.new_content.frequencyname.trim().toUpperCase(),
                "description":this.new_content.description,
                "activate":Number(this.new_content.activate),
                "xmldata":'',
            }

            let currentFreqDateList = []   //暫存所有需要傳到service的date資料
            if(this.datetype === 'Daily'){
                returnValue.manuallyedit = "0"
                returnValue.bywcalendar = "0"
                returnValue.wcalendaruid = ""

                let newDateData= {
                    yearnum: -1,
                    monthnum: -1,
                    daynum: -1,
                    weekdaynum: -1
                };
                currentFreqDateList.push(newDateData)
            }else if(this.datetype === 'Weekly'){
                if(this.checkedWeekday.length <= 0){
                    let newStatus = {
                        "msg": "Date Type = '"+this.datetype+"', The total number of weekday can not be zero!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }
                returnValue.manuallyedit = "0"
                returnValue.bywcalendar = "0"
                returnValue.wcalendaruid = ""

                this.checkedWeekday = this.checkedWeekday.sort(function(a, b){return a-b});
                for(let index in this.checkedWeekday){
                    let newDateData= {
                        yearnum: -1,
                        monthnum: -1,
                        daynum: -1,
                        weekdaynum: this.checkedWeekday[index]
                    };
                    currentFreqDateList.push(newDateData)
                }
            }else if(this.datetype === 'Monthly'){
                if(this.checkedDay.length <= 0){
                    let newStatus = {
                        "msg": "Date Type = '"+this.datetype+"', The total number of day can not be zero!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }
                returnValue.manuallyedit = "0"
                returnValue.bywcalendar = "0"
                returnValue.wcalendaruid = ""

                this.checkedDay = this.checkedDay.sort(function(a, b){return a-b});
                for(let index in this.checkedDay){
                    let newDateData= {
                        yearnum: -1,
                        monthnum: -1,
                        daynum: this.checkedDay[index],
                        weekdaynum: -1
                    };
                    currentFreqDateList.push(newDateData)
                }
            }else if(this.datetype === 'Calendar'){
                let datetimeArr = JSON.parse(datetime)
                if(datetimeArr.length <= 0){
                    let newStatus = {
                        "msg": "Date Type = '"+this.datetype+"', Frequency Calendar List can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }else if(datetimeArr.length > 2000){
                    let newStatus = {
                        "msg": "Date Type = '"+this.datetype+"', The total number of date selected can not exceed 2000!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }
                returnValue.manuallyedit = "2"
                returnValue.bywcalendar = "0"
                returnValue.wcalendaruid = ""

                for(let index in datetimeArr){
                    let ymdArr =  datetimeArr[index].split('-')
                    if(ymdArr.length === 3){
                        let newDateData= {
                            yearnum: ymdArr[0],
                            monthnum: ymdArr[1],
                            daynum: ymdArr[2],
                            weekdaynum: -1
                        };
                        currentFreqDateList.push(newDateData)
                    }
                }
            }else if(this.datetype === 'WorkingCalendar'){
                if(!this.new_content.wcalendaruid || this.new_content.wcalendaruid.length <= 0){
                    this.inputClassList.wcalendaruid.splice(2, 1, 'w3-red')
                }
                returnValue.manuallyedit = "0"
                returnValue.bywcalendar = "1"
                returnValue.wcalendaruid = this.new_content.wcalendaruid

                let newDateData= {
                    yearnum: -2,
                    monthnum: -2,
                    daynum: -2,
                    weekdaynum: -2
                };
                currentFreqDateList.push(newDateData)
            }else if(this.datetype === 'Manually'){
                if(this.allFrequencyLists.length <= 0){
                    let newStatus = {
                        "msg": "Date Type = '"+this.datetype+"', The total number of date time list selected can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }
                returnValue.manuallyedit = "1"
                returnValue.bywcalendar = "0"
                returnValue.wcalendaruid = ""

                currentFreqDateList = this.allFrequencyLists
            }

            let currentFreqDateTimeList = []   //暫存所有需要傳到service的date及time之資料
            if(this.datetype !== 'Manually') {
                let currentFreqTimeList = []   //暫存所有需要傳到service的time資料
                if(this.timetype === 'EveryHour'){
                    if(this.checkedMinutes.length <= 0){
                        let newStatus = {
                            "msg": "Time Type = '"+this.timetype+"', The total number of minute selected can not be empty!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }
                    this.checkedMinutes = this.checkedMinutes.sort(function(a, b){return a-b});
                    for(let index in this.checkedMinutes){
                        let newTimeData= {
                            hour: -1,
                            minute: this.checkedMinutes[index]
                        };
                        currentFreqTimeList.push(newTimeData)
                    }
                }else if(this.timetype === 'SelectedTime'){
                    if(this.selectedTime.length <= 0){
                        let newStatus = {
                            "msg": "Time Type = '"+this.timetype+"', The total number of time selected can not be empty!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }

                    //以下檢查selected time是否重覆
                    var valueArr = this.selectedTime.map(function(time){ return time.hour + ':' + time.minute });
                    var isDuplicate = valueArr.some(function(time, idx){ 
                        return valueArr.indexOf(time) != idx 
                    });
                    if(isDuplicate){
                        let newStatus = {
                            "msg": "Time Type = '"+this.timetype+"', Duplicate time!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }

                    for(let index in this.selectedTime){
                        let newTimeData= {
                            hour: this.selectedTime[index].hour,
                            minute: this.selectedTime[index].minute
                        };
                        currentFreqTimeList.push(newTimeData)
                    }
                }

                let seq = 1
                for(let i in currentFreqDateList){
                    for(let j in currentFreqTimeList){
                        let newDateTimeData= {
                            yearnum: currentFreqDateList[i].yearnum,
                            monthnum: currentFreqDateList[i].monthnum,
                            daynum: currentFreqDateList[i].daynum,
                            weekdaynum: currentFreqDateList[i].weekdaynum,
                            hour: currentFreqTimeList[j].hour,
                            minute: currentFreqTimeList[j].minute,
                            seq: seq
                        };
                        currentFreqDateTimeList.push(newDateTimeData)
                        seq++
                    }
                }
            }else{
                let seq = 1
                for(let i in currentFreqDateList){
                    let newDateTimeData= {
                        yearnum: currentFreqDateList[i].yearnum,
                        monthnum: currentFreqDateList[i].monthnum,
                        daynum: currentFreqDateList[i].daynum,
                        weekdaynum: currentFreqDateList[i].weekdaynum,
                        hour: currentFreqDateList[i].hour,  //for date type = manually
                        minute: currentFreqDateList[i].minute,   //for date type = manually
                        seq: seq
                    };
                    currentFreqDateTimeList.push(newDateTimeData)
                    seq++
                }
            }

            returnValue.freqlist = currentFreqDateTimeList

             //freqcategoryuid這個值只為了如果是move/copy的情況下, 需要把值傳回去前個元件, 才能知道目前選擇的是那一個category
            if(this.freqcategoryuid && this.freqcategoryuid.trim().length > 0)
                returnValue.freqcategoryuid = this.freqcategoryuid

            this.$emit('save', returnValue);
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
            this.new_content.activate = Number(this.content.activate),
            this.new_content.manuallyedit = this.content.manuallyedit,
            this.new_content.bywcalendar = this.content.bywcalendar,
            this.new_content.wcalendaruid = this.content.wcalendaruid

            if(this.urlOp === 'add'){
                this.datetype = "Daily"
                this.timetype = "EveryHour"

                //以下是把date相關的data binding歸空
                this.setDatetimePicker('[]')    //把Calendar值歸空
                this.checkedDay = []    //把checkedDay值歸空
                this.checkedWeekday = []    //把checkedWeekday值歸空
                //以下是把time相關的data binding歸空
                this.checkedMinutes = []    //把checkedMinutes歸空
                this.selectedTime = []  //把selectedTime歸空
                this.allFrequencyLists = [] //把allFrequencyLists值歸空
            }else{
                this.getFrequencyList() //重新再取得及判斷一次frequency list
            }
        },
        clearInValid(){
            this.inputClassList.frequencyname.splice(2, 1)
            this.inputClassList.wcalendaruid.splice(2, 1)
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
                
                this.allCategoryLists = response.data
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getFrequencyList(){    //Get frequency list by freqUid
            if(this.new_content.manuallyedit === "0" || this.new_content.manuallyedit === "2"){
                this.getDistinctFrequencyList()
            }else if(this.new_content.manuallyedit === "1"){
                this.getAllFrequencyList()
            }
        },
        getDistinctFrequencyList(){
            HTTPRepo.get(`frequency-list/findDistinctDateByFrequencyUid`, {params:{uid: this.new_content.frequencyuid}})
            .then(response => {
                this.distinctDateLists = response.data
                if(!this.distinctDateLists[0])  //if empth array
                    return
                    
                if(this.distinctDateLists[0].yearnum != -1 && this.distinctDateLists[0].monthnum != -1 && this.distinctDateLists[0].daynum != -1 && 
                        this.distinctDateLists[0].weekdaynum === -1){ //by calendar
                    this.setDatetimePicker(JSON.stringify(this.convertYMDObjtoArray()))
                    this.datetype = "Calendar"

                    this.checkedDay = []    //把checkedDay值歸空
                    this.checkedWeekday = []    //把checkedWeekday值歸空
                    this.allFrequencyLists = [] //把allFrequencyLists值歸空
                }else if(this.distinctDateLists[0].yearnum === -1 && this.distinctDateLists[0].monthnum === -1 && 
                        this.distinctDateLists[0].daynum != -1 && this.distinctDateLists[0].weekdaynum === -1){   //by month
                    this.checkedDay = []    //先把自己(checkedDay)歸空
                    for(let i=0;i<this.distinctDateLists.length;i++){
                        this.checkedDay.push(this.distinctDateLists[i].daynum)
                    }
                    this.datetype = "Monthly"

                    this.setDatetimePicker('[]')    //把Calendar值歸空
                    this.checkedWeekday = []    //把checkedWeekday值歸空
                    this.allFrequencyLists = [] //把allFrequencyLists值歸空
                }else if(this.distinctDateLists[0].yearnum === -1 && this.distinctDateLists[0].monthnum === -1 && 
                        this.distinctDateLists[0].daynum === -1 && this.distinctDateLists[0].weekdaynum != -1){   //by week
                    this.checkedWeekday = []    //先把自己(checkedWeekday)歸空
                    for(let i=0;i<this.distinctDateLists.length;i++){
                        this.checkedWeekday.push(this.distinctDateLists[i].weekdaynum)
                    }
                    this.datetype = "Weekly"

                    this.setDatetimePicker('[]')    //把Calendar值歸空
                    this.checkedDay = []    //把checkedDay值歸空
                    this.allFrequencyLists = [] //把allFrequencyLists值歸空
                }else if(this.distinctDateLists[0].yearnum === -1 && this.distinctDateLists[0].monthnum === -1 && 
                        this.distinctDateLists[0].daynum === -1 && this.distinctDateLists[0].weekdaynum === -1){   //by day
                    this.datetype = "Daily"

                    this.setDatetimePicker('[]')    //把Calendar值歸空
                    this.checkedDay = []    //把checkedDay值歸空
                    this.checkedWeekday = []    //把checkedWeekday值歸空
                    this.allFrequencyLists = [] //把allFrequencyLists值歸空
                }else if(this.distinctDateLists[0].yearnum === -2 && this.distinctDateLists[0].monthnum === -2 && 
                        this.distinctDateLists[0].daynum === -2 && this.distinctDateLists[0].weekdaynum === -2){   //by working calendar
                    this.datetype = "WorkingCalendar"

                    this.setDatetimePicker('[]')    //把Calendar值歸空
                    this.checkedDay = []    //把checkedDay值歸空
                    this.checkedWeekday = []    //把checkedWeekday值歸空
                    this.allFrequencyLists = [] //把allFrequencyLists值歸空
                }

                HTTPRepo.get(`frequency-list/findDistinctTimeByFrequencyUid`, {params:{uid: this.new_content.frequencyuid}})
                .then(response => {
                    this.distinctTimeLists = response.data
                    if(!this.distinctTimeLists[0])  //if empth array
                        return
                        
                    if(this.distinctTimeLists[0].hour === -1){ //every hour
                        this.checkedMinutes = []    //先把自己(checkedMinutes)歸空
                        for(let i=0;i<this.distinctTimeLists.length;i++){
                            this.checkedMinutes.push(this.distinctTimeLists[i].minute)
                        }
                        this.timetype = "EveryHour"

                        this.selectedTime = []    //把selectedTime值歸空
                    }else {   //select time
                        this.selectedTime = []    //先把自己(selectedTime)歸空
                        for(let i=0;i<this.distinctTimeLists.length;i++){
                            this.selectedTime.push({ hour: this.distinctTimeLists[i].hour, minute: this.distinctTimeLists[i].minute })
                        }
                        this.timetype = "SelectedTime"

                        this.checkedMinutes = []    //把checkedMinutes值歸空
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getAllFrequencyList(){
            HTTPRepo.get(`frequency-list/findByFrequencyUid`, {params:{uid: this.new_content.frequencyuid}})
            .then(response => {
                this.allFrequencyLists = response.data
                this.datetype = "Manually"
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        getAllWCs(){    //Get all working calendar
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"wcalendarname"
                }
            }

            HTTPRepo.post(`working-calendar/findByFilter?withoutDetail=true`, params)
            .then(response => {
                this.allWCLists = response.data
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        changePatternWindowStatus(){
            this.patternWindowAlive = !this.patternWindowAlive
        },
        clearAllDate(){
            this.setDatetimePicker('[]')
        },
        setDatetimePicker(date){
            this.startTime.time = date
            this.$refs.datetimePicker.showCheck()
        },
        convertYMDObjtoArray(){
            let ymdArr = []
            this.distinctDateLists.forEach(function(element) {  //activate value must be cast to integer 0 or 1
                let year = element.yearnum
                let month = element.monthnum
                let day = element.daynum
                if(month < 10)
                    month = '0' + month
                if(day < 10)
                    day = '0' + day
                ymdArr.push(year + '-' + month + '-' + day)
            });
            return ymdArr
        },
        generateByPattern(postContent){
            HTTPRepo.post(`working-calendar/getWCPattern`, postContent)
                .then(response => {
                    this.setDatetimePicker(JSON.stringify(response.data))
                    this.changePatternWindowStatus()
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
        },
        getYearNumbers(){
            for(let i=Number(moment().format('YYYY')) - 6;i<=Number(moment().format('YYYY')) + 6;i++){
                this.yearRange.push(i)
            }
        },
        addManuallyTime(index){
            let new_time= {
                frequencyuid: this.new_content.frequencyuid,
                seq: this.allFrequencyLists.length + 1,
                yearnum: -1,
                monthnum: -1,
                daynum: -1,
                weekdaynum: -1,
                hour: -1,
                minute: 0
            };
            this.allFrequencyLists.push(new_time)
        },
        delManuallyTime(index){
            this.allFrequencyLists.splice(index, 1)
        },
        addSelectedTime(){
            let new_time= {
                hour: 0,
                minute: 0
            };
            this.selectedTime.push(new_time)
        },
        delSelectedTime(index){
            this.selectedTime.splice(index, 1)
        },
    },
    components: {
        'datetime-picker': myDatepicker,
        'calendar-pattern-window': CalendarPatternWindow
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
