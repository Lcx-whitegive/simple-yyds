<template>
  <div>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe=""
        class="table"
        max-height="300"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template #default="data">
            <el-switch
              v-model="data.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="changeUserState(data.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="data">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(data.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(data.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
      <!-- 添加用户弹框区域 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="resetForm"
      >
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          :disabled="isDialogLoading"
        >
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="password"
          >
            <el-input v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="userForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser" :loading="isDialogLoading"
            >添 加</el-button
          >
        </span>
      </el-dialog>
      <!-- 修改用户弹框区域 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="60%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="resetEditForm"
      >
        <el-form
          :model="editUserForm"
          :rules="rules"
          ref="editFormRef"
          :disabled="isDialogLoading"
        >
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser" :loading="isDialogLoading"
            >修 改</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUserList,
  changeUserState,
  addUser,
  getUserById,
  editUser,
  deleteUserById
} from "network/users";

export default {
  name: "UserList",
  data() {
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确格式的邮箱"));
      }
    };
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入正确格式的手机号"));
      }
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      userList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      userForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUserForm: {
        id: "",
        username: "",
        role_id: "",
        mobile: "",
        email: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度为3~10个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度为3~10个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "80px",
      isDialogLoading: false,
    };
  },
  methods: {
    // 获取用户列表
    getUserList() {
      getUserList(this.queryInfo).then((res) => {
        if (res.meta.status == 200) {
          console.log(res);
          this.userList = res.data.users;
          this.total = res.data.total;
        }
      });
    },
    // 每页显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 当前页码数变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 修改用户状态
    changeUserState(user) {
      changeUserState(user.id, user.mg_state).then((res) => {
        if (res.meta.status == 200) {
          this.$message.success("修改状态成功");
          this.getUserList();
        } else {
          user.mg_state = !user.mg_state;
          this.$message.error("修改状态失败");
        }
      });
    },
    // 添加用户
    addUser() {
      this.$refs.userFormRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        addUser(this.userForm)
          .then((res) => {
            if (res.meta.status == 201) {
              this.$message.success("添加成功");
              this.getUserList();
            } else {
              this.$message.error("添加失败");
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.addDialogVisible = false;
          });
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.userFormRef.resetFields();
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields();
    },
    //展示修改弹窗
    showEditDialog(id) {
      this.editDialogVisible = true;
      getUserById(id).then((res) => {
        if (res.meta.status == 200) {
          this.editUserForm = res.data;
        } else {
          this.$message.error("获取用户信息失败");
        }
      });
    },
    //修改用户信息
    editUser() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.isDialogLoading = true;
        editUser(this.editUserForm)
          .then((res) => {
            if (res.meta.status == 200) {
              this.$message.success("修改成功");
              this.getUserList();
            } else {
              this.$message.error("修改失败");
            }
          })
          .finally(() => {
            this.isDialogLoading = false;
            this.editDialogVisible = false;
          });
      });
    },
    // 根据id删除用户
    deleteUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUserById(id)
            .then(res => {
              if(res.meta.status == 200){
                this.$message.success('删除成功')
                this.getUserList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          })
        })
    },
  },
  mounted() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.table {
  margin-top: 15px;
}
.pagination {
  margin-top: 15px;
  text-align: center;
}
</style>