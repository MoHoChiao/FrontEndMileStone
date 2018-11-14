<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2">&nbsp;</div>
            <div class="w3-col m4">
                <input :class="inputClassList.rootdir" v-model="new_content.rootdir" type="text" :placeholder="$t('Form.Fs.RootPath')">
            </div>
            <div class="w3-col m4">
                <button class="w3-button w3-blue-grey w3-round" @click="applyRoot" style="padding-top:6px;padding-bottom:6px">{{ $t('Form.Generate') }}</button>
            </div>
            <div class="w3-col m2">&nbsp;</div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.ReceivedDir') }}</label>
                <input name="receivedir" :class="[inputClassList.common, errors.has('receivedir')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="new_content.receivedir" type="text" maxlength="128" placeholder="">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.CorruptDir') }}</label>
                <input name="corruptdir" :class="[inputClassList.common, errors.has('corruptdir')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="new_content.corruptdir" type="text" maxlength="128" placeholder="">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.TargetDir') }}</label>
                <input name="targetdir" :class="[inputClassList.common, errors.has('targetdir')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="new_content.targetdir" type="text" maxlength="128" placeholder="">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.DuplicateDir') }}</label>
                <input name="duplicatedir" :class="[inputClassList.common, errors.has('duplicatedir')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="new_content.duplicatedir" type="text" maxlength="128" placeholder="">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.CompleteDir') }}</label>
                <input name="completedir" :class="[inputClassList.common, errors.has('completedir')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="new_content.completedir" type="text" maxlength="128" placeholder="">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.ErrorDir') }}</label>
                <input name="errordir" :class="[inputClassList.common, errors.has('errordir')? inputClassList.invalid: '']" 
                       v-validate="'required'" v-model="new_content.errordir" type="text" maxlength="128" placeholder="">
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
                    rootdir: 'w3-input',
                    invalid: 'w3-pale-red'
                },
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    rootdir: this.content.rootdir,
                    receivedir: this.content.receivedir,
                    targetdir: this.content.targetdir,
                    completedir: this.content.completedir,
                    corruptdir: this.content.corruptdir,
                    duplicatedir: this.content.duplicatedir,
                    errordir: this.content.errordir
                }
            }
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        rootdir: '',
                        receivedir: '',
                        targetdir: '',
                        completedir: '',
                        corruptdir: '',
                        duplicatedir: '',
                        errordir: ''
                    }
                }
            },
            index: Number
        },
        methods: {
            applyRoot() {
                this.new_content.receivedir = this.new_content.rootdir + '/Receive'
                this.new_content.targetdir = this.new_content.rootdir + '/Target'
                this.new_content.completedir = this.new_content.rootdir + '/Completed'
                this.new_content.corruptdir = this.new_content.rootdir + '/Corrupt'
                this.new_content.duplicatedir = this.new_content.rootdir + '/Duplicate'
                this.new_content.errordir = this.new_content.rootdir + '/Error'
            },
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                } else {
                    return this.new_content
                }
            },
            reset() {
                //reset value to initial
                this.new_content.rootdir = this.content.rootdir
                this.new_content.receivedir = this.content.receivedir
                this.new_content.targetdir = this.content.targetdir
                this.new_content.completedir = this.content.completedir
                this.new_content.corruptdir = this.content.corruptdir
                this.new_content.duplicatedir = this.content.duplicatedir
                this.new_content.errordir = this.content.errordir
            }
        }
    }
</script>
<style scoped>

    input {
        height: 30px
    }

    input.w3-check {
        height: 20px
    }
</style>