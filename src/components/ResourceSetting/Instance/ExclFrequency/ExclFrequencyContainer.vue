<template>
    <div>
        <excl-frequency-add-window :windowAlive="addWindowAlive" 
                            window-title="Add Exclude Frequency" 
                            @closeAdd="changeAddWindowStatus" 
        ></excl-frequency-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive" 
                            :deleteName="deleteName" 
                            window-title="Confirm window" 
                            window-bg-color="highway-schoolbus" 
                            btn-color="signal-white" 
                            @closeDelete="changeDeleteWindowStatus" 
                            @confirmDelete="deleteExclFreq" 
        ></confirm-delete-window>
        <excl-frequency-apply-window :windowAlive="applyWindowAlive" 
                            window-title="Apply Exclude Frequency To Other Object"
                            :applyTimes="selectedExclFreqRecord.excludefrequencylist" 
                            :excludefrequencyuid="selectedExclFreqRecord.excludefrequencyuid" 
                            @closeApply="changeApplyWindowStatus" 
        ></excl-frequency-apply-window>
        <router-view name="content">
        <!--Global Excl Freq Window組件內容會在這裡渲染-->
        </router-view>
        <div class="w3-col m7 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Exclude Frequency</i>
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i class="fa fa-plus w3-button w3-right" title="Add Exclude frequency" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getExclFreq"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode">
                <div :key="content.excludefrequencyuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in allExclFreqObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/exclude_frequency.png" alt="Exclude Frequency" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            <i v-if="content.excludefrequencyuid.trim() === 'global'" class="fa fa-globe fa-fw w3-text-blue"></i>
                            {{ content.excludefrequencyname }}
                        </p>
                        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                        <excl-frequency-apply-panel :key="content.excludefrequencyuid+'ApplyPanel'" 
                            :applyTimes="content.excludefrequencylist" :excludefrequencyuid="content.excludefrequencyuid">
                        </excl-frequency-apply-panel>
                        <hr class="w3-border-black w3-clear">
                        <p class="w3-small">{{ content.description }}</p>
                        <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i> Edit</button>
                        <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.excludefrequencyuid, content.excludefrequencyname)">
                            <i class="fa fa-trash-o"></i> Delete</button>
                    </div>
                    <excl-frequency-edit-panel v-else :key="content.excludefrequencyuid+'EditPanel1'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></excl-frequency-edit-panel>
                </div>
            </div>
            <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
                <li :key="content.excludefrequencyuid+'li'" class="w3-bar w3-border-camo-black" v-for="(content, index) in allExclFreqObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/exclude_frequency.png" alt="Exclude Frequency" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            <i v-if="content.excludefrequencyuid.trim() === 'global'" class="fa fa-globe fa-fw w3-text-blue"></i>
                            {{ content.excludefrequencyname }}
                        </p>
                        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
                        <button title="Delete This Exclude Frequency" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.excludefrequencyuid, content.excludefrequencyname)">
                            <i class="fa fa-trash-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Delete</span>
                        </button>
                        <button title="Apply To Frequency/Job/Flow" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeApplyWindowStatus(content)">
                            <i class="fa fa-hand-lizard-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Apply</span>
                        </button>
                        <button title="Edit This Exclude Frequency" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i>
                            <span class="w3-hide-medium w3-hide-small"> Edit</span>
                        </button>
                    </div>
                    <excl-frequency-edit-panel v-else :key="content.excludefrequencyuid+'EditPanel2'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></excl-frequency-edit-panel>
                </li>
            </ul>
        </div>
        <filter-panel ref="filter" :order-fileds="orderFields" :query-fileds="queryFields" @fromFilter="getExclFreq"></filter-panel>
    </div>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import FilterPanel from '../../FilterPanel.vue'
import ExclFrequencyEditPanel from './ExclFrequencyEditPanel.vue'
import ExclFrequencyApplyPanel from './ExclFrequencyApplyPanel.vue'
import ExclFrequencyAddWindow from './ExclFrequencyAddWindow.vue'
import ConfirmDeleteWindow from '../../ConfirmDeleteWindow.vue'
import ExclFrequencyApplyWindow from './ExclFrequencyApplyWindow.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add Exclude Frequency modal windows
            applyWindowAlive: false, //for modify Exclude Frequency Apply modal windows(Frequency, Job, Flow)
            deleteWindowAlive: false,  //for delete Exclude Frequency modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allExclFreqObjs: [], //store all Exclude Frequency
            editable: [],   //for all Exclude Frequency content edit panel
            selectedExclFreqRecord: new Object(),   //store which excl freq apply button has been clicked.
            orderFields: [  //for ordering filter fields
                {name: "Update Time",value: "lastupdatetime"},
                {name: "Name",value: "excludefrequencyname"},
                {name: "Activate",value: "activate"}
            ],
            queryFields: [  //for querying filter fields
                {name: "Name",value: "excludefrequencyname"},
                {name: "Activate",value: "activate"},
                {name: "Desc",value: "Description"}
            ]
        }
    },
    mounted() {
        this.getExclFreq()
    },
    methods: {
        getExclFreq(e){
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

            HTTP_TRINITY.post(`excl-frequency/findByFilter`, params)
            .then(response => {
                this.editable.fill(false) //close all edit form
                if (response.data.content !== undefined) {
                    this.allExclFreqObjs = response.data.content
                    this.$refs.filter.totalPages = response.data.totalPages
                } else {
                    this.allExclFreqObjs = response.data
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
                this.allExclFreqObjs[index] = content
            }
        },
        changeApplyWindowStatus(record){
            if(record)
                this.selectedExclFreqRecord = record
            this.applyWindowAlive = !this.applyWindowAlive
        },
        deleteExclFreq(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return
            
            HTTP_TRINITY.get(`excl-frequency/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allExclFreqObjs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
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
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            if(content !== undefined){
                this.allExclFreqObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, excludefrequencyuid, excludefrequencyname){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = excludefrequencyuid
            this.deleteName = excludefrequencyname
        },
        
    },
    components: {
        'filter-panel': FilterPanel,
        'excl-frequency-edit-panel': ExclFrequencyEditPanel,
        'excl-frequency-apply-panel': ExclFrequencyApplyPanel,
        'excl-frequency-add-window': ExclFrequencyAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'excl-frequency-apply-window': ExclFrequencyApplyWindow
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

