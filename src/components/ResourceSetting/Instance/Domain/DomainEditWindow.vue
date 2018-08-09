<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <domain-form v-if="urlOp === 'add'" slot="content" ref="domainForm"></domain-form>
        <domain-form v-else slot="content" ref="domainForm" :content="content" :urlOp="urlOp"></domain-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import DomainForm from './DomainForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add Domain'
            else if(this.urlOp === 'edit')
                return 'Edit Domain - ' + this.content.name
            else if(this.urlOp === 'copy')
                return 'Copy Domain from ' + this.content.name
        }  
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        //store selected domain
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
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        cancel(){
            if(this.urlOp === 'add')
                this.$emit('closeAdd')
            else if(this.urlOp === 'edit')
                this.$emit('closeEdit')
            else if(this.urlOp === 'copy')
                this.$emit('closeCopy')
        },
        save(){
            let postContent = this.$refs.domainForm.save()

            let urlPath = ''
            if(this.urlOp === 'add' || this.urlOp === 'copy'){   //新增或複制一筆domain
                urlPath = 'add'
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的domain
                urlPath = 'edit'
            } else {
                return
            }
            
            if(postContent){
                HTTP_TRINITY.post(`domain/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }else if(this.urlOp === 'copy'){  //copy operation
                        this.$emit('closeCopy', response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.domainForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'domain-form': DomainForm,
        'form-button': FormButton
    }
}
</script>