<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <domain-form slot="content" ref="domainForm" :content="content"></domain-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import DomainForm from './DomainForm.vue'
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
                    domainuid: '',
                    name: '',
                    description: '',
                    domainVars: [],
                    domainResources: []
                }
            }
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.domainForm.save()
            
            if(postContent){
                HTTPRepo.post(`domain/add`, postContent)
                .then(response => {
                    this.$emit('closeAdd', response.data)
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