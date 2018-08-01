<template>
    <div class="w3-small">
        <p>
            <div v-show="showTop">
                <span><img :src="imgPath" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                <span>
                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white" style="padding:3px;transform:rotate(-5deg)">
                        <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                            {{ name }}
                        </i>
                    </i>
                </span>
                <!-- button -->
                <span class="w3-right">
                    <i v-show="btn1" class="fa fa-upload w3-button" title="1" aria-hidden="true" @click="">1</i>
                    <i v-show="btn2" class="fa fa-upload w3-button" title="2" aria-hidden="true" @click="">2</i>
                    <i v-show="btn3" class="fa fa-upload w3-button" title="3" aria-hidden="true" @click="">3</i>
                    <i v-show="btn4" class="fa fa-upload w3-button" title="4" aria-hidden="true" @click="">4</i>
                </span>
            </div>
        </p>
        <p>
            <div>
                <div class="w3-responsive w3-card w3-round">
                    <table class="w3-table-all">
                        <tr class="w3-teal">
                            <th v-for="(header, index) in gridHeader" class="w3-left" :width="gridWidth[index]">
                                {{ header }}
                            </th>
                        </tr>
                    </table>
                </div>
                <div id="container" class="w3-responsive w3-card w3-round" style="min-height:450px">
                    <table id="dataTable" class="w3-table-all">
                        <tr class="w3-hover-blue-grey w3-hover-opacity" v-for="(content, index) in allGridObjs" :style="trStyle" @click="">
                            <td v-for="(obj, key, index) in content" :id="key" class="w3-left" :width="gridWidth[index]">
                                <span v-if="key == 'status'" :class="faStatus(obj)"></span>
                                <span v-else>{{ obj }}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <!--<page ref="paginate" :page-count="totalPages" :clickHandler="changeNum"></page>-->
            </div>
        </p>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                
            }
        },
        props: {
            trStyle: {
                type: String,
                default: ''
            },
            showTop: {
                type: Boolean,
                default: true
            },
            name: {
                type: String,
                default: ''
            },
            iconName: {
                type: String
            },
            gridHeader: {
                type: Array,
                default: () => []
            },
            gridWidth: {
                type: Array,
                default: () => []
            },
            allGridObjs: {
                type: Array,
                default: () => []
            },
            btnFlag: {
                type: Array,
                default: () => []
            }
        },
        computed: {
            imgPath() {
                //return '/src/assets/images/resource_setter/' + this.iconName + '.png'
                return '/src/assets/images/resource_setter/User.png'
            },
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
        methods: {
            refresh() {
                this.$emit('refresh')
            },
            faStatus(b) {
                if (b)
                    return 'fa fa-check-circle w3-text-green'
                else
                    return 'fa fa-times-circle w3-text-red'
            },
            openImportWindow() {
                this.$emit('openImportWindow')
            }
        }
    }
</script>