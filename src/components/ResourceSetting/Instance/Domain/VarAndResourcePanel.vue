<template>
    <div>
        <div class="w3-small">
            <div class="w3-row">
                <a href="javascript:void(0)" @click="openTab(0)">
                    <div :class="tabsClass[0]">Domain Variable</div>
                </a>
                <a href="javascript:void(0)" @click="openTab(1)">
                    <div :class="tabsClass[1]">Domain Resource</div>
                </a>
            </div>
            <br>
            <div v-if="viewMode">
                <div v-show="tabsFlag[0]">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all w3-small">
                            <tr class="w3-teal">
                                <th class="w3-center" width="60%">Variable Name</th>
                                <th class="w3-center" width="40%">Variable Value</th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px;word-break:break-all">
                        <table class="w3-table-all w3-small">
                            <tr :key="list_index+'VarTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in new_domainVars">
                                <td class="w3-center" width="60%">
                                    <span style="text-transform:uppercase">{{ list_info.variablename }}</span>
                                </td>
                                <td class="w3-center" width="40%">
                                    <span>{{ list_info.variablevalue }}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div v-show="tabsFlag[1]">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all w3-small">
                            <tr class="w3-teal">
                                <th class="w3-center" width="60%">Resource Name</th>
                                <th class="w3-center" width="40%">Resource Value</th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:176px;word-break:break-all">
                        <table class="w3-table-all w3-small">
                            <tr :key="list_index+'ResourceTr'" class="w3-hover-blue-grey w3-hover-opacity" v-for="(list_info, list_index) in new_domainResources">
                                <td class="w3-center" width="60%">
                                    <span style="text-transform:uppercase">{{ list_info.resourcename }}</span>
                                </td>
                                <td class="w3-center" width="40%">
                                    <span>{{ list_info.resourcevalue }}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-show="tabsFlag[0]">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all w3-small">
                            <tr class="w3-teal">
                                <th class="" width="50%" style="padding-top:12px;padding-bottom:12px">Variable Name</th>
                                <th class="" width="40%" style="padding-top:12px;padding-bottom:12px">Variable Value</th>
                                <th class="w3-center" width="10%" style="padding-top:7px;padding-bottom:7px">
                                    <i class="fa fa-plus-square w3-button w3-hover-none" title="Add Variable" aria-hidden="true" @click="addVariable"></i>
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:190px;word-break:break-all">
                        <table class="w3-table-all w3-small">
                            <tr :key="index+'VarEditTr'" v-for="(list_info, index) in new_domainVars">
                                <td class="w3-center" width="50%">
                                    <input class="w3-input w3-border" v-model="list_info.variablename" type="text"
                                           maxlength="64" placeholder="Please Input Domain Variable Name"
                                           style="text-transform:uppercase">
                                </td>
                                <td class="w3-center" width="40%">
                                    <input class="w3-input w3-border" v-model="list_info.variablevalue" type="text" maxlength="64" placeholder="Please Input Domain Variable Value">
                                </td>
                                <td class="w3-center" width="10%">
                                    <i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delVariable(index)"></i>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div v-show="tabsFlag[1]">
                    <div class="w3-responsive w3-card w3-round">
                        <table class="w3-table-all w3-small">
                            <tr class="w3-teal">
                                <th class="" width="50%" style="padding-top:12px;padding-bottom:12px">Resource Name</th>
                                <th class="" width="40%" style="padding-top:12px;padding-bottom:12px">Resource Value</th>
                                <th class="w3-center" width="10%" style="padding-top:7px;padding-bottom:7px">
                                    <!--<i class="fa fa-plus-square w3-button w3-hover-none" title="Add Resource" aria-hidden="true" @click="addResource"></i>-->
                                </th>
                            </tr>
                        </table>
                    </div>
                    <div class="w3-responsive w3-card w3-round" style="overflow:auto;height:190px;word-break:break-all">
                        <table class="w3-table-all w3-small">
                            <tr :key="index+'ResourceEditTr'" v-for="(list_info, index) in new_domainResources">
                                <td class="w3-center" width="50%">
                                    <input class="w3-input w3-border" v-model="list_info.resourcename" type="text"
                                           maxlength="64" readonly placeholder="Please Input Domain Resource Name"
                                           style="text-transform:uppercase">
                                </td>
                                <td class="w3-center" width="40%">
                                    <input class="w3-input w3-border" v-model="list_info.resourcevalue" type="text" maxlength="64" placeholder="Please Input Domain Resource Value">
                                </td>
                                <td class="w3-center" width="10%">
                                    <!--<i class="fa fa-minus-circle w3-button w3-hover-none" title="Delete" aria-hidden="true" @click="delResource(index)"></i>-->
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                tabsClass: ['w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                    'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'],
                tabsFlag: [true, false, false, false],
                new_domainVars: [],
                new_domainResources: [],
            }
        },
        mounted() {
            this.cloneDomainVar()
            this.cloneDomainResource()
        },
        props: {
            domainVars: {
                type: Array
            },
            domainResources: {
                type: Array
            },
            viewMode: true,
            domainuid: ''
        },
        watch: {
            /*
             * 這是為了在父元件中只要按下reload相關的功能時, applyTimes會改變, 利用這個改變來使用watch
             * 使得每次按下reload相關的功能時, 都能讓tab回到第一個
            */
            domainVars: function (newValue) {
                this.cloneDomainVar()
            },
            domainResources: function (newValue) {
                this.cloneDomainResource()
            }
        },
        methods: {
            openTab(numOfTab) {
                if (this.whichTab === numOfTab)
                    return

                this.whichTab = numOfTab

                for (let i = 0; i < this.tabsFlag.length; i++) {
                    this.$set(this.tabsFlag, i, false)
                }
                this.$set(this.tabsFlag, this.whichTab, true)

                for (let i = 0; i < this.tabsClass.length; i++) {
                    this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
                }
                this.$set(this.tabsClass, this.whichTab, this.tabsClass[this.whichTab] + " w3-border-theme")
            },
            addVariable() {
                let new_var = {
                    // "domainuid": this.domainuid, 後端不需要這個值回傳, 減少傳輸量
                    "variablename": '',
                    "variablevalue": ''
                }
                this.new_domainVars.push(new_var)
            },
            delVariable(index) {
                this.new_domainVars.splice(index, 1)
            },
            addResource() {
                alert('coming soon')
                return;

                let new_resource = {
                    // "domainuid": this.domainuid, 後端不需要這個值回傳, 減少傳輸量
                    "resourcename": '',
                    "resourcevalue": ''
                }
                this.new_domainResources.push(new_resource)
            },
            delResource(index) {
                alert('coming soon')
                return;

                this.new_domainResources.splice(index, 1)
            },
            cloneDomainVar() {
                //Create a new array from this.domainVars, Avoid array to call by reference.
                this.new_domainVars = []
                /*
                    Copy all new objs from this.domainVars's objs into this.new_domainVars
                    Avoid objs to call by reference.
                */
                for (var i = 0, len = this.domainVars.length; i < len; i++) {
                    this.new_domainVars[i] = {
                        // domainuid: this.domainVars[i].domainuid, 後端不需要這個值回傳, 減少傳輸量
                        variablename: this.domainVars[i].variablename,
                        variablevalue: this.domainVars[i].variablevalue
                    };
                }
            },
            cloneDomainResource() {
                //Create a new array from this.domainResources, Avoid array to call by reference.
                this.new_domainResources = []

                /*
                    Copy all new objs from this.domainResources's objs into this.new_domainResources
                    Avoid objs to call by reference.
                */
                if (this.domainResources.length <= 0) {
                    this.new_domainResources[0] = {
                        resourcename: 'TD-BULKLOAD',
                        resourcevalue: '1'
                    };
                } else {
                    for (var i = 0, len = this.domainResources.length; i < len; i++) {
                        this.new_domainResources[i] = {
                            // domainuid: this.domainResources[i].domainuid, 後端不需要這個值回傳, 減少傳輸量
                            resourcename: this.domainResources[i].resourcename,
                            resourcevalue: this.domainResources[i].resourcevalue
                        };
                    }
                }
            },
            isDuplicateInDomainVars() {
                var variablenameArr = this.new_domainVars.map(function (item) { return item.variablename.trim().toUpperCase() });
                var isDuplicate = variablenameArr.some(function (item, idx) {
                    return variablenameArr.indexOf(item) != idx && item.trim() != ''
                });
                return isDuplicate
            },
            getDomainVars() {
                let return_domainVars = []
                for (let i = 0; i < this.new_domainVars.length; i++) {
                    this.new_domainVars[i].variablename = this.new_domainVars[i].variablename.trim().toUpperCase()
                    if (this.new_domainVars[i].variablename !== '') {
                        return_domainVars.push(this.new_domainVars[i])
                    }
                }

                return return_domainVars
            },
            isEmptyInDomainResources() {
                var resourcevalueArr = this.new_domainResources.map(function (item) { return item.resourcevalue.trim() });
                return resourcevalueArr.includes('')
            },
            getDomainResources() {
                return this.new_domainResources
            },
            reset() {
                this.cloneDomainVar()
                this.cloneDomainResource()
            }
        }
    }
</script>
<style scoped>
    input {
        height: 30px
    }
</style>

