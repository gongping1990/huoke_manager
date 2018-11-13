<template>
  <div class="p-setting">
    <Card>
      <Row>
        <Col :span="20">
          <div class="-p-header">
            <div class="-p-h-left">
              <img src="../../assets/images/userImg.png"/>
            </div>
            <div class="-p-h-right">
              <div class="-r-name">{{adminInfo.nickname}}</div>
              <div class="-r-dev">
                <span><Icon type="ios-time-outline"/>: {{adminInfo.createTime}}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col :span="4">
          <Button type="text" @click="openModal">修改密码</Button>
        </Col>
      </Row>

      <Row class="-s-text">
        <Col :span="5">
          <div><span>姓名：</span><span class="-text-span">{{adminInfo.nickname}}</span></div>
          <div><span>岗位：</span><span class="-text-span">{{adminInfo.roleName}}</span></div>
          <div><span>角色：</span><span class="-text-span">{{adminInfo.roleName}}</span></div>
        </Col>
      </Row>
    </Card>

    <div v-if="isOpenModal">
      <update-pwd @emitPwdModal="submitPwd" @closePwdModal="closeModal"></update-pwd>
    </div>

    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import UpdatePwd from "@/components/updatePwdTemplate";

  export default {
    name: 'use-info',
    components: {UpdatePwd, Loading},
    data() {
      return {
        adminInfo: '',
        isFetching: false,
        isOpenModal: false
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal() {
        this.isOpenModal = true
      },
      closeModal () {
        this.isOpenModal = false
      },
      submitPwd() {
        this.$api.admin.updatePassword(this.changePswForm)
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('修改成功，请重新登录获课管理系统！');
                this.closeModal()
                this.$router.push('/login')
              }
            })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.admin.userAdminInfo()
          .then(
            response => {
              this.adminInfo = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    },
  }
</script>

<style lang="less" scoped>
  .p-setting {
    .-p-header {
      display: flex;

      .-p-h-left {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .-p-h-right {
        margin-left: 20px;
        text-align: left;

        .-r-name {
          font-size: 30px;
          font-weight: bold;
        }

        .-r-dev {
          color: #b3b5b8;

          span {
            padding-right: 20px;
          }
        }
      }
    }

    .-s-text {
      margin: 20px 0 0 90px;
      text-align: left;

      .-text-span {
        display: inline-block;
        color: #b3b5b8;
        margin-left: 10px;
        padding: 5px 0;
      }
    }

    .-p-s-footer {
      display: flex;
      /*text-align: center;*/
      justify-content: space-around;
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
