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
    <el-card class="card">
      <!-- 消息提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        class="steps"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab页区域 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          class="tabs"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabChange"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catList"
                :props="catProps"
                @change="cateChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTabData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(attr, index) in item.attr_vals"
                  :key="index"
                  :label="attr"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTabData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
            <el-button type="primary" class="btn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 预览图片弹窗区域 -->
      <el-dialog title="图片预览" :visible.sync="picDialogVisible">
        <img :src="dialogPicSrc" alt="" class="dialog_pic">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategories } from "network/categories";

import { getParams } from "network/params";

import { addGoods } from 'network/goods'

import _ from 'lodash'

export default {
  name: "AddGoods",
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      manyTabData: [],
      onlyTabData: [],
      catProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      catList: [],
      rules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "change",
          },
        ],
      },
      headers: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      picDialogVisible: false,
      dialogPicSrc: ''
    };
  },
  methods: {
    // 获取分类列表
    getCategories() {
      getCategories().then((res) => {
        if (res.meta.status == 200) {
          this.catList = res.data;
        } else {
          this.$message.error("获取分类列表失败");
        }
      });
    },
    // 分类发生切换
    cateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 控制tab页切换
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // tab页切换时
    tabChange() {
      if (this.activeIndex == "1") {
        this.getParams(this.addForm.goods_cat[2], "many");
      } else if (this.activeIndex == "2") {
        this.getParams(this.addForm.goods_cat[2], "only");
      }
    },
    // 获取参数列表
    getParams(id, sel) {
      getParams(id, sel).then((res) => {
        if (res.meta.status == 200) {
          if (this.activeIndex == "1") {
            res.data.forEach((item) => {
              if (item.attr_vals !== "") {
                item.attr_vals = item.attr_vals.split(" ");
              } else {
                item.attr_vals = [];
              }
              this.manyTabData = res.data;
            });
          } else {
            this.onlyTabData = res.data;
          }
        }
      });
    },
    // 预览事件
    handlePreview(file) {
      console.log(file);
      this.picDialogVisible = true
      this.dialogPicSrc = file.response.data.url
    },
    // 移除事件
    handleRemove(file) {
      const path = file.response.tmp_path;
      this.addForm.pics.splice(this.addForm.pics.indexOf(path), 1);
    },
    // 上传成功回调
    uploadSuccess(response) {
      const obj = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(obj);
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if(!valid) {
          this.$message.error('请填写必要的表单项')
          return
        }
        const newAddForm = _.cloneDeep(this.addForm)
        newAddForm.goods_cat = newAddForm.goods_cat.join(',')
        this.manyTabData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.length !== 0 ? item.attr_vals.join(' ') : ''
          }
          newAddForm.attrs.push(obj)
        })
        this.onlyTabData.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          newAddForm.attrs.push(obj)
        })
        addGoods(newAddForm)
          .then(res => {
            if(res.meta.status == 201){
              this.$message.success('创建商品成功')
              this.$router.push('/goods')
            }else{
              this.$message.error('添加商品失败')
            }
          })
      })
    }
  },
  mounted() {
    this.getCategories();
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
  .steps {
    margin-top: 15px;
  }
  .tabs {
    margin-top: 15px;
  }
  .dialog_pic {
    width: 400px;
    height: 300px;
  }
  .btn {
    margin-top: 15px;
  }
}
</style>