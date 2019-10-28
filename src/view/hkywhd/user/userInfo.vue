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
              <div class="-r-dev" style="margin-top: 10px">
                <span>是否关注: {{userInfo.subscripbe ? '是' : '否'}}</span>
                <span>是否购买: {{userInfo.buyed ? '是' : '否'}}</span>
                <span>支付时间: {{userInfo.buyTime || '未购买'}}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row class="-c-tab g-t-left">
        <Select v-model="searchInfo.appId" @on-change="changeRadio" style="width: 300px">
          <Option v-for="(item,index) in appList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </Row>

      <div class="-c-tab">
        <Row>
          <div class="-c-text">上课数据</div>
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
  import dayjs from 'dayjs'

  export default {
    name: 'hkywhd_userInfo',
    components: {Loading},
    props: ['userId'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        userInfo: '',
        detailInfo: '',
        searchInfo: {
          appId: '7'
        },
        dataList: [],
        appList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '课时名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '是否完成学习',
            render: (h, params) => {
              return h('div', [
                h('div', `生字：${params.row.studyNewword ? '是' : '否'}`),
                h('div', `朗读：${params.row.studyReaded ? '是' : '否'}`),
                h('div', `精读：${params.row.studyCarefulRead ? '是' : '否'}`)
              ])
            },
            align: 'center'
          },
          {
            title: '是否通关',
            render: (h, params) => {
              return h('div',[
                h('div', `生字：${params.row.clearanceNewword ? '是' : '否'}`),
                h('div', `朗读：${params.row.clearanceReaded ? '是' : '否'}`),
                h('div', `精读：${params.row.clearanceCarefulRead ? '是' : '否'}`)
              ])
            },
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.listBase()
    },
    methods: {
      changeRadio () {
        this.listLessonProgress()
      },
      openModal() {
        this.isOpenModal = true
      },
      currentChange(val) {
        this.tab.page = val;
        this.listLessonProgress();
      },
      listBase() {
        this.appList = []
        this.$api.hkywhdBook.listAll()
          .then(response => {
            this.appList = response.data.resultData
            this.searchInfo.appId = this.appList[0].id
            if(this.$route.query.id || this.userId) {
              this.listLessonProgress()
            }
          })
      },
      //分页查询
      listLessonProgress() {
        this.$api.hkywhdStatistics.getUserLearnStatistics({
          userId: this.$route.query.id || this.userId,
          bookId: this.searchInfo.appId
        })
          .then(
            response => {
              this.userInfo = response.data.resultData
              this.dataList = response.data.resultData.dataList;
              this.userInfo.learnStartDate = this.userInfo.learnStartDate ? dayjs(+this.userInfo.learnStartDate).format('YYYY-MM-DD') : '暂无'
              this.userInfo.buyedTime =  this.userInfo.buyedTime ? dayjs(+this.userInfo.buyedTime).format('YYYY-MM-DD HH:mm') : '暂无'
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

    .-p-center-item {
      margin-top: 20px;

      span {
        color: #b3b5b8;
        padding-right: 20px;
      }
    }
    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0 20px 90px;

      .-c-text {
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
      }
    }
  }
</style>
