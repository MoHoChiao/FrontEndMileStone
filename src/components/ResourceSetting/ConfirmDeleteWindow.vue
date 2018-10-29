<template>
    <modal-window v-if="this.windowAlive" :window-title="_windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <p class="w3-large" slot="content">
            Do you really want to delete {{ deleteName }} ? 
        </p>
        <div slot="footer">
            <div v-if="isLoading" class="w3-row w3-small">
                <button type="button" :class="classList" style="margin-right:3px" disabled><i class="w3-spin fa fa-spinner"></i> OK</button>
                <button type="button" :class="classList" style="margin-right:3px" disabled><i class="w3-spin fa fa-spinner"></i> Cancel</button>
            </div>
            <div v-else class="w3-row w3-small">
                <button type="button" :class="classList" style="margin-right:3px" @click="confirm"><i class="fa fa-check-circle-o"></i> OK</button>
                <button type="button" :class="classList" style="margin-right:3px" @click="cancel"><i class="fa fa-ban"></i> Cancel</button>
            </div>
        </div>
    </modal-window>
</template>
<script>
import ModalWindow from '../Common/window/ModalWindow.vue'

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
        _windowTitle() {
            return this.windowTitle === null || this.windowTitle.trim() === '' ? 'Confirm' : this.windowTitle.trim();
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
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onValidate(e) {
            
        },
        cancel(){
            if(this.isLoading)
                return
            this.$emit('closeDelete')
        },
        confirm(){
            this.$emit('confirmDelete')
        }
    },
    components: {
        'modal-window': ModalWindow
    }
}
</script>