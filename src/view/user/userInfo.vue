<template>
  <div class="p-userInfo">
    <Card>
      <Row>
        <Col :span="20">
          <div class="-p-header">
            <div class="-p-h-left">
              <img :src="userInfo.headimgurl"/>
            </div>
            <div class="-p-h-right">
              <div class="-r-name">{{userInfo.nickname}}</div>
              <div class="-r-dev">
                <span>id: {{userInfo.userId}}</span>
                <span><Icon type="ios-call"/>: {{userInfo.phone || '暂无'}}</span>
                <span><Icon type="ios-time-outline"/>: {{userInfo.createTime}}</span>
              </div>
            </div>
          </div>
        </Col>
        <Col :span="4">
          <i-switch v-model="userInfo.disabled" @on-change="toChangeStatus"></i-switch>
          {{userInfo.disabled ? '已禁用' : '已启用'}}
        </Col>
      </Row>

      <div class="-c-tab">
        <Row>
          <div class="-c-text">最近登录日志</div>
          <Table :columns="columns" :data="dataList"></Table>
        </Row>
      </div>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>

  import Loading from "@/components/loading";

  export default {
    name: 'userInfo',
    components: {Loading},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        userInfo: '',
        dataList: [],
        total: 0,
        isFetching: false,
        columns: [
          {
            title: '登录时间',
            key: 'inTime'
          },
          {
            title: 'IP地址',
            key: 'loginIp'
          },
          {
            title: '所属地区',
            key: 'public_time'
          },
          {
            title: '使用时长',
            key: 'useTime'
          },
          {
            title: '是否学习课程',
            render: (h, params) => {
              return h('span', params.row.studyCourse ? '是' : '否')
            }
          }
        ],
      };
    },
    mounted() {
      this.getUserInfo()
      this.userLoginList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.userLoginList();
      },
      //分页查询
      getUserInfo() {
        this.isFetching = true
        this.$api.user.getUserInfo({
          userId: this.$route.query.id
        })
          .then(
            response => {
              this.userInfo = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      userLoginList() {
        this.$api.user.userLoginInfo({
          userId: this.$route.query.id,
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
      },
      toChangeStatus() {
        this.$api.user.changeUserStatus({
          userId: this.$route.query.id,
          disabled: this.userInfo.disabled
        }).then(
          response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功')
            }
          })
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-userInfo {

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


    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 40px 0 20px 90px;

      .-c-text{
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
      }
    }
  }
</style>
