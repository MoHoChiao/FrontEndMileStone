<template>
    <div class=" w3-col m9 w3-animate-opacity">
        <div class="w3-row-padding w3-small">
            <div class="w3-col m12">
                <div class="w3-container w3-card-4 w3-signal-white w3-round">
                    <div class="w3-panel w3-border w3-round w3-padding">
                        <div>
                            <span><img src="src/assets/images/resource_setter/User.png" alt="External Rule" class="w3-margin-right w3-left w3-hide-small" style="height26px;width:32px"></span>
                            <span>
                                <div class="w3-tag w3-round w3-blue-grey" style="padding:3px;/*transform:rotate(-5deg)*/">
                                    <div class="w3-tag w3-round w3-blue-grey w3-border w3-border-white">
                                        {{ $t('Item.ServerMonitor') }}
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div class="w3-row">
                        <a href="javascript:void(0)" @click="openTab(0)">
                            <div :class="tabsClass[0]">{{ $t('Form.ServerMonitor.Monitor') }}</div>
                        </a>
                        <a href="javascript:void(0)" @click="openTab(1)">
                            <div :class="tabsClass[1]">{{ $t('Form.ServerMonitor.Notification') }}</div>
                        </a>
                    </div>
                    <div class="w3-row" style="overflow:auto;height:410px">
                        <monitor-config-form v-show="tabsFlag[0]"></monitor-config-form>
                        <notification-form v-show="tabsFlag[1]"></notification-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import MonitorconfigForm from './MonitorconfigForm.vue'
    import NotificationForm from './NotificationForm.vue'

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
                tabsFlag: [true, false]
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
            }
        }
    }
</script>