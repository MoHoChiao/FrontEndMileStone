<template>
<div class="w3-col m2 w3-small">
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Page Size</p>
            <p>
                <select class="w3-select w3-border w3-round" v-model="selectedSize" @change="changeSize">
                    <option value="-1" disabled selected>Size</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="500">500</option>
                </select>
            </p>
            <p class="w3-center">Page Num</p>
            <p>
                <select :class="inputClassList.selectedNum" v-model="selectedNum" @change="changeNum">
                    <option value="-1" disabled selected>Num</option>
                    <option :value="index-1" v-for="index in totalPages">{{ index }}</option>
                </select>
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
                    <option :value="field.value" v-for="field in orderFileds">{{ field.name }}</option>
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
                    <option :value="field.value" v-for="field in queryFileds">{{ field.name }}</option>
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
import { HTTPRepo } from '../../axios/http-common'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            inputClassList: {
                selectedNum: ['w3-select','w3-border','w3-round'],
            },
            //for pagging
            selectedNum: 0,
            selectedSize: 10,
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
            this.selectedNum = 0
            this.$emit('fromFilter', e)
        },
        changeNum(e){            
            this.$emit('fromFilter', e)
        },
        applyOrder(e){
            this.isOrder = true
            this.$emit('fromFilter', e)
        },
        applyQuery(e){
            this.isQuery = true
            this.$emit('fromFilter', e)
        },
        cancelOrder(e){
            this.isOrder = false
            this.$emit('fromFilter', e)
        },
        cancelQuery(e){
            this.isQuery = false
            this.$emit('fromFilter', e)
        }
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

