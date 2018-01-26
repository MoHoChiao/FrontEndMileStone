<template>
  <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
    <div slot="content" class="w3-container w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m4">
                <label>End Date Type</label>
                <select class="w3-select w3-border w3-round" v-model="endDateType" style="padding:0px">
                    <option value="EndBy" selected>End By</option>
                    <option value="EndAfter" selected>End After</option>
                </select>
            </div>
            <div class="w3-col m4">
                <span class="w3-text-red">*</span><label>Start Date</label>
                <datetime-picker :date="startTime" :option="option" :limit="limit" :inputMode="true"></datetime-picker>
            </div>
            <div v-if="endDateType === 'EndBy'" class="w3-col m4">
                <span class="w3-text-red">*</span><label>End Date</label>
                <datetime-picker :date="endTime" :option="option" :limit="limit" :inputMode="true"></datetime-picker>
            </div>
            <div v-else class="w3-col m4">
                <span class="w3-text-red">*</span><label>Occurences</label>
                <input :class="inputClassList.occurences" v-model="occurences" type="number" min="1" max="999">
            </div>
        </div>
        <div class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Daily</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">Weekly</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(2)">
                <div :class="tabsClass[2]">Monthly</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(3)">
                <div :class="tabsClass[3]">Yearly</div>
            </a>
        </div>

        <div v-show="tabsFlag[0]" class="w3-container">
            <div class="w3-panel w3-card">
                <div class="w3-row-padding w3-section">
                    <div class="w3-col m6">
                        <label>Daily Type</label>
                        <select class="w3-select w3-border w3-round" v-model="dailyType" style="padding:0px">
                            <option value="Days">Every Day(s)</option>
                            <option value="WeekDay">Every Weekday</option>
                        </select>
                    </div>
                    <div v-if="dailyType === 'Days'" class="w3-col m6">
                        <span class="w3-text-red">*</span><label>Day(s)</label>
                        <input :class="inputClassList.daily_day" v-model="daily_day" type="number" min="1" max="999">
                    </div>
                </div>
            </div>
        </div>

        <div v-show="tabsFlag[1]" class="w3-container">
            <div class="w3-panel w3-card">
                <div class="w3-row w3-section">
                    <div class="w3-col m12">
                        <span class="w3-left" style="padding-top:6px">Every&nbsp;&nbsp;</span>
                        <span class="w3-text-red w3-left">*</span>
                        <span class="w3-left"><input :class="inputClassList.weekly_week" v-model="weekly_week" type="number" min="1" max="999"></span>
                        <span class="w3-left" style="padding-top:6px">&nbsp;&nbsp;week(s) on : </span>
                    </div>
                </div>
                <div class="w3-row w3-section">
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('1')" type="checkbox" v-model="weekly_days">
                        <label>SUN</label>
                    </div>
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('2')" type="checkbox" v-model="weekly_days">
                        <label>MON</label>
                    </div>
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('3')" type="checkbox" v-model="weekly_days">
                        <label>TUE</label>
                    </div>
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('4')" type="checkbox" v-model="weekly_days">
                        <label>WED</label>
                    </div>
                </div>
                <div class="w3-row w3-section">
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('5')" type="checkbox" v-model="weekly_days">
                        <label>THU</label>
                    </div>
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('6')" type="checkbox" v-model="weekly_days">
                        <label>FRI</label>
                    </div>
                    <div class="w3-col m3">
                        <input class="w3-check" :value="Number('7')" type="checkbox" v-model="weekly_days">
                        <label>SAT</label>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="tabsFlag[2]" class="w3-container">
            <div class="w3-panel w3-card">
                <div class="w3-row w3-section">
                    <div class="w3-col m12 w3-center">
                        <label>Monthly Type</label>
                        <select class="w3-select w3-border w3-round" v-model="monthlyType" style="padding:0px">
                            <option value="DayOfEveryMonth">Day(s) of Every Month(s)</option>
                            <option value="TheDayOfEveryMonth">The Day of Every Month(s)</option>
                        </select>
                    </div>
                </div>
                <div v-if="monthlyType === 'DayOfEveryMonth'" class="w3-row w3-section">
                    <div class="w3-col m12">
                        <span class="w3-text-red w3-left">*</span>
                        <span class="w3-left"><input :class="inputClassList.monthly_day" v-model="monthly_day" type="number" min="1" max="999"></span>
                        <span class="w3-left" style="padding-top:6px">&nbsp;&nbsp;day(s) of every&nbsp;&nbsp;</span>
                        <span class="w3-text-red w3-left">*</span>
                        <span class="w3-left"><input :class="inputClassList.monthly_month" v-model="monthly_month" type="number" min="1" max="999"></span>
                        <span class="w3-left" style="padding-top:6px">&nbsp;&nbsp;month(s)</span>
                    </div>
                </div>
                <div v-else>
                    <div class="w3-row w3-section">
                        <div class="w3-col m12">
                            <span class="w3-left" style="padding-top:6px">The&nbsp;&nbsp;</span>
                            <span class="w3-left">
                                <select class="w3-select w3-border w3-round" v-model="monthly_seq" style="padding:0px">
                                    <option :value="Number('1')">First</option>
                                    <option :value="Number('2')">Second</option>
                                    <option :value="Number('3')">Third</option>
                                    <option :value="Number('4')">Fourth</option>
                                    <option :value="Number('-1')">Last</option>
                                </select>
                            </span>
                            <span class="w3-left">&nbsp;&nbsp;</span>
                            <span class="w3-left">
                                <select class="w3-select w3-border w3-round" v-model="monthly_dayType" style="padding:0px">
                                    <option :value="Number('8')">Day</option>
                                    <option :value="Number('9')">Weekday</option>
                                    <option :value="Number('10')">Weekend Day</option>
                                    <option :value="Number('1')">Sunday</option>
                                    <option :value="Number('2')">Monday</option>
                                    <option :value="Number('3')">Tuesday</option>
                                    <option :value="Number('4')">Wednesday</option>
                                    <option :value="Number('5')">Thursday</option>
                                    <option :value="Number('6')">Firday</option>
                                    <option :value="Number('7')">Saturday</option>
                                </select>
                            </span> 
                            <span class="w3-left" style="padding-top:6px">&nbsp;&nbsp;of every&nbsp;&nbsp;</span>
                            <span class="w3-text-red w3-left">*</span>
                            <span class="w3-left">
                                <input :class="inputClassList.monthly_month" v-model="monthly_month" type="number" min="1" max="999">
                            </span>
                            <span class="w3-left" style="padding-top:6px">&nbsp;&nbsp;month(s)</span>
                        </div>
                    </div>
                    <div class="w3-row w3-section">
                        <div class="w3-col m12">
                            <span class="w3-left" style="padding-top:6px">Plus or Minus&nbsp;&nbsp;</span>
                            <span class="w3-left">
                                <input :class="inputClassList.monthly_plusOrMinus" v-model="monthly_plusOrMinus" type="number" min="-999" max="999">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="tabsFlag[3]" class="w3-container">
            <div class="w3-panel w3-card">
                <div class="w3-row w3-section">
                    <div class="w3-col m12 w3-center">
                        <label>Yearly Type</label>
                        <select class="w3-select w3-border w3-round" v-model="yearlyType" style="padding:0px">
                            <option value="DayOfEveryYear">Day(s) of Every Year</option>
                            <option value="TheDayOfEveryYear">The Day of Every Year</option>
                        </select>
                    </div>
                </div>
                <div v-if="yearlyType === 'DayOfEveryYear'" class="w3-row w3-section">
                    <div class="w3-col m12">
                        <span class="w3-left" style="padding-top:6px">Every&nbsp;&nbsp;</span>
                        <span class="w3-left">
                            <select class="w3-select w3-border w3-round" v-model="yearly_month1" style="padding:0px">
                                <option :value="Number('0')">January</option>
                                <option :value="Number('1')">February</option>
                                <option :value="Number('2')">March</option>
                                <option :value="Number('3')">April</option>
                                <option :value="Number('4')">May</option>
                                <option :value="Number('5')">June</option>
                                <option :value="Number('6')">July</option>
                                <option :value="Number('7')">August</option>
                                <option :value="Number('8')">September</option>
                                <option :value="Number('9')">October</option>
                                <option :value="Number('10')">November</option>
                                <option :value="Number('11')">December</option>
                            </select>
                        </span>
                        <span class="w3-text-red w3-left">&nbsp;&nbsp;*</span>
                        <span class="w3-left"><input :class="inputClassList.yearly_day" v-model="yearly_day" type="number" min="1" max="999"></span>
                        <span class="w3-left" style="padding-top:6px">&nbsp;&nbsp;day(s)</span>
                    </div>
                </div>
                <div v-else>
                    <div class="w3-row w3-section">
                        <div class="w3-col m12">
                            <span class="w3-left" style="padding-top:6px">The&nbsp;&nbsp;</span>
                            <span class="w3-left">
                                <select class="w3-select w3-border w3-round" v-model="yearly_seq" style="padding:0px">
                                    <option :value="Number('1')">First</option>
                                    <option :value="Number('2')">Second</option>
                                    <option :value="Number('3')">Third</option>
                                    <option :value="Number('4')">Fourth</option>
                                    <option :value="Number('-1')">Last</option>
                                </select>
                            </span>
                            <span class="w3-left">&nbsp;&nbsp;</span>
                            <span class="w3-left">
                                <select class="w3-select w3-border w3-round" v-model="yearly_dayType" style="padding:0px">
                                    <option :value="Number('8')">Day</option>
                                    <option :value="Number('9')">Weekday</option>
                                    <option :value="Number('10')">Weekend Day</option>
                                    <option :value="Number('1')">Sunday</option>
                                    <option :value="Number('2')">Monday</option>
                                    <option :value="Number('3')">Tuesday</option>
                                    <option :value="Number('4')">Wednesday</option>
                                    <option :value="Number('5')">Thursday</option>
                                    <option :value="Number('6')">Firday</option>
                                    <option :value="Number('7')">Saturday</option>
                                </select>
                            </span> 
                            <span class="w3-left">&nbsp;&nbsp;</span>
                            <span class="w3-left">
                                <select class="w3-select w3-border w3-round" v-model="yearly_month2" style="padding:0px">
                                    <option :value="Number('0')">January</option>
                                    <option :value="Number('1')">February</option>
                                    <option :value="Number('2')">March</option>
                                    <option :value="Number('3')">April</option>
                                    <option :value="Number('4')">May</option>
                                    <option :value="Number('5')">June</option>
                                    <option :value="Number('6')">July</option>
                                    <option :value="Number('7')">August</option>
                                    <option :value="Number('8')">September</option>
                                    <option :value="Number('9')">October</option>
                                    <option :value="Number('10')">November</option>
                                    <option :value="Number('11')">December</option>
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div slot="footer">
        <div class="w3-row w3-small">
            <button type="button" class="w3-button w3-right w3-round w3-theme-d2" style="margin-right:3px" @click="generate"><i class="fa fa-hand-lizard-o"></i> Generate</button>
            <button type="button" class="w3-button w3-right w3-round w3-theme-d2" style="margin-right:3px" @click="cancel"><i class="fa fa-ban"></i> Cancel</button>
        </div>
    </div>
  </modal-window>
