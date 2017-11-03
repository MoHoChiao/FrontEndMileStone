<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.fscategoryname" type="text" maxlength="32" placeholder="Please Input Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
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
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                fscategoryuid: this.content.fscategoryuid,
                fscategoryname: this.content.fscategoryname,
                description: this.content.description
            }
        }
    },
    computed: {
        _classList() {
            return {
                name:  ['w3-input','w3-border']
            };
        },
        _invalidClassList() {
            return [
                'w3-input',
                'w3-border',
                'w3-text-red'
            ];
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    fscategoryuid: '',
                    fscategoryname: '',
                    description: ''
                }
            }
        }
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.fscategoryname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-text-red')
            }else{
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.fscategoryuid = this.content.fscategoryuid
            this.new_content.fscategoryname = this.content.fscategoryname
            this.new_content.description = this.content.description
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
        }
    }
}
</script>
<style scoped>
    th {
        padding-top:13px
    }
    input,select {
        height: 30px
    }
    input.w3-check,input.w3-radio {
        height: 20px
    }
</style>
