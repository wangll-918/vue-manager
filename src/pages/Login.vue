<template>
  <div class="login_box">
    <div class="center_box">
      <h2>大联盟系统登录</h2>
      <el-input v-model="account" clearable prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
      <el-input
        type="password"
        v-model="pwd"
        prefix-icon="el-icon-lock"
        placeholder="请输入密码"
        show-password
      ></el-input>
      <!-- <el-alert type="error" show-icon v-show="isshow">{{ error }}</el-alert> -->
      <p class="error_mesg" show-icon>{{ error }}</p>
      <el-button type="primary" @click="clicklogin">登录</el-button>
    </div>
  </div>
</template>

<script>
// 结构 -- 接/引入多个对象  @/ 表示直接指向根目录
import { login } from "@/api/apis";

export default {
  data() {
    /* var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
      callback();
    } */

    return {
      pwd: "", //密码
      account: "", //账号
      error: "", // 错误提示
      isshow: false,
      /* rules: {
        pwd: [{ validator: validatePass, trigger: "blur" }],
        acc: [{ validator: checkAge, trigger: "blur" }],
      }, */
    };
  },
  methods: {
    clicklogin() {
      login(this.account, this.pwd).then((res) => {
        // console.log(res.data); // 登录响应
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "恭喜您，登录成功!",
            type: "success",
          });
          // 本地写入 token role acc  == localStorage.setItem('token', res.data.token)
          localStorage.token = res.data.token;
          localStorage.role = res.data.role;
          localStorage.account = this.account;
          localStorage.id = res.data.id;
          //this.$router 指向main.js中注入的router对象实例 -- push改变当前的hash地址，到要跳转的hsah地址
          // console.log(this.$router);
          // 登录成功后跳转到首页
          this.$router.push("./home/Index");
        } else {
          this.error = res.data.msg;
          this.isshow = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_box {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3a4b;
  color: #fff;
  text-align: center;
  .center_box {
    width: 350px;
    height: 200px;
    h2 {
      height: 80px;
    }
    .el-input {
      margin-top: 20px;
    }
    .el-button {
      width: 100%;
      margin-top: 20px;
    }
    .error_mesg {
      text-align: left;
      color: red;
      font-size: 14px;
    }
  }
}
</style>