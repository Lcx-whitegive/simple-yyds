<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/reports' }"
        >数据统计</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/reports' }"
        >数据报表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="card">
      <div
        id="reports"
        style="width: 600px; height: 400px"
        ref="reportsRef"
      ></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";

import { getReportsData } from 'network/reports'

export default {
  name: "Reports",
  data() {
    return {
      option: {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  },
  mounted() {
    const reports = echarts.init(this.$refs.reportsRef);
    getReportsData()
      .then(res => {
        if(res.meta.status == 200){
          this.option = res.data
          reports.setOption(this.option)
        }else{
          this.$message.error('获取数据失败')
        }
      })
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
}
</style>