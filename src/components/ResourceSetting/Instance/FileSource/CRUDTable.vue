<template>
<div>
  <p class="">
    <span><img src="/src/assets/images/resource_setter/filesource_category.png" alt="File Source Category" class="w3-margin-right w3-hide-small" style="height32px;width:32px"></span>
    <span>All Categories</span>
  </p>
  <p>
    <div class="w3-responsive w3-card w3-round">
        <table class="w3-table-all w3-small">
            <tr class="w3-teal">
                <th class="w3-center" width="7%">
                    <check-box-icon></check-box-icon>
                </th>
                <th class="w3-center" width="33%">Name</th>
                <th class="w3-center" width="60%">Description</th>
            </tr>
        </table>
    </div>
    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px">
        <table class="w3-table-all w3-small">
            <tr class="w3-hover-blue-grey w3-hover-opacity" draggable="true" v-for="(content, index) in allDataObjs">
                <td class="w3-center" width="7%">
                    <check-box-icon></check-box-icon>
                </td>
                <td class="w3-center" width="33%">
                    <span>{{ content.fscategoryname }}</span>
                </td>
                <td width="60%">
                    <span>{{ content.description }}</span>
                </td>
            </tr>
        </table>
    </div>
  </p>
</div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import FilterPanel from '../../FilterPanel.vue'
import FileSourceEditPanel from './FileSourceEditPanel.vue'
import FileSourceAddWindow from './FileSourceAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import CheckBoxIcon from '../../../Common/form/CheckBoxIcon.vue'

export default {
    data() {
        return {
            isCheckSelect: false,
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add virtual agent modal windows
            deleteWindowAlive: false,  //for delete virtual agent modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allDataObjs: new Object(), //store all remote data from backend service
            editable: [],   //for all virtual agents content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "virtualagentname"},
                {name: "Activate",value: "activate"},
                {name: "Mode",value: "mode"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "virtualagentname"},
                {name: "Activate",value: "activate"},
                {name: "Mode",value: "mode"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getData()
    },
    props: {
        filterParams: {
            type: Object,
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getData(e){
            HTTPRepo.post(`file-source-category/findByFilter`, filterParams)
            .then(response => {
                if (response.data.content !== undefined) {
                    this.allDataObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allDataObjs = response.data
                    this.$refs.filter.totalPages = 1
                }
            })
            .catch(error => {
                if(e){
                    if(e.target.title === 'Apply Order')
                        this.$refs.filter.isOrder = true
                    else if(e.target.title === 'Apply Query')
                        this.$refs.filter.isQuery = true
                    else if(e.target.title === 'Cancel Order')
                        this.$refs.filter.isOrder = false
                    else if(e.target.title === 'Cancel Query')
                        this.$refs.filter.isQuery = false
                }

                if (error.response) {
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
        },
        deleteAgent(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTPRepo.get(`vragent/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.objs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '', '')
            })
            .catch(error => {
                if (error.response) {
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
            
        },
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            this.editable
            if(content !== undefined){
                this.objs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, vr_agentuid, vr_agentname){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = vr_agentuid
            this.deleteName = vr_agentname
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'file-source-edit-panel': FileSourceEditPanel,
        'file-source-add-window': FileSourceAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'check-box-icon': CheckBoxIcon
    }
}
</script>

