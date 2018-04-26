<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <connection-category-form v-if="urlOp === 'add'" slot="content" ref="connectionCategoryForm"></connection-category-form>
        <connection-category-form v-else slot="content" ref="connectionCategoryForm" :content="content"></connection-category-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../../axios/http-common'
import ModalWindow from '../../../../Common/window/ModalWindow.vue'
import ConnectionCategoryForm from './ConnectionCategoryForm.vue'
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
                    conncategoryuid: '',
                    conncategoryname: '',
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
            let postContent = this.$refs.connectionCategoryForm.save()
            
            if(postContent){
                HTTPRepo.post(`connection-category/` + this.urlOp, postContent)
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
            this.$refs.connectionCategoryForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'connection-category-form': ConnectionCategoryForm,
        'form-button': FormButton
    }
}
</script>