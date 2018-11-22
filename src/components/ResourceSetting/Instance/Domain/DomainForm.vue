<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Name') }}</label>
            </div>
            <div class="w3-col m6">
                <name-input name="name" :class="[inputClassList.common, errors.has('name')? inputClassList.invalid: '']" 
                            v-validate="'required'" v-model="new_content.name" type="text" maxlength="32" placeholder="" 
                            style="text-transform:uppercase" />
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Description') }}</label>
            </div>
            <div class="w3-col m10">
                <input :class="inputClassList.common" v-model="new_content.description" type="text" maxlength="255" placeholder="">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <var-resource-panel ref="varAndResourceTable" :domainVars="content.domainVars" :domainResources="content.domainResources" />
            </div>
        </div>
    </div>
</template>
<script>
    import VarAndResourcePanel from './VarAndResourcePanel.vue'

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
                    domainuid: this.content.domainuid,
                    name: this.content.name,
                    description: this.content.description
                }
            }
        },
        created() {
            if (this.urlOp === 'copy') {
                //copy動作, 把name和description設空值
                this.new_content.domainuid = ''
                this.new_content.name = ''
                this.new_content.description = ''
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        domainuid: '',
                        name: '',
                        description: '',
                        domainVars: [],
                        domainResources: []
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

                if (this.$refs.varAndResourceTable.isDuplicateInDomainVars()) {
                    let newStatus = {
                        "msg": "Duplicate Domain Variable Name",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.new_content.domainVars = this.$refs.varAndResourceTable.openTab(0)
                    return
                } else {
                    this.new_content.domainVars = this.$refs.varAndResourceTable.getDomainVars()
                }

                if (this.$refs.varAndResourceTable.isEmptyInDomainResources()) {
                    let newStatus = {
                        "msg": "Domain Resource Value can not be empty",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.new_content.domainVars = this.$refs.varAndResourceTable.openTab(1)
                    return
                } else {
                    this.new_content.domainResources = this.$refs.varAndResourceTable.getDomainResources()
                }

                return this.new_content
            },
            reset() {
                if (this.urlOp === 'copy') {
                    this.new_content.domainuid = ''
                    this.new_content.name = ''
                    this.new_content.description = ''
                } else {
                    this.new_content.domainuid = this.content.domainuid
                    this.new_content.name = this.content.name
                    this.new_content.description = this.content.description
                }

                this.$refs.varAndResourceTable.reset()
            }
        },
        components: {
            'var-resource-panel': VarAndResourcePanel
        }
    }
</script>
<style scoped>

    input {
        height: 30px;
    }
</style>