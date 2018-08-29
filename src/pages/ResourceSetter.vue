<template>
    <div>
        <!-- msg window -->
        <trinity-config-window :windowAlive="trinityconfigAlive" 
                    window-title="Trinity Configuration Setting" 
                    @closeAdd="changeConfigWindowStatus" 
        ></trinity-config-window>
        <resource-monitor-window :windowAlive="resourceMonitorAlive" 
                    window-title="Resource Monitor Setting" 
                    @closeAdd="changeMonitorWindowStatus" 
        ></resource-monitor-window>
        <!-- Navbar -->
        <div class="w3-top w3-animate-opacity">
            <div class="w3-bar w3-camo-black w3-left-align w3-large">
                <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" @click="openNav"><i class="fa fa-bars"></i></a>
                <a href="#" class="w3-bar-item w3-button w3-padding-large w3-signal-black"><i class="fa fa-home w3-margin-right"></i>Home</a>
                <a href="#" class="w3-bar-item w3-button w3-padding-large w3-hover-white" title="Other Apps"><i class="fa fa-laptop"></i></a>
                <a href="#" class="w3-bar-item w3-button w3-padding-large w3-hover-white" title="Help"><i class="fa fa-question-circle"></i></a>
                <a href="#" class="w3-bar-item w3-button w3-padding-large w3-hover-white" title="About"><i class="fa fa-info-circle"></i></a>
                <div class="w3-dropdown-hover">
                    <button class="w3-button w3-padding-large" title="Auditing"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">5</span></button>
                    <div class="w3-dropdown-content w3-card-4 w3-bar-block w3-small">
                        <i class="w3-bar-item fa fa-check-square-o fa-fw">&nbsp;&nbsp;Add Agent(Test_Agent_1) Success.</i>
                        <i class="w3-bar-item fa fa-check-square-o fa-fw">&nbsp;&nbsp;Edit Alias(Test_Alias) Success.</i>
                        <i class="w3-bar-item fa fa-ban fa-fw">&nbsp;&nbsp;Add Frequency(Test_Connection_1) Error!</i>
                        <i class="w3-bar-item fa fa-check-square-o fa-fw">&nbsp;&nbsp;Delete Connection(Test_Connection_1) Success.</i>
                        <i class="w3-bar-item fa fa-ban fa-fw">&nbsp;&nbsp;Delete Connection(Test_Connection_1) Error!</i>
                    </div>
                </div>
                <a href="#" class="w3-bar-item w3-button w3-right w3-padding-large w3-hover-white" title="My Account"><img src="/src/assets/images/resource_setter/People_24.png" class="w3-circle" style="height:25px;width:25px" alt="My Account"></a>
            </div>
        </div>
        <!-- Page Container -->
        <div class="w3-container w3-content w3-animate-zoom" style="max-width:1400px;margin-top:80px">
            <!-- The Grid -->
            <div class="w3-row">
                <!-- Left Column -->
                <div class="w3-col m3">
                    <!-- Accordion -->
                    <div class="w3-card-4 w3-round">
                        <div class="w3-signal-white w3-round">
                            <button @click="menuFunction('accountMenu')" class="w3-button w3-block w3-theme-d1 w3-hover-blue-grey w3-hover-opacity w3-left-align"><i class="fa fa-user-plus fa-fw w3-margin-right"></i>Account</button>
                            <div id="accountMenu" class="w3-container w3-animate-opacity">
                                <p>
                                    <div class="w3-bar-block">
                                        <a @click="getUser" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-user-secret fa-fw w3-margin-right"></i>User</a>
                                        <a @click="getRole" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-users fa-fw w3-margin-right"></i>Role</a>
                                        <a @click="getUserGroup" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-user-circle-o fa-fw w3-margin-right"></i>User Group</a>
                                    </div>
                                </p>
                            </div>
                            <button @click="menuFunction('resourceMenu')" class="w3-button w3-block w3-theme-d1 w3-hover-blue-grey w3-hover-opacity w3-left-align"><i class="fa fa-cubes fa-fw w3-margin-right"></i>Resource</button>
                            <div id="resourceMenu" class="w3-container w3-animate-opacity">
                                <p>
                                    <div class="w3-bar-block">
                                        <a @click="getAlias" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-american-sign-language-interpreting fa-fw w3-margin-right"></i>Alias Reference</a>
                                        <a @click="getDomains" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-ravelry fa-fw w3-margin-right"></i>Domain</a>
                                        <a @click="getConnections" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-plug fa-fw w3-margin-right"></i>Connection</a>
                                        <a @click="getFileSources" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-files-o fa-fw w3-margin-right"></i>File Source</a>
                                        <a @click="getAgents" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-cog fa-fw w3-margin-right"></i>JCS Agent</a>
                                        <a @click="getVRAgents" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-cogs fa-fw w3-margin-right"></i>Virtual Agent</a>
                                    </div>
                                </p>
                            </div>
                            <button @click="menuFunction('scheduleMenu')" class="w3-button w3-block w3-theme-d1 w3-hover-blue-grey w3-hover-opacity w3-left-align"><i class="fa fa-clock-o fa-fw w3-margin-right"></i>Schedule</button>
                            <div id="scheduleMenu" class="w3-container w3-animate-opacity">
                                <p>
                                    <div class="w3-bar-block">
                                        <!--<a @click="getWorkingCalendar" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>Working Cal</a>
                                        <a @click="getFrequencies" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-calendar-check-o fa-fw w3-margin-right"></i>Frequency</a>-->
                                        <button @click="menuFunction('excludeFreqMenu')" class="w3-button w3-block w3-left-align w3-text-teal"><i class="fa fa-calendar-times-o fa-fw w3-margin-right"></i>Exclude Freq</button>
                                        <div id="excludeFreqMenu" class="w3-hide w3-container w3-animate-opacity">
                                            <div class="w3-bar-block">
                                                <a @click="getExclFrequencies" class="w3-bar-item w3-button w3-block w3-padding w3-text-teal"><i class="fa fa-calendar-o fa-fw w3-margin-right"></i>General</a>
                                                <a @click="getGlobalExclFrequency" class="w3-bar-item w3-button w3-block w3-padding w3-text-teal"><i class="fa fa-globe fa-fw w3-margin-right"></i>Global</a>
                                            </div>
                                        </div>  
                                    </div>
                                </p>
                            </div>
                            <button @click="menuFunction('systemMenu')" class="w3-button w3-block w3-theme-d1 w3-hover-blue-grey w3-hover-opacity w3-left-align"><i class="fa fa-wrench fa-fw w3-margin-right"></i>System</button>
                            <div id="systemMenu" class="w3-container w3-animate-opacity">
                                <p>
                                    <div class="w3-bar-block">
                                        <a @click="getTrinityconfig" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-file-text-o fa-fw w3-margin-right"></i>Configuration</a>
                                        <a @click="getResourceMonitor" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-desktop fa-fw w3-margin-right"></i>Server Monitor</a>
                                        <a @click="getDrivers" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-hdd-o fa-fw w3-margin-right"></i>Driver Manager</a>
                                        <a @click="getExternalRules" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-magic fa-fw w3-margin-right"></i>External Rule</a>
                                        <a @click="getPluginLicense" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-id-card-o fa-fw w3-margin-right"></i>License Status</a>
                                        <a @click="getVersionInfo" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-code-fork fa-fw w3-margin-right"></i>Version Info</a>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                    <br>
                </div>
                <!-- Middle Column & Right Column -->
                <router-view name="content">
                <!--所有被routing的組件內容都會在這裡渲染-->
                </router-view>
                <!-- End Middle Column & Right Column -->
            </div>
            <!-- End Page Container -->
        </div>
        <br>

        <!-- Footer -->
        <footer class="w3-container w3-center w3-camo-black w3-padding-16">
            <p>Resource Setter - 5.0.0.alpha Build 20170915</p>
        </footer>

        <footer class="w3-container w3-center w3-signal-black">
            <p>Copyright © Trinity Data Corporation.</p>
        </footer>
    </div>
