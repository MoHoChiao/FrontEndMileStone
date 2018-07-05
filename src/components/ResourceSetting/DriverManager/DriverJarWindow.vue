<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div slot="content" class="loading-area">
            <over-lay-loading-div loadingSize="60px" textSize="16px">
                <div slot="content">
                    <driver-jar-panel  
                        :driverName="driverName" :jarFiles="jarFiles" @changeLoadingStatus="changeLoadingStatus"
                    ></driver-jar-panel>
                </div>
            </over-lay-loading-div>
        </div>
        <div slot="footer"></div>
    </modal-window>
</template>
<script>
import ModalWindow from '../../Common/window/ModalWindow.vue'
import DriverJarPanel from './DriverJarPanel.vue'
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
        driverName: '',
        jarFiles: {
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
        'driver-jar-panel': DriverJarPanel,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>
<style scoped>
    .loading-area {
        position: relative
    }
</style>