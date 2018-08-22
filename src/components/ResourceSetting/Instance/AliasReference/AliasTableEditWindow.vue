<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <alias-form slot="content" ref="aliasForm" :content="content"></alias-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import AliasForm from './AliasForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            return 'Edit Alias Under the ' + this.content.busentityname
        }
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        content: {
            type: Object,
            default () {
                return {
                    busentityuid: '',
                    busentityname: '',
                    alias: []
                }
            }
        }
    },
    methods: {
        cancel(){
            this.$emit('closeEdit')
        },
        save(){
            let postContent = this.$refs.aliasForm.save()
            if(postContent){
                HTTP_TRINITY.post(`objectalias/modify?parentUid=`+this.content.busentityuid, postContent)
                .then(response => {
                    this.$emit('closeEdit', response.data)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.aliasForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'alias-form': AliasForm,
        'form-button': FormButton
    }
}
</script>