</template>
<script>
import TrinityconfigWindow from '../components/ResourceSetting/TrinityConfiguration/TrinityconfigWindow.vue'
import ResourceMonitorWindow from '../components/ResourceSetting/ResourceMonitor/ResourceMonitorWindow.vue'

export default {
    data() {
        return {
            trinityconfigAlive: false,
            resourceMonitorAlive: false,
        }
    },
    methods: {
        menuFunction(id){
            var x = document.getElementById(id);
            if (x.className.indexOf("w3-hide") == -1) {
                x.className += " w3-hide"
            } else {
                x.className = x.className.replace("w3-hide", "")
            }
        },
        openNav(e){
            var x = document.getElementById("navDemo")
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show"
            } else {
                x.className = x.className.replace(" w3-show", "")
            }
        },
        changeConfigWindowStatus(){
            this.trinityconfigAlive = !this.trinityconfigAlive
        },
        changeMonitorWindowStatus(){
            this.resourceMonitorAlive = !this.resourceMonitorAlive
        },
        //以下為頁面中間的部份, 各種Resources都會在這裡
        getAlias(e){
            this.$router.push({ name: 'AliasReference'})
        },
        getGlobalAlias(e){
            this.$router.push({ name: 'GlobalAliasReference'})
        },
        getDomains(e){
            this.$router.push({ name: 'Domain'})
        },
        getGlobalDomain(e){
            this.$router.push({ name: 'GlobalDomain'})
        },
        getUser(e){
            this.$router.push({ name: 'User'})
        },
        getRole(e){
            this.$router.push({ name: 'Role'})
        },
        getUserGroup(e){
            this.$router.push({ name: 'UserGroup'})
        },
        getAgents(e){
            this.$router.push({ name: 'JCSAgent'})
        },
        getVRAgents(e){
            this.$router.push({ name: 'VRAgent'})
        },
        getFileSources(e){
            this.$router.push({ name: 'FileSource'})
        },
        getConnections(e){
            this.$router.push({ name: 'Connection'})
        },
        getWorkingCalendar(e){
            this.$router.push({ name: 'WorkingCalendar'})
        },
        getFrequencies(e){
            this.$router.push({ name: 'Frequency'})
        },
        getExclFrequencies(e){
            this.$router.push({ name: 'ExclFrequency'})
        },
        getGlobalExclFrequency(e){
            this.$router.push({ name: 'GlobalExclFrequency'})
        },
        getTrinityconfig(e) {
            this.$router.push({ name: 'Trinityconfig' })
        },
        getResourceMonitor(e) {
            this.$router.push({ name: 'ResourceMonitor' })
        },
        getDrivers(e){
            this.$router.push({ name: 'DriverManager'})
        },
        getExternalRules(e){
            this.$router.push({ name: 'ExternalRuleContainer'})
        },
        getPluginLicense(e) {
            this.$router.push({ name: 'PluginLicense' })
        },
        getVersionInfo(e) {
            this.$router.push({ name: 'VersionInfo' })
        }
    },
    components: {
        'trinity-config-window': TrinityconfigWindow,
        'resource-monitor-window': ResourceMonitorWindow
    }
}
</script>
<style scoped>
    div { font-family: Verdana, Arial, "Microsoft YaHei", "Noto Sans CJK TC", "Microsoft JhengHei" }
</style>
