import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/index.vue'),
        children: [
            {
                path: '/productList',
                name: 'productList',
                component: () => import('../views/product/productList.vue')
            },
            {
                path: '/productRelease',
                name: 'productRelease',
                component: () => import('../views/product/productRelease.vue')
            },
            {
                path: '/classifyList',
                name: 'classifyList',
                component: () => import('../views/classify/classifyList.vue'),
            },
            {
                path: '/rotationChartList',
                name: 'rotationChartList',
                component: () => import('../views/rotationChart/rotationChartList.vue'),
            },
            {
                path: '/rotationChartDispose',
                name: 'rotationChartDispose',
                component: () => import('../views/rotationChart/rotationChartDispose.vue'),
            },
            {
                path: '/stockList',
                name: 'stockList',
                component: () => import('../views/stock/stockList.vue')
            },
            {
                path: '/orderList',
                name: 'orderList',
                component: () => import('../views/order/orderList.vue')
            },
            {
                path: '/freightList',
                name: 'freightList',
                component: () => import('../views/freight/freightList.vue')
            },{
                path: '/freightTemplate',
                name: 'freightTemplate',
                component: () => import('../views/freight/freightTemplate.vue')
            },
            {
                path: '/waybillList',
                name: 'waybillList',
                component: () => import('../views/freight/waybillList.vue')
            },
            {
                path: '/afterSalesList',
                name: 'afterSalesList',
                component: () => import('../views/afterSales/afterSalesList.vue')
            },
            {
                path: '/userList',
                name: 'userList',
                component: () => import('../views/system/user/userList.vue')
            },
            {
                path: '/userRelease',
                name: 'userRelease',
                component: () => import('../views/system/user/userRelease.vue')
            },
            {
                path: '/resetPassword',
                name: 'resetPassword',
                component: () => import('../views/system/resetPassword.vue')
            },
            {
                path: '/roleList',
                name: 'roleList',
                component: () => import('../views/system/role/roleList.vue')
            },
            {
                path: '/roleRelease',
                name: 'roleRelease',
                component: () => import('../views/system/role/roleRelease.vue')
            },
            {
                path: '/customerList',
                name: 'customerList',
                component: () => import('../views/system/customerList.vue')
            },
            {
                path: '/evaluateList',
                name: 'evaluateList',
                component: () => import('../views/evaluate/evaluateList.vue')
            },
            {
                path: '/sensitiveWordsList',
                name: 'sensitiveWordsList',
                component: () => import('../views/evaluate/sensitiveWordsList.vue')
            },
        ]
    },
];

const router = new VueRouter({
    routes
});

export default router
