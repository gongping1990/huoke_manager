<template>
  <div class="p-applicationRecord">
    <Table class="p-applicationRecord-top" :columns="columnsTab" :data="dataTabList"></Table>

    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Col :span="5">
            <div class="-search">
              <Select v-model="selectInfo" class="-search-select">
                <Option value="1">用户昵称</Option>
                <Option value="2">手机号码</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList(1)"></Input>
            </div>
          </Col>
          <Col :span="10" class="g-flex-a-j-center">
            <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          </Col>
        </Row>
        <Row style="margin-top: 29px">
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">排序方式</div>
              <Select v-model="searchInfo.sortType" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in sortList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">是否预约</div>
              <Select v-model="searchInfo.courseId" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">是否付费</div>
              <Select v-model="searchInfo.buyed" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text" style="min-width: 120px">是否关注公众号</div>
              <Select v-model="searchInfo.subcribeMp" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>

        </Row>
        <Row style="margin-top: 29px">

          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">是否上课</div>
              <Select v-model="searchInfo.studyed" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">是否交作业</div>
              <Select v-model="searchInfo.homeworked" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">是否回访</div>
              <Select v-model="searchInfo.visited" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
          <Col :span="5" class="g-t-left">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text" style="min-width: 120px">是否进入小程序</div>
              <Select v-model="searchInfo.useMa" @on-change="getList()" class="-search-selectOne">
                <Option v-for="(item,index) in visitedStatusList" :label="item.name" :value="item.id" :key="index"></Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Row>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>

    <Modal
      class="p-applicationRecord"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      footer-hide
      width="800"
      title="作业记录">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="dataDetailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Modal>

    <look-user-info v-model="isOpenUserInfo" :dataInfo="detailInfo"></look-user-info>

    <sqjl_detail v-model="isOpenDataDetail"></sqjl_detail>
  </div>
</template>

