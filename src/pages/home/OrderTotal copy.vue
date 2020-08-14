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
  },
  created() {},
  mounted() {
    let orderCharts = echarts.init(document.getElementById("orderCharts"));
    // 订单接口
    ordertotal().then((res) => {
      console.log(res.data)
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
          data: ["订单量1", "订单量2", "平均订单数量"],
        },
        xAxis: [
          {
            type: "category",
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "订单量",
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} 单",
            },
          },
          {
            type: "value",
            name: "订单量走势",
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value} 单",
            },
          },
        ],
        series: [
          {
            name: "订单量1",
            type: "bar",
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3,
            ],
          },
          {
            name: "订单量2",
            type: "bar",
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3,
            ],
          },
          {
            name: "平均订单数量",
            type: "line",
            yAxisIndex: 1,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2,
            ],
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      orderCharts.setOption(option);
    });
    window.addEventListener("resize", function () {
      orderCharts.resize();
    });
  },
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