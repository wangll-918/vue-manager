<template>
  <div id="main_accountlist">
    <div id="tit_accountlist">
      <div>账号列表</div>
    </div>
    <div id="content_list">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="65"></el-table-column>
        <el-table-column label="用户名" width="200">
            <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="用户组" width="200">
            <template slot-scope="scope">{{ scope.row.group }}</template>
        </el-table-column>
        <el-table-column label="日期" width="240">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <!-- currentPage1：设置默认当前显示在第几页；jumper：跳转到多少页；page-size	每页显示条目个数，支持 .sync 修饰符 -->
        <el-pagination
          :current-page.sync="currentPage1"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="10"
        ></el-pagination>
      </div>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])" type="danger">批量删除</el-button>
        <el-button @click="toggleSelection()" type="primary">取消选择</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 结构 -- 接/引入多个对象  @/ 表示直接指向根目录
import { userlist } from "@/api/apis";
export default {
  data() {
    return {
      tableData: [
        /* {
          date: "2016-05-03",
          name: "王小虎",
          group:'超级管理员'
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          group:'超级管理员'
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          group:'超级管理员'
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          group:'普通管理员'
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          group:'普通管理员'
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          group:'普通管理员'
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          group:'普通管理员'
        },*/
      ], 
      multipleSelection: [],
      // 分页器
      currentPage1: 1,
    };
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
  created() {
    userlist(1, 2).then((res) => {
      console.log(res.data)
    })
  }
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
  #content_list{
      padding: 0 15px 20px;
  }
  // 分页器边距
  .block {
    padding: 15px 20px 0;
  }
}
</style>