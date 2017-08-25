<template>
<div class="w3-signal-white">
  <div class="container">
    <div class="row">
        <div class="col-md-4 col-sm-4 hidden-lg" v-for="appContent in TrinityApps">
            <app-card :app-title="appContent.name" 
              :img-src="appContent.img" 
              :content-list="appContent.desc" 
              bg-color="signal-white" 
              hover-color="theme-l3-blue-grey" 
              round="xlarge" 
            >
                <login-btn class="w3-margin-bottom" btn-text="Login" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    window-title="Welcome to sign in" 
                    form-action="/test" 
                ></login-btn>
            </app-card>
        </div>
        <div class="col-md-3 col-sm-3 visible-lg" v-for="appContent in TrinityApps">
            <app-card :app-title="appContent.name" 
              :img-src="appContent.img" 
              :content-list="appContent.desc" 
              bg-color="signal-white" 
              hover-color="theme-l3-blue-grey" 
              round="xlarge" 
            >
                <login-btn class="w3-margin-bottom" btn-text="Login" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    window-title="Welcome to sign in" 
                    form-action="/test" 
                ></login-btn>
            </app-card>
        </div>
    </div>
  </div>
</div>
</template>
</div>
</template>
<script>
import AppCard from '../card/AppCard.vue';
import LoginBtn from '../button/LoginBtn.vue';
import { mapGetters } from 'vuex'


export default {
    created() {
        this.$store.dispatch('fetchTrinityAPPS');
    },
    computed: mapGetters({
        TrinityApps: 'getTrinityApps',
    }),
    components: {
        'app-card': AppCard,
        'login-btn': LoginBtn
    }
}
</script>
<style scoped>
.w3-signal-white {
    background-image: url("/src/assets/images/bgpic.jpg");
}
</style>