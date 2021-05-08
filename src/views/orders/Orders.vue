<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/orders' }"
        >订单管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/orders' }"
        >订单列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card class="card">
      <!-- 搜索区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="clear"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        stripe
        max-height="300"
        class="table"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单标号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template #default="data">
            <el-tag v-if="data.row.order_pay == 1" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template #default="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addressDialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
      <!-- 修改订单地址弹框区域 -->
      <el-dialog title="修改地址" :visible.sync="addressDialogVisible">
        <el-form :model="addressForm" :rules="rules">
          <el-form-item label="省市区/县" :label-width="formLabelWidth" prop="address1">
            <el-input v-model="addressForm.address1"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address2">
            <el-input v-model="addressForm.address1"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrderList } from "network/orders";

import moment from "moment";

export default {
  name: "Orders",
  data() {
    return {
      queryInfo: {
        query: "",
        pagesize: 6,
        pagenum: 1,
      },
      total: 0,
      orderList: [],
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      rules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blue" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      formLabelWidth: "90px",
    };
  },
  methods: {
    // 获取订单列表
    getOrderList() {
      getOrderList(this.queryInfo).then((res) => {
        if (res.meta.status == 200) {
          res.data.goods.forEach((item) => {
            item.create_time = moment(item.create_time).format(
              "YYYY年-MM月-DD日 HH时:mm分:ss秒"
            );
          });
          this.orderList = res.data.goods;
          this.total = res.data.total;
        } else {
          this.$message.error("获取订单列表失败");
        }
      });
    },
    // 每页条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    // 页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 搜索订单
    search() {
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
    // 清空搜索框
    clear() {
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
  },
  mounted() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
  .pagination {
    margin-top: 15px;
    text-align: center;
  }
  .table {
    margin-top: 15px;
  }
}
</style>