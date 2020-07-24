import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import PM from '@/views/pm/Index.vue';
import Normal from '@/views/normal/Index.vue';

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
        component: Normal
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
