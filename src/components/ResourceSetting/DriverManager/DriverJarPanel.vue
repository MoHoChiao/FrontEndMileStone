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
                <div class="w3-col m12">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all">
                            <tr class="w3-teal">
                                <th class="w3-center" width="80%" style="padding-top:12px;padding-bottom:12px">Jar Name</th>
                                <th class="w3-center" width="20%" style="padding-top:7px;padding-bottom:7px">
                                    <form enctype="multipart/form-data" novalidate>
                                        <label>
                                            <i class="fa fa-upload w3-button w3-hover-none" title="Upload Files" aria-hidden="true"></i>
                                            <input type="file" multiple :name="uploadFieldName" 
                                                @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                                                accept=".jar" class="input-file">
                                        </label>
                                    </form>
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
import { HTTPRepo,HTTPUpload,errorHandle } from '../../../axios/http-common';
import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue';
import { upload } from './file-upload.fake.service'; // fake service
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            delButtonLoading: false,
            new_jarFiles: this.jarFiles,
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
                this.new_jarFiles.splice(this.deleteIndex, 1)
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

                this.$parent.new_loadingText = "Upload " + this.uploadedFiles.length + " File(s)..."
                this.$parent.new_isLoading = true
                
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
                            if(!this.new_jarFiles.includes(fileName))
                                this.new_jarFiles.unshift(fileName)
                        }
                    }
                    this.$parent.new_isLoading = false
                    var jarsContainer = this.$el.querySelector("#jarsContainer")
                    jarsContainer.scrollTop = -jarsContainer.scrollTop
                })
                .catch(error => {
                    this.$parent.new_isLoading = false
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

