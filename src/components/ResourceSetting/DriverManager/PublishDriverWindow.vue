<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div class="w3-small w3-section w3-card w3-row" slot="content">
            <div class="w3-col m6">
                <div class="w3-responsive w3-card-0 w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center" width="10%" style="padding-top:4px">
                                <input class="w3-check" type="checkbox" v-model="checkAllAgentFlag" @click="onClickAllAgent">
                            </th>
                            <th class="w3-center" width="90%">{{ $t('Item.JCSAgent') }}</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="freqCategoryTable" class="w3-table-all w3-small">
                        <template v-for="(agent, index) in allJCSAgents">
                            <tr :id="agent.agentname" :key="agent.agentname">
                                <td class="w3-center" width="10%" style="padding-top:4px">
                                    <input class="w3-check" type="checkbox" v-model="agent.checked" @change="onClickAgent(agent, index)">
                                </td>
                                <td class="w3-center" width="90%">
                                    <span>{{ agent.agentname }}</span>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
            <div class="w3-col m6">
                <div class="w3-responsive w3-card-0 w3-round">
                    <table class="w3-table-all w3-small">
                        <tr class="w3-teal">
                            <th class="w3-center" width="10%" style="padding-top:4px">
                                <input class="w3-check" type="checkbox" v-model="checkAllFlag" @click="onClickCheckAll">
                            </th>
                            <th class="w3-center" width="90%">{{ $t('Form.Driver.DriverName') }}</th>
                        </tr>
                    </table>
                </div>
                <div class="w3-responsive w3-card-0 w3-round" style="overflow:auto;max-height:200px">
                    <table id="freqCategoryTable" class="w3-table-all w3-small">
                        <template v-for="(driver, index) in allDriverObjs">
                            <tr :id="driver.name" :key="driver.name">
                                <td class="w3-center" width="10%" style="padding-top:4px">
                                    <input class="w3-check" type="checkbox" v-model="driver.checked" @change="onClickCheck(driver, index)">
                                </td>
                                <td class="w3-center" width="90%">
                                    <span>{{ driver.name }} ({{ driver.owner }})</span>
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>
        </div>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="addButtonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import ModalWindow from '../../Common/window/ModalWindow.vue'
    import FormButton from '../FormButton.vue'
    import { wait, NON_SPEED, SLOW_SPEED, FAST_SPEED } from '../../../util_js/utils';

    export default {
        data() {
            return {
                selectedRecords: [],
                selectedAgentRecords: [],
                checkAllFlag: false,
                checkAllAgentFlag: false,
                addButtonLoading: false,
                allDriverObjs: [],
                allJCSAgents: []
            }
        },
        created() {
            this.getDrivers()
            this.getAllAgents()
        },
        props: {
            windowTitle: {
                type: String,
                default: ''
            },
            windowBgColor: {
                type: String,
                default: 'camo-black'
            }
        },
        methods: {
            cancel() {
                if (this.addButtonLoading)
                    return
                this.$emit('closeApply')
            },
            onClickCheckAll() {
                this.selectedRecords = []
                if (!this.checkAllFlag) {
                    for (let i = 0; i < this.allDriverObjs.length; i++) {
                        this.allDriverObjs[i].checked = true //單純為了在UI把checkbox勾起來而已
                        this.onClickCheck(this.allDriverObjs[i], i)
                    }
                } else {
                    for (let i = 0; i < this.allDriverObjs.length; i++) {
                        this.allDriverObjs[i].checked = false //單純為了在UI把checkbox取消而已
                    }
                }
            },
            onClickCheck(driver, index) {
                if (driver.checked) {
                    let new_driver = {
                        "driverName": driver.name
                    }
                    this.selectedRecords[index] = new_driver
                } else {
                    delete this.selectedRecords[index]
                }
            },
            onClickAllAgent() {
                this.selectedAgentRecords = []
                if (!this.checkAllAgentFlag) {
                    for (let i = 0; i < this.allJCSAgents.length; i++) {
                        this.allJCSAgents[i].checked = true //單純為了在UI把checkbox勾起來而已
                        this.onClickAgent(this.allDriverObjs[i], i)
                    }
                } else {
                    for (let i = 0; i < this.allJCSAgents.length; i++) {
                        this.allJCSAgents[i].checked = false //單純為了在UI把checkbox取消而已
                    }
                }
            },
            onClickAgent(agent, index) {
                if (agent.checked) {
                    let new_agent = {
                        "agentuid": agent.agentuid
                    }
                    this.selectedAgentRecords[index] = new_agent
                } else {
                    delete this.selectedAgentRecords[index]
                }
            },
            reset() {
                this.checkAllFlag = false
                this.selectedRecords = []
                this.getDrivers()
            },
            getDrivers(e) {
                HTTP_TRINITY.get(`driver-manager/findDriversProp`)
                    .then(response => {
                        this.allDriverObjs = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getAllAgents() {
                let params = {
                    "paging": {
                        "number": 0,
                        "size": 500
                    },
                    "ordering": {
                        "orderType": 'ASC',
                        "orderField": 'agentname'
                    },
                    "param": ''
                }

                HTTP_TRINITY.post(`jcsagent/findByFilter`, params)
                    .then(response => {
                        this.allJCSAgents = response.data.content
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            searchForAgentList() {
                let input, filter, table, i
                input = document.getElementById('SearchAgentInput')
                filter = input.value.toUpperCase()
                table = document.getElementById('AgentListTable')
                for (i = 0; i < table.rows.length; i++) {
                    let text = table.rows[i].cells[0].innerHTML
                    if (text.toUpperCase().indexOf(filter) > -1) {
                        table.rows[i].style.display = "";
                    } else {
                        table.rows[i].style.display = "none";
                    }
                }
            },
            save() {
                if (this.selectedRecords && this.selectedRecords.length > 0) {
                    let driverNames = []
                    for (let i = 0; i < this.selectedRecords.length; i++) {
                        if (this.selectedRecords[i] && this.selectedRecords[i].driverName)
                            driverNames.push(this.selectedRecords[i].driverName)
                    }

                    let agentList = []
                    for (let i = 0; i < this.selectedAgentRecords.length; i++) {
                        if (this.selectedAgentRecords[i] && this.selectedAgentRecords[i].agentuid)
                            agentList.push(this.selectedAgentRecords[i].agentuid)
                    }

                    let params = {
                        "driver": driverNames,
                        "agent": agentList
                    }

                    if (driverNames.length > 0) {
                        this.addButtonLoading = true

                        HTTP_TRINITY.post('driver-manager/publishDriver', params)
                            .then(wait(SLOW_SPEED)) // DEV ONLY: wait for 1s
                            .then(response => {
                                this.addButtonLoading = false

                                let newStatus = {
                                    "msg": "Drivers published to JCS are successful.",
                                    "status": "Success"
                                }
                                //this.$store.dispatch('setSystemStatus', newStatus)
                                this.cancel()
                                return
                            })
                            .catch(error => {
                                this.addButtonLoading = false
                                errorHandle(this.$store, error)
                            })
                    } else {
                        this.cancel()
                    }
                } else {
                    this.cancel()
                }
            }
        },
        components: {
            'modal-window': ModalWindow,
            'form-button': FormButton
        }
    }
</script>
<style scoped>

    input.w3-check {
        height: 16px;
        top: 2px
    }
</style>