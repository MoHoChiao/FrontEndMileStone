<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Rule Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.rulename" style="text-transform:uppercase" 
                        type="text" maxlength="50" placeholder="Please Input Package Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Full Class</label>
            </div>
            <div class="w3-col m6">
                <select :class="inputClassList.fullclasspathSelect" v-model="new_content.fullclasspath" style="width:100%;padding:0px">
                    <template v-for="(rule, index) in new_content.non_setting_rules">
                        <option :key="rule.fullclasspath" :value="rule.fullclasspath" selected>{{ rule.fullclasspath }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.description" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data() {
        return {
            inputClassList: {
                name: ['w3-input','w3-border'],
                fullclasspath: ['w3-input','w3-border'],
                description: ['w3-input','w3-border'],
                fullclasspathSelect: ['w3-select','w3-border','w3-round']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                extjaruid: this.modifyRuleRecord.extjaruid,
                rulename: this.modifyRuleRecord.rulename,
                fullclasspath: this.modifyRuleRecord.fullclasspath,
                active: this.modifyRuleRecord.active,
                description: this.modifyRuleRecord.description,
                non_setting_rules: this.modifyRuleRecord.non_setting_rules
            }
        }
    },
    props: {
        modifyRuleRecord: {
            type: Object,
            default () {
                return {
                    extjaruid: '', 
                    rulename: '', 
                    fullclasspath: '', 
                    active: '1', 
                    description: '' ,
                    non_setting_rules: []
                }
            }
        }
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.rulename === undefined || this.new_content.rulename.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
                return
            }
            
            if(this.new_content.fullclasspath === undefined || this.new_content.fullclasspath.trim().length <= 0){
                this.inputClassList.fullclasspath.splice(2, 1, 'w3-red')
                this.inputClassList.fullclasspathSelect.splice(3, 1, 'w3-red')
                return
            }

            let retContent = {
                "extjaruid": this.new_content.extjaruid,
                "rulename": this.new_content.rulename,
                "fullclasspath": this.new_content.fullclasspath,
                "active": '1',
                "description": this.new_content.description
            }

            return retContent
        },
        reset(){
            this.clearInValid()
            
            this.new_content.extjaruid = this.modifyRuleRecord.extjaruid,
            this.new_content.rulename = this.modifyRuleRecord.rulename,
            this.new_content.fullclasspath = this.modifyRuleRecord.fullclasspath,
            this.new_content.active = '1',
            this.new_content.description = this.modifyRuleRecord.description,
            this.new_content.non_setting_rules = this.modifyRuleRecord.non_setting_rules
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
            this.inputClassList.fullclasspath.splice(2, 1)
            this.inputClassList.fullclasspathSelect.splice(3, 1)
        }
    }
}
</script>
<style lang="scss">
input,select {
    height: 30px
}
</style>
