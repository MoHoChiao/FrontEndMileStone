<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <domain-form slot="content" ref="domainForm" :content="content"></domain-form>
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
     data() {
        return {
            content: {
                domainuid: 'global',
                name: 'GLOBAL',
                description: 'Global Domain',
                domainVars: [],
                domainResources: []
            }
        }
     },
    props: {
        windowTitle: {
            type: String,
            default: 'Modify Global Domain'
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    created() {
        this.getGlobalDomain()
    },
    methods: {
        cancel(){
            this.$router.push({ name: 'Domain'})
        },
        save(){
            let postContent = this.$refs.domainForm.save()
            
            if(postContent){
                HTTP_TRINITY.post(`domain/edit`, postContent)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Global Domain Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.content = response.data
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.domainForm.reset()
        },
        getGlobalDomain(e){
            HTTP_TRINITY.get(`domain/findByUid?uid=global`)
            .then(response => {
                this.content = response.data
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
    },
    components: {
        'modal-window': ModalWindow,
        'domain-form': DomainForm,
        'form-button': FormButton
    }
}
</script>