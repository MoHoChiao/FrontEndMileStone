<template>
    <div>
        <confirm-delete-window v-if="deleteWindowAlive" :windowAlive="deleteWindowAlive" 
            :deleteName="deleteName" 
            :is-loading="delButtonLoading" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteWindowStatus" 
            @confirmDelete="deleteAttach" 
        ></confirm-delete-window>
        <div class="w3-small">
            <div class="w3-row">
                <!--All Files-->
                <div class="w3-col m12 w3-section">
                    <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                            External Library List
                        </div>
                    </div>
                    <div class="w3-col m12">
                        <div class="w3-row">
                            <div class="w3-col m10">
                                <input :id="'SearchUserInput' + groupuid" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                                    placeholder="Search For Library..." @keyup="searchForUser()">
                            </div>
                            <div class="w3-col m2 w3-border w3-border-camo-black w3-camo-grey w3-center">
                                <form enctype="multipart/form-data" novalidate>
                                    <label>
                                        <i class="fa fa-upload w3-button w3-hover-none" title="Upload Files" aria-hidden="true"></i>
                                        <input type="file" multiple :name="uploadFieldName" 
                                            @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                                            accept=".jar" class="input-file">
                                    </label>
                                </form>
                            </div>
                        </div>
                        <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:102px;word-break:break-all">
                            <table id="filesTable" class="w3-table-all">
                                <tr :id="file.extjaruid" :key="index+'FileListTr'" class="w3-hover-blue-grey w3-hover-opacity" style="cursor: pointer" 
                                    @click="clickOnFile(file.extjaruid, index)" v-for="(file, index) in new_files">
                                <td class="w3-center" width="84%">
                                    {{ file.filename.split('/')[1] }}
                                </td>
                                <td class="w3-center" width="16%" style="padding:3px 0px 0px 0px">
                                    <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                        aria-hidden="true" @click="changeDeleteWindowStatus(index, file)"></i>
                                </td>
                            </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <!--All Rules-->
                <div class="w3-col m12 w3-section">
                    <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                            External Rule List
                        </div>
                    </div>
                    <div class="w3-col m12">
                        <div class="w3-row">
                            <div class="w3-col m10">
                                <input :id="'SearchUserInput' + groupuid" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                                    placeholder="Search For Rule..." @keyup="searchForUser()">
                            </div>
                            <div class="w3-col m2 w3-border w3-border-camo-black w3-camo-grey w3-center">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Apply Members" aria-hidden="true" @click="changeApplyWindowStatus"></i>
                                <i class="fa fa-refresh w3-button w3-hover-none" title="Reload Members" aria-hidden="true" @click="getMembers"></i>
                            </div>
                        </div>
                        <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                            <table id="rulesTable" class="w3-table-all">
                                <tr :key="list_index+'UserListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in applyMembers">
                                    <td class="w3-center" width="84%">
                                        {{ compositionName(list_info) }}
                                    </td>
                                    <td class="w3-center" width="16%" style="padding-top:0px;padding-bottom:0px">
                                        <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                            aria-hidden="true" @click="changeDeleteWindowStatus(list_index, list_info)"></i>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo,HTTPUpload,errorHandle } from '../../../util_js/axios_util';
