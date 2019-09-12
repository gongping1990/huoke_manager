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
                <span>是否关注古诗词: {{userInfo.subscripbe ? '是' : '否'}}</span>
                <span>是否关注轻作文: {{userInfo.subscripbe ? '是' : '否'}}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row class="-c-tab g-t-left">
        <RadioGroup v-model="searchInfo.appId" type="button">
          <Radio label="7">每日一首古诗</Radio>
          <Radio label="8">小语轻作文</Radio>
        </RadioGroup>
        <div class="-p-center-item">
          <div class="-c-text">购买数据</div>
          <div>
            <span>是否购买: {{userInfo.buyed ? '是' : '否'}}</span>
            <span>支付时间: {{userInfo.buyedTime}}</span>
          </div>
        </div>
        <div class="-p-center-item">
          <div class="-c-text">学习数据</div>
          <div>
            <span>开课日期: {{userInfo.learnStartDate}}</span>
            <span>课程进度: {{userInfo.learnProgress}}</span>
            <span>交作业课时数: {{userInfo.homeworkLesson}}</span>
            <span>老师批改作业数: {{userInfo.teacherReply}}</span>
            <span>累计打卡: {{userInfo.totalCards}}</span>
            <span>最近连续打卡: {{userInfo.continuousCards}}</span>
            <span>最长连续打卡: {{userInfo.maxContinuousCards}}</span>
          </div>
        </div>
      </Row>

      <div class="-c-tab">
        <Row>
          <div class="-c-text">上课作业记录</div>
          <Table :columns="columns" :data="dataList"></Table>
        </Row>
      </div>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>
    <loading v-if="isFetching"></loading>

    <job-record-template v-model="isOpenModal" :dataInfo="detailInfo"></job-record-template>
  </div>
</template>

<script>

  import Loading from "@/components/loading";
  import JobRecordTemplate from "../../../components/jobRecordTemplate";

  export default {
    name: 'userInfo',
    components: {JobRecordTemplate, Loading},
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
        total: 0,
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '课时名称',
            key: 'lessonName'
          },
          {
            title: '首次完成上课时间',
            key: 'firstLearnTime'
          },
          {
            title: '最后交作业时间',
            key: 'lastSubmitTime'
          },
          {
            title: '老师最后批改时间',
            key: 'lastReplyTime'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color: '#5444E4',
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.openModal(params.row)
                  }
                }
              }, '作业记录')
            }
          }
        ],
      };
    },
    mounted() {
      this.getLearnDTO()
      this.listLessonProgress()
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
        this.detailInfo.appId = this.searchInfo.appId
      },
      currentChange(val) {
        this.tab.page = val;
        this.listLessonProgress();
      },
      //分页查询
      getLearnDTO() {
        this.isFetching = true
        this.$api.jsdJob.getLearnDTO({
          uid: this.$route.query.id,
          system: this.searchInfo.appId,
          courseId: this.searchInfo.appId == 7 ? '1148165277549838337' : '1133673190743896065'
        })
          .then(
            response => {
              this.userInfo = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listLessonProgress() {
        this.$api.jsdJob.listLessonProgress({
          uid: this.$route.query.id,
          system: this.searchInfo.appId,
          courseId: this.searchInfo.appId == 7 ? '1148165277549838337' : '1133673190743896065',
          current: this.tab.page,
          size: this.tab.pageSize
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
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
