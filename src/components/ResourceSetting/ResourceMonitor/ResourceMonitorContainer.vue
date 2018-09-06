<template>
    <div class=" w3-col m9 w3-animate-opacity">
        <div class="w3-small w3-row-padding">
            <div class="w3-col m12">
                <div class="w3-container w3-card-4 w3-round w3-signal-white">
                    <div class="w3-panel w3-border w3-round w3-padding">
                        <div>
                            <span>
                                <img src="/src/assets/images/resource_setter/User.png" class="w3-margin-right w3-left w3-hide-small"
                                     style="height:26px;width:32px">
                            </span>
                            <span>
                                <i class="w3-tag w3-round w3-blue-grey" style="padding:3px;/*transform:rotate(-5deg)*/">
                                    <i class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        Server Monitor
                                    </i>
                                </i>
                            </span>
                        </div>
                    </div>
                    <div class="w3-bottombar">Resource Alert</div>
                    <div>
                        <monitor-config-form :eventBus="eventBus" />
                    </div>
                    <div class="w3-bottombar">Notification</div>
                    <div>
                        <notification-form :eventBus="eventBus" />
                    </div>
                    <div class="w3-section w3-center">
                        <button class="w3-button w3-round w3-blue-grey" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import MonitorconfigForm from './MonitorconfigForm.vue'
    import NotificationForm from './NotificationForm.vue'
    import Vue from 'vue'

    export default {
        components: {
            'monitor-config-form': MonitorconfigForm,
            'notification-form': NotificationForm
        },
        data() {
            return {
                tabsClass: [
                    //'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                    //'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'
                    'w3-half tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding w3-border-theme',
                    'w3-half tablink w3-bottombar w3-hover-blue-grey w3-hover-opacity w3-padding'
                ],
                tabsFlag: [true, false],
                eventBus: new Vue()
            }
        },
        methods: {
            openTab(whichTab) {
                for (let i = 0; i < this.tabsFlag.length; i++) {
                    this.$set(this.tabsFlag, i, false)
                }
                this.$set(this.tabsFlag, whichTab, true)

                for (let i = 0; i < this.tabsClass.length; i++) {
                    this.$set(this.tabsClass, i, this.tabsClass[i].replace(" w3-border-theme", ""))
                }
                this.$set(this.tabsClass, whichTab, this.tabsClass[whichTab] + " w3-border-theme")
            },
            save() {
                this.eventBus.$emit('save')
            }
        }
    }
</script>