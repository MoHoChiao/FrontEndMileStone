<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <file-source-category-form slot="content" ref="fileSourceCategoryForm" :content="content"></file-source-category-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FileSourceCategoryForm from './FileSourceCategoryForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    props: {
        windowTitle: {
            type: String,
            default: ''
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
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
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let urlOp = 'add'
            if(this.content.fscategoryuid && this.content.fscategoryuid !== '')
                urlOp = 'edit'

            let postContent = this.$refs.fileSourceCategoryForm.save()
            
            if(postContent){
                HTTPRepo.post(`file-source-category/` + urlOp, postContent)
                .then(response => {
                    if(urlOp === 'add') //add operation
                        this.$emit('closeAdd', response.data)
                    else    //edit operation
                        this.$emit('closeEdit', response.data)   
                })
                .catch(error => {
                    if (error.response) {
                        let newStatus = {
                            "msg": error.response.data,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    } else {
                        let newStatus = {
                            "msg": error.message,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                })
            }
        },
        reset(){
            this.$refs.fileSourceCategoryForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'file-source-category-form': FileSourceCategoryForm,
        'form-button': FormButton
    }
}
</script>