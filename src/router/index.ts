import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
// import Home from '@/views/Home.vue';
// import PM from '@/views/pm/Index.vue';
// import Normal from '@/views/normal/Index.vue';
// import SwiperTest from '@/views/swiper-test/Index.vue';
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const PM = () => import(/* webpackChunkName: "pm" */ '@/views/pm/Index.vue');
const Normal = () =>
    import(/* webpackChunkName: "normal" */ '@/views/normal/Index.vue');
const SwiperTest = () =>
    import(
        /* webpackChunkName: "swiper-test" */ '@/views/swiper-test/Index.vue'
    );
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/pm',
        name: 'pm',
        component: PM
    },
    {
        path: '/normal/:type',
        name: 'normal',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Normal
    },
    {
        path: '/swiper-test',
        name: 'SwiperTest',
        component: SwiperTest
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
