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
      <li>
        创建时间：
        <span>
          {{ getTime(ctime) }}
          <!-- {{
          new Date(ctime).getFullYear() + '-' +
          ((new Date(ctime).getMonth())<10 ? '0'+(new Date(ctime).getMonth()):(new Date(ctime).getMonth())) +
          '-' +
          ((new Date(ctime).getDate())<10 ? '0'+(new Date(ctime).getDate()):(new Date(ctime).getDate()))
          + ' ' +
          ((new Date(ctime).getHours())<10 ? '0'+(new Date(ctime). getHours()):(new Date(ctime).getHours()))
          + ':' +
          ((new Date(ctime).getMinutes())<10 ? '0'+(new Date(ctime). getMinutes()):(new Date(ctime).get())) + ':' +
          ((new Date(ctime).getSeconds())<10 ? '0'+(new Date(ctime). getSeconds()):(new Date(ctime).getSeconds())) }} -->
        </span>
      </li>
    </ul>
    <!-- <el-table
    :data="tableData"
    style="width: 100%">
            <el-table-column prop="name" label="创建时间：" width="180">
    
            {{ scope.row.ctime }}
    </el-table-column>

    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="创建时间：" width="200">
        <template slot-scope="scope">{{ scope.row.ctime }}</template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, row)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import { accountinfo, checktoken } from "@/api/apis";
import { getnum } from '@/utils/utils';
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
      imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        $message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        $message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 封装补0函数
    /* num) {
      return num < 10 ? "0" + num : num;
    },*/

    handleSelectionChange(index, row) {
      console.log(index, row);
    },
    // 删除
    handleDelete(index, row) {
      console.log(index, row);
    },
    // 移出
    deleteRow(index, rows) {
      rows.splice(index, 1);
    }, 
    getTime(time) {
      let date = new Date(time); // 获取时间  中国时区
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
    },
  },
  created() {
    // 个人中心信息
    let id = localStorage.id;
    accountinfo(id).then((res) => {
      let Info = res.data.accountInfo;
      id = Info.id;
      account = Info.account;
      userGroup = Info.userGroup;
      ctime = Info.ctime;
      // console.log(Info.account);
    });
    /* fun(index, row){
      console.log(row)
    } */
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