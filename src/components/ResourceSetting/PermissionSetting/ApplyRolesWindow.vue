<template>
  <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
    <div class="w3-small w3-section w3-card" slot="content">
        <div class="w3-responsive w3-card-0 w3-round">
            <table class="w3-table-all w3-small">
                <tr class="w3-teal">
                    <th class="w3-center" width="10%" style="padding-top:4px">
                        <input class="w3-check" type="checkbox" v-model="checkAllFlag" @click="onClickCheckAll">
                    </th>
                    <th class="w3-center" width="90%">Role List</th>
                </tr>
            </table>
        </div>
        <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
            <table id="freqCategoryTable" class="w3-table-all w3-small">
                <template v-for="(role, index) in roles">
                    <tr :id="role.roleuid" :key="role.roleuid">
                        <td class="w3-center" width="10%" style="padding-top:4px">
                            <input class="w3-check" type="checkbox" v-model="role.checked" @change="onClickCheck(role, index)">
                        </td>
                        <td class="w3-center" width="90%">
                            <span>{{ role.rolename }}</span>
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
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import FormButton from '../FormButton.vue'

export default {
    data() {
        return {
            selectedRecords: [], 
            checkAllFlag: false, 
            roles: []
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
        roleUids: {
            type: Array,
            default: () => []
        }
    },
    mounted(){
        this.getRole()
    },
    methods: {
        cancel(){
            this.$emit('closeApply')
        },
        onClickCheckAll(){
            this.selectedRecords =[]
            if(this.checkAllFlag){
                for(let i=0;i<this.roles.length;i++){
                    this.roles[i].checked = true //單純為了在UI把checkbox勾起來而已
                    this.onClickCheck(this.roles[i], i)
                }
            }else{
                for(let i=0;i<this.roles.length;i++){
                    this.roles[i].checked = false //單純為了在UI把checkbox取消而已
                }
            }
        },
        onClickCheck(role, index){
            if(role.checked){
                let new_member = {
                    "roleuid": role.roleuid,
                    "rolename": role.rolename
                }
                this.selectedRecords[index] = new_member
            }else{
                delete this.selectedRecords[index]
            }
        },
        getRole(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"roleame"
                }
            }

            HTTPRepo.post(`role/findByFilter`, params)
            .then(response => {
                this.roles = []
                for(let i=0;i<response.data.length;i++){
                    if(!this.roleUids.includes(response.data[i].roleuid.trim())){
                        this.roles.push(response.data[i])
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
            this.getRole()
        },
        save(){
            if(this.selectedRecords && this.selectedRecords.length > 0){
                var retRecords = []
                for(let i=0;i<this.selectedRecords.length;i++){
                    if(this.selectedRecords[i] && this.selectedRecords[i].roleuid)
                        retRecords.push(this.selectedRecords[i])
                }

                if(retRecords.length > 0){
                    this.$emit('applyMembers', retRecords)
                    this.cancel()
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