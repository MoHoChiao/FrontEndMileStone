<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <alias-form ref="aliasForm" slot="content" :content="content"></alias-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import AliasForm from './AliasForm.vue'
import FormButton from '../../FormButton.vue'

export default {
     data() {
        return {
            content: {
                busentityuid: 'global',
                busentityname: '',
                alias: []
            }
        }
     },
    props: {
        windowTitle: {
            type: String,
            default: 'Modify Global Alias Reference'
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    created() {
        this.getGlobalAlias()
    },
    methods: {
        cancel(){
            this.$router.push({ name: 'AliasReference'})
        },
        save(){
            let postContent = this.$refs.aliasForm.save()
            if(postContent){
                HTTPRepo.post(`objectalias/modify?parentUid=global`, postContent)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Global Alias Reference Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.content.alias = response.data
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.aliasForm.reset()
        },
        getGlobalAlias(e){
            HTTPRepo.get(`objectalias/findExtraByParentUid?parentUid=global`)
            .then(response => {
                if(response.data !== ''){
                    this.content.alias = response.data
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
    },
    components: {
        'modal-window': ModalWindow,
        'alias-form': AliasForm,
        'form-button': FormButton
    }
}
</script>