</template>
<script>
import { HTTPRepo } from '../../axios/http-common'
import myDatepicker from './DatetimePicker.vue'
import ModalWindow from '../Common/window/ModalWindow.vue'
import FormButton from './FormButton.vue'

var moment = require('moment')

export default {
    data() {
        return {
            tabsClass: ['w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false, false, false],
            inputClassList: {
                occurences: ['w3-input','w3-border'],
                daily_day: ['w3-input','w3-border'],
                weekly_week: ['w3-input','w3-border'],
                monthly_day: ['w3-input','w3-border'],
                monthly_month: ['w3-input','w3-border'],
                monthly_plusOrMinus: ['w3-input','w3-border'],
                yearly_day: ['w3-input','w3-border']
            },
            occurences: 10,
            endDateType: 'EndBy',
            dailyType: 'Days',
            daily_day: 1,
            weekly_week: 1,
            weekly_days: [],
            monthlyType: 'DayOfEveryMonth',
            monthly_day: 1,
            monthly_month: 1,
            monthly_seq: 1,
            monthly_dayType : 8,
            monthly_plusOrMinus: 0,
            yearlyType: 'DayOfEveryYear',
            yearly_month1: 0,
            yearly_month2: 0,
            yearly_day: 1,
            yearly_seq: 1,
            yearly_dayType : 8,
            startTime: {
                time: moment().format('YYYY-MM-DD')
                // time: ''
            },
            endTime: {
                time: moment().add(1, 'year').format('YYYY-MM-DD')
                // time: ''
            },
            option: {
                type: 'day',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format: 'YYYY-MM-DD',
                placeholder: 'Select Date',
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
                    header: '#2a6592',
                    headerText: '#8ec3eb'
                },
                buttons: {
                    ok: 'Ok',
                    cancel: 'Cancel'
                },
                overlayOpacity: 0.1, // 0.5 as default
                dismissible: true // as true as default
            },
            limit: [{type: '', available: [1, 2, 3, 4, 5]}, {type: 'fromto', from: '', to: ''}]
        }
    },
    props: {
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
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
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
        generate(){
            this.clearInValid()
            
            if(this.endDateType === 'EndAfter' && this.occurences <= 0){
                this.inputClassList.occurences.splice(2, 1, 'w3-red')
                return
            }

            let diffDays = moment(this.endTime.time).diff(moment(this.startTime.time), 'days')
            if(diffDays < 0){
                let newStatus = {
                    "msg": 'End Date can not be earlier than the Start Date!',
                    "status": "Error"
                }
                this.$store.dispatch('setSystemStatus', newStatus)
                return
            }

            let patternValue = {
                "endDateType": this.endDateType,
                "startDate": this.startTime.time
            }

            if(this.endDateType === 'EndBy'){   //end by
                patternValue.endDate = this.endTime.time
            }else{  //end after
                patternValue.occurences = this.occurences
            }
            

            if(this.tabsFlag[0]){
                if(this.dailyType === 'Days'){  //days
                    if(this.daily_day <= 0){
                        this.inputClassList.daily_day.splice(2, 1, 'w3-red')
                        return
                    }
                    patternValue.day = this.daily_day
                }else{  //WeekDay
                    //do nothing
                }

                patternValue.patternType = "Daily"
                patternValue.dailyType = this.dailyType

            }else if(this.tabsFlag[1]){
                if(this.weekly_week <= 0){
                    this.inputClassList.weekly_week.splice(2, 1, 'w3-red')
                    return
                }
                if(this.weekly_days.length <= 0){
                    let newStatus = {
                        "msg": 'The day of week can not be empty!',
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

                patternValue.patternType = 'Weekly'
                patternValue.week = this.weekly_week
                patternValue.days = this.weekly_days

            }else if(this.tabsFlag[2]){
                if(this.monthly_month <= 0){
                    this.inputClassList.monthly_month.splice(2, 1, 'w3-red')
                    return
                }

                if(this.monthlyType === 'DayOfEveryMonth'){ //DayOfEveryMonth
                    if(this.monthly_day <= 0){
                        this.inputClassList.monthly_day.splice(2, 1, 'w3-red')
                        return
                    }
                    
                    patternValue.monthlyType = 'DayOfEveryMonth'
                    patternValue.day = this.monthly_day

                }else{  //TheDayOfEveryMonth
                    patternValue.monthlyType = 'TheDayOfEveryMonth'
                    patternValue.seq = this.monthly_seq
                    patternValue.dayType = this.monthly_dayType
                    patternValue.plusOrMinus = this.monthly_plusOrMinus
                }

                patternValue.patternType = 'Monthly'
                patternValue.month = this.monthly_month

            }else if(this.tabsFlag[3]){
                if(this.yearlyType === 'DayOfEveryYear'){   //DayOfEveryYear
                    if(this.yearly_day <= 0){
                        this.inputClassList.yearly_day.splice(2, 1, 'w3-red')
                        return
                    }

                    patternValue.yearlyType = 'DayOfEveryYear'
                    patternValue.month = this.yearly_month1
                    patternValue.day = this.yearly_day
                }else{  //TheDayOfEveryYear
                    patternValue.yearlyType = 'TheDayOfEveryYear'
                    patternValue.month = this.yearly_month2
                    patternValue.seq = this.yearly_seq
                    patternValue.dayType = this.yearly_dayType
                }

                patternValue.patternType = 'Yearly'
            }else{
                return
            }

            this.$emit('generate', patternValue)
        },
        reset(){
            //clear red font
            this.clearInValid()

            //reset value to initial
            this.new_content.filesourceuid = this.content.filesourceuid
            if(this.urlOp === 'copy'){  //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
                this.new_content.filesourcename = ''
                this.new_content.description = ''
            }else{
                this.new_content.filesourcename = this.content.filesourcename
                this.new_content.description = this.content.description
            }

            //call child form to reset value to initial
            this.$refs.directoryAsignForm.reset()
            this.$refs.fileDesignForm.reset()
            this.$refs.jobTriggerForm.reset()
        },
        clearInValid(){
            this.inputClassList.occurences.splice(2, 1)
            this.inputClassList.daily_day.splice(2, 1)
            this.inputClassList.weekly_week.splice(2, 1)
            this.inputClassList.monthly_day.splice(2, 1)
            this.inputClassList.monthly_month.splice(2, 1)
        },
        getCategories(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"fscategoryname"
                }
            }

            HTTPRepo.post(`file-source-category/findByFilter`, params)
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
        }
    },
    components: {
        'datetime-picker': myDatepicker,
        'modal-window': ModalWindow,
        'form-button': FormButton
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
