<template>
<div class="w3-col m2 w3-small">
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Page Size</p>
            <p>
                <select class="w3-select w3-border w3-round" name="option" v-model="selectedSize" @change="changeSize">
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
                <select class="w3-select w3-border w3-round" name="option" v-model="selectedNum" @change="changeNum">
                    <option value="-1" disabled selected>Num</option>
                    <option :value="index" v-for="(page, index) in totalPages">{{ index + 1 }}</option>
                </select>
            </p>
        </div>
    </div>
    <br>
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Ordering</p>
            <p>
                <select class="w3-select w3-border w3-round" name="option" v-model="orderField">
                    <option value="" disabled selected>Field</option>
                    <option value="lastupdatetime">Update Time</option>
                    <option value="agentname">Name</option>
                    <option value="activate">Activate</option>
                    <option value="host">Host</option>
                    <option value="port">Port</option>
                </select>
            </p>
            <p>
                <input class="w3-radio" type="radio" name="ASC" value="ASC" v-model="orderType">
                <label>Asc</label>
            </p>
            <p>
                <input class="w3-radio" type="radio" name="DESC" value="DESC" v-model="orderType">
                <label>Desc</label>
            </p>
            <p><button class="w3-button w3-block w3-theme-l4" @click="applyOrder">Apply</button></p>
        </div>
    </div>
    <br>

    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Querying</p>
            <p>
                <select class="w3-select w3-border w3-round" name="option" v-model="queryField">
                    <option value="" disabled selected>Field</option>
                    <option value="Agentname">Name</option>
                    <option value="Activate">Activate</option>
                    <option value="Host">Host</option>
                    <option value="Port">Port</option>
                    <option value="Description">Desc</option>
                </select>
            </p>
            <p>
                <input class="w3-radio" type="radio" name="EQUALS" value="EQUALS" v-model="queryType">
                <label>Equals</label>
            </p>
            <p>
                <input class="w3-radio" type="radio" name="LIKE" value="LIKE" v-model="queryType">
                <label>Like</label>
            </p>
            <hr class="w3-border-black">
            <p>
                <input class="w3-input w3-border" type="text">
            </p>
            <div class="w3-row w3-opacity">
                <div class="w3-half">
                    <button class="w3-button w3-block w3-green w3-section" title="Apply"><i class="fa fa-check"></i></button>
                </div>
                <div class="w3-half">
                    <button class="w3-button w3-block w3-red w3-section" title="Cancel"><i class="fa fa-remove"></i></button>
                </div>
            </div>
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
            selectedNum: 0,
            selectedSize: 10,
            totalPages: 1,
            orderField: 'lastupdatetime',
            orderType: 'DESC',
            queryField: '',
            queryType: '',
            queryString: ''
        }
    },
    // computed: {
    //     //ES7的寫法
    //     ...mapGetters({
    //         totalPages: 'getTotalPages'
    //     })
    // },
    methods: {
        changeSize(e){
            this.selectedNum = 0
            this.$emit('fromFilter', e)
        },
        changeNum(e){
            this.$emit('fromFilter', e)
        },
        applyOrder(e){
            this.$emit('fromFilter', e)
        }
    }
    
    // mounted() {
    //     HTTPRepo.get(`jcsagent/findAll`)
    //         .then(response => {
    //             this.objs = response.data;
    //         })
    //         .catch(error => {
    //             if (error.response) {
    //                 alert(error.response.data)
    //             } else {
    //                 alert(error.message)
    //             }
    //         })
    // }
}
</script>

