<template>
  <div>
    <ul>
      <li>
        <p>管理员信息</p>
      </li>
      <li>
        管理员ID：
        <span>{{id}}</span>
      </li>
      <li>
        账号：
        <span>{{account}}</span>
      </li>
      <li>
        用户组：
        <span>{{userGroup}}</span>
      </li>
      <li>
        创建时间：
        <span>{{ 
          new Date(ctime).getFullYear() + '-' + 
         ((new Date(ctime).getMonth())<10 ? '0'+(new Date(ctime).getMonth()):(new Date(ctime).getMonth())) + 
          '-' + 
          ((new Date(ctime).getDate())<10 ? '0'+(new Date(ctime).getDate()):(new Date(ctime).getDate())) 
          + ' ' + 
          ((new Date(ctime).getHours())<10 ? '0'+(new Date(ctime). getHours()):(new Date(ctime).getHours())) 
          + ':' + 
          ((new Date(ctime).getMinutes())<10 ? '0'+(new Date(ctime). getMinutes()):(new Date(ctime).get())) + ':' + 
          ((new Date(ctime).getSeconds())<10 ? '0'+(new Date(ctime). getSeconds()):(new Date(ctime).getSeconds())) }}
          </span>
      </li>
      <li class="li_bd">
        管理员头像：
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </li>
    </ul>
  </div>
</template>

<script>
import { accountinfo } from "@/api/apis";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: "",
      id: "",
      account: "",
      userGroup: "",
      ctime: "",
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  created() {
    // 个人中心信息
    let id = localStorage.id;
    accountinfo(id).then((res) => {
      let Info = res.data.accountInfo;
      this.id = Info.id;
      this.account = Info.account;
      this.userGroup = Info.userGroup;
      this.ctime = Info.ctime;
      // console.log(Info.account);
    });
  },
};
</script>

<style lang="less" scoped>
ul {
  list-style: none;
  background-color: #fff;
  padding: 15px 20px;
  margin-top: 15px;
  li {
    border-bottom: 1px solid #dde0e7;
    padding: 15px 0;
  }
  .li_bd {
    border: 0;
    div {
      display: inline-block;
    }
  }
}
// 头像样式
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>