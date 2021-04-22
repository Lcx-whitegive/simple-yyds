<template>
  <el-container class="home">
    <!-- 头部区域 -->
    <el-header class="header">
      <h1>电商后台管理系统</h1>
      <el-button class="logout" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
        <div class="collapse" @click="collapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened='true'
          :collapse="isCollapse"
          :collapse-transition='false'
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="String(item.id)" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + m.path" v-for="m in item.children" :key="m.id">
              <i class="el-icon-menu"></i>
              <span>{{m.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mutationTypes from "store/mutationTypes";

import { getMenuList } from 'network/home'

export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconList: [
        'el-icon-user',
        'el-icon-view',
        'el-icon-shopping-bag-1',
        'el-icon-sold-out',
        'el-icon-monitor'
      ],
      isCollapse: false
    }
  },
  computed: {
    // 左侧导航高亮
    activePath() {
      const activePathArr = this.$route.path.split('/')
      activePathArr.length = 2
      const activePath = activePathArr.join('/')
      return activePath
    }
  },
  methods: {
    // 登出
    logout() {
      this.$store.commit({
        type: mutationTypes.LOGOUT,
      });
      this.$router.push("/login");
    },
    // 获取左侧导航列表
    getMenuList() {
      getMenuList()
        .then(res => {
          if(res.meta.status == 200){
            this.menuList = res.data
          }else{
            this.$message.error(res.meta.msg)
          }
        })
    },
    // 折叠左侧导航
    collapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  mounted() {
    this.getMenuList()
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  .header {
    background-color: #373d41;
    .logout {
      float: right;
      margin-top: 10px;
    }
    h1 {
      float: left;
      line-height: 60px;
      margin: 0;
    }
  }
  .aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
    .collapse {
        width: 100%;
        height: 30px;
        background-color: #4A5064;
        text-align: center;
        line-height: 30px;
        color: #fff;
        cursor: pointer;
        letter-spacing: 2px;
      }
  }
  .main {
    background-color: #EAEDF1;
  }
}
</style>