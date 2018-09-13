<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input v-if="this.new_content.excludefrequencyuid.trim() === 'global'"
                       :class="inputClassList.name" v-model="new_content.excludefrequencyname"
                       type="text" maxlength="32" placeholder="Please Input Name" readonly
                       style="text-transform:uppercase">
                <name-input v-else :class="inputClassList.name" v-model="new_content.excludefrequencyname"
                            type="text" maxlength="32" placeholder="Please Input Name"
                            style="text-transform:uppercase" />
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
            <div class="w3-col m12">
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th width="10%" style="padding-top:12px;padding-bottom:12px">Seq</th>
                            <th width="40%" style="padding-top:12px;padding-bottom:12px">Start Time</th>
                            <th width="40%" style="padding-top:12px;padding-bottom:12px">End Time</th>
                            <th class="w3-center" width="10%" style="padding-top:7px;padding-bottom:7px">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Time" aria-hidden="true" @click="addTime"></i>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:226px">
                    <table class="w3-table">
                        <tr :key="index+'TimeEdit'" draggable="true" @dragover.prevent @drag="dragTime(index)" @drop="dropTime(index)" v-for="(list_info, index) in new_content.excludefrequencylist">
                            <td width="10%" style="padding-top:13px">{{ index + 1 }}</td>
                            <td class="w3-center" width="40%" style="padding:6px 0px 0px 0px">
                                <datetime-picker :date="list_info.starttime" :option="option" :limit="limit" :inputMode="true"></datetime-picker>
                            </td>
                            <td width="40%" style="padding:6px 0px 0px 0px">
                                <datetime-picker :date="list_info.endtime" :option="option" :limit="limit" :inputMode="true"></datetime-picker>
                            </td>
                            <td class="w3-center" width="10%">
                                <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delTime(index)"></i>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import myDatepicker from '../../DatetimePicker.vue'
    import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'

    var moment = require('moment')

    export default {
        data() {
            return {
                inputClassList: {
                    name: ['w3-input', 'w3-border'],
                    desc: ['w3-input', 'w3-border'],
                },
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    excludefrequencyuid: this.content.excludefrequencyuid,
                    excludefrequencyname: this.content.excludefrequencyname,
                    description: this.content.description,
                    activate: Number(this.content.activate),
                    excludefrequencylist: this.initialNewTimeList()
                },
                dragIndex: 0,
                option: {
                    type: 'min',
                    week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    format: 'YYYY-MM-DD HH:mm',
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
                limit: [{ type: '', available: [1, 2, 3, 4, 5] }, { type: 'fromto', from: '', to: '' }]
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        excludefrequencyuid: '',
                        excludefrequencyname: '',
                        description: '',
                        activate: '0',
                        excludefrequencylist: []
                    }
                }
            }
        },
        watch: {    //這段主要是為了Global excl freq window所寫, 讓content異動後的值, 即時更新到new_content中
            content: function (newValue) {
                if (newValue.excludefrequencyuid.trim() === 'global') {
                    this.new_content.excludefrequencyuid = newValue.excludefrequencyuid
                    this.new_content.excludefrequencyname = newValue.excludefrequencyname
                    this.new_content.description = newValue.description
                    this.new_content.activate = Number(newValue.activate)
                    this.new_content.excludefrequencylist = this.initialNewTimeList()
                }
            }
        },
        methods: {
            initialNewTimeList() {
                let new_excludefrequencylist = []
                for (let i = 0; i < this.content.excludefrequencylist.length; i++) {
                    let new_timeObj = {
                        "excludefrequencyuid": this.content.excludefrequencyuid,
                        "seq": this.content.excludefrequencylist[i].seq,
                        "starttime": {
                            "time": this.convertToTimeObject(this.content.excludefrequencylist[i].starttime)
                        },
                        "endtime": {
                            "time": this.convertToTimeObject(this.content.excludefrequencylist[i].endtime)
                        }
                    }
                    new_excludefrequencylist.push(new_timeObj)
                }
                return new_excludefrequencylist
            },
            save() {
                this.clearInValid()

                this.new_content.excludefrequencyname = this.new_content.excludefrequencyname.trim().toUpperCase()

                if (this.new_content.excludefrequencyname.length <= 0) {
                    this.inputClassList.name.splice(2, 1, 'w3-red')
                } else {
                    if (this.new_content.excludefrequencylist.length > 2000) {
                        let newStatus = {
                            "msg": "The total number of datetime selected can not exceed 2000!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    } else {
                        /*
                         * 這裡要再創一個return_content之object的原因是需要讓this.new_content保持starttime及endtime是object的格式, 因為這種格式是DatetimePicker元件吃的
                         * 當starttime改變成後端所吃的Json格式, 即例如"starttime": 201801191004, 則DatetimePicker元件會立刻丟出錯所吃的元件為object而非String的錯誤
                         * 當endtime改變成後端所吃的格式, 即例如"endtime": 201801191005, 則DatetimePicker元件會立刻丟出錯所吃的元件為object而非String的錯誤
                        */
                        let return_content = new Object()
                        return_content.excludefrequencyuid = this.new_content.excludefrequencyuid
                        return_content.excludefrequencyname = this.new_content.excludefrequencyname
                        return_content.description = this.new_content.description
                        return_content.activate = Number(this.new_content.activate)
                        let return_lists = []   //新的excludefrequencylist
                        let timeTemp = []   //這單純是為了檢查是否有重覆時間用的
                        for (let i = 0; i < this.new_content.excludefrequencylist.length; i++) {
                            let starttime = this.new_content.excludefrequencylist[i].starttime.time.replace(/-/g, "").replace(/ /g, "").replace(/:/g, "")
                            let endtime = this.new_content.excludefrequencylist[i].endtime.time.replace(/-/g, "").replace(/ /g, "").replace(/:/g, "")

                            if (starttime > endtime) {    //Check Start time can not be greater than the end time
                                let newStatus = {
                                    "msg": "Start time can not be greater than the end time!",
                                    "status": "Warn"
                                }
                                this.$store.dispatch('setSystemStatus', newStatus)
                                return
                            }

                            if (timeTemp.includes(starttime + "~" + endtime)) {   //Check duplicate time
                                let newStatus = {
                                    "msg": "Duplicate time!",
                                    "status": "Warn"
                                }
                                this.$store.dispatch('setSystemStatus', newStatus)
                                return
                            } else {
                                timeTemp.push(starttime + "~" + endtime)
                            }

                            let return_list = {
                                "seq": i + 1,
                                "starttime": starttime,
                                "endtime": endtime
                            }
                            return_lists.push(return_list)
                        }
                        return_content.excludefrequencylist = return_lists
                        return return_content
                    }
                }
            },
            reset() {
                this.clearInValid()

                this.new_content.excludefrequencyuid = this.content.excludefrequencyuid
                this.new_content.excludefrequencyname = this.content.excludefrequencyname
                this.new_content.description = this.content.description
                this.new_content.activate = Number(this.content.activate)
                this.new_content.excludefrequencylist = this.initialNewTimeList()
            },
            clearInValid() {
                this.inputClassList.name.splice(2, 1)
            },
            addTime() {
                let new_timeObj = {
                    "excludefrequencyuid": this.new_content.excludefrequencyuid,
                    "seq": this.new_content.excludefrequencylist.length + 1,
                    "starttime": {
                        "time": moment().format('YYYY-MM-DD HH:mm')
                    },
                    "endtime": {
                        "time": moment().format('YYYY-MM-DD HH:mm')
                    }
                }
                this.new_content.excludefrequencylist.push(new_timeObj)
            },
            delTime(index) {
                this.new_content.excludefrequencylist.splice(index, 1)
            },
            dragTime(index) {
                this.dragIndex = index
            },
            dropTime(index) {
                if (this.new_content.excludefrequencylist.length === 1)
                    return

                var temp = this.new_content.excludefrequencylist[index];
                /*
                    this.$set is for above :
                    http://www.jianshu.com/p/358c1974d9a5
                    https://jsfiddle.net/qnq2munr/2/
                */
                this.$set(this.new_content.excludefrequencylist, index, this.new_content.excludefrequencylist[this.dragIndex])
                this.$set(this.new_content.excludefrequencylist, this.dragIndex, temp)
            },
            convertToTimeObject(timeNum) {
                let timeStr = timeNum + ''
                if (timeStr.length === 12) {
                    timeStr = timeStr.slice(0, 4) + "-" + timeStr.slice(4, 6) + "-" + timeStr.slice(6, 8) + " "
                        + timeStr.slice(8, 10) + ":" + timeStr.slice(10, 12)
                }

                return timeStr
            }
        },
        components: {
            'datetime-picker': myDatepicker,
            'confirm-delete-window': ConfirmDeleteWindow
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
