<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <agent-form v-if="urlOp === 'add'" slot="content" ref="agentForm"></agent-form>
        <agent-form v-else slot="content" ref="agentForm" :content="content" :urlOp="urlOp"></agent-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import JCSAgentForm from './JCSAgentForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add Agent'
            else if(this.urlOp === 'edit')
                return 'Edit Agent - ' + this.content.agentname
            else if(this.urlOp === 'copy')
                return 'Copy Agent from ' + this.content.agentname
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
        //store selected agent
        content: {
            type: Object,
            default () {
                return {
                    agentuid: '',
                    agentname: '',
                    description: '',
                    host: '',
                    port: '',
                    maximumjob: 5,
                    activate: '0',
                    ostype: 'Linux',
                    osname: '',
                    deadperiod: 10,
                    memweight: 1,
                    compresstransfer: '0',
                    encoding: '',
                    monitortime: 6,
                    cpuweight: 2
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
            else if(this.urlOp === 'copy')
                this.$emit('closeCopy')
        },
        save(){
            let postContent = this.$refs.agentForm.save()

            let urlPath = ''
            if(this.urlOp === 'add' || this.urlOp === 'copy'){   //新增或複制一筆Agent
                urlPath = 'add'
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的Agent
                urlPath = 'edit'
            } else {
                return
            }
            
            if(postContent){
                HTTP_TRINITY.post(`jcsagent/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }else if(this.urlOp === 'copy'){  //copy operation
                        this.$emit('closeCopy', response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.agentForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'agent-form': JCSAgentForm,
        'form-button': FormButton
    }
}
</script>