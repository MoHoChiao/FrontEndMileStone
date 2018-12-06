<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Name') }}</label>
            </div>
            <div class="w3-col m6">
                <name-input name="agentname" :class="[inputClassList.common, errors.has('agentname')? inputClassList.invalid: '']"
                            v-validate="'required'" v-model="new_content.agentname" type="text" maxlength="32" placeholder=""
                            style="text-transform:uppercase" />
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.activate" type="checkbox">
                <label>{{ $t('Form.Activate') }}</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Description') }}</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.common" v-model="new_content.description" type="text" maxlength="255" placeholder="">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.compresstransfer" type="checkbox">
                <label>{{ $t('Form.Agent.Compress') }}</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Agent.OSType') }}</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.ostype" style="padding:7px">
                    <option value="Linux" selected>Linux</option>
                    <option value="Other">Other</option>
                    <option value="Unix">Unix</option>
                    <option value="Windows">Windows</option>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Agent.OSName') }}</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.common" v-model="new_content.osname" type="text" maxlength="20" placeholder="">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Host') }}</label>
            </div>
            <div class="w3-col m4">
                <input name="host" :class="[inputClassList.common, errors.has('host')? inputClassList.invalid: '']"
                       v-validate="'required|ip'" v-model="new_content.host" type="text" maxlength="30" placeholder="">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Port') }}</label>
            </div>
            <div class="w3-col m3">
                <input name="port" :class="[inputClassList.common, errors.has('port')? inputClassList.invalid: '']"
                       v-validate="'required|numeric'" v-model="new_content.port" type="number" min="0" max="65535">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Agent.MaxJobs') }}</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.maximumjob" style="padding:7px">
                    <template v-for="n in 64">
                        <option v-if="n === 5" :value="n" selected>{{ n }}</option>
                        <option v-else :value="n">{{ n }}</option>
                    </template>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Encoding') }}</label>
            </div>
            <div class="w3-col m3">
                <input :class="inputClassList.common" v-model="new_content.encoding" type="text" placeholder="">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Agent.DeadPeriod') }}</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.deadperiod" style="padding:7px">
                    <template v-for="n in 30">
                        <option v-if="n === 10" :value="n" selected>{{ n }} minutes</option>
                        <option v-else :value="n">{{ n }} minutes</option>
                    </template>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Agent.MonitorPeriod') }}</label>
            </div>
            <div class="w3-col m3">
                <select class="w3-select w3-border w3-round" v-model="new_content.monitortime" style="padding:7px">
                    <template v-for="n in 60">
                        <option v-if="n === 6" :value="n" selected>{{ n }} seconds</option>
                        <option v-else :value="n">{{ n }} seconds</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Agent.CPUWeight') }}</label>
            </div>
            <div class="w3-col m4">
                <input name="cpuweight" :class="[inputClassList.common, errors.has('cpuweight')? inputClassList.invalid: '']"
                       v-validate="'required|numeric'" v-model="new_content.cpuweight" type="number" min="0" max="999">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Agent.MEMWeight') }}</label>
            </div>
            <div class="w3-col m3">
                <input name="memweight" :class="[inputClassList.common, errors.has('memweight')? inputClassList.invalid: '']"
                       v-validate="'required|numeric'" v-model="new_content.memweight" type="number" min="0" max="999">
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                inputClassList: {
                    common: 'w3-input w3-border',
                    invalid: 'w3-pale-red'
                },
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    agentuid: this.content.agentuid,
                    agentname: this.content.agentname,
                    description: this.content.description,
                    host: this.content.host,
                    port: this.content.port,
                    maximumjob: this.content.maximumjob,
                    activate: Number(this.content.activate),
                    ostype: this.content.ostype,
                    osname: this.content.osname,
                    deadperiod: this.content.deadperiod,
                    memweight: this.content.memweight,
                    compresstransfer: Number(this.content.compresstransfer),
                    encoding: this.content.encoding,
                    monitortime: this.content.monitortime,
                    cpuweight: this.content.cpuweight
                }
            }
        },
        created() {
            if (this.urlOp === 'copy') {
                //copy動作, 把name和description設空值
                this.new_content.agentuid = ''
                this.new_content.agentname = ''
                this.new_content.description = ''
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        agentuid: '',
                        agentname: '',
                        description: '',
                        host: '',
                        port: '',
                        maximumjob: 5,
                        activate: '0',
                        ostype: 'Linux',
                        osname: '',
                        deadperiod: 10,
                        memweight: 1,
                        compresstransfer: '0',
                        encoding: '',
                        monitortime: 6,
                        cpuweight: 2
                    }
                }
            },
            urlOp: {
                type: String,
                default: 'add'
            }
        },
        methods: {
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                }

                this.new_content.agentname = this.new_content.agentname.trim().toUpperCase()
                this.new_content.activate = Number(this.new_content.activate)
                this.new_content.compresstransfer = Number(this.new_content.compresstransfer)
                return this.new_content
            },
            reset() {
                if (this.urlOp === 'copy') {
                    this.new_content.agentuid = ''
                    this.new_content.agentname = ''
                    this.new_content.description = ''
                } else {
                    this.new_content.agentuid = this.content.agentuid
                    this.new_content.agentname = this.content.agentname
                    this.new_content.description = this.content.description
                }

                this.new_content.host = this.content.host
                this.new_content.port = this.content.port
                this.new_content.maximumjob = this.content.maximumjob
                this.new_content.activate = Number(this.content.activate)
                this.new_content.ostype = this.content.ostype
                this.new_content.osname = this.content.osname
                this.new_content.deadperiod = this.content.deadperiod
                this.new_content.memweight = this.content.memweight
                this.new_content.compresstransfer = Number(this.content.compresstransfer)
                this.new_content.encoding = this.content.encoding
                this.new_content.monitortime = this.content.monitortime
                this.new_content.cpuweight = this.content.cpuweight
            }
        }
    }
</script>
<style scoped>
    input, select {
        height: 30px
    }

    input.w3-check {
        height: 20px
    }
</style>