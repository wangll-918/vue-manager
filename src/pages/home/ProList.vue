<template>
  <div id="main_plist">
    <div id="tit_plist">
      <div>商品列表</div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <!-- 通过设置 type="expand" 和 Scoped slot 可以开启展开行功能，el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <template slot-scope="scope">
                <img :src="GET_goods_img+scope.row.imgUrl" />
              </template>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.ctime }}</span>
            </el-form-item>
            <el-form-item label="商品评价">
              <span>{{ props.row.rating }}</span>
            </el-form-item>
            <el-form-item label="商品销量">
              <span>{{ props.row.sellCount }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goodsDesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- prop 对应列内容的字段名，也可以使用 property 属性 -->
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="商品分类" prop="category"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>
      <el-table-column label="商品图片" prop="imgUrl">
        <template slot-scope="scope">
          <img :src="GET_goods_img + scope.row.imgUrl" />
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="goodsDesc"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            style="margin-right:10px;"
            type="primary"
          >编辑</el-button>

          <!-- 模板 对话框 -->
          <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="40%">
            <el-form>
              <el-form-item label="商品名称">
                <el-input autocomplete="off" style="width:220px;" v-model="name"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-select v-model="category" placeholder="请选择商品分类">
                  <el-option :label="item" v-for="item in sortlist" :key="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input-number v-model="price" :min="0" label="描述文字"></el-input-number>
              </el-form-item>
              <el-form-item label="商品图片">
                <!-- handleAvatarSuccess 成功时的回调函数 -->
                <el-upload
                  class="avatar-uploader"
                  :action="Goods_img_upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="imgdata"
                >
                  <img :src="GET_goods_img + imgUrl" v-show="imgUrl" />
                  <i class="el-icon-plus avatar-uploader-icon" v-show="imgUrl==''"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="商品描述">
                <el-input type="textarea" style="width:400px;" v-model="goodsDesc"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
          </el-dialog>

          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <!-- currentPage1：设置默认当前显示在第几页；jumper：跳转到多少页；page-size	每页显示条目个数，支持 .sync 修饰符 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  del,
  list,
  categories,
  edit,
  Goods_img_upload,
  GET_goods_img,
} from "@/api/apis";
import { getTime } from "@/utils/utils";

export default {
  data() {
    return {
      tableData: [],
      imgUrl: "",
      // 分页器
      currentPage: 1,
      pagesize: 5,
      total: 100,
      i: "",
      sortlist: [],
      price: 1,
      item: "",
      imgdata: "",
      goodsDesc: "",
      dialogFormVisible: false, // 控制对话框是否关闭
      name: "",
      category: "",
      porid: "",
      Goods_img_upload: "",
      GET_goods_img: "",
    };
  },
  methods: {
    // 编辑
    handleEdit(index, row) {
      this.name = row.name;
      this.category = row.category;
      this.price = row.price;
      this.goodsDesc = row.goodsDesc;
      this.imgUrl = row.imgUrl;
      this.porid = row.id;
      // console.log(this.i, this.rowarr);
      // 获取分类接口
      categories().then((res) => {
        // console.log(res.data);
        let listobj = res.data.categories;
        // console.log(listobj)
        // 遍历获取cateName -- 返回新的数组赋值给sortlist
        this.sortlist = listobj.map((item) => item.cateName);
        // console.log(this.sortlist);
      });
      this.dialogFormVisible = true;
    },
    // 图片上传成功后的回调函数
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.imgUrl = res.imgUrl;
      }
    },
    // ============================================
    // 获取商品列表
    getprolist() {
      list(this.currentPage, this.pagesize).then((res) => {
        // console.log(res.data);
        let settingtotal = res.data;
        let settingObj = res.data.data;
        for (let obj of settingObj) {
          // 转换时间格式--获取时就转换避免多次渲染，提高性能
          obj.ctime = getTime(obj.ctime);
          // console.log(obj.ctime);
        }
        // console.log(settingObj);
        // 总数据
        // this.tableData = Object.values(settingObj);
        this.tableData = settingObj;
        // console.log(this.tableData);
        // 获取数据总条数
        this.total = settingtotal.total;
      });
    },

    // =========================================
    // 当选择项发生变化时会触发该事件 -- 复选框是否选中
    handleSelectionChange(val) {
      // 循环输出数组
      this.ids = val.map((item) => item.id);
      // console.log(val) // 以数组形式输出选中的对应的每条数据
      // console.log(this.ids); // 以数组形式输出选中的对应的每条数据的id -- 为批量删除做铺垫，需要根据每条数据的id操作
    },

    // 点击删除当前数据
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 调用删除当前这条数据的接口
        del(row.id)
          .then((res) => {
            // console.log(res.data);
            if (res.data.code == 0) {
              // 获取账号列表
              this.getprolist();
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
        // console.log(index, row);
      });
    },
    // size-change和current-change事件来处理页码大小和当前页变动时候触发的事件
    // 处理页码大小--每页条数(pageSize) 改变时会触发
    handleSizeChange(newpage) {
      // 改变页面显示数据条数
      this.pagesize = newpage;
      // 重新获取列表
    },

    // 当前页变动时候触发的事件--当前页(currentPage)改变时会触发
    handleCurrentChange(newcurrent) {
      // 改变当前页
      this.currentPage = newcurrent;
      this.getprolist();
    },
    onSubmit() {
      // 修改商品接口
      edit(
        this.name,
        this.category,
        this.price,
        this.imgUrl,
        this.goodsDesc,
        this.porid
      ).then((res) => {
        // console.log(res.data);
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "商品修改成功!!",
          });
          // 初始化商品列表
          this.getprolist();
          // 关闭模态框
          this.dialogFormVisible = false;
        }
      });
    },
  },
  created() {
    // 初始化商品列表
    this.getprolist();
    // 上传图片携带的参数id
    this.imgdata = { id: localStorage.id };
    this.Goods_img_upload = Goods_img_upload;
    this.GET_goods_img = GET_goods_img;
  },
};
</script>

<style lang="less" scoped>
// 头部
#tit_plist {
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  padding-top: 20px;
  div {
    padding: 0 0 10px 15px;
  }
}
// 主体上边距
#main_plist {
  background-color: #ffffff;
  .el-table {
    padding: 0 20px;
  }
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
// 商品图片样式
img {
  border-radius: 8px;
  width: 65px;
  height: 65px;
}
// 分页器边距
.block {
  padding: 15px 20px;
}
</style>