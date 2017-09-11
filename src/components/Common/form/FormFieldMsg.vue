<template>
    <div :class="_classList">
        <i class="fa fa-exclamation-triangle w3-animate-opacity">（<slot></slot>）</i>
    </div>
</template>

<script>
export default {
    computed: {
        _classList() {
            return [
                this._color,
                this._inline
            ];
        },
        _inline() {
            return this.inline ? 'w3-show-inline-block' : '';
        },
        _color() {
            return this.color !== null ? `w3-text-${this.color}` : '';
        }
    },
    props: {
        inline: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: 'red'
        }
    }
};
</script>
<style scoped>
@media (max-width: 34em) {
    div {
        font-size: 0.75em;
        font-size: 3.5vw;
    }
}
</style>