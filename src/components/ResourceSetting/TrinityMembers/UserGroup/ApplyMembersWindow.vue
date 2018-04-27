<template>
  <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
    <div class="w3-small w3-section w3-card" slot="content">
        <div class="w3-responsive w3-card-0 w3-round">
            <table class="w3-table-all w3-small">
                <tr class="w3-teal">
                    <th class="w3-center" width="10%" style="padding-top:4px">
                        <input class="w3-check" type="checkbox" v-model="checkAllFlag" @click="onClickCheckAll">
                    </th>
                    <th class="w3-center" width="90%">Trinity User List</th>
                </tr>
            </table>
        </div>
        <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
            <table id="freqCategoryTable" class="w3-table-all w3-small">
                <template v-for="(user, index) in trinityusers">
                    <tr :id="user.useruid" :key="user.useruid">
                        <td class="w3-center" width="10%" style="padding-top:4px">
                            <input class="w3-check" type="checkbox" v-model="user.checked" @click="onClickCheck(user, index)">
                        </td>
                        <td class="w3-center" width="90%">
                            <span>{{ user.username }} ({{ user.userid }})</span>
                        </td>
                    </tr>
                </template>
            </table>
        </div>
    </div>
    <div slot="footer">
        <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
    </div>
  </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FormButton from '../../FormButton.vue'

export default {
    data() {
        return {
            selectedRecords: [],
            checkAllFlag: false,      
            trinityusers: []
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
        },
        groupuid: '',
        memberUids: {
            type: Array,
            default: () => []
        }
    },
    created(){
        this.getTrinityUser()
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        },
        onClickCheckAll(){
            this.selectedRecords =[]
            if(this.checkAllFlag){
                for(let i=0;i<this.trinityusers.length;i++){
                    this.trinityusers[i].checked = true //單純為了在UI把checkbox勾起來而已
                    this.onClickCheck(this.trinityusers[i], i)
                }
            }else{
                for(let i=0;i<this.trinityusers.length;i++){
                    this.trinityusers[i].checked = false //單純為了在UI把checkbox取消而已
                }
            }
        },
        onClickCheck(user, index){
            if(user.checked){
                let new_member = {
                    "useruid": user.useruid
                }
                this.selectedRecords[index] = new_member
            }else{
                delete this.selectedRecords[index]
            }
        },
        getTrinityUser(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"username"
                }
            }

            HTTPRepo.post(`trinity-user/findByFilter`, params)
            .then(response => {
                this.trinityusers = []
                for(let i=0;i<response.data.length;i++){
                    if(!this.memberUids.includes(response.data[i].useruid) && response.data[i].useruid.trim() !== 'trinity'){
                        this.trinityusers.push(response.data[i])
                    }
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        reset(){
            this.checkAllFlag = false
            this.selectedRecords = []
            this.getTrinityUser()
        },
        save(){
            if(this.selectedRecords && this.selectedRecords.length > 0){ 
                var retRecords = []
                for(let i=0;i<this.selectedRecords.length;i++){
                    if(this.selectedRecords[i] && this.selectedRecords[i].useruid)
                        retRecords.push(this.selectedRecords[i])
                }
                
                if(retRecords.length > 0){
                    HTTPRepo.post('group-member/addBatch?groupUid='+this.groupuid, retRecords)
                    .then(response => {
                        this.$emit('applyMembers')
                        this.cancel()
                    })
                    .catch(error => {
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