<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <package-add-form v-if="urlOp === 'add'" slot="content" ref="packageAddForm"></package-add-form>
        <package-add-form v-else slot="content" ref="packageAddForm" :content="content" :urlOp="urlOp"></package-add-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import ModalWindow from '../../Common/window/ModalWindow.vue'
    import PackageAddForm from './PackageAddForm.vue'
    import FormButton from '../FormButton.vue'

    export default {
        components: {
            'modal-window': ModalWindow,
            'package-add-form': PackageAddForm,
            'form-button': FormButton
        },
        computed: {
            windowTitle() {
                if (this.urlOp === 'add')
                    return this.$t('Window.System.AddPackage')
                else if (this.urlOp === 'edit')
                    return this.$t('Window.System.EditPackage') + ' - ' + this.content.packagename
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
                        packageuid: '',
                        packagename: '',
                        description: ''
                    }
                }
            },
        },
        methods: {
            cancel() {
                this.$emit('close')
            },
            async save() {
                let postContent = await this.$refs.packageAddForm.save()

                if (postContent) {
                    HTTP_TRINITY.post(`dm-ext-package/` + this.urlOp, postContent)
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
                this.$refs.packageAddForm.reset()
            }
        }
    }
</script>