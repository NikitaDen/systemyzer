import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Groups from '../views/Groups.vue'
import firebase from 'firebase/app';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Groups',
        meta: {auth: true, index: '2'},
        component: Groups
    },
    {
        path: '/groups',
        name: 'Groups',
        meta: {auth: true, index: '2'},
        component: () => import('../views/Groups.vue')
    },
    {
        path: '/favorites',
        name: 'Favorites',
        meta: {auth: true, index: '3'},
        component: () => import('../views/Favorites.vue')
    },
    {
        path: '/progress',
        name: 'Progress',
        meta: {auth: true, index: '4'},
        component: () => import('../views/Progress.vue')
    },
    // {
    //     path: '/settings',
    //     name: 'Settings',
    //     meta: {auth: true, index: '5'},
    //     component: () => import('../views/Settings.vue')
    // },
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
