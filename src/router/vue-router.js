import Vue from 'vue';
import VueRouter from 'vue-router'
import TrinityHome from '../pages/TrinityHome.vue'
import ResourceSetter from '../pages/ResourceSetter.vue'
import JCSAgentContainer from '../components/ResourceSetting/Instance/JCSAgent/JCSAgentContainer.vue'
import VRAgentContainer from '../components/ResourceSetting/Instance/VRAgent/VRAgentContainer.vue'

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
                }
            ]
        }, {
            path: '/',
            redirect: '/TrinityHome'
        }
    ]
})