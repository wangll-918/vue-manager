<template>
  <!-- bug：编辑修改信息保存，除了第一次操作修改数据成功并入库，后面修改，界面数据变化，但是没有入库 -->

  <div id="main_accountlist">
    <div id="tit_accountlist">
      <div>账号列表</div>
    </div>
    <div id="content_list">
      <!-- selection-change：当选择项发生变化时会触发该事件 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column label="用户名" width="200">
          <template slot-scope="scope">{{ scope.row.account }}</template>
        </el-table-column>
        <el-table-column label="用户组" width="200">
          <template slot-scope="scope">{{ scope.row.userGroup }}</template>
        </el-table-column>
        <el-table-column label="日期" width="240">
          <template slot-scope="scope">{{ scope.row.ctime }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              style="margin-right:10px;"
            >编辑</el-button>
            <!-- 模板 对话框 -->
            <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="35%">
              <el-form>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                  <el-input autocomplete="off" style="width:220px;" v-model="nameinfo"></el-input>
                </el-form-item>
                <el-form-item label="用户组" :label-width="formLabelWidth">
                  <el-select v-model="groupinfo" placeholder="请选择用户组">
                    <el-option label="超级管理员" value="super"></el-option>
                    <el-option label="普通管理员" value="normal"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickSaveto">确 定</el-button>
              </div>
            </el-dialog>

            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <!-- currentPage1：设置默认当前显示在第几页；jumper：跳转到多少页；page-size	每页显示条目个数，支持 .sync 修饰符 -->
        <!-- // size-change和current-change事件来处理页码大小和当前页变动时候触发的事件 -->
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
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection" type="danger">批量删除</el-button>
        <el-button @click="toggleSelection()" type="primary">取消选择</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 结构 -- 接/引入多个对象  @/ 表示直接指向根目录
import { userlist, useredit, userdel, userbatchdel } from "@/api/apis";
import { getTime } from "@/utils/utils";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      // 分页器
      currentPage: 1,
      pagesize: 5,
      total: 100,
      isshow: false,
      nameinfo: "",
      groupinfo: "",
      i: "",
      rowarr: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },

  methods: {
    // 批量操作
    toggleSelection(rows) {
      if (rows) {
        // rows.forEach(row => {
        //   this.$refs.multipleTable.toggleRowSelection(row);
        // });
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          // 调用删除当前这条数据的接口
          // JSON.stringify(this.ids)将ids转换为字符串数组
          userbatchdel(JSON.stringify(this.ids))
            .then((res) => {
              // console.log(res.data);
              if (res.data.code == 0) {
                // 获取账号列表
                this.getuserlist();
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
      } else {
        // 清空选择
        this.$refs.multipleTable.clearSelection();
      }
    },

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
        userdel(row.id)
          .then((res) => {
            // console.log(res.data);
            if (res.data.code == 0) {
              // 获取账号列表
              this.getuserlist();
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
      this.getuserlist();
    },

    // 当前页变动时候触发的事件--当前页(currentPage)改变时会触发
    handleCurrentChange(newcurrent) {
      // 改变当前页
      this.currentPage = newcurrent;
      this.getuserlist();
    },

    // 编辑 -- 将原始数据渲染到编辑页面
    handleEdit(index, row) {
      // console.log(row);  //输出一行的对象数据
      this.i = index;
      this.groupinfo = row.userGroup;
      this.nameinfo = row.account;
      this.rowarr = row;
      this.dialogFormVisible = true;
      console.log(this.i, this.rowarr);
    },
    // ====================================================
    // 编辑修改保存
    clickSaveto() {
      let saveVal = {
        account: this.nameinfo,
        userGroup: this.groupinfo == "super" ? "超级管理员" : "普通管理员",
        ctime: this.rowarr.ctime,
      };
      // 接口  编辑
      this.tableData.splice(this.i, 1, saveVal);
      useredit(this.rowarr.id, this.nameinfo, this.groupinfo).then((res) => {
        // console.log(res.data);
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "恭喜您，编辑成功!",
            type: "success",
          });
        } else {
          this.error = res.data.msg;
        }
      }, (this.dialogFormVisible = false));
    },
    // ====================================================================
    // 获取用户列表
    getuserlist() {
      userlist(this.currentPage, this.pagesize).then((res) => {
        // console.log(res)
        let settingtotal = res.data;
        let settingObj = res.data.data;
        // console.log(settingObj)

        for (let obj of settingObj) {
          // 转换时间格式--获取时就转换避免多次渲染，提高性能
          obj.ctime = getTime(obj.ctime);
          // console.log(obj.ctime);
        }
        // 对象转换为数组
        // console.log(settingObj)
        // 总数据
        this.tableData = Object.values(settingObj);
        // console.log(this.tableData)
        // 获取数据总条数
        this.total = settingtotal.total;
      });
    },
  },
  created() {
    // 初始化账号列表
    this.getuserlist();
  },
};
</script>

<style lang="less" scoped>
// 主体样式
#main_accountlist {
  // 头部
  #tit_accountlist {
    font-size: 16px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    padding-top: 20px;
    div {
      padding: 0 0 10px 15px;
    }
  }
  #content_list {
    padding: 0 15px 20px;
  }
  // 分页器边距
  .block {
    padding: 15px 20px 0;
  }
}
</style>