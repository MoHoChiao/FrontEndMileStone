<template>
<div class="w3-hide w3-col m2 w3-small">
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Page Size</p>
            <p>
                <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize">
                    <option value="-1" disabled selected>Size</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </p>
            <p class="w3-center">Page Num</p>
            <p>
                <page ref="paginate" :page-count="totalPages" :clickHandler="changeNum"></page>
            </p>
        </div>
    </div>
    <br>
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Ordering</p>
            <p>
                <select class="w3-select w3-border w3-round" v-model="orderField">
                    <option value="" disabled selected>Field</option>
                    <option :key="field.name + field.value" :value="field.value" v-for="field in orderFileds">{{ field.name }}</option>
                </select>
            </p>
            <p>
                <input class="w3-radio" type="radio" value="ASC" v-model="orderType">
                <label>Asc</label>
            </p>
            <p>
                <input class="w3-radio" type="radio" value="DESC" v-model="orderType">
                <label>Desc</label>
            </p>
            <p>
                <button v-if="!isOrder" class="w3-button w3-block w3-green w3-round w3-hover-green" title="Apply Order" @click="applyOrder"><i class="fa fa-check" title="Apply Order" aria-hidden="true"></i></button>
                <button v-else class="w3-button w3-block w3-red w3-round w3-hover-red" title="Cancel Order" @click="cancelOrder"><i class="fa fa-remove" title="Cancel Order" aria-hidden="true"></i></button>
            </p>
        </div>
    </div>
    <br>

    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Querying</p>
            <p>
                <select class="w3-select w3-border w3-round" v-model="queryField">
                    <option value="" disabled selected>Field</option>
                    <option :key="field.name + field.value" :value="field.value" v-for="field in queryFileds">{{ field.name }}</option>
                </select>
            </p>
            <p>
                <input class="w3-radio" type="radio" value="EQUALS" v-model="queryType">
                <label>Equals</label>
            </p>
            <p>
                <input class="w3-radio" type="radio" value="LIKE" v-model="queryType">
                <label>Like</label>
            </p>
            <p>
                <input class="w3-check" type="checkbox" v-model="ignoreCase">
                <label>IgnoreCase</label>
            </p>
            <hr class="w3-border-black">
            <p>
                <input class="w3-input w3-border" type="text" placeholder="Input Keyword" v-model="queryString">
            </p>
            <p>
                <button v-if="!isQuery" class="w3-button w3-block w3-green w3-round w3-hover-green" title="Apply Query" @click="applyQuery"><i class="fa fa-check" title="Apply Query" aria-hidden="true"></i></button>
                <button v-else class="w3-button w3-block w3-red w3-round w3-hover-red" title="Cancel Query" @click="cancelQuery"><i class="fa fa-remove" title="Cancel Query" aria-hidden="true"></i></button>
            </p>
        </div>
    </div>
    <br>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import page from './page.vue'

export default {
    data() {
        return {
            //for pagging
            selectedNum: 0,
            selectedSize: 20,
            totalPages: 1,
            //for ordering
            isOrder: false,
            orderField: 'lastupdatetime',
            orderType: 'DESC',
            //for querying
            isQuery: false,
            queryField: '',
            queryType: '',
            queryString: '',
            ignoreCase: false
        }
    },
    props: {
        orderFileds: {
            type: Array,
            default: () => [],
            required: true
        },
        queryFileds: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    methods: {
        changeSize(e){
            //每一次的查詢, 都要讓page number先回到第一頁
            this.pageNumSelected('1')
            this.$emit('fromFilter', e)
        },
        changeNum(e, index){
            //紀錄現在點擊的是那一頁
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.$emit('fromFilter', e)
        },
        applyOrder(e){
            this.isOrder = true
            //每一次的查詢, 都要讓page number先回到第一頁
            this.pageNumSelected('1')
            this.$emit('fromFilter', e)
        },
        applyQuery(e){
            this.isQuery = true
            //每一次的查詢, 都要讓page number先回到第一頁
            this.pageNumSelected('1')
            this.$emit('fromFilter', e)
        },
        cancelOrder(e){
            this.isOrder = false
            //每一次的查詢, 都要讓page number先回到第一頁
            this.pageNumSelected('1')
            this.$emit('fromFilter', e)
        },
        cancelQuery(e){
            this.isQuery = false
            //每一次的查詢, 都要讓page number先回到第一頁
            this.pageNumSelected('1')
            this.$emit('fromFilter', e)
        },
        pageNumSelected(index){
            this.selectedNum = Number(index) - 1    //page number需要index - 1, 因為後端的分頁是從0開始算起
            this.$refs.paginate.selected = Number(index) - 1    //除了changeNum因為已經改變過paginate.selected之值了, 其它都需要再去改變paginate.selected的值
        },
        
    },
    components: {
        'page': page
    }
}
</script>
<style scoped>
    input,select {
        height: 35px
    }
    input.w3-check,input.w3-radio {
        height: 20px
    }
</style>

