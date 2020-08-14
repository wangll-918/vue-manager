<template>
  <el-container>
    <!-- 左 树导航 -->
    <el-aside width="200px">
      <el-menu
        :default-active="curhash"
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
        <!-- 判定：是否包含子级菜单 -->
        <!-- 没有子菜单 -->
        <div v-for="item in powerarr" :key="item.url">
          <el-menu-item v-if="!item.children" :index="item.url">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
          <!-- 可展开菜单 -->
          <el-submenu v-else :index="item.url">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <!-- 子菜单 -->
            <el-menu-item-group>
              <el-menu-item
                v-for="child in item.children"
                :key="child.url"
                :index="child.url"
              >{{ child.name }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breaklist" :key="item">{{ item }}</el-breadcrumb-item>
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
              <template slot="title">欢迎您，{{ username }}</template>
              <el-menu-item index="/home/Personal">个人中心</el-menu-item>
            </el-submenu>
          </el-menu>
          <!-- <div> -->
          <!-- 动态获取当前用户的头像 -->
          <img :src="imageUrl" @click="clickpath" />
          <!-- </div> -->
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
import { checktoken, accountinfo } from "@/api/apis";

export default {
  components: {
    // Personal,
  },
  data() {
    return {
      activeIndex: "1",
      username: "",
      list: [
        {
          url: "/home/Index",
          icon: "el-icon-s-home",
          name: "后台首页",
          roles: ["super", "normal"],
        },
        {
          url: "/home/Orderlist",
          icon: "el-icon-menu",
          name: "订单管理",
          roles: ["super", "normal"],
        },
        {
          url: "3",
          icon: "el-icon-s-goods",
          name: "商品管理",
          children: [
            {
              url: "/home/ProList",
              name: "商品列表",
            },
            {
              url: "/home/ProAdd",
              name: "商品添加",
            },
            {
              url: "/home/ProSort",
              name: "商品分类",
            },
          ],
          roles: ["super", "normal"],
        },
        {
          url: "/home/Shop",
          icon: "el-icon-s-shop",
          name: "店铺管理",
          roles: ["super"],
        },
        {
          url: "5",
          icon: "el-icon-user",
          name: "账号管理",
          children: [
            {
              url: "/home/AccountList",
              name: "账号列表",
            },
            {
              url: "/home/AccountAdd",
              name: "添加账号",
            },
            {
              url: "/home/ChangePwd",
              name: "修改密码",
            },
          ],
          roles: ["super"],
        },
        {
          url: "6",
          icon: "el-icon-s-data",
          name: "销售统计",
          children: [
            {
              url: "/home/ProTotal",
              name: "商品统计",
            },
            {
              url: "/home/OrderTotal",
              name: "订单统计",
            },
          ],
          roles: ["super"],
        },
      ],
      imageUrl: "",
      curhash: "",
      // 面包屑标题数组
      breaklist: [],
    };
  },
  methods: {
    //用户名下拉导航
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 初始化个人信息 --（ 获取到头像信息）
    getinfo() {
      accountinfo(localStorage.id).then((res) => {
        let Info = res.data.accountInfo;
        // console.log(Info);
        this.uid = Info.id;
        this.imageUrl = Info.imgUrl;
        // console.log(Info.imgUrl);
      });
    },
    // 头像点击事件
    clickpath() {
      this.$router.push("/home/Personal");
    },
  },
  // 计算机属性-会有缓存结果，多次调用不会重复执行，必须有返回值，不能传参
  computed: {
    // 获取用户权限数组
    powerarr() {
      // ES5
      // 根据用户权限计算并返回新数组 -- .filter循环
      // let newlist = this.list.filter((item) => {
      //   // 根据本地数据中role 返回当前用户的权限分配
      //   return item.roles.includes(localStorage.role);
      // });
      // return newlist;

      // ES6
      return this.list.filter((item) => item.roles.includes(localStorage.role));
    },
  },
  // 通知函数，初始化创建完毕
  created() {
    // 验证token是否失效
    checktoken(localStorage.token).then((res) => {
      // console.log(res.data);
      // token有效
      if (res.data.code == 0) {
        this.username = localStorage.account;
        // // token无效
      } else {
        this.username = "请登录!";
      }
    }),
      // 动态获取当前hash值的路由对象
      (this.curhash = this.$route.path),
      // 初始面包屑导航
      (this.breaklist = this.$route.meta.breaklist),
      // 初始化
      this.getinfo(),
      // 监听bus传递事件
      this.$bus.$on("upresult", () => {
        this.getinfo();
      });
  },
  // watch属性监听vue内部数据变化
  watch: {
    // 监听当前hash值的变化 -- 路由变化时触发
    $route(to) {
      // console.log(to.meta.breaklist)
      this.breaklist = to.meta.breaklist;
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
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }
}
// 面包屑导航
.el-breadcrumb {
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
}
</style>