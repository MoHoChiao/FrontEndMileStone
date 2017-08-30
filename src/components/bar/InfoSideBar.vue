<template>
    <div>
        <span :class="_btnClassList" @click="onBar">
            &#9776;
        </span>
        <div v-if="alive" :class="_sideBarClassList" @mouseleave="onBar" style="width:160px">
           
            <h3 class="w3-bar-item InfoTile">Language</h3>
            <button class="w3-button w3-block InfoSubTile" @click="setLanguage('en')">English</button>
            <button class="w3-button w3-block InfoSubTile" @click="setLanguage('tw')">繁體中文</button>
            <button class="w3-button w3-block InfoSubTile" @click="setLanguage('cn')">简体中文</button>
            <h3 class="w3-bar-item InfoTile">Resource</h3>
            <button class="w3-button w3-block InfoSubTile" @click="setLanguage('en')">About</button>
            <button class="w3-button w3-block InfoSubTile" @click="setLanguage('en')">Contact</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alive: false,
        }
    },
    computed: {
        _btnClassList() {
            return [
                'w3-button',
                'w3-display-topleft',
                'w3-hover-none',
                'w3-xlarge',
                this._btnBgColor
            ];
        },
        _sideBarClassList() {
            return [
                'w3-sidebar',
                'w3-bar-block',
                'w3-animate-left',
                'w3-card-2',
                ' w3-center-align',
                this._sideBarBgColor
            ];
        },
        _btnBgColor() {
            return this.btnBgColor !== null ? `w3-${this.btnBgColor}` : '';
        },
        _sideBarBgColor() {
            return this.sideBarBgColor !== null ? `w3-${this.sideBarBgColor}` : '';
        }
    },
    props: {
        btnBgColor: {
            type: String,
            default: 'signal-black'
        },
        sideBarBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    methods: {
        onBar(e) {
            this.alive = !this.alive
        },
        setLanguage (val) {
            document.cookie = "trinity_language=" + val + "; path=/"
            this.$i18n.locale = val
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
    h3 {
        font-size: 1.0em;
        font-size: 4.5vw;
    }
}
.InfoTile {
  font-family: 'Limelight', cursive;
}
.InfoSubTile {
  font-family: 'Courgette', cursive;
}
</style>