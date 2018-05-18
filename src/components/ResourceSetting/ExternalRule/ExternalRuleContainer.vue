<template>
    <div>
        <package-add-window v-if="addWindowAlive" 
                            window-title="Add New External Package" 
                            @closeAdd="changeAddWindowStatus" 
        ></package-add-window>
        <confirm-delete-window :windowAlive="deleteWindowAlive" 
                            :deleteName="deleteName" 
                            :is-loading="delButtonLoading" 
                            window-title="Confirm window" 
                            window-bg-color="highway-schoolbus" 
                            btn-color="signal-white" 
                            @closeDelete="changeDeleteWindowStatus" 
                            @confirmDelete="deletePackage" 
        ></confirm-delete-window>
        <files-rules-window v-if="attachWindowAlive" 
                            :window-title="'Attach Rule Files To ' + selectedPackageRecord.packagename" 
                            :packageuid="selectedPackageRecord.packageuid" 
                            :files="selectedPackageRecord.files" 
                            @closeApply="changeJarWindowStatus" 
        ></files-rules-window>
        <div class="w3-col m9 w3-animate-opacity">
            <div class="w3-row-padding">
                <div class="w3-col m12">
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                                <i class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0"> External Rule</i>
                                <i v-if="showMode" class="fa fa-toggle-on w3-button w3-right" title="Switch to Table List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <i v-else class="fa fa-toggle-off w3-button w3-right" title="Switch to Content List" aria-hidden="true" @click="changeShowMode"></i></button>
                                <span class="w3-dropdown-hover w3-right">
                                    <form enctype="multipart/form-data" novalidate>
                                        <label>
                                            <i class="w3-bar-item fa fa-upload w3-button w3-right" title="Import External Rule" aria-hidden="true"></i>
                                            <input type="file" name="file" 
                                                @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                                                accept=".zip" class="input-file">
                                        </label>
                                    </form>
                                </span>
                                <i class="fa fa-plus w3-button w3-right" title="Add New Driver" aria-hidden="true" @click="changeAddWindowStatus()"></i>
                                <i class="fa fa-refresh w3-button w3-right" title="Reload" aria-hidden="true" @click="getPackages"></i>
                                <span class="w3-dropdown-hover w3-right">
                                    <i class="fa fa-search w3-button" title="Search Driver By Name" aria-hidden="true"></i>
                                    <div class="w3-dropdown-content w3-card-4 w3-round w3-bar-block w3-small">
                                        <div class="w3-row w3-panel">
                                            <div class="w3-col m8">
                                                <input class=" w3-input w3-border" v-model="searchText" type="text" maxlength="36" placeholder="Search..">
                                            </div>
                                            <div class="w3-col m4">
                                                <a @click="getPackages" class="w3-button w3-theme-d2">Go</a>
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
                <div :key="content.packageuid" class="w3-container w3-card-4 w3-signal-white w3-round w3-margin loading-area" v-for="(content, index) in allPackageObjs">
                    <over-lay-loading-div  v-if="editable[index] === undefined || !editable[index]" loadingSize="100px" textSize="20px">
                        <div slot="content">
                            <img src="/src/assets/images/resource_setter/package.png" alt="Package" class="w3-left w3-circle w3-margin-right w3-hide-small" style="height:48px;width:48px">
                            <span class="w3-right w3-opacity">{{content.lastupdatetime}}</span>
                            <p>
                                {{ content.packagename }}
                            </p>
                            <files-rules-panel :key="content.packageuid+'FilePanel'" :packageuid="content.packageuid" :files="content.files"></files-rules-panel>
                            <hr class="w3-border-black w3-clear">
                            <p class="w3-small">{{ content.description }}</p>
                            <button type="button" class="w3-button w3-theme-d1 w3-round w3-margin-bottom" @click="changeEditable(index)">
                                <i class="fa fa-pencil"></i> Edit</button>
                            <button type="button" class="w3-button w3-theme-d2 w3-round w3-margin-bottom" @click="changeDeleteWindowStatus(index, content)">
                                <i class="fa fa-trash-o"></i> Delete</button>
                        </div>
                    </over-lay-loading-div>
                    <package-edit-panel v-else :key="content.packageuid+'EditPanel1'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></package-edit-panel>
                </div>
            </div>
            <ul v-else class="w3-ul w3-card-4 w3-round w3-signal-white w3-margin">
                <li :key="content.packageuid+'li'" class="w3-bar w3-border-camo-black loading-area" v-for="(content, index) in allPackageObjs">
                    <div v-if="editable[index] === undefined || !editable[index]">
                        <img src="/src/assets/images/resource_setter/package.png" alt="Package" class="w3-left w3-circle w3-margin-right w3-hide-medium w3-hide-small" style="height:48px;width:48px">
                        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
                        <p>
                            {{ content.packagename }}
                        </p>
                        <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-3deg)">{{ content.description }}</span>
                        <button title="Delete This Package" type="button" class="w3-button w3-theme-d2 w3-round w3-small w3-right" @click="changeDeleteWindowStatus(index, content)">
                            <i class="fa fa-trash-o"></i>
                            <span class="w3-hide-medium w3-hide-small"> Delete</span>
                        </button>
                        <button title="Attach Jar To Package" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeJarWindowStatus(content)">
                            <i class="fa fa-paperclip"></i>
                            <span class="w3-hide-medium w3-hide-small"> Attach</span>
                        </button>
                        <button title="Edit This Package" type="button" class="w3-button w3-theme-d1 w3-round w3-small w3-right" style="margin-right:3px;" @click="changeEditable(index)">
                            <i class="fa fa-pencil"></i>
                            <span class="w3-hide-medium w3-hide-small"> Edit</span>
                        </button>
                    </div>
                    <package-edit-panel v-else :key="content.name+'EditPanel2'" 
                        :index="index" :content="content" @closeEdit="changeEditable"></package-edit-panel>
                </li>
            </ul>
        </div>
        <over-lay-loading :is-loading="allOverlayLoading" :loading-text="allOverlayLoadingText"></over-lay-loading>
    </div>
