<template>

  <div class="p-courseQualityData">
    <Row class="g-search -c-tab">
      <Col :span="24">
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">课程名称</div>
          <Select class="-search-selectOne" v-model="searchInfo.courseId" @on-change="getList">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </div>
      </Col>
    </Row>

    <Card>
      <div class="p-courseQualityData">
        <div class="p-courseQualityData-wrap">
          <div class="p-courseQualityData-title">累计数据</div>
          <Table class="-c-tab" :loading="isFetching" :columns="columnsOne" :data="dataListOne"></Table>
          <Page class="g-text-right" :total="totalOne" size="small" show-elevator :page-size="tabOne.pageSize"
                :current.sync="tabOne.currentPage"
                @on-change="currentChangeOne"></Page>
        </div>
        <div class="p-courseQualityData-wrap">
          <div class="p-courseQualityData-title -titleTwo">
            <div>今日数据</div>
            <div><DatePicker type="date" v-model="searchInfo.date" placeholder="请选择"  @on-change="getList"></DatePicker></div>
          </div>
          <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="dataListTwo"></Table>
        </div>
      </div>
    </Card>

    <time-echart v-model="isOpenModal" :data-info="dataItem"></time-echart>
  </div>

</template>

<script>
  import dayjs from 'dayjs'
  import TimeEchart from "./timeEchart";
  import { formatTime } from '@/libs/index'
  export default {
    name: 'tbzw_courseQualityData',
    components: {TimeEchart},
    data() {
      return {
        tabOne: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabTwo: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        totalOne: 0,
        totalTwo: 0,
        isFetching: false,
        isOpenModal: false,
        searchInfo: {
          date: new Date()
        },
        dataItem: {},
        courseList: [],
        dataListOne: [],
        dataListTwo: [],
        columnsOne: [
          {
            title: '课时名称',
            key: 'name',
            tooltip: true,
            align: 'center'
          },
          {
            title: '累计排课人数',
            key: 'allArrangeCount',
            align: 'center'
          },
          {
            title: '累计上课人数',
            key: 'allLearnCount',
            align: 'center'
          },
          {
            title: '排课当天上课人数',
            key: 'arrangeLearnCount',
            align: 'center'
          },
          {
            title: '累计完课人数',
            key: 'allFinishCount',
            align: 'center'
          },
          {
            title: '累计排课当天完课人数',
            key: 'arrangeFinishCount',
            align: 'center'
          },
          {
            title: '累计播放次数',
            key: 'allPlayNum',
            align: 'center'
          },
          {
            title: '累计播放时长(小时)',
            render: (h, params) => {
              return h('div', params.row.allPlayTime ? formatTime(+params.row.allPlayTime) : 0)
            },
            key: 'allPlayTime',
            align: 'center'
          },
          {
            title: '次均播放时长(分钟)',
            render: (h, params) => {
              return h('div', params.row.allPlayAvgTime ? dayjs(+params.row.allPlayAvgTime).format("mm:ss") : 0)
            },
            key: 'allPlayAvgTime',
            align: 'center'
          },
          {
            title: '初次播放平均时长(分钟)',
            render: (h, params) => {
              return h('div', params.row.allFirstPlayAvgTime ? dayjs(+params.row.allFirstPlayAvgTime).format("mm:ss") : 0)
            },
            key: 'allFirstPlayAvgTime',
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toLookDetail(params.row)
                    }
                  }
                }, '学习时间分布')
              ])
            },
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '课时名称',
            tooltip: true,
            key: 'name',
            align: 'center'
          },
          {
            title: '排课人数',
            key: 'allArrangeCount',
            align: 'center'
          },
          {
            title: '上课人数',
            key: 'allLearnCount',
            align: 'center'
          },
          {
            title: '排课当天上课人数',
            key: 'arrangeLearnCount',
            align: 'center'
          },
          {
            title: '完课人数',
            key: 'allFinishCount',
            align: 'center'
          },
          {
            title: '排课当天完课人数',
            key: 'arrangeFinishCount',
            align: 'center'
          },
          {
            title: '播放次数',
            key: 'allPlayNum',
            align: 'center'
          },
          {
            title: '播放时长(小时)',
            render: (h, params) => {
              return h('div', params.row.allPlayTime ? formatTime(+params.row.allPlayTime) : 0)
            },

            key: 'allPlayTime',
            align: 'center'
          },
          {
            title: '次均播放时长(分钟)',
            render: (h, params) => {
              return h('div', params.row.allPlayAvgTime ? dayjs(+params.row.allPlayAvgTime).format("mm:ss") : 0)
            },
            key: 'allPlayAvgTime',
            align: 'center'
          },
          {
            title: '初次播放平均时长(分钟)',
            render: (h, params) => {
              return h('div', params.row.allFirstPlayAvgTime ? dayjs(+params.row.allFirstPlayAvgTime).format("mm:ss") : 0)
            },
            key: 'allFirstPlayAvgTime',
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toLookDetail(params.row)
                    }
                  }
                }, '学习时间分布')
              ])
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      // this.getList()
      this.getCourseList()
    },
    methods: {
      toLookDetail(data) {
        this.dataItem = data
        this.dataItem.date = dayjs(new Date(this.searchInfo.date)).format('YYYY-MM-DD')
        this.isOpenModal = true
      },
      currentChangeOne(val) {
        this.tabOne.page = val;
        this.getList();
      },
      currentChangeTwo(val) {
        this.tabTwo.page = val;
        this.getList();
      },
      getCourseList() {
        this.$api.tbzwCourse.listBase()
          .then(
            response => {
              this.courseList = response.data.resultData;
              this.searchInfo.courseId = this.courseList[0].id
              this.getList()
            })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.tbzwStudyRecordData.getCourseQualityData({
          courseId: this.searchInfo.courseId,
          date: dayjs(new Date(this.searchInfo.date)).format('YYYY-MM-DD')
        })
          .then(
            response => {
              let info = response.data.resultData
              this.dataListOne = info.allData;
              this.dataListTwo = info.dateData;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-courseQualityData {

    .-search-select-text {
      /*min-width: 80px;*/
    }

    .-search-selectOne {
      width: 240px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin: 0 10px;
      text-align: left;
    }

    &-wrap {
      margin-bottom: 33px;
    }

    &-title {
      text-align: left;
      font-size: 16px;
    }

    .-titleTwo {
      display: flex;
      justify-content: space-between;
    }

    .-c-tips {
      color: #39f
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
