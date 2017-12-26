<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.wcalendarname" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.activate" style="width:40px;" type="checkbox">
                <label>Activate</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m1">&nbsp;</div>
            <div class="w3-col m10">
                <datetime-picker ref="datetimePicker" :date="startTime" :option="option" :limit="limit" @change="save"></datetime-picker>
            </div>
            <div class="w3-col m1">&nbsp;</div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import myDatepicker from '../../DatetimePicker.vue'

export default {
    data() {
        return {
            inputClassList: {
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border'],
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                wcalendaruid: this.content.wcalendaruid,
                wcalendarname: this.content.wcalendarname,
                description: this.content.description,
                activate: Number(this.content.activate),
                wcalendarlist: this.content.wcalendarlist
            },
            startTime: {
                time: ''
            },
            endtime: {
                time: ''
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
            timeoption: {
                type: 'min',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format: 'YYYY-MM-DD HH:mm'
            },
            multiOption: {
                type: 'multi-day',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format:"YYYY-MM-DD HH:mm"
            },
            limit: [{type: '', available: [1, 2, 3, 4, 5]}, {type: 'fromto', from: '', to: ''}],
            
        }
    },
    created() {
        this.startTime.time = JSON.stringify(this.convertYMDObjtoArray())
        // this.startTime.time = '["2017-11-30"]'
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    wcalendaruid: '',
                    wcalendarname: '',
                    description: '',
                    activate: '0',
                    wcalendarlist: []
                }
            }
        },
        index: Number
    },
    methods: {
        picked(e, datetime){
            this.$refs.datetimePicker.picked()
        },
        save(datetime){
            this.clearInValid()

            if(this.new_content.wcalendarname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else{
                let datetimeArr = JSON.parse(datetime)
                if(datetimeArr.length <= 0){
                    let newStatus = {
                        "msg": "Working Calendar List can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }else{
                    let wcalendarlist = new Array()
                    for(let i=0;i<datetimeArr.length;i++){
                        let ymdArr =  datetimeArr[i].split('-')
                        if(ymdArr.length === 3){
                            let ymdObj = {
                                "yearnum":ymdArr[0],
                                "monthnum":ymdArr[1],
                                "daynum":ymdArr[2]
                            }
                            wcalendarlist.push(ymdObj)
                        }
                    }
                    this.new_content.wcalendarlist = wcalendarlist
                    this.new_content.activate = Number(this.new_content.activate)
                    this.$emit('save', this.new_content);
                }
            }
        },
        reset(){
            this.clearInValid()
            
            this.new_content.wcalendaruid = this.content.wcalendaruid
            this.new_content.wcalendarname = this.content.wcalendarname
            this.new_content.description = this.content.description
            this.new_content.activate = Number(this.content.activate)

            //reset working calendar list to default
            this.startTime.time = JSON.stringify(this.convertYMDObjtoArray())
            this.$refs.datetimePicker.showCheck()
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
        },
        convertYMDObjtoArray(){
            let ymdArr = new Array()
            this.new_content.wcalendarlist.forEach(function(element) {  //activate value must be cast to integer 0 or 1
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
        }
    },
    components: {
        'datetime-picker': myDatepicker
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
    input.w3-check {
        height: 20px
    }
</style>
