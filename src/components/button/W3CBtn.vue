<template>
    <button :class="_btnClassList" :style="_btnFontWeight" @click="onClick">
        <slot></slot>
    </button>
</template>

<script>
export default {
    computed: {
        _btnClassList() {
            return [
                'w3-btn',
                this._btnHoverColor,
                this._btnBlock,
                this._btnDisabled,
                this._btnRound,
                this._btnBgColor,
                this._btnSize,
                this._btnBorderColor
            ];
        },
        _btnBlock() {
            return this.btnBlock ? `w3-block` : '';
        },
        _btnDisabled() {
            return this.btnDisabled ? `w3-disabled` : '';
        },
        _btnRound() {
            return this.btnRound !== null ? `w3-round-${this.btnRound}` : '';
        },
        _btnBgColor() {
            return this.btnBgColor !== null ? `w3-${this.btnBgColor}` : '';
        },
        _btnSize() {
            return this.btnSize !== null ? `w3-${this.btnSize}` : '';
        },
        _btnFontWeight() {
            return this.btnFontWeight !== null ? `font-weight: ${this.btnFontWeight}` : '';
        },
        _btnBorderColor() {
            return this.btnBorderColor !== null ? `w3-border w3-border-${this.btnBorderColor}` : '';
        },
        _btnHoverColor() {
            return this.btnHoverColor !== null ? `w3-hover-${this.btnHoverColor}` : '';
        }
    },
    props: {
        btnBlock: {
            type: Boolean,
            default: false
        },
        btnDisabled: {
            type: Boolean,
            default: false
        },
        btnRound: {
            type: String,
            default: null
        },
        btnBgColor: {
            type: String,
            default: null
        },
        btnSize: {
            type: String,
            default: null
        },
        btnFontWeight: {
            type: String,
            default: null
        },
        btnBorderColor: {
            type: String,
            default: null
        },
        btnHoverColor: {
            type: String,
            default: null
        }
    },
    methods: {
        onClick(e) {
            if (!this.disabled) {
                this.$emit('click', e);
            } else {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
};
</script>
<style scoped>
@media (max-width: 34em) {
    button {
        font-size: 0.75em;
        font-size: 3.5vw;
    }
}
</style>