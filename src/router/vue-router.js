import Vue from 'vue';
import VueRouter from 'vue-router'
import TrinityHome from '../pages/TrinityHome.vue'
import ResourceSetter from '../pages/ResourceSetter.vue'
import DomainContainer from '../components/ResourceSetting/Instance/Domain/DomainContainer.vue'
import GlobalDomainWindow from '../components/ResourceSetting/Instance/Domain/GlobalDomainWindow.vue'
import AliasContainer from '../components/ResourceSetting/Instance/AliasReference/AliasContainer.vue'
import GlobalAliasWindow from '../components/ResourceSetting/Instance/AliasReference/GlobalAliasWindow.vue'
import RoleContainer from '../components/ResourceSetting/Instance/Role/RoleContainer.vue'
import UserGroupContainer from '../components/ResourceSetting/Instance/UserGroup/UserGroupContainer.vue'
import JCSAgentContainer from '../components/ResourceSetting/Instance/JCSAgent/JCSAgentContainer.vue'
import VRAgentContainer from '../components/ResourceSetting/Instance/VRAgent/VRAgentContainer.vue'
import FileSourceContainer from '../components/ResourceSetting/Instance/FileSource/FileSourceContainer.vue'
import ConnectionContainer from '../components/ResourceSetting/Instance/Connection/ConnectionContainer.vue'
import WorkingCalendarContainer from '../components/ResourceSetting/Instance/WorkingCalendar/WorkingCalendarContainer.vue'
import FrequencyContainer from '../components/ResourceSetting/Instance/Frequency/FrequencyContainer.vue'
import ExclFrequencyContainer from '../components/ResourceSetting/Instance/ExclFrequency/ExclFrequencyContainer.vue'
import GlobalExclFrequencyWindow from '../components/ResourceSetting/Instance/ExclFrequency/GlobalExclFrequencyWindow.vue'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [{
            path: '/TrinityHome',
            component: TrinityHome
        },
        {
            path: '/ResourceSetter',
            component: ResourceSetter,
            children: [{
                    name: 'AliasReference',
                    path: 'AliasReference',
                    components: {
                        content: AliasContainer
                    },
                    children: [{
                        name: 'GlobalAliasReference',
                        path: 'GlobalAliasReference',
                        components: {
                            content: GlobalAliasWindow
                        }
                    }]
                },
                {
                    name: 'Domain',
                    path: 'Domain',
                    components: {
                        content: DomainContainer
                    },
                    children: [{
                        name: 'GlobalDomain',
                        path: 'GlobalDomain',
                        components: {
                            content: GlobalDomainWindow
                        }
                    }]
                },
                {
                    name: 'Role',
                    path: 'Role',
                    components: {
                        content: RoleContainer
                    }
                },
                {
                    name: 'UserGroup',
                    path: 'UserGroup',
                    components: {
                        content: UserGroupContainer
                    }
                },
                {
                    name: 'JCSAgent',
                    path: 'JCSAgent',
                    components: {
                        content: JCSAgentContainer
                    }
                },
                {
                    name: 'VRAgent',
                    path: 'VRAgent',
                    components: {
                        content: VRAgentContainer
                    }
                },
                {
                    name: 'FileSource',
                    path: 'FileSource',
                    components: {
                        content: FileSourceContainer
                    }
                },
                {
                    name: 'Connection',
                    path: 'Connection',
                    components: {
                        content: ConnectionContainer
                    }
                },
                {
                    name: 'WorkingCalendar',
                    path: 'WorkingCalendar',
                    components: {
                        content: WorkingCalendarContainer
                    }
                },
                {
                    name: 'Frequency',
                    path: 'Frequency',
                    components: {
                        content: FrequencyContainer
                    }
                },
                {
                    name: 'ExclFrequency',
                    path: 'ExclFrequency',
                    components: {
                        content: ExclFrequencyContainer
                    },
                    children: [{
                        name: 'GlobalExclFrequency',
                        path: 'GlobalExclFrequency',
                        components: {
                            content: GlobalExclFrequencyWindow
                        }
                    }]
                }
            ]
        }, {
            path: '/',
            redirect: '/TrinityHome'
        }
    ]
})