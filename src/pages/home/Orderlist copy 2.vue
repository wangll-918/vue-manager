<template>
  <div id="acclist">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="formInline.consignee" placeholder="收货人"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="formInline.orderState" placeholder="订单状态">
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker
          v-model="formInline.datetime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="orderNo" label="订单号" width="70"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
      <el-table-column prop="consignee" label="收货人"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间"></el-table-column>
      <el-table-column prop="remarks" label="用户备注"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
      <el-table-column prop="orderState" label="订单状态"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <!-- currentPage1：设置默认当前显示在第几页；jumper：跳转到多少页 -->
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
import { orderlist } from "@/api/apis";
import { getTime } from "@/utils/utils";
export default {
  data() {
    // 查询控件
    return {
      formInline: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        datetime: [],
      },
      options: ["全部", "已完成", "已受理", "派送中"],
      // 查询选择时间
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 时间日期
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: "",
      // 表格数据
      tableData: [],
      // 分页器
      currentPage: 1,
      pagesize: 5,
      total: 100,
    };
  },
  methods: {
    // 条件查询
    onSubmit() {

      // 判断当值不为空时再进行传参
      let paramsobj = {};
      if (this.formInline.orderNo != "") paramsobj.orderNo = this.formInline.orderNo;
      if (this.formInline.consignee != "")
        paramsobj.consignee = this.formInline.consignee;
      if (this.formInline.phone != "") paramsobj.phone = this.formInline.phone;
      if (this.formInline.orderState != "" && "全部")
        paramsobj.orderState = this.formInline.orderState;
      // 转换时间格式 转换为字符串格式 时间条件判断
      if (this.formInline.datetime.length > 0)
        paramsobj.datetime = JSON.stringify([
          getTime(this.formInline.datetime[0]),
          getTime(this.formInline.datetime[1]),
        ]);
      this.paramsobj = paramsobj;
      console.log(this.paramsobj)
      this.getorderlist(this.paramsobj);
    },
    // 获取数据
    // 当把条件从前端统一传输过去，如果后台没有做判断，会有问题
    getorderlist(paramsobj) {
      orderlist({
        currentPage: this.currentPage,
        pagesize: this.pagesize,
        ...paramsobj,
      }).then((res) => {
        console.log(res);
        this.tableData = res.data.data;
        // console.log(this.tableData)
        for (let paramsobj of this.tableData) {
          // 转换时间格式
          paramsobj.deliveryTime = getTime(paramsobj.deliveryTime);
          paramsobj.orderTime = getTime(paramsobj.orderTime);
        }
        // 获取数据总条数
        this.total = res.data.total;
      });
      // this.getorderlist();//重新获取列表所有数据
    },
    /*  handleClick(row) {
      console.log(row);
    }, */
    // 获取订单列表
    /* getorderlist() {
      orderlist(this.currentPage, this.pagesize).then((res) => {
        // console.log(res);
        this.tableData = res.data.data;
        // console.log(this.tableData)
        for (let paramsobj of this.tableData) {
          // 转换时间格式
          paramsobj.deliveryTime = getTime(paramsobj.deliveryTime);
          paramsobj.orderTime = getTime(paramsobj.orderTime);
        }
        // 获取数据总条数
        this.total = res.data.total;
      });
    }, */
    // 处理页码大小--每页条数(pageSize) 改变时会触发
    handleSizeChange(newpage) {
      // 改变页面显示数据条数
      this.pagesize = newpage;
      this.getorderlist();
    },
    // 当前页变动时候触发的事件--当前页(currentPage)改变时会触发
    handleCurrentChange(newcurrent) {
      // 改变当前页
      this.currentPage = newcurrent;
      // 翻页时，带入查询参数
      this.getorderlist(this.paramsobj);
    },
  },
  created() {
    this.getorderlist();
  },
};
</script>

<style scoped lang='less'>
#acclist {
  background-color: #fff;
  padding: 0 15px;
}
.el-form {
  padding-top: 20px;
}
// 分页器上边距
.block {
  margin: 15px 0;
}
</style>