<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar"></div>
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import actionTypes from 'store/actionTypes'

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录
    login() {
        this.$refs.loginFormRef.validate((valid) => {
          if(!valid) return
          this.$store.dispatch({
            type: actionTypes.LOGIN,
            userInfo: this.loginForm
          }).then(res => {
              this.$message.success(res)
              this.$router.push('/home')
          }).catch(err => {
              this.$message.error(err)
          })
        })
    }
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  background-color: #2b4b6b;
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 3px;
    .avatar {
      position: absolute;
      left: 50%;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: #ccc url("~assets/img/login/logo.png") no-repeat center;
      transform: translate(-50%, -50%);
    }
    .btns {
      button {
        float: right;
        margin-left: 10px;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
    }
  }
}
</style>