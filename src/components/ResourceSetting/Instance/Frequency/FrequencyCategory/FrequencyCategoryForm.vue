<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>{{ $t('Form.Name') }}</label>
            </div>
            <div class="w3-col m6">
                <name-input name="freqcategoryname" :class="[inputClassList.common, errors.has('freqcategoryname')? inputClassList.invalid: '']"
                            v-validate="'required'" v-model="new_content.freqcategoryname" type="text"
                            maxlength="32" placeholder="" style="text-transform:uppercase" />
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">{{ $t('Form.Description') }}</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.common" v-model="new_content.description" type="text" maxlength="255" placeholder="">
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
                    freqcategoryuid: this.content.freqcategoryuid,
                    freqcategoryname: this.content.freqcategoryname,
                    description: this.content.description
                }
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        freqcategoryuid: '',
                        freqcategoryname: '',
                        description: ''
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

                this.new_content.freqcategoryname = this.new_content.freqcategoryname.trim().toUpperCase()
                return this.new_content
            },
            reset() {
                this.new_content.freqcategoryuid = this.content.freqcategoryuid
                this.new_content.freqcategoryname = this.content.freqcategoryname
                this.new_content.description = this.content.description
            }
        }
    }
</script>
<style scoped>

    th {
        padding-top: 13px
    }

    input, select {
        height: 30px
    }

        input.w3-check, input.w3-radio {
            height: 20px
        }
</style>
