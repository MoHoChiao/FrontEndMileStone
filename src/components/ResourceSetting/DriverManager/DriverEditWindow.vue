<template>
    <modal-window v-if="windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div slot="content">
            <driver-edit-form ref="driverEditForm" :content="content" :driverClassList="driverClassList"></driver-edit-form>
            <hr class="w3-border-grey">
            <form-button :btn-margin-bottom="true" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import ModalWindow from '../../Common/window/ModalWindow.vue'
    import DriverEditForm from './DriverEditForm.vue'
    import FormButton from '../FormButton.vue'
    import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'
    import { wait, NON_SPEED, SLOW_SPEED, FAST_SPEED } from '../../../util_js/utils';

    export default {
        components: {
            'modal-window': ModalWindow,
            'driver-edit-form': DriverEditForm,
            'form-button': FormButton,
            'over-lay-loading-div': OverlayLoadingDIV
        },
        computed: {
            windowTitle() {
                return 'Edit Driver - ' + this.content.name
            }
        },
        data() {
            return {
                loadingText: '',
                isLoading: false
            }
        },
        props: {
            driverClassList: {
                type: Array,
                default: () => []
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
                default() {
                    return {
                        name: '',
                        url: '',
                        driver: '',
                        owner: ''
                    }
                }
            }
        },
        methods: {
            cancel() {
                this.$emit('closeEdit')
            },
            save() {
                let postContent = this.$refs.driverEditForm.save()
                console.log('aaa= ' + postContent)
                if (postContent) {
                    HTTP_TRINITY.post(`driver-manager/modifyDriverProp`, postContent)
                        .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s 
                        .then(response => {
                            this.$emit('closeEdit', this.index, response.data)
                            this.isLoading = false
                        })
                        .catch(error => {
                            this.isLoading = false
                            errorHandle(this.$store, error)
                        })
                }
            },
            reset() {
                this.$refs.driverEditForm.reset()
            }
        }
    }
</script>