import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue';
import { upload } from '../../../util_js/file-upload.fake.service'; // fake service
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            delButtonLoading: false,
            new_files: this.files,
            memberUids: [],
            applyWindowAlive: false,
            deleteWindowAlive: false,  //for delete windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            uploadFieldName: 'files',
            uploadedFiles: []
        }
    },
    props:{
        driverName: '',
        files: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    watch: {
        /*
         * 監視父元件的files值
         * 一旦更新時, 則立即把子元件中的new_files也一併更新
        */
        files: function(newValue) {
            this.new_files = newValue
        }
    },
    created(){
        this.new_files.concat(this.new_files)
            this.new_files.concat(this.new_files)
            this.new_files.concat(this.new_files)
    },
    methods: {
        clickOnFile(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedFileRecord(tr)
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                // this.selectedCategoryRecord = this.allCategoryObjs[index]
                // this.selectedCategoryRecord.index = index //New prop is stores which category obj will be deleted in UI
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            // this.getFileSources()   //refresh file sources content
        },
        clearSelectedFileRecord(tr){
            let table = document.getElementById('filesTable')
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有category row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedCategoryRecord = new Object()
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

            this.delButtonLoading = true
            HTTPRepo.get('driver-manager/deleteJarFile?driverName='+this.driverName+'&jarName='+this.deleteUid)
            .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
            .then(response => {
                this.new_files.splice(this.deleteIndex, 1)
                this.delButtonLoading = false
                this.changeDeleteWindowStatus()
            })
            .catch(error => {
                this.delButtonLoading = false
                errorHandle(this.$store, error)
            })
        },
        filesChange(fieldName, fileList) {
            // handle file changes
            var formData = new FormData()

            if (!fileList.length) return

            // append the files to FormData
            Array
            .from(Array(fileList.length).keys())
            .map(x => {
                formData.append(fieldName, fileList[x], fileList[x].name);
            });

            // preview it
            this.filesPreview(formData);
        },
        filesPreview(formData) {
            upload(formData)
            .then(x => {
                this.uploadedFiles = [].concat(x);

                if(this.uploadedFiles.length <= 0){
                    let newStatus = {
                        "msg": "The number of jar files cannot be equal to zero!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    return
                }

                var sizeCount = 0
                for(let i=0;i<this.uploadedFiles.length;i++){
                    if(this.uploadedFiles[i].originalName.indexOf('jar') === -1){
                        let newStatus = {
                            "msg": "Uploaded file can only be jar file!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }

                    if(Math.round(this.uploadedFiles[i].size / 1024 / 1024) > 10){
                        let newStatus = {
                            "msg": "Each file must be less than 10MB!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }

                    sizeCount += this.uploadedFiles[i].size
                    if(Math.round(sizeCount / 1024 / 1024) > 50 ){
                        let newStatus = {
                            "msg": "The number of File capacity cannot be greater than 50MB!",
                            "status": "Warn"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                        return
                    }
                }

                //above for DriverContainer.vue overlay
                this.$parent.new_loadingText = "Upload " + this.uploadedFiles.length + " File(s)..."
                this.$parent.new_isLoading = true
                //above for DriverJarWindow.vue overlay
                this.$emit('changeLoadingStatus',true)

                
                this.filesUpload(formData)
            })
            .catch(error => {
                this.$parent.new_isLoading = false
                errorHandle(this.$store, error)
            });
        },
        filesUpload(formData){
            HTTPUpload.post(`driver-manager/addJarFileByDriverName?driverName=`+this.driverName, formData)
                .then(wait(FAST_SPEED)) // DEV ONLY: wait for 0.5s 
                .then(response => {
                    if(response.data.fileNameList){
                        for(let i=0;i<response.data.fileNameList.length;i++){
                            let fileName = response.data.fileNameList[i]
                            if(!this.new_files.includes(fileName))
                                this.new_files.unshift(fileName)
                        }
                    }

                    //above for DriverContainer.vue overlay
                    this.$parent.new_isLoading = false
                    //above for DriverJarWindow.vue overlay
                    this.$emit('changeLoadingStatus',false)

                    var filesContainer = this.$el.querySelector("#filesContainer")
                    filesContainer.scrollTop = -filesContainer.scrollTop
                })
                .catch(error => {
                    //above for DriverContainer.vue overlay
                    this.$parent.new_isLoading = false
                    //above for DriverJarWindow.vue overlay
                    this.$emit('changeLoadingStatus',false)

                    errorHandle(this.$store, error)
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
    .input-file {
        opacity: 0; /* invisible but it's there! */
        width: 0px;
        height: 0px;
        position: absolute;
        visibility:hidden
    }
</style>

