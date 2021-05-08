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
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="rolesList"
        style="width: 100%"
        stripe
        border
        max-height="1000"
        class="table"
      >
        <el-table-column type="expand">
          <template #default="data">
            <!-- 一级权限 -->
            <el-row v-for="item1 in data.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag closable @close="deleteRightById(data.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19" class="level2">
                <!-- 二级权限 -->
                <el-row v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(data.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="deleteRightById(data.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作">
          <template #default="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(data.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(data.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="showRightsDialog(data.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹框区域 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="resetForm"
      >
        <el-form
          :model="roleForm"
          :rules="rules"
          ref="roleFormRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            label="角色名称"
            :label-width="formLabelWidth"
            prop="roleName"
          >
            <el-input v-model="roleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="roleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole" :loading="isDialogLoading"
            >添 加</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改角色弹框区域 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="resetEditForm"
      >
        <el-form
          :model="editRoleForm"
          :rules="rules"
          ref="editFormRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            label="角色名称"
            :label-width="formLabelWidth"
            prop="roleName"
          >
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editRole()"
            :loading="isDialogLoading"
            >修 改</el-button
          >
        </span>
      </el-dialog>
      <!-- 分配权限弹框区域 -->
      <el-dialog
        title="分配权限"
        :visible.sync="rightsDialogVisible"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-tree
          :data="rightsTree"
          :props="rightsTreeProps"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="defaultCheckedNodes"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sendAuths" :loading="isDialogLoading">授 权</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getRolesList,
  addRole,
  getRoleById,
  editRoleById,
  deleteRole,
  deleteRightById,
  getRightsTree,
  sendAuths
} from "network/auth";

export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      addDialogVisible: false,
      roleForm: {
        roleName: "",
        roleDesc: "",
      },
      editRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "80px",
      isDialogLoading: false,
      editDialogVisible: false,
      rightsDialogVisible: false,
      rightsTree: [],
      rightsTreeProps: {
        children: "children",
        label: "authName",
      },
      defaultCheckedNodes: [],
      currentRoleId: '',
      currentCheckedNodes: []
    };
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      getRolesList().then((res) => {
        if (res.meta.status == 200) {
          this.rolesList = res.data;
        } else {
          this.$message.error("获取角色列表失败");
        }
      });
    },
    // 添加角色
    addRole() {
      this.$refs.roleFormRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        addRole(this.roleForm)
          .then((res) => {
            if (res.meta.status == 201) {
              this.$message.success("添加角色成功");
              this.getRolesList();
            } else {
              this.$message.error("添加角色失败");
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.addDialogVisible = false;
          });
      });
    },
    // 重置添加表单
    resetForm() {
      this.$refs.roleFormRef.resetFields();
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields();
    },
    // 弹出修改角色对话框
    showEditDialog(id) {
      this.editDialogVisible = true;
      getRoleById(id).then((res) => {
        if (res.meta.status == 200) {
          this.editRoleForm = res.data;
        } else {
          this.$message.error("获取角色信息失败");
        }
      });
    },
    // 修改角色
    editRole() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        editRoleById(this.editRoleForm)
          .then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("修改角色成功");
              this.getRolesList();
            } else {
              this.$message.error("修改角色失败");
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.editDialogVisible = false;
          });
      });
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(id).then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("删除成功!");
              this.getRolesList();
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
    // 删除权限
    deleteRightById(role, id) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRightById(role, id).then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("删除成功!");
              role.children = res.data;
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
    // 展示分配权限弹框
    showRightsDialog(role) {
      this.rightsDialogVisible = true;
      this.currentRoleId = role.id
      this.getRightsTree();
      this.defaultCheckedNodes = [];
      role.children.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children.forEach((item3) => {
            this.defaultCheckedNodes.push(item3.id);
          });
        });
      });
    },
    // 分配权限
    sendAuths() {
      this.isDialogLoading = true
      this.currentCheckedNodes = []
      this.currentCheckedNodes = this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys())
      sendAuths(this.currentCheckedNodes, this.currentRoleId)
        .then(res => {
          if(res.meta.status == 200){
            this.$message.success('分配成功')
            this.getRolesList()
          }else{
            this.$message.error('分配失败')
          }
        }).finally(() => {
          this.rightsDialogVisible = false
          this.isDialogLoading = false
        })
    },
    // 获取权限树
    getRightsTree() {
      getRightsTree().then((res) => {
        if (res.meta.status == 200) {
          this.rightsTree = res.data;
        } else {
          this.$message.error("获取权限树失败");
        }
      });
    },
  },
  mounted() {
    this.getRolesList();
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
  .table {
    margin-top: 15px;
    .el-tag {
      margin: 7px;
    }
    .el-row {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      &:first-child {
        border-top: 1px solid #ccc;
      }
    }
    .level2 {
      .el-row {
        &:first-child {
          border-top: none;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>