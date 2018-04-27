<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <file-source-form v-if="urlOp === 'add'" slot="content" ref="fileSourceForm"></file-source-form>
        <file-source-form v-else slot="content" ref="fileSourceForm" :content="content" :urlOp="urlOp"></file-source-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
        
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FileSourceForm from './FileSourceForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add File Source'
            else if(this.urlOp === 'edit')
                return 'Edit File Source'
            else if(this.urlOp === 'copy')
                return 'Copy File Source'
            else if(this.urlOp === 'move')
                return 'Move File Source'
        }
        
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
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
        selectedCategoryRecord: {
            type: Object,
            default () {
                return {
                    fscategoryuid: '',
                    fscategoryname: '',
                    description: ''
                }
            }
        },
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        cancel(){
            if(this.urlOp === 'add')
                this.$emit('closeAdd')
            else if(this.urlOp === 'edit')
                this.$emit('closeEdit')
            else if(this.urlOp === 'copy'){
                this.$emit('closeCopy')
            }else if(this.urlOp === 'move')
                this.$emit('closeMove')
        },
        save(){
            let postContent = this.$refs.fileSourceForm.save()
            
            let urlPath = ''
            if(this.urlOp === 'add'){   //新增一筆file source
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.fscategoryuid && 
                        this.selectedCategoryRecord.fscategoryuid !== ''){  //在某個file source category底下新增一筆file source
                    urlPath = this.urlOp + '?categoryUid=' + this.selectedCategoryRecord.fscategoryuid
                }else{  //在root位置新增一筆file source
                    urlPath = this.urlOp
                }
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的file source
                urlPath = this.urlOp
            } else if(this.urlOp === 'copy'){   //複制一筆已存在的file source, 到某個file source category底下
                /*
                 * 寫死add方法,因為其實copy就等於是add方法的行為
                 * 沒有回傳fscategoryuid則表示是在root底下新增file source, 此時urlPath只需'add'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.fscategoryuid && postContent.fscategoryuid.trim().length > 0)    //當fscategoryuid有值, 表示有選擇某一個category
                        urlPath = 'add?categoryUid=' + postContent.fscategoryuid
                    else    //如果選擇'/'表示根目錄, 只需要add即可
                        urlPath = 'add'
                }
            } else if(this.urlOp === 'move'){   //移動一筆已存在的file source, 到某個file source category底下
                /*
                 * 寫死edit方法,因為其實move就等於是edit方法的行為
                 * 沒有回傳fscategoryuid則表示是把file source移動到root底下, 此時urlPath只需'edit'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.fscategoryuid && postContent.fscategoryuid.trim().length > 0)    //當fscategoryuid有值, 表示有選擇某一個category
                        urlPath = 'edit?categoryUid=' + postContent.fscategoryuid
                    else    //表示選擇'/'表示根目錄, categoryUid代為空字串
                        urlPath = 'edit?categoryUid='
                }
            }else {
                return
            }
            
            if(postContent){
                HTTPRepo.post(`file-source/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }else if(this.urlOp === 'copy'){  //copy operation
                        this.$emit('closeCopy', postContent.fscategoryuid, response.data)
                    }else if(this.urlOp === 'move'){  //move operation
                        this.$emit('closeMove', postContent.fscategoryuid, response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.fileSourceForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'file-source-form': FileSourceForm,
        'form-button': FormButton
    }
}
</script>