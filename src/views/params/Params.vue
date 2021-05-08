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
      <el-alert
        title="注意！只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row class="row">
        <el-col :span="3" style="line-height: 40px">
          <span>请选择商品分类:</span>
        </el-col>
        <el-col :span="8">
          <el-cascader
            v-model="currentCateId"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页区域 -->
      <el-tabs v-model="paramsType" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="addParamsBtnDisabled"
            @click="addParamDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格区域 -->
          <el-table
            :data="manyParamList"
            style="width: 100%"
            border
            stripe
            class="table"
          >
            <el-table-column type="expand">
              <template #default="data">
                <el-tag
                  v-for="(item, index) in data.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(item, data.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="data.row.inputVisible"
                  v-model="data.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(data.row)"
                  @blur="handleInputConfirm(data.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(data.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
            <el-table-column label="操作">
              <template #default="data">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(data.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamById(data.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="addParamsBtnDisabled"
            @click="addParamDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格区域 -->
          <el-table
            :data="onlyParamList"
            style="width: 100%"
            border
            stripe
            class="table"
          >
            <el-table-column type="expand">
              <template #default="data">
                <el-tag
                  v-for="(item, index) in data.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(item, data.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="data.row.inputVisible"
                  v-model="data.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(data.row)"
                  @blur="handleInputConfirm(data.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(data.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
            <el-table-column label="操作">
              <template #default="data">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(data.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamById(data.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加动态/静态属性弹框区域 -->
      <el-dialog
        :title="paramsType == 'many' ? '添加动态参数' : '添加静态属性'"
        :visible.sync="addParamDialogVisible"
        @close="resetForm"
      >
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addFormRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            :label="this.paramsType == 'many' ? '动态参数' : '静态属性'"
            :label-width="formLabelWidth"
            prop="attr_name"
          >
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addParamDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParam" :loading="isDialogLoading"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 修改动态/静态属性弹框区域 -->
      <el-dialog
        :title="paramsType == 'many' ? '修改动态参数' : '修改静态属性'"
        :visible.sync="editParamDialogVisible"
        @close="resetEditForm"
      >
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editFormRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            :label="this.paramsType == 'many' ? '动态参数' : '静态属性'"
            :label-width="formLabelWidth"
            prop="attr_name"
          >
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editParamDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editParam"
            :loading="isDialogLoading"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getCategories } from "network/categories";
import {
  getParams,
  addParam,
  getParamById,
  editParam,
  deleteParamById,
} from "network/params";

