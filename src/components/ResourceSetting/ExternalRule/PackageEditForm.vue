<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Package Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.packagename" type="text" maxlength="50" placeholder="Please Input Package Name">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m9">
                <input :class="inputClassList.description" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
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
                description: ['w3-input','w3-border']
            },
            new_content: {
                /*
                    javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                    To avoid parent content to be changed.
                */
                packageuid: this.content.packageuid,
                packagename: this.content.packagename,
                description: this.content.description
            }
        }
    },
    props: {
        content: {
            type: Object,
            default () {
                return {
                    packageuid: '',
                    packagename: '',
                    description: ''
                }
            }
        }
    },
    methods: {
        save(){
            this.clearInValid()

            if(this.new_content.packagename === undefined || this.new_content.packagename.trim().length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else{
                return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.packageuid = this.content.packageuid
            this.new_content.packagename = this.content.packagename
            this.new_content.description = this.content.description
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
        }
    }
}
</script>
<style scoped>
    input {
        height: 30px
    }
</style>
