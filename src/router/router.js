// 引入
import Vue from 'vue';
import VueRouter from 'vue-router';

// 引入页面
import Login from '../pages/Login';
import {checktoken} from '@/api/apis';


// 使用VueRouter插件
Vue.use(VueRouter);

// new对象暴露
var router = new VueRouter({
    routes: [{
            // path就是hash值，不带标点符号；name是唯一值，不重复就好
            path: '/',
            name: 'Login',
            component: Login,
        },
       
        // 一级页面
        {
            path: '/Home',
            name: 'Home',
            // 懒加载 当hash值被匹配成功时，才回加载此页面
            component: () => import('../pages/Home'),
            // 子路由
            children: [
                // 首页
                {
                    // path就是hash值，不带标点符号；name是唯一值，不重复就好
                    path: '/home/Index',
                    name: './home/Index',
                    component: () => import('../pages/home/Index'),
                    // 自定义数据 -- 用于管理 （根据路由动态获取）面包屑
                    meta:{breaklist:['首页']}
                },
                // 店铺管理
                {
                    path: '/home/Shop',
                    name: './home/Shop',
                    component: () => import('../pages/home/Shop'),
                    meta:{breaklist:['店铺管理']}
                },
                // 订单管理
                {
                    path: '/home/Orderlist',
                    name: './home/Orderlist',
                    component: () => import('../pages/home/Orderlist'),
                    meta:{breaklist:['订单管理']}
                },
// ====================================账号管理=====================================
                // 添加账号
                {
                    path: '/home/AccountAdd',
                    name: './home/AccountAdd',
                    component: () => import('../pages/home/AccountAdd'),
                    meta:{breaklist:['账号管理', '添加账号']}
                },
                // 修改密码
                {
                    path: '/home/ChangePwd',
                    name: './home/ChangePwd',
                    component: () => import('../pages/home/ChangePwd'),
                    meta:{breaklist:['账号管理', '修改密码']}
                },
                // 账号列表AccountList
                {
                    path: '/home/AccountList',
                    name: './home/AccountList',
                    component: () => import('../pages/home/AccountList'),
                    meta:{breaklist:['账号管理', '账号列表']}
                },
// =======================================销售统计  =========================  
                // 商品统计
                {
                    path: '/home/ProTotal',
                    name: './home/ProTotal',
                    component: () => import('../pages/home/ProTotal'),
                    meta:{breaklist:['销售统计', '商品统计']}
                },
                // 订单统计
                {
                    path: '/home/OrderTotal',
                    name: './home/OrderTotal',
                    component: () => import('../pages/home/OrderTotal'),
                    meta:{breaklist:['销售统计', '订单统计']}
                },
// =============================商品管理========================================
                // 商品分类
                {
                    path: '/home/ProSort',
                    name: './home/ProSort',
                    component: () => import('../pages/home/ProSort'),
                    meta:{breaklist:['商品管理', '商品分类']}
                },
                // 商品列表
                {
                    path: '/home/ProList',
                    name: './home/ProList',
                    component: () => import('../pages/home/ProList'),
                    meta:{breaklist:['商品管理', '商品列表']}
                },
                // 商品添加
                {
                    path: '/home/ProAdd',
                    name: './home/ProAdd',
                    component: () => import('../pages/home/ProAdd'),
                    meta:{breaklist:['商品管理', '商品添加']}
                },
                // 个人中心
                {
                    path: '/home/Personal',
                    name: './home/Personal',
                    component: () => import('../pages/home/Personal'),
                    meta:{breaklist:['个人中心']}

                },
            ]
        },

    ]
})

// 路由拦截
// beforeEach在切换路由之前执行 to 跳转到哪里  from 从哪里来（哪个hash地址） next 放行--是一个函数
router.beforeEach((to, from, next) => {
    // console.log(to, from, next)
    if (to.path != '/') {   // 要跳转到不是根目录的界面
        // 调用token接口 验证用户的登录状态
        checktoken(localStorage.token).then(res => {
            if (res.data.code == 0)  // 返回在登录 放行执行下一步
                next()
            else {
                next('/')  // 否则跳转到根目录
            }
        })
    } else {  // 跳转根目录界面--放行
        next()
    }
})

// 切换路由之后执行
// router.afterEach()

export default router