</template>
<script>
import { HTTPRepo,HTTPDownload,HTTPUpload, errorHandle } from '../../../util_js/axios_util'
import PackageEditPanel from './PackageEditPanel.vue'
import FilesAndRulesPanel from './FilesAndRulesPanel.vue'
import PackageAddWindow from './PackageAddWindow.vue'
import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue'
import FilesAndRulesWindow from './FilesAndRulesWindow.vue'
import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
import OverlayLoading from '../../Common/Loading/OverlayLoading.vue'
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            delButtonLoading: false,    //control the status of delete window buttons 
            allOverlayLoading: false,    //control the status of all page overlay loading
            allOverlayLoadingText: 'Loading',    //control the status of all page overlay loading
            showMode: true, //switch content list or table list
            addWindowAlive: false,  //for add driver modal windows
            attachWindowAlive: false, //for upload jar file modal windows
            publishWindowAlive: false, //for publish driver file modal windows
            deleteWindowAlive: false,  //for delete driver modal windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            allPackageObjs: [], //store all drivers info
            editable: [],   //for all driver content edit panel
            selectedPackageRecord: new Object(),   //store which driver attach button has been clicked.
            searchText: ''
        }
    },
    mounted() {
        this.getPackages()
    },
    methods: {
        getPackages(e){
            let url = 'dm-ext-package/findAll'
            if(this.searchText.trim().length > 0)
                url = 'dm-ext-package/findByName?name=' + this.searchText.trim()
            HTTPRepo.get(url)
            .then(response => {
                this.editable.fill(false) //close all edit form
                this.allPackageObjs = response.data
            })
            .catch(error => {
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
                content.files = this.allPackageObjs[index].files   //由於後端不會再回傳jar files, 因此這裡把舊的代入
                this.allPackageObjs[index] = content
            }
        },
        changeJarWindowStatus(record){
            if(record)
                this.selectedPackageRecord = record
            this.attachWindowAlive = !this.attachWindowAlive
        },
        changePublishWindowStatus(){
            this.publishWindowAlive = !this.publishWindowAlive
        },
        deletePackage(){
            if(this.deleteIndex === -1)
                return
            if(this.deleteUid === '')
                return

            this.delButtonLoading = true
            HTTPRepo.get(`dm-ext-package/delete`, {
                params: {
                    uid: this.deleteUid
                }
            })
            .then(response => {
                this.allPackageObjs.splice(this.deleteIndex, 1)
                this.editable.splice(this.deleteIndex, 1)
                this.editable.fill(false) //close all edit form
                this.delButtonLoading = false
                this.changeDeleteWindowStatus(-1, '')
            })
            .catch(error => {
                this.delButtonLoading = false
                errorHandle(this.$store, error)
            })
        },
        changeShowMode(){
            this.showMode = !this.showMode
        },
        changeAddWindowStatus(content){
            this.addWindowAlive = !this.addWindowAlive
            let index = -1
            if(content !== undefined){
                this.allPackageObjs.unshift(content) //add object to the top of array
                this.editable.fill(false) //close all edit form
                // this.editable.unshift(false)
            }
        },
        changeDeleteWindowStatus(index, p){
            this.deleteWindowAlive = !this.deleteWindowAlive

            /*
                store which obj be delete
            */
            if(p){
                this.deleteIndex = index
                this.deleteUid = p.packageuid
                this.deleteName = p.packagename
            }
        },
        importJDBC(formData){
            this.allOverlayLoadingText = 'Import ZIP File - jdbc.zip...'
            this.allOverlayLoading = true

            HTTPUpload.post(`driver-manager/importDriverZIP`, formData)
            .then(response => {
                this.allOverlayLoading = false
                if(response.data === true){
                    this.allOverlayLoading = false
                    this.getPackages()
                    let newStatus = {
                        "msg": "Import ZIP File - jdbc.zip Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }else{
                    let newStatus = {
                        "msg": "Import jdbc.zip error! Please look at the error log.",
                        "status": "Error"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }
                
            })
            .catch(error => {
                this.allOverlayLoading = false
                errorHandle(this.$store, error)
            });
        },
        filesChange(fieldName, fileList) {
            // handle file changes
            var formData = new FormData()

            if (!fileList.length > 1) return

            // append the files to FormData
            Array
            .from(Array(fileList.length).keys())
            .map(x => {
                formData.append(fieldName, fileList[x], fileList[x].name);
            });

            // preview it
            this.importJDBC(formData);
        }
    },
    components: {
        'package-edit-panel': PackageEditPanel,
        'files-rules-panel': FilesAndRulesPanel,
        'package-add-window': PackageAddWindow,
        'confirm-delete-window': ConfirmDeleteWindow,
        'files-rules-window': FilesAndRulesWindow,
        'over-lay-loading-div': OverlayLoadingDIV,
        'over-lay-loading': OverlayLoading
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
    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 0px;
        height: 0px;
        position: absolute;
        visibility:hidden
    }
</style>

