<template>
<div class="w3-modal" style="display:block">
    <div :class="_classList">
        <header :class="_windowBgColor">
            <span @click="closeModalWindow" class="w3-button w3-hover-none w3-display-topright">
                <i class="fa fa-window-close"></i>
            </span>
            <h4 class="w3-center winTitle">{{ _windowTitle }}</h4>
        </header>
        <div class="w3-padding">
            <slot name="content"></slot>
        </div>
        <footer :class="_windowBgColor">
            <slot name="footer"></slot>
        </footer>
    </div>
</div>
</template>
<script>
export default {
    computed: {
        _windowBgColor() {
            return this.windowBgColor !== null ? `w3-padding w3-${this.windowBgColor}` : 'w3-padding';
        },
        _classList() {
            return [
                'w3-modal-content',
                'w3-card-4',
                'w3-leftbar',
                'w3-rightbar',
                'w3-round-large',
                this._windowAnimations,
                'w3-border-'+this.windowBgColor
            ];
        },
        _windowTitle() {
            return this.windowTitle === null || this.windowTitle.trim() === '' ? 'Modal Window' : this.windowTitle.trim();
        },
        _windowAnimations() {
            return this.windowAnimations === null || this.windowAnimations.trim() === '' ? `w3-animate-top` : `w3-${this.windowAnimations}`;
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
        windowAnimations: {
            type: String,
            default: 'animate-top'
        },
    },
    methods: {
        closeModalWindow(e) {
            this.$emit('closeModalWindow', e);
        }
    }
}
</script>
<style scoped>
@media (max-width: 34em) {
    h4 {
        font-size: 1em;
        font-size: 4.5vw;
    }
}
.winTitle {
  font-family: 'Limelight', cursive;
}
</style>
