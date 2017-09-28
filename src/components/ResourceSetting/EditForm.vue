<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Name</label>
            </div>
            <div class="w3-col m6">
                <input class="w3-input w3-border" v-model="_agentname" type="text" maxlength="32" placeholder="Please Input Agent Name">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.activate" style="width:40px;" type="checkbox">
                <label>Activate</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m6">
                <input class="w3-input w3-border" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
            <div class="w3-col m3 w3-right">
                <input class="w3-check" v-model="new_content.activate" style="width:40px;" type="checkbox">
                <label>Compress</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">OS Type</label>
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
                <label class="w3-right">OS Name</label>
            </div>
            <div class="w3-col m3">
                <input class="w3-input w3-border" v-model="new_content.osname" type="text" maxlength="20" placeholder="Please Input OS Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Host</label>
            </div>
            <div class="w3-col m4">
                <input class="w3-input w3-border" v-model="new_content.host" type="text" maxlength="30" placeholder="Please Input Host">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Port</label>
            </div>
            <div class="w3-col m3">
                <input class="w3-input w3-border" v-model="new_content.port" type="number" placeholder="Please Input Port">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Max Jobs</label>
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
                <label class="w3-right">Encoding</label>
            </div>
            <div class="w3-col m3">
                <input class="w3-input w3-border" v-model="new_content.maximumjob" type="text" placeholder="Please Input Encoding">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Dead Period</label>
            </div>
            <div class="w3-col m4">
                <select class="w3-select w3-border w3-round" v-model="new_content.maximumjob" style="padding:7px">
                    <template v-for="n in 30">
                        <option v-if="n === 10" :value="n" selected>{{ n }} minutes</option>
                        <option v-else :value="n">{{ n }} minutes</option>
                    </template>
                </select>
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Monitor Period</label>
            </div>
            <div class="w3-col m3">
                <select class="w3-select w3-border w3-round" v-model="new_content.maximumjob" style="padding:7px">
                    <template v-for="n in 60">
                        <option v-if="n === 6" :value="n" selected>{{ n }} seconds</option>
                        <option v-else :value="n">{{ n }} seconds</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">CPU Weight</label>
            </div>
            <div class="w3-col m4">
                <input class="w3-input w3-border" v-model="new_content.maximumjob" type="number" placeholder="Please Cpu Weight">
            </div>
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">MEM Weight</label>
            </div>
            <div class="w3-col m3">
                <input class="w3-input w3-border" v-model="new_content.maximumjob" type="number" placeholder="Please Memory Weight">
            </div>
        </div>
        <hr class="w3-border-black">
        <div class="w3-row w3-right">
            <button type="button" class="w3-button w3-theme-d1 w3-margin-bottom" @click="cancel"><i class="fa fa-ban"></i> Cancel</button>
            <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom" @click="save"><i class="fa fa-clipboard"></i> Save</button>
            <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom" @click="reset"><i class="fa fa-undo"></i> Reset</button>
        </div>
    </div>
</template>
<script>
import StringInput from '../Common/form/StringInput.vue';
import CheckBox from '../Common/form/CheckBox.vue';
import ValidateCode from '../Common/form/ValidateCode.vue';

export default {
    data() {
        return {
            new_content: new Object,
        }
    },
    computed: {
        _agentname: {
            get(){
                return this.content.agentname
            },
            set(){
                this.new_content.agentname = this._agentname
            }
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    agentuid: '',
                    agentname: '',
                    description: '',
                    host: '',
                    port: '',
                    maximumjob: 5,
                    activate: 0,
                    ostype: '',
                    osname: ''
                }
            }
        },
        index: Number
    },
    methods: {
        // verifyForm() {
        //     return {
        //         account: this.$refs.ac_input.inputContent,
        //         psw: this.$refs.psw_input.inputContent,
        //         flag: (this.$refs.ac_input.checkEmpty('formContent.Field_Empty')) &&
        //             (this.$refs.psw_input.checkEmpty('formContent.Field_Empty')) &&
        //             (this.$refs.code_input.checkEmpty('formContent.Field_Empty')) &&
        //             (this.$refs.code_input.checkVerify('formContent.Validate_Error'))
        //     } 
        // },
        cancel(){
            this.$emit('closeForm', this.index)
        },
        save(){
            alert(this.new_content.agentname)
        },
        reset(){
            // alert(this.new_content.agentname+'/'+this.content.agentname)
            this.new_content = this.content
        }
    },
    components: {
        'string-input': StringInput,
        'check-box': CheckBox,
        'validate-code': ValidateCode,
    }
}
</script>