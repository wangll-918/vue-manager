<template>
  <div>
    <!-- 数量金额统计 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/imgs/total-orders.png" alt />
          <div>
            <p>总订单</p>
            <span>102400</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/imgs/total-sales.png" alt />
          <div>
            <p>总销售额</p>
            <span>102400</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/imgs/orders-today.png" alt />
          <div>
            <p>今日订单数</p>
            <span>102400</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <img src="../../assets/imgs/sales-today.png" alt />
          <div>
            <p>今日销售额</p>
            <span>102400</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 统计图 -->
    <div id="myCharts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { totaldata } from "@/api/apis";
export default {
  mounted() {
    let myChart = echarts.init(document.getElementById("myCharts"));
    // 访问接口
    totaldata().then((res) => {
      console.log(res);

      let option = {
        title: {
          text: "数据统计",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["订单量", "销售额"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: res.data.xData,  //x轴数据 -- 横坐标时间
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "订单量",
            type: "line",
            stack: "总量",
            data: res.data.orderData,  // 订单数据
          },
          {
            name: "销售额",
            type: "line",
            stack: "总量",
            data: res.data.amountData, //金额数据
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    });
    //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    // 自适应大小
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  },
};
</script>

<style lang="less" scoped>
.el-row {
  padding: 10px 10px 20px;
  background: #f0f2f5;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px 0;
  font-size: 14px;
  background: #ffffff;

  img {
    width: 45px;
    height: 48px;
  }
  p {
    color: #aaa;
    margin-bottom: 5px;
  }
  span {
    font-weight: bold;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
// 折线图
#myCharts {
  height: 400px;
  margin: 0 auto;
  background-color: #fff;
  padding: 15px;
}
</style>