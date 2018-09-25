<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <p class="w3-large" slot="content">
            Do you really want to {{ _operation }} {{ lockName }} ? 
        </p>
        <div slot="footer">
            <div class="w3-row w3-small">
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
        _btnColor() {
            return this.btnColor !== null ? `w3-${this.btnColor}` : '';
        },
        _operation() {
            return this.lock ? `Lock` : 'Unlock';
        },
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
        lockName: {
            type: String,
            default: ''
        },
        lock: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onValidate(e) {
            
        },
        cancel(){
            this.$emit('closeLock')
        },
        confirm(){
            this.$emit('confirmLock')
        }
    },
    components: {
        'modal-window': ModalWindow
    }
}
</script>