<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Driver.JDBCDriver') }}</label>
            </div>
            <div class="w3-col m6">
                <select class="w3-select w3-border w3-round" v-model="new_content.driver" style="padding:0px">
                    <template v-for="(driverClass, index) in driverClassList">
                        <option :key="index" :value="parseDriverClass(driverClass)">{{ driverClass }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Driver.JDBCURL') }}</label>
            </div>
            <div class="w3-col m9">
                <input name="url" :class="[inputClassList.common, errors.has('url')? inputClassList.invalid: '']"
                       v-validate="'required'" v-model="new_content.url" type="text" maxlength="255" placeholder="">
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
                name: this.content.name,
                url: this.content.url,
                driver: this.content.driver,
                owner: this.content.owner,
            }
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    name: '',
                    url: '',
                    driver: '',
                    owner: ''
                }
            }
        },
        driverClassList: {
            type: Array,
            default: []
        }
    },
    methods: {
        async save() {
            await this.$validator.validateAll()

            if (this.errors.any()) {
                return
            }

            return this.new_content
        },
        reset(){
            this.new_content.name = this.content.name
            this.new_content.url = this.content.url
            this.new_content.driver = this.content.driver
            this.new_content.owner = this.content.owner
        },
        parseDriverClass(driverClass){
            return driverClass.substring(0,driverClass.indexOf(" "))
        }
    }
}
</script>
<style scoped>
    input,select {
        height: 30px
    }
</style>
