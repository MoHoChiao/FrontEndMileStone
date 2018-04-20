<template>
    <div>
        <div v-if="isLoading" class="w3-row w3-small">
            <button type="button" :class="classList" style="margin-right:3px" disabled><i class="w3-spin fa fa-spinner"></i> Save</button>
            <button type="button" :class="classList" style="margin-right:3px" disabled><i class="w3-spin fa fa-spinner"></i> Cancel</button>
            <button type="button" :class="classList" style="margin-right:3px" disabled><i class="w3-spin fa fa-spinner"></i> Reset</button>
        </div>
        <div v-else class="w3-row w3-small">
            <button type="button" :class="classList" style="margin-right:3px" @click="save"><i class="fa fa-clipboard"></i> Save</button>
            <button type="button" :class="classList" style="margin-right:3px" @click="cancel"><i class="fa fa-ban"></i> Cancel</button>
            <button type="button" :class="classList" style="margin-right:3px" @click="reset"><i class="fa fa-undo"></i> Reset</button>
        </div>
    </div>
    
</template>
<script>
import { HTTPRepo } from '../../axios/http-common'

export default {
    computed: {
        classList() {
            return [
                'w3-button',
                'w3-right',
                'w3-round',
                this._btnColor,
                this._btnMarginBottom
            ];
        },
        _btnColor() {
            return this.btnColor !== null ? `w3-${this.btnColor}` : '';
        },
        _btnMarginBottom() {
            return this.btnMarginBottom ? `w3-margin-bottom` : '';
        }
    },
     props: {
        btnColor: {
            type: String,
            default: 'theme-d2'
        },
        btnMarginBottom: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        cancel(){
            if(this.isLoading)
                return
            this.$emit('cancel')
        },
        save(){
            this.$emit('save')
        },
        reset(){
            this.$emit('reset')
        }
    }
}
</script>