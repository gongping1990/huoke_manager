<template>
  <div class="hk_login">
    <div class="hk_login_left">
      <div class="left_logo"><img src="../../assets/images/login-logo.png"></div>
      <div class="left_text">
        <div class="text_version">v1.0</div>
        <div class="text_sub">获课学堂</div>
        <div class="text-en">PRE-CLASS</div>
        <div class="text-en">OPERATION CENTER</div>
      </div>
    </div>
    <div class="hk_login_right">
      <span class="right_header">忘记密码？</span>
      <div class="right_body">
        <div class="body_wrap">
          <div class="body_title">账号登陆</div>
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="username">
              <Input class="body_input" v-model="form.username" placeholder="请输入您的用户名" size="large">
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input class="body_input" type="password" v-model="form.password" placeholder="请输入密码" size="large">
              </Input>
            </FormItem>
            <FormItem>
              <div @click="handleSubmit" class="g-primary-btn -width">登录</div>
            </FormItem>
          </Form>
        </div>
      </div>

      <div class="right_footer">
        <div>玖桔（北京）教育科技有限公司</div>
        <div>Jiuju (Beijing)</div>
        <div>education technology co. LTD.</div>
      </div>
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
        localStorage.setItem('isLoginSuccess', false)
        this.$refs.loginForm.validate(vaild => {
          if (vaild) {
            this.$api.admin.loginAdmin(this.form)
              .then(res => {
                if (res.data.code == 200) {
                  this.$router.push("/home");
                  this.$Message.success('登录成功');
                  this.$store.commit('changeUserInfo', res.data.resultData)
                  localStorage.userInfo = JSON.stringify(res.data.resultData)
                  localStorage.nowSystem = '1'
                  localStorage.isLoginSuccess = true
                  localStorage.nickname = res.data.resultData.nickname
                  localStorage.userId = res.data.resultData.id
                }
              })
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .hk_login {
    position: relative;
    display: flex;
    font-size: 12px;
    width: 100%;
    height: 100%;
    background-color: #ffff;
    color: #fff;

    &_left {
      position: relative;
      width: 40%;
      background: url("../../assets/images/login-bg.png");
      background-size: cover;
      background-position: center;

      .left_logo {
        display: inline-block;
        position: absolute;
        top: 6%;
        left: 15%;

        img {
          width: 60%;
        }
      }

      .left_text {
        position: absolute;
        top: 33%;
        left: 35%;
        text-align: left;

        .text_version {
          padding: 0 6px;
          display: inline-block;
          border-radius: 4px;
          border: 1px solid #fff;
          color: #fff;

        }

        .text_sub {
          margin: 10px 0 20px 0;
          font-size: 33px;
          letter-spacing: 4px;
          font-weight: bold;
        }

        .text-en {
          font-size: 12px;
        }

      }
    }
    &_right {
      position: relative;
      width: 60%;
      color: #191542;

      .right_header {
        position: absolute;
        right: 14%;
        top: 6%;
        color: #5444E4;
        font-size: 14px;

      }
      .right_body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        .body_title {
          font-size: 30px;
          margin-bottom: 40px;
          text-align: left;
        }

        .-width{
          width: 100%;
        }

        .body_input {
          width: 240px;
          /*margin-bottom: 50px;*/
        }
      }
      .right_footer {
        position: absolute;
        bottom: 4%;
        right: 10%;
        color: #B3B5B8;
        text-align: left;
      }
    }

    .ivu-input{
      height: 42px;
    }
  }
</style>
