<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <excl-frequency-form v-if="urlOp === 'add'" slot="content" ref="exclFreqForm"></excl-frequency-form>
        <excl-frequency-form v-else slot="content" ref="exclFreqForm" :content="content"></excl-frequency-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import ModalWindow from '../../../Common/window/ModalWindow.vue'
    import ExclFrequencyForm from './ExclFrequencyForm.vue'
    import FormButton from '../../FormButton.vue'

    export default {
        components: {
            'modal-window': ModalWindow,
            'excl-frequency-form': ExclFrequencyForm,
            'form-button': FormButton
        },
        //updated() {
        //    console.log('content = ' + JSON.stringify(this.content))
        //},
        computed: {
            windowTitle() {
                if (this.urlOp === 'add')
                    return 'Add Exclude Frequency'
                else if (this.urlOp === 'edit')
                    return 'Edit Exclude Frequency - ' + this.content.excludefrequencyname
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
                default() {
                    return {
                        excludefrequencyuid: '',
                        excludefrequencyname: '',
                        description: '',
                        activate: '',
                        lastupdatetime: '',
                        excludefrequencylist: []
                    }
                }
            },
            urlOp: {
                type: String,
                default: 'add'
            }
        },
        methods: {
            cancel() {
                this.$emit('closeAdd')
            },
            save() {
                let postContent = this.$refs.exclFreqForm.save()

                if (postContent) {
                    HTTP_TRINITY.post(`excl-frequency/` + this.urlOp, postContent)
                        .then(response => {
                            if (this.urlOp === 'add') {
                                this.$emit('closeAdd', response.data)
                            } else if (this.urlOp === 'edit') {
                                this.$emit('closeEdit', response.data)
                            }
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                }
            },
            reset() {
                this.$refs.exclFreqForm.reset()
            }
        }
    }
</script>