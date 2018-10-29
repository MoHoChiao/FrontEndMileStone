<template>
    <div class=" w3-col m9 w3-animate-opacity">
        <div class="w3-row-padding w3-small">
            <div class="w3-col m12">
                <div class="w3-container w3-card-4 w3-signal-white w3-round">
                    <div class="w3-panel w3-border w3-round w3-padding">
                        <span>
                            <img src="src/assets/images/resource_setter/User.png" class="w3-margin-right w3-left w3-hide-small" 
                                    style="height:26px;width:32px">
                        </span>
                        <span>
                            <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                    {{ $t('Item.VersionInfo') }}
                                </i>
                            </i>
                        </span>
                        <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="inputStr"
                                placeholder="Name" style="height:28px;max-width: 200px;" @keyup.enter="searchBy">
                        <i class="fa fa-search w3-button" :title="$t('Container.Func.Search')" aria-hidden="true" @click="searchBy"></i>
                        <i class="fa fa-download w3-button w3-right" :title="$t('Container.Func.Export')" aria-hidden="true" @click="exportCSV"></i>
                    </div>
                    <!-- tabs -->
                    <div class="w3-row">
                        <a href="javascript:void(0)" @click="openTab(0)">
                            <div :class="tabsClass[0]">JCS Server</div>
                        </a>
                        <a href="javascript:void(0)" @click="openTab(1)">
                            <div :class="tabsClass[1]">DIS Server</div>
                        </a>
                    </div>
                    <!-- tab content -->
                    <div class="w3-container" style="overflow:auto">
                        <p>
                            <div class="w3-responsive w3-card w3-round">
                                <table class="w3-table-all">
                                    <tr class="w3-teal" style="cursor: pointer">
                                        <th class="w3-left" :width="gridWidth[0]" @click="sortBy('path')">
                                            {{ gridHeader[0] }}
                                            <span v-if="this.sortKey == 'path' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.sortKey == 'path' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-left" :width="gridWidth[1]" @click="sortBy('name')">
                                            {{ gridHeader[1] }}
                                            <span v-if="this.sortKey == 'name' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.sortKey == 'name' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-left" :width="gridWidth[2]" @click="sortBy('version')">
                                            {{ gridHeader[2] }}
                                            <span v-if="this.sortKey == 'version' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.sortKey == 'version' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                        <th class="w3-left" :width="gridWidth[3]" @click="sortBy('buildTime')">
                                            {{ gridHeader[3] }}
                                            <span v-if="this.sortKey == 'buildTime' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                            <span v-else-if="this.sortKey == 'buildTime' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                        </th>
                                    </tr>
                                </table>
                            </div>
                            <div id="container" class="w3-responsive w3-card w3-round">
                                <table id="dataTable" class="w3-table-all">
                                    <tr v-for="obj in dataObjs" class="w3-hover-blue-grey w3-hover-opacity">
                                        <td class="w3-left" :width="gridWidth[0]">{{ obj.path }}</td>
                                        <td class="w3-left" :width="gridWidth[1]">{{ obj.name }}</td>
                                        <td class="w3-left" :width="gridWidth[2]">{{ obj.version }}</td>
                                        <td class="w3-left" :width="gridWidth[3]">{{ obj.buildTime }}</td>
                                    </tr>
                                </table>
                            </div>
                        </p>
                    </div>
                </div>
                <!--<over-lay-loading :is-loading="allOverlayLoading" :loading-text="allOverlayLoadingText"></over-lay-loading>-->
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import OverlayLoading from '../../Common/Loading/OverlayLoading.vue'
    import startsWith from 'lodash/startsWith'
    import endsWith from 'lodash/endsWith'
    import filter from 'lodash/filter'

    export default {
        components: {
            'over-lay-loading': OverlayLoading
        },
        data() {
            return {
                tabsClass: [
                    'w3-half tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding w3-border-theme',
                    'w3-half tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding'
                ],
                tabsFlag: [true, false],
                jcsServerV: [],
                disServerV: [],
                btnFlag: [1, 0, 0, 1],
                gridHeader: [
                    this.$t('Container.Grid.Path'),
                    this.$t('Container.Grid.Name'),
                    this.$t('Container.Grid.Version'),
                    this.$t('Container.Grid.BuildTime')
                ],
                gridWidth: ['10%', '35%', '25%', '30%'],
                inputStr: '',
                queryStr: '',
                sortKey: 'path',
                sortOrder: 'ASC',
                allOverlayLoading: false,    //control the status of all page overlay loading
                allOverlayLoadingText: 'Loading',    //control the status of all page overlay loading
                xxAry: []
            }
        },
        props: {

        },
        created() {
            this.getJCSServerInfo();
            this.getDISServerInfo();
        },
        computed: {
            sortedJCSData: function () {
                return this.filterJCSData.sort((a, b) => {
                    let modifier = 1;
                    if (this.sortOrder === 'DESC')
                        modifier = -1;
                    if (a[this.sortKey] < b[this.sortKey])
                        return -1 * modifier;
                    if (a[this.sortKey] > b[this.sortKey])
                        return 1 * modifier;
                    return 0;
                });
            },
            filterJCSData: function () {
                if (this.queryStr.length == 0)
                    return this.jcsServerV;

                var qs = this.queryStr;

                if (startsWith(this.queryStr, '%') && endsWith(this.queryStr, '%')) {
                    qs = qs.slice(1);
                    qs = qs.slice(0, -1); // %xxx% => xxx
                } else if (startsWith(this.queryStr, '%')) {
                    qs = qs.slice(1) + '$'; // %xxx => xxx$
                } else if (endsWith(this.queryStr, '%')) {
                    qs = '^' + qs.slice(0, -1); // xxx% => ^xxx
                } else {
                    qs = '^' + qs + '$'; // xxx => ^xxx$
                }

                var reg = new RegExp(qs, 'i');

                return filter(this.jcsServerV, obj => { return reg.test(obj.name); });
            },
            sortedDISData: function () {
                return this.filterDISData.sort((a, b) => {
                    let modifier = 1;
                    if (this.sortOrder === 'DESC')
                        modifier = -1;
                    if (a[this.sortKey] < b[this.sortKey])
                        return -1 * modifier;
                    if (a[this.sortKey] > b[this.sortKey])
                        return 1 * modifier;
                    return 0;
                });
            },
            filterDISData: function () {
                if (this.queryStr.length == 0)
                    return this.disServerV;

                var qs = this.queryStr;

                if (startsWith(this.queryStr, '%') && endsWith(this.queryStr, '%')) {
                    qs = qs.slice(1);
                    qs = qs.slice(0, -1);
                } else if (startsWith(this.queryStr, '%')) {
                    qs = qs.slice(1) + '$';
                } else if (endsWith(this.queryStr, '%')) {
                    qs = '^' + qs.slice(0, -1);
                } else {
                    qs = '^' + qs + '$';
                }

                var reg = new RegExp(qs, 'i');

                return filter(this.disServerV, obj => { return reg.test(obj.name); });
            },
            dataObjs: function () {
                if (this.tabsFlag[0]) {
                    return this.sortedJCSData;
                } else {
                    return this.sortedDISData;
                }
            }
        },
        methods: {
            openTab(whichTab) {
                for (let i = 0; i < this.tabsFlag.length; i++) {
                    this.$set(this.tabsFlag, i, false);
                }
                this.$set(this.tabsFlag, whichTab, true);

                for (let i = 0; i < this.tabsClass.length; i++) {
                    this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""));
                }
                this.$set(this.tabsClass, whichTab, this.tabsClass[whichTab] + " w3-border-theme");
            },
            searchBy: function () {
                this.queryStr = this.inputStr;
            },
            sortBy: function (key) {
                //if s == current sort, reverse
                if (key === this.sortKey) {
                    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
                }
                this.sortKey = key;
            },
            getJCSServerInfo(e) {
                this.allOverlayLoading = true

                HTTP_TRINITY.get(`versioninfo/findJCSServer`)
                    .then(response => {
                        this.jcsServerV = response.data;
                    })
                    .catch(error => {
                        errorHandle(this.$store, error);
                    })
                    .finally(e => {
                        this.allOverlayLoading = false
                    })
            },
            getDISServerInfo(e) {
                this.allOverlayLoading = true

                HTTP_TRINITY.get(`versioninfo/findDISServer`)
                    .then(response => {
                        this.disServerV = response.data;
                    })
                    .catch(error => {
                        errorHandle(this.$store, error);
                    })
            },
            exportCSV() {
                //const items = this.jcsServerV;
                let items = this.sortedJCSData;
                items = items.concat(this.sortedDISData);

                const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
                const header = Object.keys(items[0]);
                let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
                csv.unshift(header.join(','));
                csv = csv.join('\r\n');

                const url = window.URL.createObjectURL(new Blob([csv]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'version_info.csv'); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
        },
    }
</script>