import Vue from 'vue';
import VueRouter from 'vue-router'
import TrinityHome from '../pages/TrinityHome.vue'
import ResourceSetter from '../pages/ResourceSetter.vue'
import MiddleContainer from '../components/ResourceSetting/MiddleContainer.vue'

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
                    content: MiddleContainer
                }
            }]
        }, {
            path: '/',
            redirect: '/TrinityHome'
        }
    ]
})