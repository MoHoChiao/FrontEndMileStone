<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <agent-form v-if="urlOp === 'add'" slot="content" ref="agentForm" @save="save"></agent-form>
        <agent-form v-else slot="content" ref="agentForm" :content="content" :urlOp="urlOp" @save="save"></agent-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import ModalWindow from '../../../Common/window/ModalWindow.vue'
    import JCSAgentForm from './JCSAgentForm.vue'
    import FormButton from '../../FormButton.vue'

    export default {
        computed: {
            windowTitle() {
                if (this.urlOp === 'add')
                    return 'Add JCS Agent'
                else if (this.urlOp === 'edit')
                    return 'Edit JCS Agent'
                else if (this.urlOp === 'copy')
                    return 'Copy JCS Agent'
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
            urlOp: {
                type: String,
                default: 'add'
            },
            content: {
                type: Object,
                default() {
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
            }
        },
        methods: {
            cancel() {
                this.$emit('eClose')
            },
            save() {
                let postContent = this.$refs.agentForm.save()
                let urlPath = this.urlOp

                if (this.urlOp === 'copy') {
                    urlPath = 'add'
                }

                if (postContent) {
                    HTTP_TRINITY.post(`jcsagent/` + urlPath, postContent)
                        .then(response => {
                            if (this.urlOp === 'add') {
                                this.$emit('eAdd', response.data)
                            } else if (this.urlOp === 'copy') {
                                this.$emit('eCopy', postContent.agentuid, response.data)
                            } else if (this.urlOp === 'edit') {
                                this.$emit('eEdit', response.data)
                            }
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                }
            },
            reset() {
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