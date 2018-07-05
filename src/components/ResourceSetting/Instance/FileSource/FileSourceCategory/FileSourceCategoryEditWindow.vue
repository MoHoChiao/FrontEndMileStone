<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <file-source-category-form v-if="urlOp === 'add'" slot="content" ref="fileSourceCategoryForm"></file-source-category-form>
        <file-source-category-form v-else slot="content" ref="fileSourceCategoryForm" :content="content"></file-source-category-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../../util_js/axios_util'
import ModalWindow from '../../../../Common/window/ModalWindow.vue'
import FileSourceCategoryForm from './FileSourceCategoryForm.vue'
import FormButton from '../../../FormButton.vue'

export default {
    // data() {
    //     return {
    //         urlOp: ''
    //     }
    // },
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
            else
                this.$emit('closeEdit')
        },
        save(){
            let postContent = this.$refs.fileSourceCategoryForm.save()
            
            if(postContent){
                HTTP_TRINITY.post(`file-source-category/` + this.urlOp, postContent)
                .then(response => {
                    if(this.urlOp === 'add') //add operation
                        this.$emit('closeAdd', response.data)
                    else    //edit operation
                        this.$emit('closeEdit', response.data)   
                })
                .catch(error => {
                    errorHandle(this.$store, error)
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