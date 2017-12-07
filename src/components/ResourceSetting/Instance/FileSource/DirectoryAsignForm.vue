<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row-padding w3-section">
            <div class="w3-col m2">&nbsp;</div>
            <div class="w3-col m4">
                <input :class="inputClassList.rootdir" v-model="new_content.rootdir" type="text" placeholder="Root Path">
            </div>
            <div class="w3-col m4">
                <button class="w3-button w3-blue-grey w3-round" @click="applyRoot" style="padding-top:6px;padding-bottom:6px">Generate</button>
            </div>
            <div class="w3-col m2">&nbsp;</div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Received Directory</label>
                <input :class="inputClassList.receivedir" v-model="new_content.receivedir" type="text" maxlength="128" placeholder="Please Input Received Path">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Corrupt Directory</label>
                <input :class="inputClassList.corruptdir" v-model="new_content.corruptdir" type="text" maxlength="128" placeholder="Please Input Corrupt Path">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Target Directory</label>
                <input :class="inputClassList.targetdir" v-model="new_content.targetdir" type="text" maxlength="128" placeholder="Please Input Target Path">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Duplicate Directory</label>
                <input :class="inputClassList.duplicatedir" v-model="new_content.duplicatedir" type="text" maxlength="128" placeholder="Please Input Duplicate Path">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Complete Directory</label>
                <input :class="inputClassList.completedir" v-model="new_content.completedir" type="text" maxlength="128" placeholder="Please Input Complete Path">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>Error Directory</label>
                <input :class="inputClassList.errordir" v-model="new_content.errordir" type="text" maxlength="128" placeholder="Please Input Error Path">
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'

export default {
    data() {
        return {
            inputClassList: {
                rootdir: ['w3-input'],
                receivedir: ['w3-input','w3-border'],
                targetdir: ['w3-input','w3-border'],
                completedir: ['w3-input','w3-border'],
                corruptdir: ['w3-input','w3-border'],
                duplicatedir: ['w3-input','w3-border'],
                errordir: ['w3-input','w3-border']
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
            default () {
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
        applyRoot(){
            this.new_content.receivedir =  this.new_content.rootdir + '/Receive'
            this.new_content.targetdir =  this.new_content.rootdir + '/Target'
            this.new_content.completedir =  this.new_content.rootdir + '/Completed'
            this.new_content.corruptdir =  this.new_content.rootdir + '/Corrupt'
            this.new_content.duplicatedir =  this.new_content.rootdir + '/Duplicate'
            this.new_content.errordir =  this.new_content.rootdir + '/Error'
        },
        save(){
            this.clearInValid()

            if(this.new_content.receivedir.trim().length <= 0){
                this.inputClassList.receivedir.splice(2, 1, 'w3-red')
                return
            }else if(this.new_content.targetdir.trim().length <= 0){
                this.inputClassList.targetdir.splice(2, 1, 'w3-red')
                return
            }else if(this.new_content.completedir.trim().length <= 0){
                this.inputClassList.completedir.splice(2, 1, 'w3-red')
                return
            }else if(this.new_content.corruptdir.trim().length <= 0){
                this.inputClassList.corruptdir.splice(2, 1, 'w3-red')
                return
            }else if(this.new_content.duplicatedir.trim().length <= 0){
                this.inputClassList.duplicatedir.splice(2, 1, 'w3-red')
                return
            }else if(this.new_content.errordir.trim().length <= 0){
                this.inputClassList.errordir.splice(2, 1, 'w3-red')
                return
            }
            return this.new_content
        },
        reset(){
            //clear red font
            this.clearInValid()

            //reset value to initial
            this.new_content.rootdir = this.content.rootdir
            this.new_content.receivedir = this.content.receivedir
            this.new_content.targetdir = this.content.targetdir
            this.new_content.completedir = this.content.completedir
            this.new_content.corruptdir = this.content.corruptdir
            this.new_content.duplicatedir = this.content.duplicatedir
            this.new_content.errordir = this.content.errordir
        },
        clearInValid(){
            this.inputClassList.receivedir.splice(2, 1)
            this.inputClassList.targetdir.splice(2, 1)
            this.inputClassList.completedir.splice(2, 1)
            this.inputClassList.corruptdir.splice(2, 1)
            this.inputClassList.duplicatedir.splice(2, 1)
            this.inputClassList.errordir.splice(2, 1)
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