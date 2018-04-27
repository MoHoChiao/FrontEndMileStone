<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <excl-frequency-form slot="content" ref="exclFreqForm" :content="content"></excl-frequency-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import ExclFrequencyForm from './ExclFrequencyForm.vue'
import FormButton from '../../FormButton.vue'

export default {
     data() {
        return {
            content: {
                excludefrequencyuid: 'global',
                excludefrequencyname: 'GLOBAL',
                description: '',
                activate: '0',
                excludefrequencylist: []
            }
        }
     },
    props: {
        windowTitle: {
            type: String,
            default: 'Modify Global Exclude Frequency'
        },
        windowBgColor: {
            type: String,
            default: 'camo-black'
        }
    },
    created() {
        this.getGlobalExclFreq()
    },
    methods: {
        cancel(){
            this.$router.push({ name: 'ExclFrequency'})
        },
        save(){
            let postContent = this.$refs.exclFreqForm.save()
            if(postContent){
                HTTPRepo.post(`excl-frequency/modifyGlobal`, postContent)
                .then(response => {
                    let newStatus = {
                        "msg": "Modify Global Exclude Frequency Success.",
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
            this.$refs.exclFreqForm.reset()
        },
        getGlobalExclFreq(e){
            HTTPRepo.get(`excl-frequency/findByGlobal`)
            .then(response => {
                if(response.data !== ''){
                    this.content = response.data
                }
            })
            .catch(error => {
                errorHandle(this.$store, error)
            })
        },
    },
    components: {
        'modal-window': ModalWindow,
        'excl-frequency-form': ExclFrequencyForm,
        'form-button': FormButton
    }
}
</script>