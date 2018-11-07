<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录获课">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="ios-person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="md-lock"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  // import { mapActions } from 'vuex'
  export default {
    name: 'Login',
    props: {
      userNameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    computed: {
      rules() {
        return {
          username: this.userNameRules,
          password: this.passwordRules
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate(vaild => {
          if (vaild) {
            this.$api.admin.loginAdmin(this.form)
              .then(res => {
                if (res.data.code == 200) {
                  // this.$store.commit("login", this.loginForm.username);
                  // this.$store.commit("setAdminInfo", {});
                  this.$Message.success('登录成功');
                  this.$router.push("/home");
                }
              })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .login {
    width: 100%;
    height: 100%;
    background-color: #324057;
    /*background-image: url('../../assets/images/login-bg.jpg');*/
    background-size: cover;
    background-position: center;
    position: relative;
    &-con {
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;
      &-header {
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }
      .form-con {
        padding: 10px 0 0;
      }
    }
  }
</style>
