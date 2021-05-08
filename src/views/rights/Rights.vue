<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/roles' }">角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card">
      <!-- 权限列表区域 -->
      <el-table :data="rightsList" style="width: 100%" stripe border max-height="400">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级"> 
          <template #default="data">
            <el-tag v-if="data.row.level == 0">一级</el-tag>
            <el-tag type="success" v-if="data.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-if="data.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/auth";

export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    // 获取权限列表
    getRightsList() {
      getRightsList().then((res) => {
        if (res.meta.status == 200) {
          this.rightsList = res.data;
        } else {
          this.$message.error("获取权限列表失败");
        }
      });
    },
  },
  mounted() {
    this.getRightsList();
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
}
</style>