<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div slot="content" class="loading-area">
            <over-lay-loading-div loadingSize="60px" textSize="16px">
                <div slot="content">
                    <files-rules-panel  
                        :packageuid="packageuid" :files="files" @changeLoadingStatus="changeLoadingStatus"
                    ></files-rules-panel>
                </div>
            </over-lay-loading-div>
        </div>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../util_js/axios_util'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import FilesAndRulesPanel from './FilesAndRulesPanel.vue'
import OverlayLoadingDIV from '../../Common/Loading/OverlayLoadingDIV.vue'

export default {
    data() {
        return {
            isLoading: false,
        }
    },
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        packageuid: '',
        files: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    methods: {
        cancel(){
            if(this.isLoading)
                return
            this.$emit('closeApply')
        },
        changeLoadingStatus(status){
            this.isLoading = status
        }
    },
    components: {
        'modal-window': ModalWindow,
        'files-rules-panel': FilesAndRulesPanel,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>
<style scoped>
    .loading-area {
        position: relative
    }
</style>