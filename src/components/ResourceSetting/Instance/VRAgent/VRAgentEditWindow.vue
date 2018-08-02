<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <vr-agent-form v-if="urlOp === 'add'" slot="content" ref="vrAgentForm"></vr-agent-form>
        <vr-agent-form v-else slot="content" ref="vrAgentForm" :content="content"></vr-agent-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import VRAgentForm from './VRAgentForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add Virtual Agent'
            else if(this.urlOp === 'edit')
                return 'Edit Virtual Agent - ' + this.content.virtualagentname
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
        //store selected virtual agent
        content: {
            type: Object,
            default () {
                return {
                    virtualagentuid: '',
                    virtualagentname: '',
                    description: '',
                    maximumjob: 5,
                    activate: '0',
                    mode: '0',
                    agentlist: []
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
        },
        save(){
            let postContent = this.$refs.vrAgentForm.save()

            let urlPath = ''
            if(this.urlOp === 'add' || this.urlOp === 'copy'){   //新增或複制一筆Agent
                urlPath = 'add'
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的Agent
                urlPath = 'edit'
            } else {
                return
            }
            
            if(postContent){
                HTTP_TRINITY.post(`vragent/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.vrAgentForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'vr-agent-form': VRAgentForm,
        'form-button': FormButton
    }
}
</script>