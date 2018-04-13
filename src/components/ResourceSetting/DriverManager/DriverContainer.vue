<template>
    <div>
        <driver-add-window :windowAlive="addWindowAlive" 
                            window-title="Add New Driver" 
                            @closeAdd="changeAddWindowStatus" 
        ></driver-add-window>
        <confirm-delete-window ref="confirmWindow" 
                            :windowAlive="deleteWindowAlive" 
                            :deleteName="deleteName" 
                            window-title="Confirm window" 
                            window-bg-color="highway-schoolbus" 
                            btn-color="signal-white" 
                            @closeDelete="changeDeleteWindowStatus" 
                            @confirmDelete="deleteDriver" 
        ></confirm-delete-window>
        <driver-jar-window :windowAlive="attachWindowAlive" 
                            window-title="Attach Jar To Driver" 
                            :driverName="selectedDriverRecord.name" 
                            :jarFiles="selectedDriverRecord.jarFiles" 
                            @closeApply="changeJarWindowStatus" 
        ></driver-jar-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> Driver Manager</i>
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-file-archive-o w3-button" title="Import/Export/Publish" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block w3-small">
                                        <div>
                                            <i class="w3-bar-item fa fa-upload w3-button w3-right" title="Import Drivers" aria-hidden="true"> Import Drivers</i>
                                            <i class="w3-bar-item fa fa-download w3-button w3-right" title="Export Drivers" aria-hidden="true"> Export Drivers</i>
                                            <i class="w3-bar-item fa fa-share-square w3-button w3-right" title="Publish Drivers" aria-hidden="true"> Publish Drivers</i>
                                        </div>
                                    </div>
                                </span>
                                <i class="fa fa-plus w3-button w3-right" title="Add New Driver" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getDrivers"></i>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-search w3-button" title="Search Driver By Name" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block w3-small">
                                        <div class="w3-row w3-panel">
                                            <div class="w3-col m8">
                                                <input class=" w3-input w3-border" v-model="searchText" type="text" maxlength="36" placeholder="Search..">
                                            </div>
                                            <div class="w3-col m4">
                                                <a @click="getDrivers" class="w3-button w3-theme-d2">Go</a>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showMode">
                <div :key="content.name" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin loading-area" v-for="(content, index) in allDriverObjs">
                    <over-lay-loading-div  v-if="editable[index] === undefined || !editable[index]" ref="loadingDIV">
                        <div slot="content">
                            <img src="/src/assets/images/resource_setter/driver.png" alt="Driver" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                            <span class="w3-right w3-opacity">{{content.owner}}</span>
                            <p>
                                {{ content.name }}
                            </p>
                            <p><span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-3deg)">{{ content.driver }}</span></p>
                            <driver-jar-panel :key="content.name+'JarPanel'" :driverName="content.name" :jarFiles="content.jarFiles"></driver-jar-panel>
                            <br>
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                                <i class="fa fa-pencil"></i> Edit</button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content.name)">
                                <i class="fa fa-trash-o"></i> Delete</button>
                        </div>
                    </over-lay-loading-div>
                    <driver-edit-panel v-else :key="content.name+'EditPanel1'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></driver-edit-panel>
                </div>
            </div>
            <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
                <li :key="content.name+'li'" class="w3-bar w3-border-camo-black loading-area" v-for="(content, index) in allDriverObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/driver.png" alt="Driver" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.owner }}</span>
                        <p>
                            {{ content.name }}
                        </p>
                        <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-3deg)">{{ content.driver }}</span>
                        <button title="Delete This Driver" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content.name)">
                            <i class="fa fa-trash-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Delete</span>
                        </button>
                        <button title="Attach Jar To Driver" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeJarWindowStatus(content)">
                            <i class="fa fa-paperclip"></i>
                            <span class="w3-hide-medium w3-hide-small"> Attach</span>
                        </button>
                        <button title="Edit This Driver" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i>
                            <span class="w3-hide-medium w3-hide-small"> Edit</span>
                        </button>
                    </div>
                    <driver-edit-panel v-else :key="content.name+'EditPanel2'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></driver-edit-panel>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import DriverEditPanel from './DriverEditPanel.vue'
import DriverJarPanel from './DriverJarPanel.vue'
import DriverAddWindow from './DriverAddWindow.vue'
import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue'
import DriverJarWindow from './DriverJarWindow.vue'
import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'

export default {
    data() {
        return {
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add driver modal windows
            attachWindowAlive: false, //for upload jar file modal windows
            deleteWindowAlive: false,  //for delete driver modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allDriverObjs: [], //store all drivers info
            editable: [],   //for all driver content edit panel
            selectedDriverRecord: new Object(),   //store which driver attach button has been clicked.
            searchText: ''
        }
    },
    mounted() {
        this.getDrivers()
    },
    methods: {
        getDrivers(e){
            HTTPRepo.get(`driver-manager/findDriversProp?driverName=` + this.searchText.trim())
            .then(response => {
                this.editable.fill(false) //close all edit form
                this.allDriverObjs = response.data
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
                content.jarFiles = this.allDriverObjs[index].jarFiles   //由於後端不會再回傳jar files, 因此這裡把舊的代入
                this.allDriverObjs[index] = content
            }
        },
        changeJarWindowStatus(record){
            if(record)
                this.selectedDriverRecord = record
            this.attachWindowAlive = !this.attachWindowAlive
        },
        deleteDriver(){
            this.$refs.confirmWindow.overLayLoading(true)
            return
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return

            HTTPRepo.get(`driver-manager/deleteDriverFolderAndProp`, {
                params: {
                    driverName: this.deleteUid
                }
            })
            .then(response => {
                this.allDriverObjs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.changeDeleteWindowStatus(-1, '')
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
        },
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            if(content !== undefined){
                this.allDriverObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, name){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            this.deleteIndex = index
            this.deleteUid = name
            this.deleteName = name
        }
    },
    components: {
        //'filter-panel': FilterPanel,
        'driver-edit-panel': DriverEditPanel,
        'driver-jar-panel': DriverJarPanel,
        'driver-add-window': DriverAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'driver-jar-window': DriverJarWindow,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>
<style scoped>
    input {
        height: 34px
    }
    .loading-area {
        position: relative
    }
</style>

