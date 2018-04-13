<template>
    <over-lay-loading-div ref="loadingDIV">
        <div slot="content">
            <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
                <p class="w3-large" slot="content">
                    Do you really want to delete {{ deleteName }} ? 
                </p>
                <div slot="footer">
                    <div class="w3-row w3-small">
                        <button type="button" :class="classList" style="margin-right:3px" @click="confirm"><i class="fa fa-check-circle-o"></i> Sure</button>
                        <button type="button" :class="classList" style="margin-right:3px" @click="cancel"><i class="fa fa-ban"></i> Cancel</button>
                    </div>
                </div>
            </modal-window>
        </div>
    </over-lay-loading-div>
</template>
<script>
import ModalWindow from '../Common/window/ModalWindow.vue'
import OverlayLoadingDIV from '../Common/Loading/OverlayLoadingDIV.vue'

export default {
    computed: {
        classList() {
            return [
                'w3-button',
                'w3-right',
                'w3-round',
                this._btnColor
            ];
        },
        _btnColor() {
            return this.btnColor !== null ? `w3-${this.btnColor}` : '';
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
        btnColor: {
            type: String,
            default: 'theme-d2'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        deleteName: {
            type: String,
            default: ''
        }
    },
    methods: {
        onValidate(e) {
            
        },
        cancel(){
            this.$emit('closeDelete')
        },
        confirm(){
            this.$emit('confirmDelete')
        },
        overLayLoading(isLoading){
            console.log(this.$refs.loadingDIV.isLoading)
            if(isLoading)
                this.$refs.loadingDIV.loadingText = 'Delete ' + this.deleteName + '...'
            this.$refs.loadingDIV.isLoading = isLoading
            console.log(this.$refs.loadingDIV.isLoading)
        }
    },
    components: {
        'modal-window': ModalWindow,
        'over-lay-loading-div': OverlayLoadingDIV
    }
}
</script>