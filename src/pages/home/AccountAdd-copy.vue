<template>
  <div id="main_aadd">
    <div id="tit_aadd">
      <div>添加账号</div>
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="account" style="width:318px;">
        <el-input type="text" v-model="ruleForm.account" autocomplete="off" ref="acc"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass" style="width:318px;">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" ref="pwd"></el-input>
      </el-form-item>

      <el-form-item label="用户组" prop="group">
        <el-select v-model="ruleForm.group" placeholder="请选择用户组" ref="selectCh">
          <el-option
            v-for="(item,index) in seltList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
          <!-- <el-option label="用户组一" value="user1"></el-option>
          <el-option label="用户组二" value="user2"></el-option>-->
        </el-select>
      </el-form-item>

      <el-form-item class="btn_margin">
        <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import useradd from "@/api/apis";
export default {
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
    };
    var validatepass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkpass !== "") {
          this.$refs.ruleForm.validateField("checkpass");
        }
        callback();
      }
    };

    return {
      ruleForm: {
        pass: "",
        account: "",
        group: "",
      },
      pwd: "",
      acc: "",
      rules: {
        pass: [{ validator: validatepass, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }],
      },
      seltList: [
        {
          name: "超级管理员",
          id: 0,
        },
        {
          name: "普通管理员",
          id: 1,
        },
      ],
    };
  },
  methods: {
    submitForm(formName) {
      // 获取输入框对应的值
      let acc = this.$refs.acc.value;
      let pwd = this.$refs.pwd.value;
      let seleval = this.$refs.selectCh.selected.label;
      // console.log(acc, pwd, seleval);
      useradd(acc, pwd, seleval).then((res) => {
        console.log(res.data);
      });
      // 验证value是否为空
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          // console.log(seleval)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击充值输入框为空
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
#main_aadd {
  // 头部
  #tit_aadd {
    font-size: 16px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    padding-top: 20px;
    div {
      padding: 0 0 10px 15px;
    }
  }
  .btn_margin {
    margin-bottom: 0;
    padding-bottom: 20px;
  }
}
</style>