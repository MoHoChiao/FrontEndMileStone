<template>
    <div v-if="LoginStatus == 'Error'" class="w3-modal" style="display:block">
   		<div class="w3-modal-content w3-animate-top w3-card-8">
      		<div class="w3-panel w3-red">
    			<span @click="close" class="w3-button w3-hover-none w3-display-topright">&times;</span>
    			<h3>{{ LoginStatus }}!</h3>
    			<p>{{ LoginMsg }}</p>
  			</div>
    	</div>
  	</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    computed: mapGetters({
        LoginStatus: 'getLoginStatus',
        LoginMsg: 'getLoginMsg'
    }),
    methods: {
        close() {
            this.$store.dispatch('setLoginStatus', {"status":"","msg":""})
        }
    }
}
</script>