<template>
    <div class="w3-small">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Name') }}</label>
            </div>
            <div class="w3-col m6">
                <name-input name="rolename" :class="[inputClassList.common, errors.has('rolename')? inputClassList.invalid: '']" 
                            v-validate="'required|alpha_dash'" v-model="new_content.rolename" type="text"
                            maxlength="32" placeholder="" :readonly="this.new_content.roleuid.startsWith('Role')"/>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Description') }}</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.common" v-model="new_content.description" type="text"
                       maxlength="255" placeholder="" :readonly="this.new_content.roleuid.startsWith('Role')">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.HomeDir') }}</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.common" v-model="new_content.homedir" type="text" maxlength="255" placeholder="">
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
                    roleuid: this.content.roleuid,
                    rolename: this.content.rolename,
                    description: this.content.description,
                    homedir: this.content.homedir
                }
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        roleuid: '',
                        rolename: '',
                        description: '',
                        homedir: ''
                    }
                }
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
            reset() {
                this.new_content.roleuid = this.content.roleuid
                this.new_content.rolename = this.content.rolename
                this.new_content.description = this.content.description
                this.new_content.homedir = this.content.homedir
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
