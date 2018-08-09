<template>
    <div class=" w3-col m9 w3-animate-opacity">
        <div class="w3-row-padding">
            <div class="w3-col m12">
                <div class="w3-card-4 w3-round w3-signal-white">
                    <div class="w3-container w3-small">
                        <p>
                            <div>
                                <span><img src="/src/assets/images/resource_setter/User.png" alt="External Rule" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                                <span>
                                    <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;transform:rotate(-5deg)">
                                        <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                            Configuration
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </p>
                        <trinity-config-form slot="content" ref="configForm"></trinity-config-form>
                        <div slot="footer">
                            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import TrinityconfigForm from './TrinityconfigForm.vue'
    import FormButton from '../FormButton.vue'

    export default {
        components: {
            'trinity-config-form': TrinityconfigForm,
            'form-button': FormButton
        },
        methods: {
            cancel() {
                this.$emit('closeAdd')
            },
            save() {
                let postContent = this.$refs.configForm.save()
                if (postContent) {
                    HTTP_TRINITY.post(`trinity-config/edit`, postContent)
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
            reset() {
                this.$refs.configForm.reset()
            }
        }
    }
</script>