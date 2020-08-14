<template>
  <el-container>
    <!-- 左 树导航 -->
    <el-aside width="200px">
      <el-menu
        default-active="/home/Index"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <div id="logo">
          <!-- logo -->
          <img src="../assets/imgs/logo1.png" />
          <h3 id="tit_home">外卖商家中心</h3>
        </div>
        <el-menu-item index="/home/Index">
          <i class="el-icon-s-home"></i>
          <span slot="title">后台首页</span>
        </el-menu-item>
        <el-menu-item index="/home/Orderlist">
          <i class="el-icon-menu"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <!-- 可展开菜单 -->
        <el-submenu index="3">
          <!-- 标题名 -->
          <template slot="title">
            <i class="el-icon-s-goods"></i>
            <span>商品管理</span>
          </template>
          <!-- 子菜单-可展开 -->
          <el-menu-item-group>
            <el-menu-item index="/home/ProList">商品列表</el-menu-item>
            <el-menu-item index="/home/ProAdd">商品添加</el-menu-item>
            <el-menu-item index="/home/ProSort">商品分类</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/home/Shop">
          <i class="el-icon-s-shop"></i>
          <span slot="title">店铺管理</span>
        </el-menu-item>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账号管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/home/AccountList">账号列表</el-menu-item>
            <el-menu-item index="/home/AccountAdd">添加账号</el-menu-item>
            <el-menu-item index="/home/ChangePwd">修改密码</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-s-data"></i>
            <span>销售统计</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/home/ProTotal">商品统计</el-menu-item>
            <el-menu-item index="/home/OrderTotal">订单统计</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home/Index' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="demo-type">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            router
          >
            <el-submenu index="2">
              <template slot="title">欢迎您，admin</template>
              <el-menu-item index="/home/Personal">个人中心</el-menu-item>
              <el-menu-item index="2-2">购物车</el-menu-item>
              <el-menu-item index="2-3">我的订单</el-menu-item>
            </el-submenu>
          </el-menu>
          <div>
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          </div>
        </div>
      </el-header>
      <!-- 二级路由  主体 -->
      <el-main>
        <router-view />
        <!-- <Personal /> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// import Personal from "./home/Personal";
export default {
  components: {
    // Personal,
  },
  data() {
    return {
      activeIndex: "1",
    };
  },
  methods: {
    //用户名下拉导航
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped lang='less'>
@asidebase: #304156;
// 导航标题
#logo {
  display: flex;
  align-items: center;
  padding: 12px 0 10px 20px;
  color: #fff;
  #tit_home {
    margin-left: 5px;
  }
  img {
    width: 40px;
    height: 40px;
  }
}
// 树导航-布局容器
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding-left: 5px;
  .el-breadcrumb {
    line-height: 60px;
  }
}
// 导航滚动条隐藏
.el-aside::-webkit-scrollbar {
  display: none;
}
.el-aside {
  background-color: @asidebase;
  border: 0;
}
.el-main {
  border-radius: 7px;
  margin: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 0;
  background-color: #fff;
}
.el-menu {
  border: 0;
}
.el-container {
  height: 100%;
  background-color: #f0f2f5;
}
// 用户下拉导航与头像
.demo-type {
  display: flex;
}
</style>