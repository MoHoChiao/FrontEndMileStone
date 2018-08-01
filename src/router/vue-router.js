import Vue from 'vue';
import VueRouter from 'vue-router'
import TrinityHome from '../pages/TrinityHome.vue'
import ResourceSetter from '../pages/ResourceSetter.vue'
import DomainContainer from '../components/ResourceSetting/Instance/Domain/DomainContainer.vue'
import GlobalDomainWindow from '../components/ResourceSetting/Instance/Domain/GlobalDomainWindow.vue'
import AliasContainer from '../components/ResourceSetting/Instance/AliasReference/AliasContainer.vue'
import GlobalAliasWindow from '../components/ResourceSetting/Instance/AliasReference/GlobalAliasWindow.vue'
import UserContainer from '../components/ResourceSetting/TrinityMembers/TrinityUser/UserContainer.vue'
import RoleContainer from '../components/ResourceSetting/TrinityMembers/Role/RoleContainer.vue'
import UserGroupContainer from '../components/ResourceSetting/TrinityMembers/UserGroup/UserGroupContainer.vue'
import JCSAgentContainer from '../components/ResourceSetting/Instance/JCSAgent/JCSAgentContainer.vue'
import VRAgentContainer from '../components/ResourceSetting/Instance/VRAgent/VRAgentContainer.vue'
import FileSourceContainer from '../components/ResourceSetting/Instance/FileSource/FileSourceContainer.vue'
import ConnectionContainer from '../components/ResourceSetting/Instance/Connection/ConnectionContainer.vue'
import WorkingCalendarContainer from '../components/ResourceSetting/Instance/WorkingCalendar/WorkingCalendarContainer.vue'
import FrequencyContainer from '../components/ResourceSetting/Instance/Frequency/FrequencyContainer.vue'
import ExclFrequencyContainer from '../components/ResourceSetting/Instance/ExclFrequency/ExclFrequencyContainer.vue'
import GlobalExclFrequencyWindow from '../components/ResourceSetting/Instance/ExclFrequency/GlobalExclFrequencyWindow.vue'
import DriverContainer from '../components/ResourceSetting/DriverManager/DriverContainer.vue'
import ExternalRuleContainer from '../components/ResourceSetting/ExternalRule/ExternalRuleContainer.vue'
import PluginLicenseContainer from '../components/ResourceSetting/LicenseStatus/PluginLicenseContainer.vue'
import VersionInfoContainer from '../components/ResourceSetting/VersionInfo/VersionInfoContainer.vue'
import { Authentication } from '../util_js/auth';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [{
            path: '/TrinityHome',
            component: TrinityHome,
            name: 'TrinityHome'
        },
        {
            path: '/ResourceSetter',
            component: ResourceSetter,
            beforeEnter(to, from, next) {
                Authentication(next)
            },
            children: [{
                    name: 'AliasReference',
                    path: 'AliasReference',
                    components: {
                        content: AliasContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    },
                    children: [{
                        name: 'GlobalAliasReference',
                        path: 'GlobalAliasReference',
                        components: {
                            content: GlobalAliasWindow
                        },
                        beforeEnter(to, from, next) {
                            Authentication(next)
                        }
                    }]
                },
                {
                    name: 'Domain',
                    path: 'Domain',
                    components: {
                        content: DomainContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    },
                    children: [{
                        name: 'GlobalDomain',
                        path: 'GlobalDomain',
                        components: {
                            content: GlobalDomainWindow
                        },
                        beforeEnter(to, from, next) {
                            Authentication(next)
                        }
                    }]
                },
                {
                    name: 'User',
                    path: 'User',
                    components: {
                        content: UserContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'Role',
                    path: 'Role',
                    components: {
                        content: RoleContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'UserGroup',
                    path: 'UserGroup',
                    components: {
                        content: UserGroupContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'JCSAgent',
                    path: 'JCSAgent',
                    components: {
                        content: JCSAgentContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'VRAgent',
                    path: 'VRAgent',
                    components: {
                        content: VRAgentContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'FileSource',
                    path: 'FileSource',
                    components: {
                        content: FileSourceContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'Connection',
                    path: 'Connection',
                    components: {
                        content: ConnectionContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'WorkingCalendar',
                    path: 'WorkingCalendar',
                    components: {
                        content: WorkingCalendarContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'Frequency',
                    path: 'Frequency',
                    components: {
                        content: FrequencyContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'ExclFrequency',
                    path: 'ExclFrequency',
                    components: {
                        content: ExclFrequencyContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    },
                    children: [{
                        name: 'GlobalExclFrequency',
                        path: 'GlobalExclFrequency',
                        components: {
                            content: GlobalExclFrequencyWindow
                        },
                        beforeEnter(to, from, next) {
                            Authentication(next)
                        }
                    }]
                },
                {
                    name: 'DriverManager',
                    path: 'DriverManager',
                    components: {
                        content: DriverContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'ExternalRuleContainer',
                    path: 'ExternalRuleContainer',
                    components: {
                        content: ExternalRuleContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'PluginLicense',
                    path: 'PluginLicense',
                    components: {
                        content: PluginLicenseContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                },
                {
                    name: 'VersionInfo',
                    path: 'VersionInfo',
                    components: {
                        content: VersionInfoContainer
                    },
                    beforeEnter(to, from, next) {
                        Authentication(next)
                    }
                }
            ]
        }, {
            path: '/',
            redirect: '/TrinityHome'
        }
    ]
})