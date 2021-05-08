<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/params' }"
        >商品参数</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/categories' }"
        >商品分类</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear='clear'>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="toAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table
        :data="goodsList"
        style="width: 100%"
        border
        stripe
        class="table"
        max-height="300"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量(克)">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>
        <el-table-column label="操作">
          <template #default="data">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsById(data.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoodsById } from "network/goods";

import moment from "moment";

export default {
  name: "Params",
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagesize: 5,
        pagenum: 1,
      },
      total: 0,
    };
  },
  methods: {
    // 获取商品列表
    getGoodsList() {
      getGoodsList(this.queryInfo).then((res) => {
        if (res.meta.status == 200) {
          res.data.goods.forEach((item) => {
            item.add_time = moment(item.add_time).format("YYYY年-MM月-DD日");
          });
          this.goodsList = res.data.goods;
          this.total = res.data.total;
        } else {
          this.$message.error("获取商品列表失败");
        }
      });
    },
    // 每页显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList()
    },
    // 当前页码数变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList()
    },
    // 搜索商品
    search() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 清空搜索框
    clear() {
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    // 删除商品
    deleteGoodsById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGoodsById(id).then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("删除成功!");
              this.getGoodsList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    toAddGoods() {
      this.$router.push('/goods/add')
    }
  },
  mounted() {
    this.getGoodsList();
  },
};
</script>

<style lang="less" scoped>
.breadcrumb {
  margin-bottom: 15px;
}
.table {
  margin-top: 15px;
}
.pagination {
  margin-top: 15px;
  text-align: center;
}
</style>