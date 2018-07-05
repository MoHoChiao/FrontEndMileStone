<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.freqcategoryname" type="text" 
                    maxlength="32" placeholder="Please Input Name" style="text-transform:uppercase">
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
                freqcategoryuid: this.content.freqcategoryuid,
                freqcategoryname: this.content.freqcategoryname,
                description: this.content.description
            }
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    freqcategoryuid: '',
                    freqcategoryname: '',
                    description: ''
                }
            }
        }
    },
    methods: {
        save(){
            this.clearInValid()
            
            if(this.new_content.freqcategoryname === undefined || this.new_content.freqcategoryname.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else{
                this.new_content.freqcategoryname = this.new_content.freqcategoryname.trim().toUpperCase()
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.freqcategoryuid = this.content.freqcategoryuid
            this.new_content.freqcategoryname = this.content.freqcategoryname
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
