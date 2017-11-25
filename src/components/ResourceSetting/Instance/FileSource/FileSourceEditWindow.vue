<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <file-source-form v-if="this.urlOp === 'add'" slot="content" ref="fileSourceForm"></file-source-form>
        <file-source-form v-else slot="content" ref="fileSourceForm" :content="content"></file-source-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FileSourceForm from './FileSourceForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
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
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let urlOp = 'add'
            if(this.content.filesourceuid && this.content.filesourceuid !== '')
                urlOp = 'edit'

            let postContent = this.$refs.fileSourceForm.save()
            
            if(postContent){
                HTTPRepo.post(`file-source/` + urlOp, postContent)
                .then(response => {
                    if(urlOp === 'add') //add operation
                        this.$emit('closeAdd', response.data)
                    else    //edit operation
                        this.$emit('closeEdit', response.data)   
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