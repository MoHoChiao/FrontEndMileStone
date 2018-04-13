<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>JDBC Driver</label>
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
                <label class="w3-right"><span class="w3-text-red">*</span>JDBC URL</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.url" v-model="new_content.url" type="text" maxlength="255" placeholder="Please Input URL">
            </div>
        </div>
    </div>
</template>
<script>
import { HTTPRepo } from '../../../axios/http-common'

export default {
    data() {
        return {
            inputClassList: {
                url: ['w3-input','w3-border']
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
        save(){
            this.clearInValid()

            if(this.new_content.url === undefined || this.new_content.url.trim().length <= 0){
                this.inputClassList.url.splice(2, 1, 'w3-red')
            }else{
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.name = this.content.name
            this.new_content.url = this.content.url
            this.new_content.driver = this.content.driver
            this.new_content.owner = this.content.owner
        },
        clearInValid(){
            this.inputClassList.url.splice(2, 1)
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
