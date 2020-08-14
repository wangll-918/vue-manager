<template>
  <div id="main_shop">
    <div id="tit_shop">
      <div>
        <p>店铺管理</p>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="店铺名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="店铺公告">
        <el-input type="textarea" v-model="bulletin"></el-input>
      </el-form-item>
      <el-form-item label="店铺头像">
        <el-upload
          class="avatar-uploader"
          :action="Shop_img_upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="avatar" :src=" avatar == '' ? '' : GET_shop_img + avatar " class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="店铺图片">
        <el-upload
          :action="Shop_img_upload"
          list-type="picture-card"
          :on-success="handleimgSuccess"
          v-model="pics"
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="filelist"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogVisible" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="配送费">
        <el-input v-model="deliveryPrice"></el-input>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="delivery"></el-switch>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-input v-model="deliveryTime"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input v-model="description"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-input v-model="score"></el-input>
      </el-form-item>
      <el-form-item label="销量">
        <el-input v-model="sellCount"></el-input>
      </el-form-item>
      <el-form-item label="活动">
        <el-checkbox-group v-model="supports">
          <el-checkbox label="在线支付满28减5" name="type"></el-checkbox>
          <el-checkbox label="VC无限橙果汁全场8折" name="type"></el-checkbox>
          <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
          <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
          <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-time-picker
          is-range
          v-model="date"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        ></el-time-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { shopinfo, GET_shop_img, Shop_img_upload, shopedit } from "@/api/apis";
import { getTime } from "@/utils/utils";

export default {
  data() {
    return {
      id: "",
      name: "",
      bulletin: "",
      avatar: "",
      pics: [],
      deliveryPrice: "",
      delivery: "",
      deliveryTime: "",
      description: "",
      score: "",
      sellCount: "", // 销量
      supports: [],
      date: [],
      dialogImageUrl: "",
      dialogVisible: false,
      filelist: [], // 回填数组
    };
  },
  methods: {
    // 保存修改
    onSubmit() {
      // 将参数封装（拷贝一个新的对象），操作的话直接在新的对象上改，避免改变母体数据
      var params = {
        id: this.id,
        name: this.name,
        bulletin: this.bulletin,
        avatar: this.avatar,
        deliveryPrice: this.deliveryPrice,
        deliveryTime: this.deliveryTime,
        description: this.description,
        score: this.score,
        sellCount: this.sellCount,
        supports: JSON.stringify(this.supports),
        date: JSON.stringify([getTime(this.date[0]), getTime(this.date[1])]), //转换时间格式 -- 数组字符串
        pics: JSON.stringify(this.pics),
      };
      shopedit(params).then((res) => {
        console.log(res);
      });
    },

    // 图片超出上传限制个数定义的行为
    handleExceed() {
      this.$message.warning(`店铺图片限制选择上传 3 张图片哦!`);
    },
    // 店铺头像上传成功后的回调函数
    handleAvatarSuccess(res) {
      console.log(res);
      if (res.code == 0) {
        this.avatar = res.imgUrl;
        this.$message({
          type: "success",
          message: "店铺头像上传成功!!",
        });
      }
    },
    // 店铺图片上传成功后的回调函数
    handleimgSuccess(res) {
      if (res.code == 0) {
        // 图片上传成功后将新的图片push进pics数组
        this.pics.push(res.imgUrl);
        // console.log(this.pics)
      }
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
    // 移出图片
    handleRemove(res) {
      console.log(res);
      // 删除对应索引的对象
      this.pics.splice(this.pics.indexOf(res.name), 1);
      console.log(this.pics);
    },
  },
  created() {
    // 接口
    shopinfo().then((res) => {
      let arr = res.data.data;
      this.name = arr.name;
      this.bulletin = arr.bulletin;
      this.avatar = arr.avatar;
      this.pics = arr.pics;
      this.deliveryPrice = arr.deliveryPrice;
      this.delivery = arr.delivery;
      this.deliveryTime = arr.deliveryTime;
      this.description = arr.description;
      this.score = arr.score;
      this.sellCount = arr.sellCount;
      // 店铺图片
      // this.avatar = GET_shop_img + arr.avatar;
      // 活动
      this.supports = arr.supports;
      for (let key in arr) {
        this[key] = arr[key];
      }
    });
    this.Shop_img_upload = Shop_img_upload;
    this.GET_shop_img = GET_shop_img;
    // 回填照片墙
    this.filelist = this.pics.map((imgUrl) => {
      return {
        name: imgUrl,
        url: GET_shop_img + imgUrl,
      };
    });
  },
};
</script>

<style lang="less" scoped>
#main_shop {
  background-color: #ffffff;
  .el-form {
    padding: 0 20px 20px 10px;
  }
}
// 头部
#tit_shop {
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  padding-top: 20px;
  div {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    .el-button {
      height: 35px;
      margin-bottom: 2px;
    }
  }
}
// 店铺头像
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

