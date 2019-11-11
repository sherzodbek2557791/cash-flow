export default [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Game.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue')
    },
    {
        path: '/game',
        name: 'game',
        component: () => import('../views/Game.vue')
    }
];