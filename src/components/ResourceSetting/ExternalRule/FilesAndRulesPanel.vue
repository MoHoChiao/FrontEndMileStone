<template>
    <div>
        <file-edit-window v-if="editFileindowAlive" 
                            :index="this.modifyFileRecord.index" 
                            :modifyFileRecord = "modifyFileRecord" 
                            @closeEdit="closeEditFileWindowStatus" 
        ></file-edit-window>
        <rule-add-window v-if="addRuleWindowAlive" 
                            :filename= "selectedFileRecord.filename" 
                            :modifyRuleRecord = "modifyRuleRecord" 
                            @closeAdd="closeAddRuleWindowStatus" 
        ></rule-add-window>
        <rule-edit-window v-if="editRuleWindowAlive" 
                            :index="this.modifyRuleRecord.index" 
                            :modifyRuleRecord = "modifyRuleRecord" 
                            @closeEdit="closeEditRuleWindowStatus" 
        ></rule-edit-window>
        <confirm-delete-window v-if="deleteLibFileWindowAlive" :windowAlive="deleteLibFileWindowAlive" 
            :deleteName="deleteName" 
            :is-loading="delButtonLoading" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteLibFileWindowStatus" 
            @confirmDelete="deleteLibFile" 
        ></confirm-delete-window>
        <confirm-delete-window v-if="deleteRuleWindowAlive" :windowAlive="deleteRuleWindowAlive" 
            :deleteName="deleteName" 
            :is-loading="delButtonLoading" 
            window-title="Confirm window" 
            window-bg-color="highway-schoolbus" 
            btn-color="signal-white" 
            @closeDelete="changeDeleteRuleWindowStatus" 
            @confirmDelete="deleteRule" 
        ></confirm-delete-window>
        <div class="w3-small">
            <div class="w3-row">
                <!--All Files-->
                <div class="w3-col m12 w3-section">
                    <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;">
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                            External Library List
                        </div>
                    </div>
                    <p/>
                    <div class="w3-col m12">
                        <div class="w3-row">
                            <div class="w3-col m10">
                                <input :id="'SearchFileInput' + packageuid" class="w3-input w3-border w3-border-camo-black w3-grey" type="text" 
                                    placeholder="Search For Library..." @keyup="searchForFile()">
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
                        <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                            <table :id="'filesTable' + packageuid" class="w3-table-all">
                                <tr :id="file.extjaruid" :key="index+'FileListTr'" class="w3-hover-blue-grey w3-hover-opacity" 
                                        v-for="(file, index) in new_files">
                                <td class="w3-center" width="40%" @click="clickOnFile(file.extjaruid, index)" style="cursor: pointer">
                                    {{ file.filename.split('/')[1] }}
                                </td>
                                <td class="w3-center" width="44%" @click="clickOnFile(file.extjaruid, index)" style="cursor: pointer">
                                    {{ file.description }}
                                </td>
                                <td class="w3-center" width="16%" style="padding:3px 0px 0px 0px">
                                    <i class="fa fa-pencil w3-button w3-hover-none" title="Edit" 
                                        aria-hidden="true" @click="clickOnEditFile(index, file)"></i>
                                    <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" 
                                        aria-hidden="true" @click="changeDeleteLibFileWindowStatus(index, file)"></i>
                                </td>
                            </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <!--All Rules-->
                <div v-if="this.selectedFileRecord" class="w3-col m12 w3-section">
                    <div class="w3-tag w3-round w3-blue-grey" style="padding:3px">
                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                            External Rule List
                        </div>
                    </div>
                    <p />
                    <div class="w3-col m12">
                        <div class="w3-row">
                            <div class="w3-col m10">
                                <input :id="'SearchRuleInput' + packageuid" class="w3-input w3-border w3-border-camo-black w3-grey" type="text"
                                       placeholder="Search For Rule Name..." @keyup="searchForRule()">
                            </div>
                            <div class="w3-col m2 w3-border w3-border-camo-black w3-camo-grey w3-center">
                                <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Rule" aria-hidden="true" @click="clickOnAddRule"></i>
                            </div>
                        </div>
                        <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:142px;word-break:break-all">
                            <table :id="'rulesTable' + packageuid" class="w3-table-all">
                                <tr :id="list_info.rulename" :key="list_index+'RuleListTr'" class="w3-hover-blue-grey w3-hover-opacity"
                                    v-for="(list_info, list_index) in rules">
                                    <td class="w3-center" width="30%">
                                        {{ list_info.rulename }}
                                    </td>
                                    <td class="w3-center" width="54%">
                                        {{ list_info.description }}
                                    </td>
                                    <td class="w3-center" width="16%" style="padding-top:0px;padding-bottom:0px">
                                        <i class="fa fa-pencil w3-button w3-hover-none" title="Edit"
                                           aria-hidden="true" @click="clickOnEditRule(list_index, list_info)"></i>
                                        <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete"
                                           aria-hidden="true" @click="changeDeleteRuleWindowStatus(list_index, list_info)"></i>
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
import { HTTP_TRINITY,HTTP_TRINITY_Upload,errorHandle } from '../../../util_js/axios_util';
import FileEditWindow from './FileEditWindow.vue';
import RuleAddWindow from './RuleAddWindow.vue';
import RuleEditWindow from './RuleEditWindow.vue';
import ConfirmDeleteWindow from '../ConfirmDeleteWindow.vue';
import { upload } from '../../../util_js/file-upload.fake.service'; // fake service
import { wait,NON_SPEED,SLOW_SPEED,FAST_SPEED } from '../../../util_js/utils';

