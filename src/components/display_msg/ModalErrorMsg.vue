<template>
    <div v-if="systemStatus !== ''" class="w3-modal" style="display:block">
   		<div class="w3-modal-content w3-animate-zoom w3-card-4">
      		<div :class="classList">
    			<span @click="close" class="w3-button w3-hover-none w3-display-topright">&times;</span>
    			<h3>{{ systemStatus }}!</h3>
    			<p v-html="systemMsg"></p>
  			</div>
    	</div>
  	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        //ES7的寫法
        ...mapGetters({
            systemStatus: 'getSystemStatus',
            systemMsg: 'getSystemMsg',
        }),
        classList() {
            return [
                'w3-panel',
                this.color
            ];
        },
        color() {
            return this.systemStatus === 'Error' ? `w3-highway-red` : 'w3-highway-schoolbus';
        }
    },
    methods: {
        close() {
            this.$store.dispatch('setSystemStatus', {"status":"","msg":""})
        }
    }
}
</script>