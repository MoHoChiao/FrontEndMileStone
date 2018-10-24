<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Name') }}</label>
            </div>
            <div class="w3-col m6">
                <input v-if="this.new_content.roleuid.startsWith('Role')" :class="inputClassList.name" v-model="new_content.rolename" type="text"
                       maxlength="32" placeholder="" readonly>
                <name-input v-else :class="inputClassList.name" v-model="new_content.rolename" type="text"
                            maxlength="32" placeholder="" />
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Description') }}</label>
            </div>
            <div class="w3-col m9">
                <input v-if="this.new_content.roleuid.startsWith('Role')" :class="inputClassList.desc"
                       v-model="new_content.description" type="text" maxlength="255" placeholder="" readonly>
                <input v-else :class="inputClassList.desc" v-model="new_content.description" type="text"
                       maxlength="255" placeholder="">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.HomeDir') }}</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.homedir" v-model="new_content.homedir" type="text" maxlength="255" placeholder="">
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                inputClassList: {
                    name: ['w3-input', 'w3-border'],
                    desc: ['w3-input', 'w3-border'],
                    homedir: ['w3-input', 'w3-border']
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
            save() {
                this.clearInValid()

                if (this.new_content.rolename === undefined || this.new_content.rolename.trim().length <= 0) {
                    this.inputClassList.name.splice(2, 1, 'w3-red')
                } else {
                    return this.new_content
                }
            },
            reset() {
                this.clearInValid()

                this.new_content.roleuid = this.content.roleuid
                this.new_content.rolename = this.content.rolename
                this.new_content.description = this.content.description
                this.new_content.homedir = this.content.homedir
            },
            clearInValid() {
                this.inputClassList.name.splice(2, 1)
            }
        }
    }
</script>
