<template>
  <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
    <div class="w3-small w3-section w3-card" slot="content">
        <div class="w3-responsive w3-card-0 w3-round">
            <table class="w3-table-all w3-small">
                <tr class="w3-teal">
                    <th class="w3-center" width="10%" style="padding-top:4px">
                        <input class="w3-check" type="checkbox" v-model="checkAllFlag" @click="onClickCheckAll">
                    </th>
                    <th class="w3-center" width="90%">Driver Names</th>
                </tr>
            </table>
        </div>
        <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
            <table id="freqCategoryTable" class="w3-table-all w3-small">
                <template v-for="(driver, index) in allDriverObjs">
                    <tr :id="driver.name" :key="driver.name">
                        <td class="w3-center" width="10%" style="padding-top:4px">
                            <input class="w3-check" type="checkbox" v-model="driver.checked" @click="onClickCheck(driver, index)">
                        </td>
                        <td class="w3-center" width="90%">
                            <span>{{ driver.name }} ({{ driver.owner }})</span>
                        </td>
                    </tr>
                </template>
            </table>
        </div>
    </div>
    <div slot="footer">
        <form-button btn-color="signal-white" :is-loading="addButtonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
  </modal-window>
</template>
<script>
import { HTTPRepo, errorHandle } from '../../../util_js/axios_util'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import FormButton from '../FormButton.vue'
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            selectedRecords: [],
            checkAllFlag: false,
            addButtonLoading: false,
            allDriverObjs: []
        }
    },
    created(){
        this.getDrivers()
    },
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    methods: {
        cancel(){
            if(this.addButtonLoading)
                return
            this.$emit('closeApply')
        },
        onClickCheckAll(){
            this.selectedRecords =[]
            if(this.checkAllFlag){
                for(let i=0;i<this.allDriverObjs.length;i++){
                    this.allDriverObjs[i].checked = true //單純為了在UI把checkbox勾起來而已
                    this.onClickCheck(this.allDriverObjs[i], i)
                }
            }else{
                for(let i=0;i<this.allDriverObjs.length;i++){
                    this.allDriverObjs[i].checked = false //單純為了在UI把checkbox取消而已
                }
            }
        },
        onClickCheck(driver, index){
            if(driver.checked){
                let new_driver = {
                    "driverName": driver.name
                }
                this.selectedRecords[index] = new_driver
            }else{
                delete this.selectedRecords[index]
            }
        },
        reset(){
            this.checkAllFlag = false
            this.selectedRecords = []
            this.getDrivers()
        },
        getDrivers(e){
            HTTPRepo.get(`driver-manager/findDriversProp`)
            .then(response => {
                this.allDriverObjs = response.data
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        save(){
            if(this.selectedRecords && this.selectedRecords.length > 0){ 
                var driverNames = []
                for(let i=0;i<this.selectedRecords.length;i++){
                    if(this.selectedRecords[i] && this.selectedRecords[i].driverName)
                        driverNames.push(this.selectedRecords[i].driverName)
                }
                
                if(driverNames.length > 0){
                    this.addButtonLoading = true
                    console.log(driverNames)
                    HTTPRepo.post('driver-manager/publishDriver', driverNames)
                    .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
                    .then(response => {
                        this.addButtonLoading = false

                        let newStatus = {
                            "msg": "Drivers published to JCS are successful.",
                            "status": "Success"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    })
                    .catch(error => {
                        this.addButtonLoading = false
                        errorHandle(this.$store, error)
                    })
                }else{
                    this.cancel()
                }
            }else{
                this.cancel()
            }
        }
    },
    components: {
        'modal-window': ModalWindow,
        'form-button': FormButton
    }
}
</script>
<style scoped>
    input.w3-check {
        height: 16px
    }
</style>