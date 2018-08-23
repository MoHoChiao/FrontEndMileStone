<template>
    <modal-window :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <alias-table-panel slot="content" :alias="alias"></alias-table-panel>
        <div slot="footer">&nbsp;</div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import AliasTablePanel from './AliasTablePanel.vue'

export default {
    computed: {
        windowTitle(){
            return 'Apply Permission - ' + this.busentityname
        }
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        busentityname: {
            type: String,
            default: 'UnKnow'
        },
        alias: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        cancel(){
            this.$emit('closeApplyPermission')
        }
    },
    components: {
        'modal-window': ModalWindow,
        'alias-table-panel': AliasTablePanel
    }
}
</script>