export default {
    data() {
        return {
            delButtonLoading: false,
            new_files: this.files,  //store all files in a package
            rules: [],  //store all rules in a file
            editFileindowAlive: false,   //for file edit windows
            addRuleWindowAlive: false,   //for rule add windows
            editRuleWindowAlive: false,   //for rule edit windows
            deleteLibFileWindowAlive: false,  //for lib file delete windows
            deleteRuleWindowAlive: false,  //for rule delete windows
            deleteIndex: -1,    //store which index will be delete
            deleteUid: '',      //store which obj will be delete
            deleteName: '',     //store which obj name will be delete
            uploadFieldName: 'file',
            selectedFileRecord: undefined,  //for keeping which file has been selected
            modifyFileRecord: undefined, //keep file data, for edit one file
            modifyRuleRecord: undefined //keep rule data, for add or edit one rule
        }
    },
    props:{
        packageuid: '',
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
    methods: {
        clickOnFile(id, index){
            let tr = document.getElementById(id)
            this.clearSelectedFileRecord(tr)
            
            if (tr.className.indexOf('w3-blue-grey') == -1) {
                tr.className = 'w3-blue-grey'
                this.selectedFileRecord = new Object()
                this.selectedFileRecord = this.new_files[index]
                this.selectedFileRecord.index = index //New prop stores which File obj will be deleted in UI
                this.getRules()   //get rules
            } else {
                tr.className = 'w3-hover-blue-grey w3-hover-opacity'
            }
        },
        clickOnEditFile(index, file){
            if(file){
                this.modifyFileRecord = file
                this.modifyFileRecord.index = index //傳現在是在編輯那一筆file至Edit Window元件
                this.editFileindowAlive = true
            }
        },
        closeEditFileWindowStatus(index, new_description){
            this.editFileindowAlive = false

            if(new_description){
                this.new_files[index].description = new_description
            }
            this.modifyFileRecord = undefined
        },
        clickOnAddRule(){
            if(this.selectedFileRecord === undefined) 
                    return
            
            HTTP_TRINITY.get('dm-ext-rule/findNonSettingRulesByJarUid?extJarUid=' + this.selectedFileRecord.extjaruid)
            .then(response => {
                this.modifyRuleRecord = new Object()
                this.modifyRuleRecord.extjaruid = this.selectedFileRecord.extjaruid
                this.modifyRuleRecord.non_setting_rules = response.data //傳送未被設定的rule至Add Rule Window元件

                this.addRuleWindowAlive = true
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
        closeAddRuleWindowStatus(new_rule){
            this.addRuleWindowAlive = false

            if(new_rule){
                this.rules.unshift(new_rule)
            }
            this.modifyRuleRecord = undefined
        },
        clickOnEditRule(index, rule){
            if(rule){
                if(this.selectedFileRecord === undefined) 
                    return
            
                this.modifyRuleRecord = rule
                this.modifyRuleRecord.index = index //傳現在是在編輯那一筆rule至Edit Window元件
                this.editRuleWindowAlive = true
            }
        },
        closeEditRuleWindowStatus(index, edited_rule){
            this.editRuleWindowAlive = false

            if(edited_rule){
                this.rules[index] = edited_rule
            }
            this.modifyRuleRecord = undefined
        },
        clearSelectedFileRecord(tr){
            let table = document.getElementById('filesTable' + this.packageuid)
            for(var i=0;i<table.childNodes.length;i++){  //先重設所有category row的class
                if(table.childNodes[i] !== tr)   //等於自己的(即點到的那一列)不用重設
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
            }
            this.selectedFileRecord = undefined
        },
        clearAllSelectedFileRecord(){
            let table = document.getElementById('filesTable' + this.packageuid)
            if(null !== table){
                for(var i=0;i<table.childNodes.length;i++){
                    table.childNodes[i].className = 'w3-hover-blue-grey w3-hover-opacity'
                }
            }
            this.selectedFileRecord = undefined
        },
        getRules(e){
            if(this.selectedFileRecord){
                HTTP_TRINITY.get('dm-ext-rule/findByJarUid?extJarUid=' + this.selectedFileRecord.extjaruid)
                .then(response => {
                    this.rules = response.data
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        changeDeleteLibFileWindowStatus(index, file){
            this.deleteLibFileWindowAlive = !this.deleteLibFileWindowAlive

            /*
                store which obj be delete
            */
            if(file){
                this.deleteIndex = index

                this.deleteUid = file.extjaruid
                this.deleteName = 'Lib File - ' + file.filename
            }else{
                this.deleteIndex = -1
                this.deleteUid = ''
                this.deleteName = ''
            }
        },
        changeDeleteRuleWindowStatus(index, rule){
            this.deleteRuleWindowAlive = !this.deleteRuleWindowAlive

            /*
                store which obj be delete
            */
            if(rule){
                this.deleteIndex = index

                this.deleteUid = rule.rulename
                this.deleteName = 'Rule - ' + rule.rulename
            }else{
                this.deleteIndex = -1
                this.deleteUid = ''
                this.deleteName = ''
            }
        },
        deleteLibFile(){
            if(this.deleteIndex === -1)
                return
            if(!this.deleteUid || this.deleteUid === '')
                return

            this.delButtonLoading = true
            HTTP_TRINITY.get('dm-ext-jar/deleteByJarUid?uid='+this.deleteUid)
            .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
            .then(response => {
                this.new_files.splice(this.deleteIndex, 1)
                this.delButtonLoading = false
                this.changeDeleteLibFileWindowStatus()
                this.clearAllSelectedFileRecord()
            })
            .catch(error => {
                this.delButtonLoading = false
                errorHandle(this.$store, error)
            })
        },
        deleteRule(){
            if(this.deleteIndex === -1)
                return
            if(!this.deleteUid || this.deleteUid === '')
                return
            if(this.selectedFileRecord === undefined || this.selectedFileRecord === null)
                return

            this.delButtonLoading = true
            HTTP_TRINITY.get('dm-ext-rule/deleteByAllPKs?extJarUid='+this.selectedFileRecord.extjaruid+'&ruleName='+this.deleteUid)
            .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
            .then(response => {
                this.rules.splice(this.deleteIndex, 1)
                this.delButtonLoading = false
                this.changeDeleteRuleWindowStatus()
            })
            .catch(error => {
                this.delButtonLoading = false
                errorHandle(this.$store, error)
            })
        },
        filesChange(fieldName, fileList) {
            // handle file changes
            var formData = new FormData()

            if (fileList.length !== 1) return
           
            // append the files to FormData
            Array
            .from(Array(fileList.length).keys())
            .map(x => {
                formData.append(fieldName, fileList[x], fileList[x].name);
            });
            
            //above for DriverContainer.vue overlay
            this.$parent.new_loadingText = "Upload " + fileList[0].name + " ..."
            this.$parent.new_isLoading = true
            //above for DriverJarWindow.vue overlay
            this.$emit('changeLoadingStatus',true)

            // upload it
            this.uploadFile(formData);
        },
        uploadFile(formData){
            HTTP_TRINITY_Upload.post(`dm-ext-jar/add?packageUid=` + this.packageuid, formData)
            .then(wait(FAST_SPEED))
            .then(response => {
                if(response.data){
                    this.new_files.unshift(response.data)
                }

                //above for DriverContainer.vue overlay
                this.$parent.new_isLoading = false
                //above for DriverJarWindow.vue overlay
                this.$emit('changeLoadingStatus',false)

                this.clearAllSelectedFileRecord()

                var filesContainer = this.$el.querySelector("#filesTable" + this.packageuid)
                filesContainer.scrollTop = -filesContainer.scrollTop
            })
            .catch(error => {
                //above for RuleContainer.vue overlay
                this.$parent.new_isLoading = false
                //above for RuleJarWindow.vue overlay
                this.$emit('changeLoadingStatus',false)

                errorHandle(this.$store, error)
            });
        },
        searchForFile() {
            let input, filter, table, i
            input = document.getElementById('SearchFileInput'+this.packageuid)
            filter = input.value.toUpperCase()
            table = document.getElementById('filesTable'+this.packageuid)
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[0].innerHTML
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
            this.clearAllSelectedFileRecord()
        },
        searchForRule() {
            let input, filter, table, i
            input = document.getElementById('SearchRuleInput'+this.packageuid)
            filter = input.value.toUpperCase()
            table = document.getElementById('rulesTable'+this.packageuid)
            for (i = 0; i < table.rows.length; i++) {
                let text = table.rows[i].cells[0].innerHTML
                if (text.toUpperCase().indexOf(filter) > -1) {
                    table.rows[i].style.display = "";
                } else {
                    table.rows[i].style.display = "none";
                }
            }
        }
    },
    components: {
        'confirm-delete-window': ConfirmDeleteWindow,
        'file-edit-window': FileEditWindow,
        'rule-add-window': RuleAddWindow,
        'rule-edit-window': RuleEditWindow
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
        visibility: hidden
    }
</style>

