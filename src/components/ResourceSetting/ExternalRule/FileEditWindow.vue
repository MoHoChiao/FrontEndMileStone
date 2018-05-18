<template>
    <modal-window :window-title="'Edit File - ' + modifyFileRecord.filename" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <file-edit-form slot="content" ref="fileEditForm" :modifyFileRecord="modifyFileRecord"></file-edit-form>
        <div slot="footer">
            <form-button btn-color="signal-white" :is-loading="buttonLoading" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../util_js/axios_util';
import ModalWindow from '../../Common/window/ModalWindow.vue';
import FileEditForm from './FileEditForm.vue';
import FormButton from '../FormButton.vue';

export default {
    data() {
        return {
            buttonLoading: false,
        }
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        index:{
            type: Number,
            default: 0
        },
        modifyFileRecord: {
            type: Object,
            default: function () {
                return { 
                    extjaruid: '',
                    filename: '',
                    description: ''
                }
            }
        }
    },
    methods: {
        cancel(){
            if(this.buttonLoading)
                return
            this.$emit('closeEdit')
        },
        save(){
            let postContent = this.$refs.fileEditForm.save()
            
            if(postContent){
                this.buttonLoading = true

                HTTPRepo.get(`dm-ext-jar/editDescriptionOnly`, {
                    params: {
                        extJarUid: postContent.extjaruid,
                        description: postContent.description
                    }
                })
                .then(response => {
                    this.buttonLoading = false
                    this.$emit('closeEdit', this.index, response.data)
                })
                .catch(error => {
                    this.buttonLoading = false
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.fileEditForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'file-edit-form': FileEditForm,
        'form-button': FormButton
    }
}
</script>