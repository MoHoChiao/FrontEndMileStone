<template>
  <div class="w3-container w3-content" style="max-width:1250px;margin-top:20px;margin-bottom:20px">
    <div class="w3-row">
        <div class="w3-col m3 w3-hide-medium w3-hide-small" style="padding-left:6px;padding-right:6px" v-for="appContent in TrinityApps">
            <app-card :app-title="appContent.name" 
              :img-src="appContent.img" 
              :content-list="appContent.desc" 
              bg-color="signal-white" 
              hover-color="theme-l3-blue-grey" 
              round="xlarge" 
            >
                <login-btn v-if="(loginStatus === '' || loginStatus === 'ChangeCredentials')" class="w3-margin-bottom" btn-text="Login" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    window-title="Welcome to sign in"
                ></login-btn>
                <goto-btn v-else-if="(appContent.authorization === 'G') || (appContent.authorization === 'R' && appContent.authorization === userType)" 
                    class="w3-margin-bottom" btn-text="Go to" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    :a-target="appContent.target" 
                    :a-url="appContent.url"
                ></goto-btn>
                <no-permission-btn v-else class="w3-margin-bottom" btn-text="Unavaiable" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    :btn-disabled="true"
                ></no-permission-btn>
            </app-card>
        </div>
        <div class="w3-col m4 w3-hide-large" style="padding-left:6px;padding-right:5px" v-for="appContent in TrinityApps">
            <app-card :app-title="appContent.name" 
              :img-src="appContent.img" 
              :content-list="appContent.desc" 
              bg-color="signal-white" 
              hover-color="theme-l3-blue-grey" 
              round="xlarge" 
            >
                <login-btn v-if="(loginStatus === '' || loginStatus === 'ChangeCredentials')" class="w3-margin-bottom" btn-text="Login" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    window-title="Welcome to sign in"
                ></login-btn>
                <goto-btn v-else-if="(appContent.authorization === 'G') || (appContent.authorization === 'R' && appContent.authorization === userType)" 
                    class="w3-margin-bottom" btn-text="Go to" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    :a-target="appContent.target" 
                    :a-url="appContent.url"
                ></goto-btn>
                <no-permission-btn v-else class="w3-margin-bottom" btn-text="Unavaiable" 
                    btn-round="medium" 
                    btn-border-color="blue" 
                    :btn-disabled="true"
                ></no-permission-btn>
            </app-card>
        </div>
    </div>
  </div>
</template>
</div>
</template>
<script>
import AppCard from '../card/AppCard.vue'
import LoginBtn from '../button/LoginBtn.vue'
import LogoutBtn from '../button/LogoutBtn.vue'
import GotoBtn from '../button/GotoBtn.vue'
import NoPermissionBtn from '../button/NoPermissionBtn.vue'
import { mapGetters } from 'vuex'

export default {
    mounted() {
        this.$store.dispatch('fetchTrinityAPPS')
    },
    computed: {
        //ES7的寫法
        ...mapGetters({
            TrinityApps: 'getTrinityApps',
            loginStatus: 'getloginStatus',
            userType: 'getUserType'
        })
    },
    components: {
        'app-card': AppCard,
        'login-btn': LoginBtn,
        'logout-btn': LogoutBtn,
        'goto-btn': GotoBtn,
        'no-permission-btn': NoPermissionBtn
    }
}
</script>
<style scoped>

</style>