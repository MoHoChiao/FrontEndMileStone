<template>
    <modal-window v-if="windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <trinity-config-form slot="content" ref="configForm"></trinity-config-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../axios/http-common'
import ModalWindow from '../../Common/window/ModalWindow.vue'
import TrinityconfigForm from './TrinityconfigForm.vue'
import FormButton from '../FormButton.vue'

export default {
    props: {
        windowTitle: {
            type: String,
            default: 'Modify Global Exclude Frequency'
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        cancel(){
            this.$emit('closeAdd')
        },
        save(){
            let postContent = this.$refs.configForm.save()
            if(postContent){
                HTTPRepo.post(`trinity-config/edit`, postContent)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Trinity Configuration Success.",
                        "status": "Success"
                    }
                    this.$store.dispatch('setSystemStatus', newStatus)
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.configForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'trinity-config-form': TrinityconfigForm,
        'form-button': FormButton
    }
}
</script>