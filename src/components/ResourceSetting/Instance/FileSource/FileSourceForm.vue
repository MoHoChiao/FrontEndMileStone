<template>
    <div class="w3-container w3-small">
        <div v-if="urlOp === 'add' || urlOp === 'edit'" class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.filesourcename" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
        </div>
        <div v-else class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m4">
                <input :class="inputClassList.name" v-model="new_content.filesourcename" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Category</label>
            </div>
            <div class="w3-col m3">
                <select :class="inputClassList.fscategoryuid" v-model="fscategoryuid" style="padding:0px">
                    <option value="" selected>/</option>
                    <template v-for="category in allCategoryObjs">
                        <option :value="category.fscategoryuid">{{ category.fscategoryname }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:6px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Directory <span class="w3-hide-medium w3-hide-small">Asign</span></div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">File Design</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(2)">
                <div :class="tabsClass[2]">Job Trigger</div>
            </a>
        </div>

        <div v-show="tabsFlag[0]" class="w3-container" style="overflow:auto;max-height:300px;min-height:300px">
            <directory-asign-form ref="directoryAsignForm" :content="new_content.directoryAsign"></directory-asign-form>
        </div>

        <div v-show="tabsFlag[1]" class="w3-container" style="overflow:auto;max-height:300px;min-height:300px">
            <file-design-form ref="fileDesignForm" :content="new_content.fileDesign"></file-design-form>
        </div>

        <div v-show="tabsFlag[2]" class="w3-container" style="overflow:auto;max-height:300px;min-height:300px">
            <job-trigger-form ref="jobTriggerForm" :content="new_content.jobTrigger"></job-trigger-form>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import DirectoryAsignForm from './DirectoryAsignForm.vue'
import FileDesignForm from './FileDesignForm.vue'
import JobTriggerForm from './JobTriggerForm.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-third tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-third tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-third tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false, false],
            inputClassList: {
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border'],
                fscategoryuid: ['w3-select','w3-border','w3-round']
            },
            fscategoryuid: '',  //store categoryuid for copy/move operation
            allCategoryObjs: new Object(), //store all remote data.(File Source Categories) for copy/move operation
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                filesourceuid: this.content.filesourceuid,
                filesourcename: this.content.filesourcename,
                description: this.content.description,
                directoryAsign: {
                    rootdir: this.content.rootdir,
                    receivedir: this.content.receivedir,
                    targetdir: this.content.targetdir,
                    completedir: this.content.completedir,
                    corruptdir: this.content.corruptdir,
                    duplicatedir: this.content.duplicatedir,
                    errordir: this.content.errordir
                },
                fileDesign: {
                    filename: this.content.filename,
                    pattern: this.content.pattern,
                    startposition: this.content.startposition,
                    endposition: this.content.endposition,
                    filetype: this.content.filetype,
                    cfImpClass: this.content.cfImpClass,
                    datafilecountmode: this.content.datafilecountmode,
                    checkduplicate: this.content.checkduplicate,
                    filterduplicate: this.content.filterduplicate,
                    checksum: this.content.checksum,
                    checksumalg: this.content.checksumalg,
                    checksumfe: this.content.checksumfe,
                    minfile: this.content.minfile,
                    maxfile: this.content.maxfile,
                    timeout: this.content.timeout,
                    bypasszero: this.content.bypasszero,
                    appendUid: this.content.appendUid,
                    ftpget: this.content.ftpget,
                    sftp: this.content.sftp,
                    ftpbinary: this.content.ftpbinary,
                    passive: this.content.passive,
                    ftpconnectionuid: this.content.ftpconnectionuid,
                    ftppostaction: this.content.ftppostaction,
                    ftpremotedir: this.content.ftpremotedir,
                    ftpmovedir: this.content.ftpmovedir,
                    checkrow: this.content.checkrow    //此值不知道作用, 似乎永遠都是0
                },
                jobTrigger: {
                    filetrigger: this.content.filetrigger,
                    txdateformat: this.content.txdateformat,
                    triggerjobuid: this.content.triggerjobuid,
                    txdatestartpos: this.content.txdatestartpos,
                    txdateendpos: this.content.txdateendpos
                }
            }
        }
    },
    created() {
        if(this.urlOp === 'copy' || this.urlOp === 'move'){
            this.getCategories()    //取得所有可供選擇的file source categories

            if(this.urlOp === 'copy'){
                //copy動作, 把name和description設空值
                this.new_content.filesourcename = ''
                this.new_content.description = ''
            }else if(this.urlOp === 'move'){
                // this.tabsFlag.fill(false)    //disable all tabs, because of move operation can not be modified
            }
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    filesourceuid: '',
                    filesourcename: '',
                    description: '',
                    rootdir: '',
                    receivedir: '',
                    targetdir: '',
                    completedir: '',
                    corruptdir: '',
                    duplicatedir: '',
                    errordir: '',
                    filename: '',
                    pattern: '1',
                    startposition: 0,
                    endposition: 0,
                    filetype: 'D',
                    cfImpClass: 'com.netpro.filesource.ctrl.MatchFileSizeCtrlFileHandler',
                    datafilecountmode: 'R',
                    checkduplicate: 0,
                    filterduplicate: '1',
                    checksum: 0,
                    checksumalg: 'M',
                    checksumfe: '.checksum',
                    minfile: 1,
                    maxfile: 5,
                    timeout: 3,
                    bypasszero: 0,
                    appendUid: 0,
                    ftpget: 0,
                    sftp: 0,
                    ftpbinary: 0,
                    passive: 0,
                    ftpconnectionuid: '',
                    ftppostaction: '0',
                    ftpremotedir: '',
                    ftpmovedir: '',
                    checkrow: 0,
                    filetrigger: 0,
                    triggerjobuid: '',
                    txdateformat: '',
                    txdatestartpos: 0,
                    txdateendpos: 0
                }
            }
        },
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        openTab(whichTab) {
            for (let i = 0; i < this.tabsFlag.length; i++) {
                this.$set(this.tabsFlag, i, false)
            }
            this.$set(this.tabsFlag, whichTab, true)

            for (let i = 0; i < this.tabsClass.length; i++) {
                this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
            }
            this.$set(this.tabsClass, whichTab, this.tabsClass[whichTab] + " w3-border-theme")
        },
        save(){
            this.clearInValid()
            
            //check form value
            if(this.new_content.filesourcename === undefined || this.new_content.filesourcename.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
                return
            }
            
            //collect basic necessary value
            let returnValue = {
                "filesourceuid":this.new_content.filesourceuid,
                "filesourcename":this.new_content.filesourcename,
                "description":this.new_content.description
            }
            
            //fscategoryuid這個值只為了如果是move/copy的情況下, 需要把值傳回去前個元件, 才能知道目前選擇的是那一個category
            if(this.fscategoryuid && this.fscategoryuid.trim().length > 0)
                returnValue.fscategoryuid = this.fscategoryuid

            //call Directory Asign form to check value
            let directoryAsignContent = this.$refs.directoryAsignForm.save()
            //collect all necessary value from Directory Asign form
            if(directoryAsignContent){
                for(let key in directoryAsignContent){
                    returnValue[key] = directoryAsignContent[key]
                }
            }else{
                this.openTab(0)
                return
            }

            //call File Design form to check value
            let fileDesignContent = this.$refs.fileDesignForm.save()
            //collect all necessary value from File Design form
            if(fileDesignContent){
                for(let key in fileDesignContent){
                    returnValue[key] = fileDesignContent[key]
                }
            }else{
                this.openTab(1)
                return
            }
            
            //call Job Trigger form to check value
            let jobTriggerContent = this.$refs.jobTriggerForm.save()
            //collect all necessary value from Job Trigger form
            if(jobTriggerContent){
                for(let key in jobTriggerContent){
                    returnValue[key] = jobTriggerContent[key]
                }
            }else{
                this.openTab(2)
                return
            }

            return returnValue
        },
        reset(){
            //clear red font
            this.clearInValid()

            //reset value to initial
            this.new_content.filesourceuid = this.content.filesourceuid
            if(this.urlOp === 'copy'){  //如果是copy動作,它的reset不能恢復name及description,要讓它們維持空字串
                this.new_content.filesourcename = ''
                this.new_content.description = ''
            }else{
                this.new_content.filesourcename = this.content.filesourcename
                this.new_content.description = this.content.description
            }

            //call child form to reset value to initial
            this.$refs.directoryAsignForm.reset()
            this.$refs.fileDesignForm.reset()
            this.$refs.jobTriggerForm.reset()
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.desc.splice(2, 1)
        },
        getCategories(){
            let params = {
                "ordering":{
                    "orderType":"ASC",
                    "orderField":"fscategoryname"
                }
            }

            HTTPRepo.post(`file-source-category/findByFilter`, params)
            .then(response => {
                this.allCategoryObjs = response.data
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
        'directory-asign-form': DirectoryAsignForm,
        'file-design-form': FileDesignForm,
        'job-trigger-form': JobTriggerForm
    }
}
</script>
<style scoped>
    input, select {
        height: 30px
    }
</style>
