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
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="cateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'cat_level !== 2' }"
        class="table"
      >
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column label="是否有效">
          <template #default="data">
            <i
              class="el-icon-success"
              v-if="!data.row.cat_deleted"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: #f00"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template #default="data">
            <el-tag v-if="data.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-if="data.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-if="data.row.cat_level == 2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="操作">
          <template #default="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(data.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCateById(data.row.cat_id)"
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
        :page-sizes="[5, 6, 7, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
      <!-- 添加分类弹框区域 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCatDialogVisible"
        @close="resetForm"
      >
        <el-form
          :model="addCateForm"
          :rules="rules"
          ref="addCateRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            label="分类名称"
            :label-width="formLabelWidth"
            prop="cat_name"
          >
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" :label-width="formLabelWidth">
            <el-cascader
              v-model="checkedCates"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange"
              style="width: 100%"
              clearable=""
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCatDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate" :loading="isDialogLoading"
            >添 加</el-button
          >
        </div>
      </el-dialog>
      <!-- 修改分类弹框区域 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editCatDialogVisible"
        @close="resetEditForm"
      >
        <el-form
          :model="editCateForm"
          :rules="rules"
          ref="editCateRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            label="分类名称"
            :label-width="formLabelWidth"
            prop="cat_name"
          >
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCatDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate" :loading="isDialogLoading"
            >修 改</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCategories,
  addCate,
  getCateById,
  editCate,
  deleteCateById,
} from "network/categories";

export default {
  name: "Params",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      parentCateList: [],
      value: [],
      total: 0,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      editCateForm: {
        cat_name: "",
      },
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      checkedCates: [],
      formLabelWidth: "80px",
      addCatDialogVisible: false,
      isDialogLoading: false,
      editCatDialogVisible: false,
      rules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取分类列表
    getCategories() {
      getCategories(this.queryInfo).then((res) => {
        if (res.meta.status == 200) {
          this.cateList = res.data.result;
          this.total = res.data.total;
        }
      });
    },
    // 每页显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategories();
    },
    // 当前页码数变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategories();
    },
    // 获取父分类列表
    getParentCategories() {
      const queryInfo = { type: 2 };
      getCategories(queryInfo).then((res) => {
        if (res.meta.status == 200) {
          this.parentCateList = res.data;
        } else {
          this.$message.error("获取父级分类失败");
        }
      });
    },
    // 下拉发生变化
    handleChange() {
      const length = this.checkedCates.length;
      if (length == 0) {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      } else {
        this.addCateForm.cat_pid = this.checkedCates[length - 1];
        this.addCateForm.cat_level = length;
      }
    },
    // 添加分类
    addCate() {
      this.$refs.addCateRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        addCate(this.addCateForm)
          .then((res) => {
            if (res.meta.status == 201) {
              this.$message.success("添加分类成功");
              this.getCategories();
            } else {
              this.$message.error("添加分类失败");
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.addCatDialogVisible = false;
          });
      });
    },
    // 清空表单
    resetForm() {
      this.$refs.addCateRef.resetFields();
    },
    resetEditForm() {
      this.$refs.editCateRef.resetFields();
    },
    // 展示添加分类弹框
    showAddCateDialog() {
      this.addCatDialogVisible = true;
      this.getParentCategories();
    },
    // 展示修改分类弹框
    showEditDialog(id) {
      this.editCatDialogVisible = true;
      getCateById(id).then((res) => {
        if (res.meta.status == 200) {
          this.editCateForm = res.data;
        } else {
          this.$message.error("获取分类失败");
        }
      });
    },
    // 修改分类
    editCate() {
      this.$refs.editCateRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        editCate(this.editCateForm.cat_id, this.editCateForm.cat_name)
          .then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("修改分类成功");
              this.getCategories();
            } else {
              this.$message.error("修改分类失败");
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.editCatDialogVisible = false;
          });
      });
    },
    // 删除分类
    deleteCateById(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCateById(id).then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("删除成功!");
              this.getCategories();
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
  },
  mounted() {
    this.getCategories();
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
  text-align: center;
}
</style>