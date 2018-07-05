<template>
    <div class="w3-small">
        <div class="w3-row">
            <a href="javascript:void(0)" @click="openTab(0)">
                <div :class="tabsClass[0]">Monitor</div>
            </a>
            <a href="javascript:void(0)" @click="openTab(1)">
                <div :class="tabsClass[1]">Notification</div>
            </a>
        </div>
        <div class="w3-row" style="overflow:auto;height:410px">
            <monitor-config-form v-show="tabsFlag[0]"></monitor-config-form>            
            <notification-form v-show="tabsFlag[1]"></notification-form>
        </div>
    </div>
</template>
<script>
import MonitorconfigForm from './MonitorconfigForm.vue'
import NotificationForm from './NotificationForm.vue'

export default {
    data() {
        return {
            tabsClass: ['w3-half tablink w3-bottombar w3-hover-light-grey w3-padding w3-border-theme',
                        'w3-half tablink w3-bottombar w3-hover-light-grey w3-padding'],
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
    },
    components: {
        'monitor-config-form': MonitorconfigForm,
        'notification-form': NotificationForm
    }
}
</script>