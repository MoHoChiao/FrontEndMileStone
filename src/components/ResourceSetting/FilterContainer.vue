<template>
<div>
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Page Size</p>
            <p>
                <select class="w3-select w3-border w3-round" name="option">
                    <option value="" disabled selected>Size</option>
                    <option value="1">10</option>
                    <option value="2">20</option>
                    <option value="3">50</option>
                    <option value="3">100</option>
                    <option value="3">200</option>
                    <option value="3">500</option>
                </select>
            </p>
            <p class="w3-center">Page Num</p>
            <p>
                <select class="w3-select w3-border w3-round" name="option" v-model="selected" @change="test">
                    <option value="-1" disabled selected>Num</option>
                    <option :value="index" v-for="(page, index) in totalPages">{{ index + 1 }}</option>
                </select>
            </p>
        </div>
    </div>
    <br>
    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Filtering</p>
            <p>
                <input class="w3-radio" type="radio" name="gender" value="female" checked>
                <label>Name</label>
            </p>
            <p>
                <input class="w3-radio" type="radio" name="gender" value="female">
                <label>Status</label>
            </p>
            <p><input class="w3-input w3-border w3-round" type="text" placeholder="Querry String"></p>
            <p><button class="w3-button w3-block w3-theme-l4">Search</button></p>
        </div>
    </div>
    <br>

    <div class="w3-card-4 w3-round w3-signal-white">
        <div class="w3-container">
            <p class="w3-center">Ordering</p>
            <p>
                <input class="w3-check" type="checkbox">
                <label>Name</label>
            </p>
            <p>
                <input class="w3-check" type="checkbox">
                <label>Status</label>
            </p>
            <p>
                <input class="w3-check" type="checkbox">
                <label>Type</label>
            </p>
            <hr class="w3-border-black">
            <p>
                <input class="w3-radio" type="radio" name="gender" value="female">
                <label>Asc</label>
            </p>
            <p>
                <input class="w3-radio" type="radio" name="gender" value="female">
                <label>Desc</label>
            </p>
            <div class="w3-row w3-opacity">
                <div class="w3-half">
                    <button class="w3-button w3-block w3-green w3-section" title="Accept"><i class="fa fa-check"></i></button>
                </div>
                <div class="w3-half">
                    <button class="w3-button w3-block w3-red w3-section" title="Decline"><i class="fa fa-remove"></i></button>
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
            selected:'-1'
        }
    },
    computed: {
        //ES7的寫法
        ...mapGetters({
            totalPages: 'getTotalPages'
        })
    },
    methods: {
        changeSize(){
            alert(this.selected)
        },
        changeNum(){
            alert(this.selected)
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

