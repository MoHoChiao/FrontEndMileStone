<template>
    <div class="w3-container w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:4px 4px 4px 0px">
                <label class="w3-right">Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.filesourcename" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:4px 4px 4px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Directory <span class="w3-hide-medium">Asign</span></div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">File Design</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(2)">
                <div :class="tabsClass[2]">Job Trigger</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(3)">
                <div :class="tabsClass[3]">FTP <span class="w3-hide-medium">Setting</span></div>
            </a>
        </div>

        <div v-if="tabsFlag[0]" class="w3-container" style="overflow:auto;max-height:350px">
            <directory-asign-form></directory-asign-form>
        </div>

        <div v-if="tabsFlag[1]" class="w3-container" style="overflow:auto;max-height:350px">
            <files-design-form></files-design-form>
        </div>

        <div v-if="tabsFlag[2]" class="w3-container" style="overflow:auto;max-height:350px">
            <h2>Tokyo</h2>
            <p>Tokyo is the capital of Japan.</p>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import DirectoryAsignForm from './DirectoryAsignForm.vue'
import FileDesignForm from './FileDesignForm.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding',
                        'w3-quarter tablink w3-bottombar w3-hover-light-grey w3-padding'],
            tabsFlag: [true, false, false],
            inputClassList: {
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border']
            },
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
                    
                }
            }
        }
    },
    computed: {
       
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    filesourceuid: '',
                    filesourcename: '',
                    description: ''
                }
            }
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
            
            if(this.new_content.fscategoryname === undefined || this.new_content.fscategoryname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-text-red')
            }else{
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.fscategoryuid = this.content.fscategoryuid
            this.new_content.fscategoryname = this.content.fscategoryname
            this.new_content.description = this.content.description
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
        }
    },
    components: {
        'directory-asign-form': DirectoryAsignForm,
        'files-design-form': FileDesignForm
    }
}
</script>
<style scoped>
    input {
        height: 25px
    }
</style>
