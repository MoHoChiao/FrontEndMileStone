<template>
    <div class="w3-small">
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right"><span class="w3-text-red">*</span>Name</label>
            </div>
            <div class="w3-col m6">
                <input :class="inputClassList.name" v-model="new_content.name" type="text" 
                    maxlength="32" placeholder="Please Input Domain Name" 
                    style="text-transform:uppercase">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m2" style="padding:8px 4px 8px 0px">
                <label class="w3-right">Description</label>
            </div>
            <div class="w3-col m10">
                <input :class="inputClassList.desc" v-model="new_content.description" type="text" maxlength="255" placeholder="Please Input Description">
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <var-resource-panel ref="varAndResourceTable" :domainVars="content.domainVars" :domainResources="content.domainResources"></var-resource-panel>
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
                name: ['w3-input','w3-border'],
                desc: ['w3-input','w3-border']
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
    props: {
        content: {
            type: Object,
            default () {
                return {
                    domainuid: '',
                    name: '',
                    description: '',
                    domainVars: [],
                    domainResources: []
                }
            }
        },
        index: Number
    },
    methods: {
        save(){
            this.clearInValid()

            this.new_content.name = this.new_content.name.trim().toUpperCase()

            if(this.new_content.name.length <= 0){
                this.inputClassList.name.splice(2, 1, 'w3-red')
            }else{
                if(this.$refs.varAndResourceTable.isDuplicateInDomainVars()){
                    let newStatus = {
                        "msg": "Duplicate Domain Variable Names!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.new_content.domainVars = this.$refs.varAndResourceTable.openTab(0)
                    return
                }else{
                    this.new_content.domainVars = this.$refs.varAndResourceTable.getDomainVars()
                }
                
                if(this.$refs.varAndResourceTable.isEmptyInDomainResources()){
                    let newStatus = {
                        "msg": "Domain Resource Value can not be empty!",
                        "status": "Warn"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.new_content.domainVars = this.$refs.varAndResourceTable.openTab(1)
                    return
                }else{
                    this.new_content.domainResources = this.$refs.varAndResourceTable.getDomainResources()
                }
                
                return this.new_content

                // this.new_content.domainVars = this.$refs.varAndResourceTable.getDomainVars()
                // this.new_content.domainResources = this.$refs.varAndResourceTable.getDomainResources()
                // return this.new_content
            }                
        },
        reset(){
            this.clearInValid()
            
            this.new_content.domainuid = this.content.domainuid
            this.new_content.name = this.content.name
            this.new_content.description = this.content.description
            
            this.$refs.varAndResourceTable.reset()
        },
        clearInValid(){
            this.inputClassList.name.splice(2, 1)
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