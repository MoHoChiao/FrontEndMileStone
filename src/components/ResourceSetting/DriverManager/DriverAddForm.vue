<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Driver Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.name" type="text" 
                    maxlength="128" placeholder="Please Input Driver Name" autocomplete="off">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>JDBC URL</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.url" v-model="new_content.url" type="text" 
                    maxlength="1024" placeholder="Please Input JDBC URL" autocomplete="off">
            </div>
        </div>
        <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving" autocomplete="off">
            <div class="dropbox">
                <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" 
                    @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                    accept=".jar" class="input-file">
                <p v-if="isInitial">
                    Drag Your Jar File(s) here to begin<br> or click to browse
                </p>
                <p v-if="isSaving">
                    Preview {{ fileCount }} Files...
                </p>
            </div>
        </form>
      <!--SUCCESS-->
      <div v-if="isSuccess">
        <p>
          Uploaded {{ uploadedFiles.length }} File(s) Successfully. 
          (<a href="javascript:void(0)" class="w3-text-blue" @click="resetFileUploadObj()">Upload again</a>)
        </p>
        <div class="w3-responsive w3-card w3-round">
            <table class="w3-table-all">
                <tr class="w3-teal">
                    <th class="w3-center" width="70%" style="padding-top:12px;padding-bottom:12px">Jar Name</th>
                    <th class="w3-center" width="30%" style="padding-top:12px;padding-bottom:12px">Jar Size</th>
                </tr>
            </table>
        </div>
        <div id="jarsContainer" class="w3-responsive w3-card w3-round" style="overflow:auto;height:106px;word-break:break-all">
            <table class="w3-table-all">
                <tr :key="index+'JarListTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(item, index) in uploadedFiles">
                    <td class="w3-center" width="70%">
                        {{ item.originalName }}
                    </td>
                    <td class="w3-center" width="30%">
                        {{conversionOfUnits(item.size)}}
                    </td>
                </tr>
            </table>
        </div>
      </div>
      <!--FAILED-->
      <div v-if="isFailed">
        <h2>Uploaded failed.</h2>
        <p>
          <a href="javascript:void(0)" class="w3-text-blue" @click="resetFileUploadObj()">Try again</a>
        </p>
        <pre>{{ uploadError }}</pre>
      </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'
import { upload } from './file-upload.fake.service'; // fake service
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
    data() {
        return {
            inputClassList: {
                name: ['w3-input','w3-border'],
                url: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                name: this.content.name,
                url: this.content.url
            },
            uploadedFiles: [],
            uploadError: null,
            currentStatus: null,
            uploadFieldName: 'files',
            formData: new FormData()
        }
    },
    mounted() {
      this.resetFileUploadObj();
    },
    computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED
      }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    name: '',
                    url: ''
                }
            }
        }
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.name === undefined || this.new_content.name.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else if(this.new_content.url === undefined || this.new_content.url.trim().length <= 0){
                this.inputClassList.url.splice(2, 1, 'w3-red')
            }else{
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

                this.formData.append("driverName", this.new_content.name);
                this.formData.append("driverURL", this.new_content.url);                
                
                return this.formData
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.name = this.content.name
            this.new_content.url = this.content.url

            this.resetFileUploadObj()
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.url.splice(2, 1)
        },
        resetFileUploadObj() {
            // reset form to initial state
            this.currentStatus = STATUS_INITIAL
            this.uploadedFiles = []
            this.uploadError = null
            this.formData = new FormData()
        },
        filesPreview() {
            this.currentStatus = STATUS_SAVING
            upload(this.formData)
            .then(wait(FAST_SPEED)) // DEV ONLY: wait for 0.5s 
            .then(x => {
                this.uploadedFiles = [].concat(x)
                this.currentStatus = STATUS_SUCCESS
                this.$emit('filePreview', false)
            })
            .catch(err => {
                this.uploadError = err.response;
                this.currentStatus = STATUS_FAILED;
                this.$emit('filePreview', false)
            });
        },
        filesChange(fieldName, fileList) {
            this.$emit('filePreview', true)
            
            // handle file changes
            this.formData = new FormData()

            if (!fileList.length) return

            // append the files to FormData
            Array
            .from(Array(fileList.length).keys())
            .map(x => {
                this.formData.append(fieldName, fileList[x], fileList[x].name);
            });

            // preview it
            this.filesPreview();
        },
        conversionOfUnits(size){
            let KB = Math.ceil(size / 1024)
            if(KB >= 1024)
                return Math.round(KB / 1024 * 100) / 100 + ' MB'
            else
                return KB + ' KB'
        }
    }
}
</script>
<style lang="scss">
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }
  
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
  
  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }
  
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
