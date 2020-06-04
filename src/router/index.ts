import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import firebase from 'firebase/app';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        meta: {auth: true},
        component: Home
    },
    {
        path: '/groups',
        name: 'Groups',
        meta: {auth: true},
        component: () => import('../views/Groups.vue')
    },
    {
        path: '/topic/:id:groupId',
        name: 'Topic',
        meta: {auth: true},
        component: () => import('../views/Topic.vue')
    },
    {
        path: '/progress',
        name: 'Progress',
        meta: {auth: true},
        component: () => import('../views/Progress.vue')
    },
    {
        path: '/settings',
        name: 'Settings',
        meta: {auth: true},
        component: () => import('../views/Settings.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {auth: false},
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'SignUp',
        meta: {auth: false},
        component: () => import('../views/SignUp.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requireAuth = to.matched.some(record => record.meta.auth);

    if (requireAuth && !currentUser) {
        next('/login')
    } else {
        next()
    }
});

export default router
