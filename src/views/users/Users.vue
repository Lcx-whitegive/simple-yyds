<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users/usermanage' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users/userlist' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Users",
};
</script>

<style lang="less" scoped>
  .breadcrumb {
      margin-bottom: 15px;
  }
</style>