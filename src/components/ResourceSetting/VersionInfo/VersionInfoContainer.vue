<template>
    <div>
        <path-bar :path="path" :btnFlag="btnFlag" />
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <div class="w3-row">
                <a href="javascript:void(0)" @click="openTab(0)">
                    <div :class="tabsClass[0]">JCS Server</div>
                </a>
                <a href="javascript:void(0)" @click="openTab(1)">
                    <div :class="tabsClass[1]">JCS Agent</div>
                </a>
                <a href="javascript:void(0)" @click="openTab(2)">
                    <div :class="tabsClass[2]">DIS Server</div>
                </a>
            </div>
            <div v-show="tabsFlag[0]" class="w3-container" style="overflow:auto">
                <grid-list :showTop=false
                           :gridWidth="gridWidth"
                           :gridHeader="gridHeader"
                           :allGridObjs="jcsServerObjs"
                           :btnFlag="btnFlag"
                           @refresh="refresh" />
            </div>
            <div v-show="tabsFlag[1]" class="w3-container" style="overflow:auto">
                <grid-list :showTop=false
                           :gridWidth="gridWidth"
                           :gridHeader="gridHeader"
                           :allGridObjs="jcsAgentObjs"
                           :btnFlag="btnFlag"
                           @refresh="refresh" />
            </div>
            <div v-show="tabsFlag[2]" class="w3-container" style="overflow:auto">
                <grid-list :showTop=false
                           :gridWidth="gridWidth"
                           :gridHeader="gridHeader"
                           :allGridObjs="disServerObjs"
                           :btnFlag="btnFlag"
                           @refresh="refresh" />
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import PathBar from '../../Common/PathBar.vue'
    import GridList from '../../Common/GridList.vue'

    export default {
        components: {
            'path-bar': PathBar,
            'grid-list': GridList
        },
        data() {
            return {
                tabsClass: [
                    'w3-third tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding',
                    'w3-third tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding',
                    'w3-third tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding'
                ],
                tabsFlag: [true, false, false],
                jcsServerObjs: [],
                jcsAgentObjs: [],
                disServerObjs: [],
                path: ['System', 'Version Info'],
                btnFlag: [1, 0, 0, 1],
                gridHeader: ['Path', 'Name', 'Version', 'Build Time'],
                gridWidth: ['10%', '35%', '25%', '30%']
            }
        },
        mounted() {
            this.getJCSServerInfo();
            this.getJCSAgentInfo();
            this.getDISServerInfo();
        },
        methods: {
            openTab(whichTab) {
                for (let i = 0; i < this.tabsFlag.length; i++) {
                    this.$set(this.tabsFlag, i, false)
                }
                this.$set(this.tabsFlag, whichTab, true)

                for (let i = 0; i < this.tabsClass.length; i++) {
                    this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
                }
                this.$set(this.tabsClass, whichTab, this.tabsClass[whichTab] + " w3-border-theme")
            },
            getJCSServerInfo(e) {
                HTTP_TRINITY.get(`versioninfo/findJCSServer`)
                    .then(response => {
                        //console.log(response.data)
                        this.jcsServerObjs = response.data;
                    })
                    .catch(error => {
                        errorHandle(this.$store, error);
                    })
            },
            getJCSAgentInfo(e) {
                HTTP_TRINITY.get(`versioninfo/findJCSAgent`)
                    .then(response => {
                        //console.log(response.data)
                        this.jcsAgentObjs = response.data;
                    })
                    .catch(error => {
                        errorHandle(this.$store, error);
                    })
            },
            getDISServerInfo(e) {
                HTTP_TRINITY.get(`versioninfo/findDISServer`)
                    .then(response => {
                        //console.log(response.data)
                        this.disServerObjs = response.data;
                    })
                    .catch(error => {
                        errorHandle(this.$store, error);
                    })
            },
            refresh() {
                this.getJCSServerInfo();
            }
        },
    }
</script>