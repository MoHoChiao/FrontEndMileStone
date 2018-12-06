<template>
    <!-- For Select Mutiple Date Card UI -->
    <div class="w3-card-4">
        <div class="w3-row w3-teal w3-border">
            <div class="w3-col m1 w3-center">
                <button class="w3-button fa fa-arrow-left w3-hover-none" title="pre half" @click="preHalfYear()" :disabled="!isPreRange" />
            </div>
            <div class="w3-col m10 w3-center">
                <span class="w3-large">{{checked.year}}</span>
            </div>
            <div class="w3-col m1 w3-center">
                <button class="w3-button fa fa-arrow-right w3-hover-none" title="next half" @click="nextHalfYear()" :disabled="!isNextRange" />
            </div>
        </div>
        <div class="w3-row">
            <div class="w3-col m4 w3-border" v-for="(item, index) in 6" :key="index" >
                <div class="w3-row w3-teal" @click="checkMonth(index)">
                    <label v-if="isFirstHalf" class="w3-col m12 w3-center" style="cursor:pointer">
                        {{option.month[index]}}
                    </label>
                    <label v-else class="w3-col m12 w3-center" style="cursor:pointer">
                        {{option.month[index + 6]}}
                    </label>
                </div>
                <div v-if="showInfo.day" class="w3-row">
                    <div class="w3-col m12">
                        <div class="week">
                            <ul class="w3-text-indigo">
                                <li v-for="(weekie, wi) in library.week" :key="wi" @click="checkWeek(index, wi)" style="cursor:pointer">{{weekie}}</li>
                            </ul>
                        </div>
                        <div class="day w3-hover-flat-silver" v-for="(day, idx) in dayList[index]" :key="idx" track-by="$index" @click="checkDay(day)"
                             :class="{'checked':day.checked,'unavailable':day.unavailable,'passive-day': !(day.inMonth)}"
                             :style="day.checked ? (option.color && option.color.checkedDay ? { background: option.color.checkedDay } : { background: '#F50057' }) : {}">
                            {{day.value}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    var _moment = require('moment');
    var _moment2 = _interopRequireDefault(_moment);
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

     export default {
        props: {
            inputMode: true,
            required: false,
            date: {
                type: Object,
                required: true
            },
            option: {
                type: Object
            },
            limit: {
                type: Array,
                default: function _default() {
                    return [];
                }
            }
        },
        data: function data() {
            function hours() {
                var list = [];
                var hour = 24;
                while (hour > 0) {
                    hour--;
                    list.push({
                        checked: false,
                        value: hour < 10 ? '0' + hour : hour
                    });
                }
                return list;
            }
            function mins() {
                var list = [];
                var min = 60;
                while (min > 0) {
                    min--;
                    list.push({
                        checked: false,
                        value: min < 10 ? '0' + min : min
                    });
                }
                return list;
            }
            return {
                isPreRange: true,
                isNextRange: true,
                isFirstHalf: true,
                hours: hours(),
                mins: mins(),
                showInfo: {
                    hour: false,
                    day: false,
                    month: false,
                    year: false,
                    check: false
                },
                displayInfo: {
                    month: ''
                },
                library: {
                    week: this.option.week,
                    month: this.option.month,
                    year: []
                },
                checked: {
                    oldtime: '',
                    currentMoment: null,
                    year: '',
                    month: '',
                    day: '',
                    hour: '00',
                    min: '00'
                },
                dayList: [],
                selectedDays: []
            };
        },
        methods: {
            pad: function pad(n) {
                n = Math.floor(n);
                return n < 10 ? '0' + n : n;
            },
            nextMonth: function nextMonth(type) {
                var next = null;
                type === 'next' ? next = (0, _moment2.default)(this.checked.currentMoment).add(1, 'M')
                    : next = (0, _moment2.default)(this.checked.currentMoment).add(-1, 'M');
                
                this.showDay(next);
            },
            preHalfYear() {
                this.isNextRange = true
                let now = (0, _moment2.default)()
                let pre = (0, _moment2.default)(this.checked.currentMoment).add(-6, 'M');

                if (now.diff(pre, 'months') > 11) {
                    this.isPreRange = false
                    return
                }

                this.showDay(pre);
            },
            nextHalfYear() {
                this.isPreRange = true
                let end = (0, _moment2.default)().add(1, 'y').endOf("year")
                let next = (0, _moment2.default)(this.checked.currentMoment).add(6, 'M')

                if (next.diff(end, 'days') >= 0) {
                    this.isNextRange = false
                    return
                }

                this.showDay(next);
            },
            showDay: function showDay(time) {
                if (time === undefined || !(0, _moment2.default)(time, this.option.format).isValid()) {
                    this.checked.currentMoment = (0, _moment2.default)();
                } else {
                    this.checked.currentMoment = (0, _moment2.default)(time, this.option.format);
                }
                
                this.showOne('day');
                this.checked.year = (0, _moment2.default)(this.checked.currentMoment).format('YYYY');
                this.checked.month = (0, _moment2.default)(this.checked.currentMoment).format('MM');
                //this.checked.day = (0, _moment2.default)(this.checked.currentMoment).format('DD');
                //this.displayInfo.month = this.library.month[(0, _moment2.default)(this.checked.currentMoment).month()];
                
                if (this.checked.month > 6) {
                    this.isFirstHalf = false;
                    this.checked.currentMoment = (0, _moment2.default)(this.checked.year + '-07-01', this.option.format);
                } else {
                    this.isFirstHalf = true;
                    this.checked.currentMoment = (0, _moment2.default)(this.checked.year + '-01-01', this.option.format);
                }

                let baseMonth = this.checked.currentMoment;
                this.dayList.length = 0;
                for (var i = 0; i < 6; ++i) {
                    this.dayList.push(this.setMonthDay(baseMonth))
                    baseMonth = (0, _moment2.default)(baseMonth).add(1, 'M').clone();
                }
            },
            setMonthDay(currentMoment) {
                var days = [];
                var firstDay = (0, _moment2.default)(currentMoment).date(1).day();
                
                // gettting previous and next month9
                let currentMonth = (0, _moment2.default)(currentMoment).format('MM')
                var previousMonth = (0, _moment2.default)(currentMoment);
                var nextMonth = (0, _moment2.default)(currentMoment);
                nextMonth.add(1, 'months');
                previousMonth.subtract(1, 'months');
                var monthDays = (0, _moment2.default)(currentMoment).daysInMonth();
                var oldtime = this.checked.oldtime;
                
                for (var i = 1; i <= monthDays; ++i) {
                    days.push({
                        value: i,
                        inMonth: true,
                        unavailable: false,
                        checked: false,
                        moment: (0, _moment2.default)(currentMoment).date(i)
                    });
                    
                    this.checkBySelectDays(i, currentMonth, days);
                }
                if (firstDay === 0) firstDay = 7;
                for (var _i = 0; _i < firstDay - (this.option.SundayFirst ? 0 : 1); _i++) {
                    var passiveDay = {
                        value: previousMonth.daysInMonth() - _i,
                        inMonth: false,
                        action: 'previous',
                        unavailable: true,
                        checked: false,
                        moment: (0, _moment2.default)(currentMoment).date(1).subtract(_i + 1, 'days')
                    };
                    days.unshift(passiveDay);
                }
                //if (this.limit.length > 0) {
                //    var _iteratorNormalCompletion = true;
                //    var _didIteratorError = false;
                //    var _iteratorError = undefined;
                //    try {
                //        for (var _iterator = this.limit[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                //            var li = _step.value;
                //            switch (li.type) {
                //                case 'fromto':
                //                    days = this.limitFromTo(li, days);
                //                    break;
                //                case 'weekday':
                //                    days = this.limitWeekDay(li, days);
                //                    break;
                //            }
                //        }
                //    } catch (err) {
                //        _didIteratorError = true;
                //        _iteratorError = err;
                //    } finally {
                //        try {
                //            if (!_iteratorNormalCompletion && _iterator.return) {
                //                _iterator.return();
                //            }
                //        } finally {
                //            if (_didIteratorError) {
                //                throw _iteratorError;
                //            }
                //        }
                //    }
                //}
                var passiveDaysAtFinal = 42 - days.length;
                for (var _i2 = 1; _i2 <= passiveDaysAtFinal; _i2++) {
                    var _passiveDay = {
                        value: _i2,
                        inMonth: false,
                        action: 'next',
                        unavailable: true,
                        checked: false,
                        moment: (0, _moment2.default)(currentMoment).add(1, 'months').date(_i2)
                    };
                    days.push(_passiveDay);
                }

                return days;
            },
            checkBySelectDays: function checkBySelectDays(d, m, days) {
                var _this = this

                this.selectedDays.forEach(function (day) {
                    if (_this.checked.year == day.substring(0, 4)
                            && m == day.substring(5, 7)
                            && d == day.substring(8, 10)) {
                        days[d - 1].checked = true;
                    }
                });
            },
            limitWeekDay: function limitWeekDay(limit, days) {
                days.map(function (day) {
                    if (limit.available.indexOf(Math.floor(day.moment.format('d'))) === -1) {
                        day.unavailable = true;
                    }
                });
                return days;
            },
            limitFromTo: function limitFromTo(limit, days) {
                var _this2 = this;
                if (limit.from || limit.to) {
                    days.map(function (day) {
                        if (_this2.getLimitCondition(limit, day)) {
                            day.unavailable = true;
                        }
                    });
                }
                return days;
            },
            getLimitCondition: function getLimitCondition(limit, day) {
                var tmpMoment = (0, _moment2.default)(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
                if (limit.from && !limit.to) {
                    return !tmpMoment.isAfter(limit.from);
                } else if (!limit.from && limit.to) {
                    return !tmpMoment.isBefore(limit.to);
                } else {
                    return !tmpMoment.isBetween(limit.from, limit.to);
                }
            },
            checkDay: function checkDay(obj) {
                if (obj.unavailable || obj.value === '') {
                    return false;
                }
                if (!obj.inMonth) {
                    this.nextMonth(obj.action);
                    if (!this.inputMode)
                        return
                }
                if (this.option.type === 'day' || this.option.type === 'min') {
                    this.dayList.forEach(function (x) {
                        x.checked = false;
                    });
                    this.checked.day = this.pad(obj.value);
                    obj.checked = true;
                } else {
                    var ctime = (0, _moment2.default)(obj.moment).format('YYYY-MM-DD')
                    
                    if (obj.checked === true) {
                        obj.checked = false;
                        var index = this.selectedDays.indexOf(ctime);
                        this.selectedDays.splice(index, 1);
                    } else {
                        this.selectedDays.push(ctime);
                        obj.checked = true;
                    }
                }
                switch (this.option.type) {
                    case 'day':
                        this.picked();
                        break;
                    case 'min':
                        this.showOne('hour');
                        // shift activated time items to visible position.
                        this.shiftActTime();
                        break;
                }
            },
            checkWeek(mi, wi) {
                for (let i = 0; i < 6; i++) {   // 6 week in 1 month
                    let day = this.dayList[mi][wi + (i * 7)];
                    if (day.inMonth) {
                        let ctime = (0, _moment2.default)(day.moment).format('YYYY-MM-DD')

                        if (day.checked === true) {
                            day.checked = false;
                            var index = this.selectedDays.indexOf(ctime);
                            this.selectedDays.splice(index, 1);
                        } else {
                            day.checked = true;
                            this.selectedDays.push(ctime);
                        }
                    }
                }
            },
            checkMonth(mi) {
                for (let i = 0; i < 42; i++) {  // 42 days in 1 month
                    let day = this.dayList[mi][i];
                    if (day.inMonth) {
                        let ctime = (0, _moment2.default)(day.moment).format('YYYY-MM-DD')

                        if (day.checked === true) {
                            day.checked = false;
                            var index = this.selectedDays.indexOf(ctime);
                            this.selectedDays.splice(index, 1);
                        } else {
                            day.checked = true;
                            this.selectedDays.push(ctime);
                        }
                    }
                }
            },
            showYear: function showYear() {
                var _this3 = this;
                var year = (0, _moment2.default)(this.checked.currentMoment).year();
                this.library.year = [];
                var yearTmp = [];
                for (var i = year - 100; i < year + 5; ++i) {
                    yearTmp.push(i);
                }
                this.library.year = yearTmp;
                this.showOne('year');
                this.$nextTick(function () {
                    var listDom = document.getElementById('yearList');
                    listDom.scrollTop = listDom.scrollHeight - 100;
                    _this3.addYear();
                });
            },
            showOne: function showOne(type) {
                switch (type) {
                    case 'year':
                        this.showInfo.hour = false;
                        this.showInfo.day = false;
                        this.showInfo.year = true;
                        this.showInfo.month = false;
                        break;
                    case 'month':
                        this.showInfo.hour = false;
                        this.showInfo.day = false;
                        this.showInfo.year = false;
                        this.showInfo.month = true;
                        break;
                    case 'day':
                        this.showInfo.hour = false;
                        this.showInfo.day = true;
                        this.showInfo.year = false;
                        this.showInfo.month = false;
                        break;
                    case 'hour':
                        this.showInfo.hour = true;
                        this.showInfo.day = false;
                        this.showInfo.year = false;
                        this.showInfo.month = false;
                        break;
                    default:
                        this.showInfo.day = true;
                        this.showInfo.year = false;
                        this.showInfo.month = false;
                        this.showInfo.hour = false;
                }
            },
            showMonth: function showMonth() {
                this.showOne('month');
            },
            addYear: function addYear() {
                var _this4 = this;
                var listDom = document.getElementById('yearList');
                listDom.addEventListener('scroll', function (e) {
                    if (listDom.scrollTop < listDom.scrollHeight - 100) {
                        var len = _this4.library.year.length;
                        var lastYear = _this4.library.year[len - 1];
                        _this4.library.year.push(lastYear + 1);
                    }
                }, false);
            },
            setYear: function setYear(year) {
                this.checked.currentMoment = (0, _moment2.default)(year + '-' + this.checked.month + '-' + this.checked.day);
                this.showDay(this.checked.currentMoment);
            },
            setMonth: function setMonth(month) {
                var mo = this.library.month.indexOf(month) + 1;
                if (mo < 10) {
                    mo = '0' + '' + mo;
                }
                this.checked.currentMoment = (0, _moment2.default)(this.checked.year + '-' + mo + '-' + this.checked.day);
                this.showDay(this.checked.currentMoment);
            },
            showCheck: function showCheck() {
                if (this.date.time === '') {
                    this.showDay();
                } else {
                    if (this.option.type === 'day' || this.option.type === 'min') {
                        this.checked.oldtime = this.date.time;
                        this.showDay(this.date.time);
                    } else {
                        this.selectedDays = JSON.parse(this.date.time);
                        //if (this.selectedDays.length) {
                        //    this.checked.oldtime = this.selectedDays[0];
                        //    this.showDay(this.selectedDays[0]);
                        //} else {
                        //    this.showDay();
                        //}
                        this.showDay();
                    }
                }
                this.showInfo.check = true;
            },
            setTime: function setTime(type, obj, list) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;
                try {
                    for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;
                        item.checked = false;
                        if (item.value === obj.value) {
                            item.checked = true;
                            this.checked[type] = item.value;
                        }
                    }

                    if (type === 'min')  //為了不需要按ok按鈕加的
                        this.picked()

                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            },
            picked: function picked() {
                if (this.option.type === 'day' || this.option.type === 'min') {
                    var ctime = this.checked.year + '-' + this.checked.month + '-' + this.checked.day + ' ' + this.checked.hour + ':' + this.checked.min;
                    this.checked.currentMoment = (0, _moment2.default)(ctime, 'YYYY-MM-DD HH:mm');
                    this.date.time = (0, _moment2.default)(this.checked.currentMoment).format(this.option.format);
                } else {
                    this.date.time = JSON.stringify(this.selectedDays);
                }
                this.showInfo.check = false;
                this.$emit('change', this.date.time);
            },
            dismiss: function dismiss(evt) {
                if (evt.target.className === 'datepicker-overlay') {
                    if (this.option.dismissible === undefined || this.option.dismissible) {
                        this.showInfo.check = false;
                        this.$emit('cancel');
                    }
                }
            },
            shiftActTime: function shiftActTime() {
                // shift activated time items to visible position.
                this.$nextTick(function () {
                    if (!document.querySelector('.hour-item.active')) {
                        return false;
                    }
                    document.querySelector('.hour-box').scrollTop = (document.querySelector('.hour-item.active').offsetTop || 0) - 250;
                    document.querySelector('.min-box').scrollTop = (document.querySelector('.min-item.active').offsetTop || 0) - 250;
                });
            }
        }
    };
</script>
<style scoped>

    .datepicker-overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 998;
        top: 0;
        left: 0;
        overflow: hidden;
        -webkit-animation: fadein 0.5s;
        /* Safari, Chrome and Opera > 12.1 */
        -moz-animation: fadein 0.5s;
        /* Firefox < 16 */
        -ms-animation: fadein 0.5s;
        /* Internet Explorer */
        -o-animation: fadein 0.5s;
        /* Opera < 12.1 */
        animation: fadein 0.5s;
    }

    @keyframes fadein {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
    /* Firefox < 16 */
    @-moz-keyframes fadein {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
    /* Safari, Chrome and Opera > 12.1 */
    @-webkit-keyframes fadein {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
    /* Internet Explorer */
    @-ms-keyframes fadein {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
    /* Opera < 12.1 */
    @-o-keyframes fadein {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
    }

    .day {
        width: 14.2857143%;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        height: 20px;
        padding: 0;
        line-height: 20px;
        vertical-align: middle;
    }

    .week ul {
        margin: 0 0px;
        padding: 0;
        list-style: none;
    }

    .week ul li {
        width: 14.2%;
        display: inline-block;
        text-align: center;
        background: transparent;
        font-weight: bold;
    }

    .passive-day {
        color: #bbb;
    }

    .checked {
        background: #F50057;
        color: #FFF !important;
        /*border-radius: 3px;*/
    }

    .unavailable {
        color: #ccc;
        cursor: not-allowed;
    }

    .unavailable:hover {
        background: none;
    }

    .checked:hover {
        background: #FF4F8E;
    }

    .date-item {
        text-align: center;
        padding: 6px 0;
        cursor: pointer;
    }

    .date-item:hover {
        background: #e0e0e0;
    }

    .date-list {
        overflow: auto;
        vertical-align: top;
        padding: 0;
    }

    .button-box {
        background: #2a6592;
        height: 20px;
    }

    .button-box span {
        cursor: pointer;
        padding: 10px 20px;
    }

    .watch-box {
        height: 100%;
        overflow: hidden;
    }

    .hour-box,
    .min-box {
        display: inline-block;
        width: 50%;
        text-align: center;
        height: 100%;
        overflow: auto;
        float: left;
    }

    .hour-box ul,
    .min-box ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .hour-item,
    .min-item {
        padding: 10px;
        font-size: 36px;
        cursor: pointer;
    }

    .hour-item:hover,
    .min-item:hover {
        background: #E3E3E3;
    }

    .hour-box .active,
    .min-box .active {
        background: #F50057;
        color: #FFF !important;
    }

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: #E3E3E3;
    }

    ::-webkit-scrollbar-thumb {
        background: #C1C1C1;
        border-radius: 2px;
    }

    input {
        height: 30px
    }
</style>