<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <working-calendar-form v-if="urlOp === 'add'" slot="content" ref="wcForm" @save="save"></working-calendar-form>
        <working-calendar-form v-else slot="content" ref="wcForm" :content="content" @save="save" :urlOp="urlOp"></working-calendar-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="picked"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import ModalWindow from '../../../Common/window/ModalWindow.vue'
    import WorkingCalendarForm from './WorkingCalendarForm.vue'
    import FormButton from '../../FormButton.vue'

    export default {
        computed: {
            windowTitle() {
                if (this.urlOp === 'add')
                    return this.$t('Window.Schedule.AddWorkingCal')
                else if (this.urlOp === 'edit')
                    return this.$t('Window.Schedule.EditWorkingCal') + ' - ' + this.content.wcalendarname
                else if (this.urlOp === 'copy')
                    return this.$t('Window.Schedule.CopyWorkingCal') + ' - ' + this.content.wcalendarname
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
                type: Object
            },
            urlOp: {
                type: String,
                default: 'add'
            }
        },
        methods: {
            cancel() {
                if (this.urlOp === 'add')
                    this.$emit('closeAdd')
                else if (this.urlOp === 'edit')
                    this.$emit('closeEdit')
                else if (this.urlOp === 'copy')
                    this.$emit('closeCopy')
                //else if (this.urlOp === 'move')
                //    this.$emit('closeMove')
            },
            picked() {
                this.$refs.wcForm.picked()
            },
            save(postContent) {
                let urlPath = ''
                if (this.urlOp === 'add' || this.urlOp === 'copy') {
                    urlPath = 'add'
                } else if (this.urlOp === 'edit') {
                    urlPath = 'edit'
                } else {
                    return
                }

                if (postContent) {
                    HTTP_TRINITY.post(`working-calendar/` + urlPath, postContent)
                        .then(response => {
                            if (this.urlOp === 'add') { //add operation
                                this.$emit('closeAdd', response.data)
                            } else if (this.urlOp === 'edit') {    //edit operation
                                this.$emit('closeEdit', response.data)
                            } else if (this.urlOp === 'copy') {  //copy operation
                                this.$emit('closeCopy', response.data)
                            }
                        })
                        .catch(error => {
                            errorHandle(this.$store, error)
                        })
                }
            },
            reset() {
                this.$refs.wcForm.reset()
            }
        },
        components: {
            'modal-window': ModalWindow,
            'working-calendar-form': WorkingCalendarForm,
            'form-button': FormButton
        }
    }
</script>