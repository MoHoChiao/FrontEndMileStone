<template>
  <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
    <div slot="content" class="w3-container w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m4">
                <label>End Date Type</label>
                <select :class="inputClassList.endDateType" v-model="endDateType" style="padding:0px">
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
                <datetime-picker :date="endtime" :option="option" :limit="limit" :inputMode="true"></datetime-picker>
            </div>
            <div v-else class="w3-col m4">
                <span class="w3-text-red">*</span><label>Occurences</label>
                <input :class="inputClassList.occurences" v-model="occurences" type="number" placeholder="Input occurences number">
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

        <div v-show="tabsFlag[0]" class="w3-container" style="overflow:auto;max-height:200px;min-height:200px">
            <div>Fuck you 1</div>
        </div>

        <div v-show="tabsFlag[1]" class="w3-container" style="overflow:auto;max-height:200px;min-height:200px">
            <div>Fuck you 2</div>
        </div>

        <div v-show="tabsFlag[2]" class="w3-container" style="overflow:auto;max-height:200px;min-height:200px">
            <div>Fuck you 3</div>
        </div>

        <div v-show="tabsFlag[3]" class="w3-container" style="overflow:auto;max-height:200px;min-height:200px">
            <div>Fuck you 4</div>
        </div>
    </div>
    <div slot="footer">
        <form-button btn-color="signal-white"></form-button>
    </div>
  </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import myDatepicker from '../../DatetimePicker.vue'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FormButton from '../../FormButton.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false, false, false],
            inputClassList: {
                startDate: ['w3-input','w3-border'],
                endDate: ['w3-input','w3-border'],
                occurences: ['w3-input','w3-border'],
                endDateType: ['w3-select','w3-border','w3-round']
            },
            startDate: '',
            endDate: '',
            occurences: 10,
            endDateType: 'EndBy',
            startTime: {
                time: ''
            },
            endtime: {
                time: ''
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
            
            //check form value
            if(this.new_content.filesourcename === undefined || this.new_content.filesourcename.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
                return
            }
            
            //collect basic necessary value
            let returnValue = {
                "filesourceuid":this.new_content.filesourceuid,
                "filesourcename":this.new_content.filesourcename,
                "description":this.new_content.description
            }
            
            //fscategoryuid這個值只為了如果是move/copy的情況下, 需要把值傳回去前個元件, 才能知道目前選擇的是那一個category
            if(this.fscategoryuid && this.fscategoryuid.trim().length > 0)
                returnValue.fscategoryuid = this.fscategoryuid

            //call Directory Asign form to check value
            let directoryAsignContent = this.$refs.directoryAsignForm.save()
            //collect all necessary value from Directory Asign form
            if(directoryAsignContent){
                for(let key in directoryAsignContent){
                    returnValue[key] = directoryAsignContent[key]
                }
            }else{
                this.openTab(0)
                return
            }

            //call File Design form to check value
            let fileDesignContent = this.$refs.fileDesignForm.save()
            //collect all necessary value from File Design form
            if(fileDesignContent){
                for(let key in fileDesignContent){
                    returnValue[key] = fileDesignContent[key]
                }
            }else{
                this.openTab(1)
                return
            }
            
            //call Job Trigger form to check value
            let jobTriggerContent = this.$refs.jobTriggerForm.save()
            //collect all necessary value from Job Trigger form
            if(jobTriggerContent){
                for(let key in jobTriggerContent){
                    returnValue[key] = jobTriggerContent[key]
                }
            }else{
                this.openTab(2)
                return
            }

            return returnValue
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
            this.inputClassList.startDate.splice(2, 1)
            this.inputClassList.desc.splice(2, 1)
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
</style>
