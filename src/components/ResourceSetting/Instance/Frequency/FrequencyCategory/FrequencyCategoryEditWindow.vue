<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <frequency-category-form v-if="urlOp === 'add'" slot="content" ref="frequencyCategoryForm"></frequency-category-form>
        <frequency-category-form v-else slot="content" ref="frequencyCategoryForm" :content="content"></frequency-category-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../../util_js/axios_util'
import ModalWindow from '../../../../Common/window/ModalWindow.vue'
import FrequencyCategoryForm from './FrequencyCategoryForm.vue'
import FormButton from '../../../FormButton.vue'

export default {
    // data() {
    //     return {
    //         urlOp: ''
    //     }
    // },
    computed: {
        windowTitle() {
            if (this.urlOp === 'add')
                return this.$t('Window.Schedule.AddFreqCate')
            else if (this.urlOp === 'edit')
                return this.$t('Window.Schedule.EditFreqCate') + ' - ' + this.content.freqcategoryname
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
        content: {
            type: Object,
            default () {
                return {
                    freqcategoryuid: '',
                    freqcategoryname: '',
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
            let postContent = this.$refs.frequencyCategoryForm.save()
            
            if(postContent){
                HTTP_TRINITY.post(`frequency-category/` + this.urlOp, postContent)
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
            this.$refs.frequencyCategoryForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'frequency-category-form': FrequencyCategoryForm,
        'form-button': FormButton
    }
}
</script>