<template>
    <div>
        <plugin-import-window :windowAlive="importWindowAlive" @eClose="closeImportWindow" />
        <path-bar :path="path" :btnFlag="btnFlag" />
        <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin">
            <grid-list name="License Status"
                       :gridWidth="gridWidth"
                       :gridHeader="gridHeader"
                       :allGridObjs="allPluginObjs"
                       :btnFlag="btnFlag"
                       @refresh="refresh"
                       @openImportWindow="openImportWindow" />
        </div>
    </div>
</template>

<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import PathBar from '../../Common/PathBar.vue'
    import GridList from '../../Common/GridList.vue'
    import PluginImportWindow from './PluginImportWindow.vue'

    export default {
        data() {
            return {
                allPluginObjs: [],
                path: ['System', 'License Status'],
                btnFlag: [1, 0, 1, 0],
                gridHeader: ['Plugin Name', 'Expired Date', 'Status'],
                gridWidth: ['60%', '25%', '15%'],
                importWindowAlive: false
            }
        },
        mounted() {
            this.getPlugin()
        },
        methods: {
            getPlugin(e) {
                HTTP_TRINITY.get(`pluginlicense/findLicenseStatus`)
                    .then(response => {
                        //console.log(response.data)
                        this.allPluginObjs = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            refresh() {
                this.getPlugin()
            },
            openImportWindow() {
                this.importWindowAlive = true
            },
            closeImportWindow() {
                this.importWindowAlive = false
            },
        },
        components: {
            'path-bar': PathBar,
            'grid-list': GridList,
            'plugin-import-window': PluginImportWindow
        }
    }
</script>