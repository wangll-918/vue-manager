<template>
  <div id="main_padd">
    <div id="tit_padd">
      <div>商品添加</div>
    </div>
    <el-form ref="form" :model="sizeForm" label-width="80px" size="small">
      <el-form-item label="商品名称">
        <el-input v-model="sizeForm.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select v-model="sizeForm.region" placeholder="请选择商品分类">
          <el-option :label="item" v-for="item in sortlist" :key="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input-number v-model="price" :min="0" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          :action="Goods_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="imgdata"
        >
          <img v-show="imageUrl" :src="GET_goods_img + imageUrl" class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon" v-show="imageUrl==''"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品描述">
        <el-input type="textarea" style="width:400px;" v-model="sizeForm.goodsDesc"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">添加商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { categories, add, Goods_img_upload, GET_goods_img } from "@/api/apis";
export default {
  data() {
    return {
      sizeForm: {
        name: "",
        region: "",
        goodsDesc: "",
      },
      sortlist: [],
      price: 1,
      item: "",
      imgdata: "",
      imageUrl: "",
    };
  },
  methods: {
    onSubmit() {
      // 添加商品接口
      add(
        this.sizeForm.name,
        this.sizeForm.region,
        this.price,
        this.imageUrl,
        this.sizeForm.goodsDesc
      ).then((res) => {
        // console.log(res.data)
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "商品添加成功!!",
          });
        }
      });
    },
    // 上传成功后执行的回调函数
    handleAvatarSuccess(res) {
      console.log(res.imgUrl);
      if (res.code == 0) {
        this.imageUrl = res.imgUrl;
      }
    },
    // 图片上传之前验证
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
    // 分类接口
    categories().then((res) => {
      // console.log(res.data);
      let listobj = res.data.categories;
      console.log(listobj)
      // 遍历获取分类名cateName -- 返回新的数组赋值给sortlist
      this.sortlist = listobj.map((item) => item.cateName);
      // console.log(this.sortlist);
      this.sizeForm.region = this.sortlist[0].cateName
    });
    // 图片上传携带参数
    this.imgdata = { id: localStorage.id };
    // 图片上传
    this.Goods_img_upload = Goods_img_upload;
    // 图片获取
    this.GET_goods_img = GET_goods_img;
  },
};
</script>

<style lang="less" scoped>
// 主体样式
#main_padd {
  background-color: #ffffff;
}
// 头部
#tit_padd {
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  padding-top: 20px;
  div {
    padding: 0 0 10px 15px;
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
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
// 表单下边距
.el-form {
  padding: 0 15px 10px;
}
.el-input {
  width: 400px;
}
</style>