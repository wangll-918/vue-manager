<template>
  <div id="main_pro">
    <div id="tit_shop">
      <div>
        <p>商品分类</p>
        <!-- <template slot-scope="scope"> -->
        <el-button type="primary" @click="onSubmit">添加分类</el-button>
        <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="35%">
          <el-form>
            <el-form-item label="分类名称">
              <el-input autocomplete="off" style="width:220px;" v-model="cateName"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" width="240">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="clickSaveto">确 定</el-button>
          </div>
        </el-dialog>
        <!-- </template> -->
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="序号" width="120">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" width="340">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-show="!scope.row.isedit">{{ scope.row.cateName }}</span>
          <!-- 编辑状态 获取value值 -->
          <el-input v-show="scope.row.isedit" v-model="scope.row.cateName" />
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="240">
        <template slot-scope="scope">
          <!-- scope.row.state 动态获取自己独立的state状态 ，如果是统一的value值，操作数据状态所有的数据会统一改变 -->
          <el-switch
            :disabled="!scope.row.isedit"
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope)"
            :style="{background:(scope.row.isedit?ygreen:'')}"
          >{{ scope.row.isedit ? '完成':'编辑'}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <!-- currentPage1：设置默认当前显示在第几页；jumper：跳转到多少页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { addcate, catelist, delcate, editcate } from "@/api/apis";

export default {
  data() {
    return {
      tableData: [], //数据源
      value: true,
      // 分页器
      currentPage: 1,
      pagesize: 5,
      total: 100,
      cateName: "",
      dialogFormVisible: false,
      ygreen: "yellowgreen",
      wcolor: "#fff",
    };
  },
  methods: {
    // 打开添加分类
    onSubmit() {
      this.cateName = this.tableData.cateName;
      this.dialogFormVisible = true;
    },
    // 编辑 -- 行内编辑数据保存 不需要界面更新再次初始化
    handleEdit(scope) {
      // console.log(row);
      if (scope.row.isedit) {
        editcate(scope.row).then((res) => {
          console.log(res.data);
          if (res.data.code == 0) {
            this.$message({
              message: "商品分类修改成功",
              type: "success",
            });
            scope.row.isedit = false;
          }
        });
      }
      // 开启编辑状态
      else {
        scope.row.isedit = true;
      }
    },
    // 获取商品分类列表
    getprolist() {
      catelist(this.currentPage, this.pagesize).then((res) => {
        // console.log(res.data.data);
        let settingtotal = res.data;
        let settingObj = res.data.data;
        // 遍历循环
        for (let obj of settingObj) {
          // 循环 转换state  1=>true 0=>false
          obj.state = obj.state == 1;
          // 自定义添加新属性 -- 判断此对象是否是在编辑状态
          obj.isedit = false;
          // console.log(obj);
        }
        // 总数据
        this.tableData = Object.values(settingObj);
        // console.log(this.tableData)
        // 获取数据总条数
        this.total = settingtotal.total;
      });
    },
    // 点击删除当前数据
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 调用删除当前这条数据的接口
        delcate(row.id)
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
    // ==================================分页===============================================
    // size-change和current-change事件来处理页码大小和当前页变动时候触发的事件
    // 处理页码大小--每页条数(pageSize) 改变时会触发
    handleSizeChange(newpage) {
      // 改变页面显示数据条数
      this.pagesize = newpage;
      // 重新获取列表
      this.getprolist();
    },
    // 当前页变动时候触发的事件--当前页(currentPage)改变时会触发
    handleCurrentChange(newcurrent) {
      // 改变当前页
      this.currentPage = newcurrent;
      this.getprolist();
    },

    // 确定添加分类-- 调用接口将分类添加到数据库
    clickSaveto() {
      let saveVal = {
        cateName: this.cateName,
        value: this.value == 1 ? true : false,
      };
      // 接口  编辑
      this.tableData.splice(this.i, 1, saveVal);
      addcate(this.cateName, this.value).then((res) => {
        // console.log(res.data);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "恭喜您，编辑成功!",
            type: "success",
          });
          this.getprolist();
        } else {
          this.$message({
              type: "danger",
              message: "分类添加异常!",
            });
        }
      }, (this.dialogFormVisible = false));
    },
  },
  created() {
    // 初始化商品列表
    this.getprolist();
  },
};
</script>

<style lang="less" scoped>
// 外层盒子
#main_pro {
  background-color: #ffffff;
  .el-table {
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
// 表格
.el-table {
  margin-top: 15px;
  .block {
    margin-top: 20px;
  }
  .el-table::before {
    border-bottom: 0;
  }
}
// 分页器边距
.block {
  padding: 10px 20px;
}
</style>