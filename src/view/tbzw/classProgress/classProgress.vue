<template>
  <div class="p-classProgress">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="searchInfo.courseId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of courseList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <!--<Option value="1">用户昵称</Option>-->
              <!--<Option value="2">课程进度</Option>-->
              <!--<Option value="3">累计打卡</Option>-->
              <!--<Option value="4">最近连续打卡</Option>-->
              <Option value="1">电话号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.public" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-classProgress"
      v-model="isOpenModal"
      footer-hide
      width="500"
      title="作业记录">
      <Timeline>
        <TimelineItem v-for="(item,index) of recordList" :key="index">
          <div>{{item.takeTime}}</div>
          <div class="-text">{{item.lessonName}}</div>
        </TimelineItem>
      </Timeline>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import JobRecordTemplate from "../../../components/jobRecordTemplate";

  export default {
    name: 'tbzw_classProgress',
    components: {JobRecordTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        courseList: [],
        recordList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        selectInfo: '1',
        searchInfo: {
          courseId: '-1'
        },
        addInfo: {},
        columns: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '电话号码',
            key: 'phone',
            align: 'center'
          },
          {
            title: '课程进度',
            key: 'courseProgress',
            align: 'center'
          },
          {
            title: '累计打卡',
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
              }, params.row.totalCard)
            },
            align: 'center'
          },
          {
            title: '最近连续打卡',
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
              }, params.row.continueCard)
            },
            align: 'center'
          },
          {
            title: '最长连续打卡',
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
              }, params.row.longerContinueCard)
            },
            align: 'center'
          },
          {
            title: '交作业课时数',
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
              }, params.row.works)
            },
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getCourseList()
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        this.recordList = data.workList
      },
      getCourseList() {
        this.$api.tbzwCourse.courseQueryPage({
          current: 1,
          size: 1000,
          type: 1
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
              this.courseList.unshift({
                id: '-1',
                name: '全部'
              })
              this.getList()
            })
      },
      currentChange(val) {
        this.tab.page = val
        this.getList()
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.searchInfo.courseId == '-1' ? '' : this.searchInfo.courseId,
        }
        switch (+this.selectInfo) {
          case 1:
            params.nickName = this.searchInfo.public
            break
          case 2:
            params.courseProgress = this.searchInfo.public
            break
          case 3:
            params.totalCard = this.searchInfo.public
            break
          case 4:
            params.continueCard = this.searchInfo.public
            break
          case 5:
            params.longerContinueCard = this.searchInfo.public
            break
        }

        this.$api.tbzwClockin.pageClassProgressByList(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-classProgress {

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tips {
      color: #39f
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
