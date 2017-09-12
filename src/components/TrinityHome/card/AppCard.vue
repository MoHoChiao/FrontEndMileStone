<template>
    <div>
      <div :class="classList" style="min-height:350px">
        <h3 class="appTile">{{ this.title }}</h3>
        <!--"margin: 0 auto" is for centered bootstrap img-responsive-->
        <img class="w3-margin-bottom img-responsive" style="margin: 0 auto" :src="_imgSrc" />
        <ul class="w3-ul appSubTile">
            <li :class="[content.color === undefined ? '':'w3-text-'+content.color]" v-for="content in lists">
                {{ $t(content) }}
            </li>
        </ul>
        <slot></slot>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: this.appTitle,
            lists: this.contentList
        }
    },
    computed: {
        classList() {
            return [
                'w3-card-4',
                'w3-container',
                'w3-hover-shadow',
                'w3-margin-top',
                'w3-margin-bottom',
                'w3-center',
                this._bgColor,
                this._hoverColor,
                this._round
            ];
        },
        _bgColor() {
            return this.bgColor !== null ? `w3-${this.bgColor}` : '';
        },
        _hoverColor() {
            return this.hoverColor !== null ? `w3-hover-${this.hoverColor}` : '';
        },
        _round() {
            return this.round !== null ? `w3-round-${this.round}` : '';
        },
        _imgSrc() {
            return this.imgSrc !== null ? this.imgSrc : '';
        }
    },
    props: {
        appTitle: {
            type: String,
            default: '',
            required: true
        },
        bgColor: {
            type: String,
            default: null
        },
        hoverColor: {
            type: String,
            default: null
        },
        round: {
            type: String,
            default: null
        },
        imgSrc: {
            type: String,
            default: null
        },
        contentList: {
            type: Array,
            default: () => [],
            required: true
        }
    }
};
</script>
<style scoped>
.appTile {
  font-family: 'Limelight', cursive;
}
.appSubTile {
  font-family: 'Courgette', cursive;
}
</style>