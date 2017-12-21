import Vue from 'vue';
import VueRouter from 'vue-router'
import TrinityHome from '../pages/TrinityHome.vue'
import ResourceSetter from '../pages/ResourceSetter.vue'
import JCSAgentContainer from '../components/ResourceSetting/Instance/JCSAgent/JCSAgentContainer.vue'
import VRAgentContainer from '../components/ResourceSetting/Instance/VRAgent/VRAgentContainer.vue'
import FileSourceContainer from '../components/ResourceSetting/Instance/FileSource/FileSourceContainer.vue'
import ConnectionContainer from '../components/ResourceSetting/Instance/Connection/ConnectionContainer.vue'
import WorkingCalendarContainer from '../components/ResourceSetting/Instance/WorkingCalendar/WorkingCalendarContainer.vue'
import FrequencyContainer from '../components/ResourceSetting/Instance/Frequency/FrequencyContainer.vue'

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
                }
            ]
        }, {
            path: '/',
            redirect: '/TrinityHome'
        }
    ]
})