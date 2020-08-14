<template>
  <div>
    <ul>
      <li>
        <p>管理员信息</p>
      </li>
      <li>
        管理员ID：
        <span>{{uid}}</span>
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
        <span>{{ ctime }}</span>
      </li>
      <li class="li_bd">
        <div>
          管理员头像：
          <p class="txt_span">(点击头像可更改)</p>
        </div>
        <!-- action 必写项 上传头像的地址  data:上传时所携带的参数 -->

        <el-upload
          class="avatar-uploader"
          :action="uploadimginfo"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :data="imgdata"
        >
          <img v-show="imageUrl" :src="imageUrl" class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon" v-show="imageUrl==''"></i>
        </el-upload>
      </li>
    </ul>
  </div>
</template>

<script>
import { accountinfo, uploadimginfo } from "@/api/apis";
import { getTime } from "@/utils/utils";

export default {
  data() {
    return {
      dialogImageUrl: "",
      imageUrl: "",
      uid: "",
      account: "",
      userGroup: "",
      ctime: "",
      imgdata: {},
      uploadimginfo: "",
    };
  },
  methods: {
    handleAvatarSuccess(res) {
      // console.log(res)
      if (res.code == 0) {
        //  利用bus跨级传值
        this.$bus.$emit("upresult");
        this.$message({
          message: "头像上传成功!",
          type: "success",
        });
      }
    },
    /*     beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        $message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        $message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }, */
  },
  created() {
    // 个人中心信息
    this.imgdata = { id: localStorage.id };
    accountinfo(localStorage.id).then((res) => {
      console.log(res.data);
      let Info = res.data.accountInfo;
      this.uid = Info.id;
      this.account = Info.account;
      this.userGroup = Info.userGroup;
      this.ctime = getTime(Info.ctime);
      this.imageUrl = Info.imgUrl
      // console.log(Info.account);
    });
    this.uploadimginfo = uploadimginfo;
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
    .txt_span{
      font-size: 12px;
      color: #aab;
    }
  }
}
// 头像样式
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon, .avatar[data-v-1d412dbc] {
  border-radius: 15px;
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>