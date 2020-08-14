<template>

<!-- bug:两次密码输入不一致时，修改密码没有受限制 -->

  <div id="main_changepwd">
    <div id="tit_changepwd">
      <div>修改密码</div>
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldpwd" style="width:350px;">
        <el-input v-model.number="ruleForm.oldpwd" ref="oldpwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass" style="width:350px;">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" ref="pass"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" style="width:350px;">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" ref="checkpass"></el-input>
      </el-form-item>

      <el-form-item class="btn_margin">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkoldpwd, editpwd } from "@/api/apis";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("原密码不能为空"));
      } else {
        // 获取input值  获取输入框对应的值
        let oldpwd = this.$refs.oldpwd.value;
        // let pass = this.$refs.pass.value;
        // let checkpass = this.$refs.checkpass.value;
        let id = localStorage.id;
        // console.log(oldpwd, pass, checkpass);
        // 检查旧密码
        checkoldpwd(oldpwd, id).then((res) => {
          // console.log(res.data);
          if (res.data.code == 1) {
            return callback(res.data.msg);
          }
        });
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldpwd: "",
        id: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldpwd: [{ validator: checkAge, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      let pass = this.$refs.pass.value;
      let id = localStorage.id;
      editpwd(id, pass).then((res) => {
        // console.log(res.data);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
          });
          // 延迟一秒跳转登录界面
          setTimeout(() => {
            this.$router.push("/");
          }, 1000);
        } else {
          return res.data.msg;
        }
      }),
      // 空值验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
// 头部
#tit_changepwd {
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
</style>