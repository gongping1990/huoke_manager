<template>
  <div class="p-franchiseeData">
    <Row class="g-search">
      <Col :span="5" class="g-flex-a-j-center -s-radio">
        <div class="-search-select-text-two">课程名称</div>
        <Select v-model="searchInfo.courseId" @on-change="getTotalInfo" class="-search-selectOne -width">
          <Option v-for="(item,index) of courseList" :label="item.courseName" :value="item.courseId"  :key="index" ></Option>
        </Select>
      </Col>
    </Row>


    <Card class="p-franchiseeData-top">
      <div class="p-franchiseeData-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon1.png"/>
          <span>加盟商数据</span>
        </div>
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeTimeTwo">
            <Option label='全部' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
          <date-picker-template v-if="selectTypeTwo===2" :dataInfo="dateOption"
                                @changeDate="changeDateTwo"></date-picker-template>
        </div>
      </div>
      <Row class="p-franchiseeData-flex" :gutter="10" style="margin-top: 20px">
        <Col v-for="(item,index) of titleList" :key="index" class="-p-d-col">
          <div class="g-t-left -card-wrap">
            <div class="-col-name">{{item.name}}</div>
            <div class="-col-down">
              {{item.num}}
            </div>
            <div class="-col-today">
              <span class="-col-today-width">{{item.todayName}}</span>
              <span class="-col-today-color">{{item.todayNum}}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>


    <Card class="p-franchiseeData-top">
      <div class="p-franchiseeData-title -three">
        <div class="-left">
          <img src="../../../assets/images/icon/icon7.png"/>
          <span>趋势数据</span>
        </div>
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectTypeThree" class="-search-selectOne" @on-change="changeTimeThree">
            <Option label='最近一月' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
          <date-picker-template v-if="selectTypeThree===2" :dataInfo="dateOption"
                                @changeDate="changeDateThree"></date-picker-template>
        </div>
      </div>

      <div class="-c-tab -p-d-echart">
        <div ref="echart" class="-p-c-content"></div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'
  import echarts from "echarts/lib/echarts";
  import dayjs from 'dayjs'
  // 引入柱状图
  import "echarts/lib/chart/bar";
  import "echarts/lib/chart/line";
  import "echarts/lib/component/title";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/dataZoom";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'fxgl_FranchiseeData',
    components: {DatePickerTemplate},
    data() {
      return {
        searchInfo: {
          courseId: ''
        },
        courseList: [],
        selectTypeTwo: 1,
        selectTypeThree: 1,
        dateOptionOne: {
          disabledDate(date) {
            return date && date.valueOf() > (new Date().getTime() - 24 * 60 * 60 * 1000);
          }
        },
        dateOption: {
          name: '',
          type: 'datetime'
        },
        isFetching: false,
        dataInfo: '',
        todayInfo: '',
        totalInfo: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTimeThree: '',
        getStartTimeTwo: '',
        getEndTimeThree: '',
        getEndTimeTwo: '',
        titleList: [],
        channelList: []
      }
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.dataInfo) {
          arrayX.push(item.date)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          franchiseeInvitePrometerCount: [],
          franchiseeEarnsAmount: []
        }
        for (let item of this.dataInfo) {
          dataList.franchiseeInvitePrometerCount.push(item.franchiseeInvitePrometerCount)
          dataList.franchiseeEarnsAmount.push(item.franchiseeEarnsAmount)
        }
        let optionSeriesLine = [
          {
            name: '邀请推广人人数',
            type: 'line',
            data: dataList.franchiseeInvitePrometerCount
          },
          {
            name: '加盟商收益',
            type: 'line',
            data: dataList.franchiseeEarnsAmount
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      this.getChannelList()
    },
    methods: {
      changeTimeTwo () {
        if(this.selectTypeTwo == 1) {
          this.getTotalInfo()
        }
      },
      changeTimeThree () {
        if(this.selectTypeThree == 1) {
          this.getTotalInfo()
        }
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.getTotalInfo()
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.getTotalInfo()
      },
      getChannelList() {
        this.$api.jsdDistributie.listByCourse()
          .then(
            response => {
              this.courseList = response.data.resultData;
              this.searchInfo.courseId = this.courseList[0].courseId
              this.getTotalInfo()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      drawLine() {
        let self = this;
        let myChart = echarts.init(this.$refs.echart);
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            },
            textStyle: {
              align: 'left'
            }
          },
          legend: {
            data: [
              {
                name: '邀请推广人人数',
                icon: 'circle'
              },
              {
                name: '加盟商收益',
                icon: 'circle'
              }
            ],
            right: '5%'
          },
          xAxis: {
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            data: this.dateTypesLine
          },
          grid: {
            left: '6%',
            top: '13%',
            right: '5%'
          },
          yAxis: {
            name: '单位（人）'
          },
          series: this.optionSeriesLine,
          dataZoom: [
            {
              type: "slider"
            }
          ],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      getList() {
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.drawLine()
      },
      getTotalInfo() {
        this.$api.fxglDataCenter.getFranchiseeData({
          courseId: this.searchInfo.courseId,
          startTime: this.getStartTimeTwo && new Date(this.getStartTimeTwo).getTime(),
          startTime1: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          endTime: this.getEndTimeTwo && new Date(this.getEndTimeTwo).getTime(),
          endTime1: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime()
        }).then(
          response => {
            this.totalInfo = response.data.resultData;
            this.dataInfo = this.totalInfo.list
            this.getList()
            this.initData()
          })
      },
      initData() {
        this.titleList = [
          {
            name: '累计邀请推广人人数',
            num: this.totalInfo.allFranchiseeInvitePrometerCount,
            todayName: '今日邀请推广人人数',
            todayNum: this.totalInfo.franchiseeInvitePrometerCount
          },
          {
            name: '加盟商累计收益',
            num: this.totalInfo.allFranchiseeEarnsAmount/100,
            todayName: '加盟商今日收益',
            todayNum: this.totalInfo.franchiseeEarnsAmount/100
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-franchiseeData {

    &-top {
      margin-top: 30px;

      .-three {
        padding-bottom: 28px;
        border-bottom: 1px solid rgba(232,232,232,1);
      }
    }

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .-left {
        display: flex;
        align-items: center;
        font-size:18px;
        font-weight:400;
        color:rgba(23,34,62,1);
        line-height:25px;

        img {
          width:28px;
          height:28px;
          margin-right: 10px;
        }
      }
    }

    &-flex {
      display: flex;
      flex-flow: wrap;

      .-card-wrap {
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(232,232,232,1);

        .-col-name {
          padding: 18px 0 18px 15px ;
          min-width: 100px;
          border-bottom: 1px solid #E9EAEC;
          font-size:16px;
          font-weight:500;
          color:rgba(23,34,62,1);
        }

        .-col-down {
          margin: 20px 15px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #E9EAEC;
          font-weight: bold;
          color:rgba(128,134,149,1);
          font-size:36px;
        }

        .-col-today {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          font-size:15px;
          font-weight:400;
          color:rgba(81,89,110,1);
          line-height:21px;

          &-width {
            max-width: 60%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          &-color {
            font-size:18px;
            font-weight:600;
            color:rgba(255,156,105,1);
            line-height:25px;
          }
        }
      }

      .-card-wrap-two {
        .-col-down {
          margin: 20px 0 0 15px;
          padding-bottom: 20px;
          border: none;
        }
      }
    }

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      text-align: left;
    }

    .-width {
      width: 300px;
    }
    .-margin-left {
      margin-left: 30px;
    }
    .date-time {
      width: 20%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-c-tab {
      margin: 20px 0;
    }
    .-search-select-text-two {
      text-align: left;
      margin-right: 20px;
      min-width: 70px;
      font-size:16px;
      font-weight:400;
      color:rgba(23,34,62,1);
      line-height:22px;
    }
    .-s-radio {
      min-width: 240px;
    }

    .-p-d-col {
      width: 20%;
      margin-bottom: 20px;

      .-col-flex {
        display: flex;
        justify-content: space-between;
      }

      .-col-ratio {
        font-size: 13px;
      }
    }
    .-p-d-echart {
      width: 100%;
    }

    .-p-c-content {
      width: 100%;
      height: 450px;
    }
  }
</style>
