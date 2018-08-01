<template>
    <div>
        <div class="w3-row-padding">
            <div class="w3-col m12">
                <div class="w3-card-4 w3-round w3-signal-white">
                    <div class="w3-container">
                        <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                            <i v-for="obj in path" class="fa fa-arrow-right w3-left w3-opacity" aria-hidden="true" style="margin: 6px 6px 0 0">
                                {{obj}}
                            </i>
                            <span class="w3-right">
                                <i v-show="btn1" class="fa fa-upload w3-button" title="1" aria-hidden="true" @click="">1</i>
                                <i v-show="btn2" class="fa fa-upload w3-button" title="2" aria-hidden="true" @click="">2</i>
                                <i v-show="btn3" class="fa fa-upload w3-button" title="3" aria-hidden="true" @click="">3</i>
                                <i v-show="btn4" class="fa fa-upload w3-button" title="4" aria-hidden="true" @click="">4</i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            btn1() {
                return this.btnFlag[0]
            },
            btn2() {
                return this.btnFlag[1]
            },
            btn3() {
                return this.btnFlag[2]
            },
            btn4() {
                return this.btnFlag[3]
            }
        },
        props: {
            path: {
                type: Array,
                default: () => []
            },
            btnFlag: {
                type: Array,
                default: () => []
            }
        }
    }
</script>