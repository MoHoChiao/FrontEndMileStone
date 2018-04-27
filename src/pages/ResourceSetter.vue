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
                <a href="#" class="w3-bar-item w3-button w3-padding-large w3-signal-black"><i class="fa fa-home w3-margin-right"></i>Go Home</a>
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
                    <!-- Profile -->
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <h4 class="w3-center">User Setting</h4>
                            <p class="w3-center"><img src="/src/assets/images/resource_setter/Edit-Male-User_64.png" class="w3-circle" style="height:64px;width:64px" alt="User Set"></p>
                            <hr class="w3-border-black">
                            <p><a href="javascript:void(0)" @click="getUser"><i class="fa fa-users fa-fw w3-margin-right w3-text-theme"></i>User Account</a></p>
                            <p><a href="javascript:void(0)" @click="getRole"><i class="fa fa-user-secret fa-fw w3-margin-right w3-text-theme"></i>User Role</a></p>
                            <p><a href="javascript:void(0)" @click="getUserGroup"><i class="fa fa-user-circle-o fa-fw w3-margin-right w3-text-theme"></i>User Group</a></p>
                        </div>
                    </div>
                    <br>

                    <!-- Accordion -->
                    <div class="w3-card-4 w3-round">
                        <div class="w3-signal-white">
                            <button @click="myFunction('Demo1')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-cubes fa-fw w3-margin-right"></i>Instances</button>
                            <div id="Demo1" class="w3-hide w3-container w3-animate-opacity">
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
                            <button @click="myFunction('Demo3')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-clock-o fa-fw w3-margin-right"></i>Frequency Events</button>
                            <div id="Demo3" class="w3-hide w3-container w3-animate-opacity">
                                <p>
                                    <div class="w3-bar-block">
                                        <a @click="getWorkingCalendar" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>Working Cal</a>
                                        <a @click="getFrequencies" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-calendar-check-o fa-fw w3-margin-right"></i>Frequency</a>
                                        <a @click="getExclFrequencies" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-calendar-o fa-fw w3-margin-right"></i>Exclude Freq</a>
                                    </div>
                                </p>
                            </div>
                            <button @click="myFunction('Demo2')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-upload fa-fw w3-margin-right"></i>File Center</button>
                            <div id="Demo2" class="w3-hide w3-container w3-animate-opacity">
                                <p>
                                    <div class="w3-bar-block">
                                        <a @click="getDrivers" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-hdd-o fa-fw w3-margin-right"></i>Driver Manager</a>
                                        <a @click="getRules" class="w3-bar-item w3-button w3-padding w3-text-teal"><i class="fa fa-magic fa-fw w3-margin-right"></i>External Rule</a>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                    <br>

                    <!-- Global -->
                    <div class="w3-card-4 w3-round w3-signal-white">
                        <div class="w3-container">
                            <p><i class="fa fa-globe fa-fw w3-margin-right"></i>Global</p>
                            <p>
                                <button @click="getGlobalDomain" class="w3-button w3-tag w3-small w3-theme-d3">Domain</button>
                                <button @click="getGlobalAlias" class="w3-button w3-tag w3-small w3-theme-l1">Alias</button>
                                <button @click="getGlobalExclFrequency" class="w3-button w3-tag w3-small w3-theme-l4">Exclude Freq</button>
                            </p>
                        </div>
                    </div>
                    <br>

                    <!-- Setting -->
                    <div class="w3-container w3-display-container w3-round w3-theme-l4 w3-border w3-theme-border w3-margin-bottom">
                        <p><i class="fa fa-wrench fa-fw w3-margin-right"></i>Setting</p>
                        <p>
                            <button @click="changeConfigWindowStatus" class="w3-button w3-tag w3-small w3-theme-d3">Configuration</button>
                            <button @click="changeMonitorWindowStatus" class="w3-button w3-tag w3-small w3-theme-l1">Resource Monitor</button>
                        </p>
                    </div>
                    <!-- End Left Column -->
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
        myFunction(id){
            var x = document.getElementById(id);
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show";
                x.previousElementSibling.className += " w3-theme-d1";
            } else {
                x.className = x.className.replace("w3-show", "");
                x.previousElementSibling.className =
                x.previousElementSibling.className.replace(" w3-theme-d1", "");
            }
        },
        openNav(e){
            var x = document.getElementById("navDemo");
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show";
            } else {
                x.className = x.className.replace(" w3-show", "");
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
        getDrivers(e){
            this.$router.push({ name: 'DriverManager'})
        },
        getRules(e){
            this.$router.push({ name: 'RuleContainer'})
        }
    },
    components: {
        'trinity-config-window': TrinityconfigWindow,
        'resource-monitor-window': ResourceMonitorWindow
    }
}
</script>
<style scoped>
    div {
        font-family: "Fugaz One"
    }
</style>
