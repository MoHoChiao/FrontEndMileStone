<template>
    <div class=" w3-col m9 w3-animate-opacity">
        <div class="w3-row-padding w3-small">
            <div class="w3-col m12">
                <div class="w3-container w3-card-4 w3-signal-white w3-round">
                    <p>
                        <div class="w3-panel w3-border w3-round w3-padding">
                            <span>
                                <img src="src/assets/images/resource_setter/User.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white w3-left" style="padding:3px">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        License Status
                                    </i>
                                </i>
                            </span>
                            <input class="w3-input w3-border w3-col m10 w3-margin-left" type="text" maxlength="32" v-model="inputStr"
                                   placeholder="Plugin Name" style="height:28px;max-width: 200px" @keyup.enter="searchBy">
                            <i class="fa fa-search w3-button" title="Search" aria-hidden="true" @click="searchBy"></i>
                            <i class="fa fa-download w3-button w3-right" title="Export" aria-hidden="true" @click="exportCSV"></i>
                        </div>
                        <div class="w3-responsive w3-card w3-round">
                            <table class="w3-table-all">
                                <tr class="w3-teal" style="cursor: pointer">
                                    <th class="w3-left" :width=gridWidth[0] @click="sortBy('pluginname')">
                                        {{ gridHeader[0] }}
                                        <span v-if="this.sortKey == 'pluginname' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.sortKey == 'pluginname' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                    <th class="w3-left" :width=gridWidth[1] @click="sortBy('expireddate')">
                                        {{ gridHeader[1] }}
                                        <span v-if="this.sortKey == 'expireddate' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.sortKey == 'expireddate' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                    <th class="w3-left" :width=gridWidth[2] @click="sortBy('status')">
                                        {{ gridHeader[2] }}
                                        <span v-if="this.sortKey == 'status' && sortOrder == 'DESC'" class="w3-text-black">&#9660;</span>
                                        <span v-else-if="this.sortKey == 'status' && sortOrder == 'ASC'" class="w3-text-black">&#9650;</span>
                                    </th>
                                </tr>
                            </table>
                        </div>
                        <div id="container" class="w3-responsive w3-card w3-round">
                            <table id="dataTable" class="w3-table-all">
                                <tr v-for="obj in sortedData" class="w3-hover-blue-grey w3-hover-opacity">
                                    <td class="w3-left" :width=gridWidth[0]>{{ obj.pluginname }}</td>
                                    <td class="w3-left" :width=gridWidth[1]>{{ obj.expireddate }}</td>
                                    <td class="w3-left" :width=gridWidth[2]>
                                        <i v-if="obj.status" class="fa fa-check-circle w3-text-green" />
                                        <i v-else class="fa fa-times-circle w3-text-red" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'

    export default {
        components: {

        },
        data() {
            return {
                dataObjs: [],
                gridHeader: ['Plugin Name', 'Expired Date', 'Status'],
                gridWidth: ['60%', '25%', '15%'],
                inputStr: '',
                queryStr: '',
                sortKey: 'pluginname',
                sortOrder: 'ASC'
            }
        },
        props: {

        },
        created() {
            this.getPlugin();
        },
        computed: {
            sortedData: function () {
                return _.orderBy(this.filterData, this.sortKey, this.sortOrder.toLowerCase());
            },
            filterData: function () {
                if (this.queryStr.length == 0)
                    return this.dataObjs;

                var qs = this.queryStr;

                if (_.startsWith(this.queryStr, '%') && _.endsWith(this.queryStr, '%')) {
                    qs = qs.slice(1);
                    qs = qs.slice(0, -1); // %xxx% => xxx
                } else if (_.startsWith(this.queryStr, '%')) {
                    qs = qs.slice(1) + '$'; // %xxx => xxx$
                } else if (_.endsWith(this.queryStr, '%')) {
                    qs = '^' + qs.slice(0, -1); // xxx% => ^xxx
                } else {
                    qs = '^' + qs + '$'; // xxx => ^xxx$
                }

                var reg = new RegExp(qs, 'i');

                return _.filter(this.dataObjs, obj => { return reg.test(obj.pluginname); });
            }
        },
        methods: {
            searchBy: function () {
                this.queryStr = this.inputStr;
            },
            sortBy: function (key) {
                if (key == this.sortKey) {
                    this.sortOrder = (this.sortOrder == 'ASC') ? 'DESC' : 'ASC';
                } else {
                    this.sortKey = key;
                    this.sortOrder = 'ASC';
                }
            },
            getPlugin(e) {
                HTTP_TRINITY.get(`pluginlicense/findLicenseStatus`)
                    .then(response => {
                        this.dataObjs = response.data;
                    })
                    .catch(error => {
                        errorHandle(this.$store, error);
                    })
            },
            exportCSV() {
                let items = this.sortedData;

                const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
                const header = Object.keys(items[0]);
                let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
                csv.unshift(header.join(','));
                csv = csv.join('\r\n');

                const url = window.URL.createObjectURL(new Blob([csv]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'plugin_license_status.csv'); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
        }
    }
</script>