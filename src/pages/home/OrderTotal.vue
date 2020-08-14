<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 柱状图 -->
    <div id="orderCharts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { ordertotal } from "@/api/apis";
import { getTime } from "@/utils/utils";
export default {
  data() {
    return {
      formInline: {
        time: "",
      },
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
      // 时间值
      date: [],
    };
  },
  methods: {
    onSubmit() {
      let timestr = JSON.stringify([
        getTime(this.date[0]),
        getTime(this.date[1]),
      ]);
      this.getordertotal(timestr);
    },
    getordertotal(str) {
      // 订单接口
      ordertotal(str).then((res) => {
        console.log(res.data.data);
        let arr = res.data.data;

        for (let obj of arr) {
          obj.orderTime = getTime(obj.orderTime);
        }
        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999",
              },
            },
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ["line", "bar"] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          legend: {
            data: ["下单时间", "订单金额"],
          },
          xAxis: [
            {
              type: "category",
              data: arr.map((obj) => obj.orderTime),
              axisPointer: {
                type: "shadow",
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "订单金额",
              axisLabel: {
                formatter: "{value} 元",
              },
            },
          ],
          series: [
            {
              name: "下单金额",
              type: "bar",
              data: arr.map((obj) => obj.orderAmount),
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        this.orderCharts.setOption(option);
      });
      /*  window.addEventListener("resize", function () {
        this.orderCharts.resize();
      }); */
    },
  },
  mounted() {
    this.orderCharts = echarts.init(document.getElementById("orderCharts"));
  },
  created(){
    // this.getordertotal();
  }
};
</script>

<style lang="less" scoped>
.el-form {
  padding-top: 15px;
  padding-left: 15px;
  // box-shadow: none
}
// 柱状图
#orderCharts {
  height: 400px;
  margin: 0 auto;
  background-color: #fff;
  padding-top: 25px;
}
</style>