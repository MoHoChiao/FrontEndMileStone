<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <domain-form slot="content" ref="domainForm" :content="content"></domain-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
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
                HTTPRepo.post(`domain/edit`, postContent)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Global Domain Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                    this.content = response.data
                })
                .catch(error => {
                    if (error.response && error.response.data) {
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
            this.$refs.domainForm.reset()
        },
        getGlobalDomain(e){
            HTTPRepo.get(`domain/findByUid?uid=global`)
            .then(response => {
                this.content = response.data
            })
            .catch(error => {
                if (error.response && error.response.data) {
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
        },
    },
    components: {
        'modal-window': ModalWindow,
        'domain-form': DomainForm,
        'form-button': FormButton
    }
}
</script>