<script>
  import DatePickerTemplate from "@/components/datePickerTemplate";
  import dayjs from 'dayjs'
  import LookUserInfo from "../../../jsd/todayWork/lookUserInfo";
  import Sqjl_detail from "./sqjl_detail";

  export default {
    name: 'tbzw_paid_applicationRecord',
    components: {Sqjl_detail, LookUserInfo, DatePickerTemplate},
    props: ['propCourseId', 'propPeriodId'],
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: [
            {
              id: '0',
              name: '领取时间'
            },
            {
              id: '1',
              name: '初次上课时间'
            },
            {
              id: '2',
              name: '初次作业时间'
            },
            {
              id: '3',
              name: '预约时间'
            }
          ],
          type: 'datetime',
          isMore: true,
        },
        dataList: [],
        dataTabList: [],
        dataDetailList: [],
        experienceLessonList: [],
        visitedStatusList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '是'
          },
          {
            id: '0',
            name: '否'
          }
        ],
        sortList: [
          {
            id: '0',
            name: '领取时间降序排列'
          },
          {
            id: '1',
            name: '初次上课时间降序'
          },
          {
            id: '2',
            name: '初次作业时间降序'
          },
          {
            id: '3',
            name: '预约时间'
          }
        ],
        total: 0,
        totalDetail: 0,
        selectInfo: '1',
        detailInfo: '',
        searchInfo: {
          courseId: '-1',
          visited: '-1',
          homeworked: '-1',
          studyed: '-1',
          buyed: '-1',
          useMa: '-1',
          subcribeMp: '-1',
          sortType: '0'
        },
        isFetching: false,
        isOpenModal: false,
        isOpenUserInfo: false,
        isOpenDataDetail: false,
        columns: [
          {
            title: '用户昵称',
            width: 120,
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
                    this.toDetail(params.row)
                  }
                }
              }, params.row.nickname)
            },
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'courseName',
            tooltip: true,
            width: 120,
            align: 'center'
          },
          {
            title: '领取时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtModified).format('YYYY-MM-DD HH:mm'))
            },
            width: 140,
            align: 'center'
          },
          {
            title: '领课节数',
            key: 'lessons',
            width: 100,
            align: 'center'
          },
          {
            title: '电话号码',
            key: 'phone',
            width: 120,
            align: 'center'
          },
          {
            title: '是否关注公众号',
            render: (h,p)=> {
              return h('div',p.row.subcribeMp ? '是' : '否')
            },
            width: 120,
            align: 'center'
          },
          {
            title: '是否进入小程序',
            render: (h,p)=> {
              return h('div',p.row.useMa ? '是' : '否')
            },
            width: 120,
            align: 'center'
          },
          // {
          //   title: '是否预约',
          //   render: (h,p)=> {
          //     return h('div',p.row.buyed ? '是' : '否')
          //   },
          //   width: 100,
          //   align: 'center'
          // },
          {
            title: '正式课是否付费',
            render: (h,p)=> {
              return h('div',p.row.buyed ? '是' : '否')
            },
            width: 120,
            align: 'center'
          },
          {
            title: '是否上课（次）',
            render: (h,p)=> {
              return h('div',{
                style: {
                  cursor: 'pointer',
                  color: '#5444E4'
                },
                on: {
                  click: () => {
                    this.openModal(p.row)
                  }
                }
              },`${p.row.studyed ? '是' : '否'}(${p.row.studys})`)
            },
            width: 120,
            align: 'center'
          },
          {
            title: '是否交作业（次）',
            render: (h,p)=> {
              return h('div',{
                style: {
                  cursor: 'pointer',
                  color: '#5444E4'
                },
                on: {
                  click: () => {
                    this.openModal(p.row)
                  }
                }
              },`${p.row.homeworked ? '是' : '否'}(${p.row.homeworks})`)
            },
            width: 140,
            align: 'center'
          },
          {
            title: '是否回访',
            render: (h,p)=> {
              return h('div',p.row.visited ? '是' : '否')
            },
            width: 100,
            align: 'center'
          },
          {
            title: '操作',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    display: !params.row.visited ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.changeAudit(params.row)
                    }
                  }
                }, '标记为已回访')
              ])
            },
            align: 'center'
          }
        ],
        columnsTab: [
          {
            title: '报名人数',
            key: 'signCount',
            align: 'center'
          },
          {
            title: '公众号关注人数',
            key: 'subcribeMpCount',
            align: 'center'
          },
          {
            title: '公众号关注率',
            render: (h, params)=> {
              return h('div', {
                style: {
                  color: '#FFB200'
                }
              },`${params.row.subCribePercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '小程序打开人数',
            key: 'useMaCount',
            align: 'center'
          },
          {
            title: '小程序打开率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.useMaPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            render: (h, params) => {
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toLookDetail(params.row)
                    }
                  }
                }, '详情')
              ])
            },
            align: 'center'
          }
        ],
        columnsModal: [
          {
            title: '课时名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '首次完成上课时间',
            key: 'studyTime',
            align: 'center'
          },
          {
            title: '最后交作业时间',
            key: 'homeworkTime',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      // this.getList()
    },
    methods: {
      toLookDetail (data) {
        this.isOpenDataDetail = true
        // this.detailInfo = JSON.parse(JSON.stringify(data))
      },
      toDetail(data) {
        this.isOpenUserInfo = true
        this.detailInfo = JSON.parse(JSON.stringify(data))
        this.detailInfo.uid = this.detailInfo.userId
      },
      openModal (data) {
        this.getWorkList(data)
        this.isOpenModal = true
      },
      changeDate(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.searchInfo.timeType = data.index
        this.getList(1)
      },
      changeAudit(param) {
        console.log(param)
        this.$api.composition.visitReservRecord({
          id: param.id
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getWorkList();
      },
      getWorkList(data) {
        this.$api.tbzwStudy.homeworkNotes({
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
          userId: data.userId,
          courseId: data.courseId,
        })
          .then(
            response => {
              this.dataDetailList = response.data.resultData.records;
              this.totalDetail = response.data.resultData.total;
            })
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
          type: '2',
          courseId: this.propCourseId,
          activeConfigId: this.propPeriodId,
          visited: this.searchInfo.visited == '-1' ? '' : this.searchInfo.visited,
          buyed: this.searchInfo.buyed == '-1' ? '' : this.searchInfo.buyed,
          studyed: this.searchInfo.studyed == '-1' ? '' : this.searchInfo.studyed,
          homeworked: this.searchInfo.homeworked == '-1' ? '' : this.searchInfo.homeworked,
          subcribeMp: this.searchInfo.subcribeMp == '-1' ? '' : this.searchInfo.subcribeMp,
          useMa: this.searchInfo.useMa == '-1' ? '' : this.searchInfo.useMa,
          sortType: this.searchInfo.sortType,
          timeType: this.searchInfo.timeType,
          startTime: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          endTime: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.$api.composition.reservatRecordPage(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.dataTabList = [response.data.resultData.userStatisticsData];
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
  .p-applicationRecord {

    &-top {
      margin-bottom: 29px;
    }

    .-c-tips {
      color: #39f
    }

    .-search-select-text {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      margin-top: 20px;
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
