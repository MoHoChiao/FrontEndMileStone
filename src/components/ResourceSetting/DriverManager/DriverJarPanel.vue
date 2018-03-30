<template>
    <div>
        <confirm-delete-window v-if="deleteWindowAlive" :windowAlive="deleteWindowAlive" 
            :deleteName="deleteName" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteWindowStatus" 
            @confirmDelete="deleteAttach" 
        ></confirm-delete-window>
        <div class="w3-small">
            <div class="w3-row">
                <div class="w3-col m12">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr class="w3-teal">
                                <th class="w3-center" width="80%" style="padding-top:12px;padding-bottom:12px">Jar Name</th>
                                <th class="w3-center" width="20%" style="padding-top:7px;padding-bottom:7px">
                                    <i class="fa fa-upload w3-button w3-hover-none" title="Upload Files" aria-hidden="true" @click="changeApplyWindowStatus"></i>
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div id="jarsContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:106px;word-break:break-all">
                        <table class="w3-table-all">
                            <tr :key="index+'JarListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(file, index) in new_jarFiles">
                                <td class="w3-center" width="80%">
                                    {{ file }}
                                </td>
                                <td class="w3-center" width="20%" style="padding-top:0px;padding-bottom:0px">
                                    <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                        aria-hidden="true" @click="changeDeleteWindowStatus(index, file)"></i>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue'

export default {
    data() {
        return {
            new_jarFiles: this.jarFiles,
            memberUids: [],
            applyWindowAlive: false,
            deleteWindowAlive: false,  //for delete windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: ''     //store which obj name will be delete
        }
    },
    props:{
        driverName: '',
        jarFiles: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    watch: {
        /*
         * 監視父元件的jarFiles值
         * 一旦更新時, 則立即把子元件中的new_jarFiles也一併更新
        */
        jarFiles: function(newValue) {
            this.new_jarFiles = newValue
        }
    },
    methods: {
        changeApplyWindowStatus(){
            this.new_jarFiles.unshift('aaaaaaaaaaaaaa')
            var jarsContainer = this.$el.querySelector("#jarsContainer")
            jarsContainer.scrollTop = -jarsContainer.scrollTop
        },
        changeDeleteWindowStatus(index, file){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            if(file){
                this.deleteIndex = index

                this.deleteUid = file
                this.deleteName = 'Jar File - ' + file
            }else{
                this.deleteIndex = -1
                this.deleteUid = ''
                this.deleteName = ''
            }
        },
        deleteAttach(){
            if(this.deleteIndex === -1)
                return
            if(!this.deleteUid || this.deleteUid === '')
                return
            console.log('driver-manager/deleteDriverJarFile?driverName='+this.driverName+'&jarName='+this.deleteUid)
            HTTPRepo.get('driver-manager/deleteDriverJarFile?driverName='+this.driverName+'&jarName='+this.deleteUid)
            .then(response => {
                this.new_jarFiles.splice(this.deleteIndex, 1)
                
                this.changeDeleteWindowStatus()
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    let newStatus = {
                        "msg": error.response.data,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                } else {
                    let newStatus = {
                        "msg": error.message,
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                }
            })
        }
    },
    components: {
        'confirm-delete-window': ConfirmDeleteWindow
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

