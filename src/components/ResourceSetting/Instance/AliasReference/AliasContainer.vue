<template>
<div>
  <confirm-delete-window :windowAlive="deleteWindowAlive" 
                    :deleteName="deleteName" 
                    window-title="Confirm window" 
                    window-bg-color="highway-schoolbus"
                    btn-color="signal-white" 
                    @closeDelete="changeDeleteWindowStatus" 
                    @confirmDelete="deleteAlias" 
  ></confirm-delete-window>
  <permission-window :windowAlive="applyPermissionWindowAlive" 
                    window-title="Apply Permission To "
                    :objectUid="selectedRecord.parentuid + selectedRecord.aliasname" 
                    :objectName="selectedRecord.aliasname" 
                    whichForm="USE"
                    @closeApply="changePermissionWindowStatus" 
  ></permission-window>
  <router-view name="content">
  <!--Global Alias Reference組件內容會在這裡渲染-->
  </router-view>
  <div class="w3-col m7 w3-animate-opacity">
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Alias Reference</i>
                        <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                        <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                        <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getEntities"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showMode">
        <div :key="content.busentityuid+'table'" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allEntityObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/entity.png" alt="Entity Name" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.busentityname }}</p>
                <br>
                <div v-if="content.alias.length > 0">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all w3-small">
                            <tr class="w3-teal">
                                <th class="w3-center" width="25%">Alias Name</th>
                                <th class="w3-center" width="10%">Type</th>
                                <th class="w3-center" width="27%">Target</th>
                                <th class="w3-center" width="30%">Description</th>
                                <th class="w3-center" width="8%">Permission</th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px;word-break:break-all">
                        <table class="w3-table-all w3-small">
                            <tr :key="list_info.parentuid+':'+list_info.aliasname" v-for="(list_info, list_index) in content.alias">
                                <td class="w3-center" width="25%"><span>{{ list_info.aliasname }}</span></td>
                                <td class="w3-center" width="10%">
                                    <span v-if="list_info.aliastype == 'Agent'" class="w3-badge w3-red" title="Agent">A</span>
                                    <span v-if="list_info.aliastype == 'Connection'" class="w3-badge w3-indigo" title="Connection">C</span>
                                    <span v-if="list_info.aliastype == 'Domain'" class="w3-badge w3-flat-turquoise" title="Domain">D</span>
                                    <span v-if="list_info.aliastype == 'Filesource'" class="w3-badge w3-dark-grey" title="Filesource">F</span>
                                    <span v-if="list_info.aliastype == 'Frequency'" class="w3-badge w3-grey" title="Frequency">F</span>
                                </td>
                                <td class="w3-center" width="27%"><span>{{ list_info.objectname }}</span></td>
                                <td width="30%"><span>{{ list_info.description }}</span></td>
                                <td class="w3-center" width="8%" style="padding-top:3px;padding-bottom:0px">
                                    <i class="fa fa-universal-access w3-button w3-hover-none" title="Apply Use Permission to Alias" 
                                        aria-hidden="true" @click="changePermissionWindowStatus(list_info)"></i>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <hr class="w3-border-black w3-clear">
                <p class="w3-small">{{ content.description }}</p>
                <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i> Edit</button>
                <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.busentityuid, content.busentityname)">
                    <i class="fa fa-trash-o"></i> Delete</button>
            </div>
            <alias-table-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></alias-table-edit-panel>
        </div>
    </div>
    <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
        <li :key="content.busentityuid+'list'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allEntityObjs">
            <div v-if="editable[index] === undefined || !editable[index]">
                <img src="/src/assets/images/resource_setter/entity.png" alt="Entity Name" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                <p>{{ content.busentityname }}</p>
                <button title="Delete This Alias Reference" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.busentityuid, content.busentityname)">
                    <i class="fa fa-trash-o"></i>
                    <span class="w3-hide-medium w3-hide-small"> Delete</span>
                </button>
                <button title="Edit This Alias Reference" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                    <i class="fa fa-pencil"></i>
                    <span class="w3-hide-medium w3-hide-small"> Edit</span>
                </button>
            </div>
            <alias-table-edit-panel v-else :index="index" :content="content" @closeEdit="changeEditable"></alias-table-edit-panel>
        </li>
    </ul>
  </div>
  <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getEntities"></filter-panel>
</div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import AliasTableEditPanel from './AliasTableEditPanel.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import PermissionWindow from '../../PermissionSetting/PermissionWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add virtual agent modal windows
            deleteWindowAlive: false,  //for delete virtual agent modal windows
            applyPermissionWindowAlive: false, //for modify Permission modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allEntityObjs: [], //store all Entities
            editable: [],   //for all virtual agents content edit panel
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "busentityname"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "busentityname"},
                {name: "Desc",value: "Description"}
            ],
            selectedRecord: new Object()   //store which Alias has been clicked.
        }
    },
    mounted() {
        this.getEntities()
    },
    methods: {
        getEntities(e){
            let params = {
                "paging":{
                    "number":this.$refs.filter.selectedNum,
                    "size":this.$refs.filter.selectedSize
                }
            }
            
            if(this.$refs.filter.isOrder){
                params.ordering = {
                    "orderType":this.$refs.filter.orderType,
                    "orderField":this.$refs.filter.orderField
                }
            }

            if(this.$refs.filter.isQuery){
                params.querying = {
                    "queryType":this.$refs.filter.queryType,
                    "queryField":this.$refs.filter.queryField,
                    "queryString":this.$refs.filter.queryString,
                    "ignoreCase":this.$refs.filter.ignoreCase
                }
            }

            HTTP_TRINITY.post(`busentity/findByFilter?withAlias=true`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allEntityObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allEntityObjs = response.data
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

                errorHandle(this.$store, error)
            })
        },
        changeEditable(index, content){
            /*
                this.$set is for above :
                http://www.jianshu.com/p/358c1974d9a5
                https://jsfiddle.net/qnq2munr/2/
            */
            if(this.editable[index] === undefined){
                this.$set(this.editable, index, true) 
            }else{
                this.$set(this.editable, index, !this.editable[index])
            }
            
            if(content !== undefined){
                this.allEntityObjs[index].alias = content
            }
        },
        deleteAlias(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            if(this.allEntityObjs[this.deleteIndex].alias.length <= 0){
                this.changeDeleteWindowStatus(-1, '', '')
                return
            }

            HTTP_TRINITY.get(`objectalias/deleteByParentUid`, {
                params: {
                    parentUid: this.deleteUid
                }
            })
            .then(response => {
                this.allEntityObjs[this.deleteIndex].alias = []
                console.log('delete')
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '', '')
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
            
        },
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeDeleteWindowStatus(index, busentityuid, busentityname){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = busentityuid
            this.deleteName = 'all aliases under ' + busentityname
        },
        changePermissionWindowStatus(record){
            if(record){
                this.selectedRecord = record
                this.selectedRecord.parentuid = this.selectedRecord.parentuid.trim()
            }

            this.applyPermissionWindowAlive = !this.applyPermissionWindowAlive
        }
    },
    components: {
        'filter-panel': FilterPanel,
        'alias-table-edit-panel': AliasTableEditPanel,
        'confirm-delete-window': ConfirmDeleteWindow,
        'permission-window': PermissionWindow
    }
}
</script>