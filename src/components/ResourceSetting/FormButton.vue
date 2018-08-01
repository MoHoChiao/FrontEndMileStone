<template>
    <div>
        <div v-if="isLoading" class="w3-row w3-small">
            <span class="w3-right">
                <button :class="classList" class="fa fa-spinner" @click="reset" title="Reset"></button>
                <button :class="classList" class="fa fa-spinner" @click="cancel" title="Cancel"></button>
                <button :class="classList" class="fa fa-spinner" @click="save" title="Save"></button>
            </span>
        </div>
        <div v-else class="w3-row w3-small">
            <span class="w3-right">
                <button :class="classList" class="fa fa-undo" @click="reset" title="Reset"></button>
                <button :class="classList" class="fa fa-times" @click="cancel" title="Cancel"></button>
                <button :class="classList" class="fa fa-check" @click="save" title="Save"></button>
            </span>
        </div>
    </div>

</template>
<script>

    export default {
        computed: {
            classList() {
                return [
                    'w3-button',
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
                default: 'theme-d1'
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
            cancel() {
                if (this.isLoading)
                    return
                this.$emit('cancel')
            },
            save() {
                this.$emit('save')
            },
            reset() {
                this.$emit('reset')
            }
        }
    }
</script>