export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      currentCateId: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      paramsType: "many",
      manyParamList: [],
      onlyParamList: [],
      addParamDialogVisible: false,
      editParamDialogVisible: false,
      formLabelWidth: "80px",
      addForm: {
        attr_name: "",
      },
      editForm: {},
      rules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      isDialogLoading: false,
    };
  },
  computed: {
    addParamsBtnDisabled() {
      return this.currentCateId.length !== 3;
    },
  },
  methods: {
    // 获取分类
    getCateList() {
      getCategories().then((res) => {
        if (res.meta.status == 200) {
          this.cateList = res.data;
        } else {
          this.$message.error("获取分类列表失败");
        }
      });
    },
    // 获取参数
    getParams() {
      getParams(
        this.currentCateId[this.currentCateId.length - 1],
        this.paramsType
      ).then((res) => {
        if (!res.data) return;
        res.data.forEach((item) => {
          item.inputVisible = false;
          item.inputValue = "";
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(" ");
          } else {
            item.attr_vals = [];
          }
        });
        if (res.meta.status == 200) {
          if (this.paramsType == "many") {
            this.manyParamList = res.data;
          } else {
            this.onlyParamList = res.data;
          }
        } else {
          this.$message.error("获取参数列表失败");
        }
      });
    },
    // 选择分类变化时查询参数
    handleChange() {
      if (this.currentCateId.length !== 3) {
        this.currentCateId = [];
        this.manyParamList = [];
        this.onlyParamList = [];
        return;
      }
      this.getParams();
    },
    // 切换tab页
    handleClick(tab, event) {
      this.getParams();
    },
    // 清空表单
    resetForm() {
      this.$refs.addFormRef.resetFields();
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加静态/动态参数
    addParam() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        const paramInfo = {
          id: this.currentCateId[this.currentCateId.length - 1],
          attr_name: this.addForm.attr_name,
          attr_sel: this.paramsType,
        };
        addParam(paramInfo)
          .then((res) => {
            if (res.meta.status == 201) {
              this.$message.success(
                this.paramsType == "many"
                  ? "添加动态参数成功"
                  : "添加静态属性成功"
              );
              this.getParams();
            } else {
              this.$message.error(
                this.paramsType == "many"
                  ? "添加动态参数失败"
                  : "添加静态属性失败"
              );
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.addParamDialogVisible = false;
          });
      });
    },
    // 点击编辑获取参数信息并弹出弹框
    showEditDialog(attr_id) {
      this.editParamDialogVisible = true;
      const queryInfo = {
        cate_id: this.currentCateId[this.currentCateId.length - 1],
        attr_id,
        attr_sel: this.paramsType,
      };
      getParamById(queryInfo).then((res) => {
        if (res.meta.status == 200) {
          this.editForm = res.data;
        } else {
          this.$message.error("获取参数信息失败");
        }
      });
    },
    // 修改静态/动态参数
    editParam() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        const paramInfo = {
          id: this.currentCateId[this.currentCateId.length - 1],
          attr_name: this.editForm.attr_name,
          attr_sel: this.paramsType,
          attr_id: this.editForm.attr_id,
        };
        editParam(paramInfo)
          .then((res) => {
            if (res.meta.status == 200) {
              this.$message.success(
                this.paramsType == "many"
                  ? "修改动态参数成功"
                  : "修改静态属性成功"
              );
              this.getParams();
            } else {
              this.$message.error(
                this.paramsType == "many"
                  ? "修改动态参数失败"
                  : "修改静态属性失败"
              );
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.editParamDialogVisible = false;
          });
      });
    },
    // 删除参数
    deleteParamById(attr_id) {
      const paramInfo = {
        id: this.currentCateId[this.currentCateId.length - 1],
        attr_id,
      };
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteParamById(paramInfo).then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("删除成功!");
              this.getParams();
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
    // 添加tag
    handleInputConfirm(param) {
      let inputValue = param.inputValue;
      if (inputValue.trim().length == 0) {
        param.inputVisible = false
        param.inputValue = ""
        return
      }
      param.attr_vals.push(inputValue);
      param.inputVisible = false
      param.inputValue = ""
      const paramInfo = {
        id: this.currentCateId[this.currentCateId.length - 1],
        attr_id: param.attr_id,
        attr_name: param.attr_name,
        attr_sel: this.paramsType,
        attr_vals: param.attr_vals.join(" "),
      };
      editParam(paramInfo).then((res) => {
        if (res.meta.status == 200) {
          this.$message.success(
            this.paramsType == "many" ? "添加动态参数成功" : "添加静态属性成功"
          );
        } else {
          param.attr_vals.pop();
          this.$message.error(
            this.paramsType == "many" ? "添加动态参数失败" : "添加静态属性失败"
          );
        }
      });
    },
    // 展开或关闭某行
    // expandChange(row, expandedRows) {
    //   console.log(row);
    // if(row.attr_vals == ''){
    //   this.paramTags = []
    //   return
    // }
    // this.rowKey = String(row.attr_id);
    // if (expandedRows.length) {
    //   this.rowKeys = [];
    //   if (row) {
    //     this.rowKeys.push(row.attr_id);
    //   }
    // } else {
    //   that.rowKeys = [];
    // }

    //   this.paramTags = row.attr_vals.split(" ");
    //   this.currentParam = row;
    // },
    // 展示添加tag的input
    showInput(param) {
      param.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除某个属性
    handleClose(item, param) {
      param.attr_vals.splice(param.attr_vals.indexOf(item), 1);
      const paramInfo = {
        id: this.currentCateId[this.currentCateId.length - 1],
        attr_id: param.attr_id,
        attr_name: param.attr_name,
        attr_sel: this.paramsType,
        attr_vals: param.attr_vals.join(" "),
      };
      editParam(paramInfo).then((res) => {
        if (res.meta.status == 200) {
          this.$message.success(
            this.paramsType == "many" ? "删除动态参数成功" : "删除静态属性成功"
          );
        } else {
          this.$message.error(
            this.paramsType == "many" ? "删除动态参数失败" : "删除静态属性失败"
          );
        }
      });
    },
  },
  mounted() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.breadcrumb {
  margin-bottom: 15px;
}
.row {
  margin-top: 15px;
}
.table {
  margin-top: 15px;
  .el-tag {
    margin-right: 5px;
  }
}
</style>