<template>
  <div class="p-activeData">
    <Row class="g-search -c-tab">
      <Col class="p-activeData-flex" :span="24">
        <div class="-flex-div g-flex-a-j-center">
          <div class="-search-select-text">活动名称</div>
          <Select class="-search-selectOne" v-model="selectTypeOne" @on-change="initFun">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </div>
      </Col>
    </Row>

    <Card class="p-activeData-top">
      <div class="p-activeData-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon6.png"/>
          <span>数据统计</span>
        </div>
      </div>
      <div>
        <Row class="p-activeData-flex" :gutter="10" style="margin-top: 20px">
          <Col v-for="(item,index) of nowList" :key="index" class="-p-d-col">
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
      </div>
    </Card>

    <Card class="p-activeData-top" v-if="selectTypeOne === 2">
      <div class="p-activeData-title -three">
        <div class="-left">
          <img src="../../../assets/images/icon/icon7.png"/>
          <span>数据漏斗</span>
        </div>
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeTimeTwo">
            <Option label='最近一月' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
          <date-picker-template v-if="selectTypeTwo===2" :dataInfo="dateOption"
                                @changeDate="changeDateTwo"></date-picker-template>
        </div>
      </div>
      <div class="-c-tab -p-d-echart">
        <div ref="echartTwo" class="-p-c-contentTwo"></div>
      </div>
    </Card>

    <Card class="p-activeData-top">
      <div class="p-activeData-title -three">
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
  import "echarts/lib/chart/funnel";
  import "echarts/lib/component/title";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/dataZoom";

  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'userData2',
    components: {DatePickerTemplate},
    data() {
      return {
        radioType: 0,
        selectTypeThree: 1,
        selectTypeTwo: 1,
        selectTypeOne: 1,
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
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTimeThree: '',
        getStartTimeTwo: '',
        getEndTimeThree: '',
        getEndTimeTwo: '',
        nowList: [],
        titleListOne: [],
        titleListTwo: [],
        titleListThree: [],
        courseList: [
          {
            id: 3,
            name: '邀请好友助力'
          },
           {
            id: 1,
            name: '分享免费领课'
          },
           {
            id: 2,
            name: '组队领课'
          }
        ]
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
      optionSeriesLineOne() {
        let dataList = {
          shareFreeSuccessCount: []
        }
        for (let item of this.dataInfo) {
          dataList.shareFreeSuccessCount.push(item.shareFreeSuccessCount)
        }
        let optionSeriesLine = [
          {
            name: '领课成功数',
            type: 'line',
            data: dataList.shareFreeSuccessCount
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineTwo() {
        let dataList = {
          firstStartActivityCount: [],
          shareCount: [],
          joinActivityCount: [],
          activitySuccessCount: [],
          orderHelpOrderCount: []
        }
        for (let item of this.dataInfo) {
          dataList.firstStartActivityCount.push(item.firstStartActivityCount)
          dataList.shareCount.push(item.shareCount)
          dataList.joinActivityCount.push(item.joinActivityCount)
          dataList.activitySuccessCount.push(item.activitySuccessCount)
          dataList.orderHelpOrderCount.push(item.orderHelpOrderCount)
        }
        let optionSeriesLine = [
          {
            name: '页面访问人数',
            value: dataList.firstStartActivityCount
          },
          {
            name: '参加组队活动人数',
            value: dataList.joinActivityCount
          },
          {
            name: '海报分享次数',
            value: dataList.activitySuccessCount
          },
          {
            name: '领课成功数',
            value: dataList.shareCount
          },
          {
            name: '公众号新增关注人数',
            value: dataList.orderHelpOrderCount
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineThree() {
        let dataList = {
          firstStartActivityCount: [],
          shareCount: [],
          joinActivityCount: [],
          activitySuccessCount: [],
          orderHelpOrderCount: [],
          orderHelpSuccessOrderCount: []
        }
        for (let item of this.dataInfo) {
          dataList.firstStartActivityCount.push(item.firstStartActivityCount)
          dataList.shareCount.push(item.shareCount)
          dataList.joinActivityCount.push(item.joinActivityCount)
          dataList.activitySuccessCount.push(item.activitySuccessCount)
          dataList.orderHelpOrderCount.push(item.orderHelpOrderCount)
          dataList.orderHelpSuccessOrderCount.push(item.orderHelpSuccessOrderCount)
        }
        let optionSeriesLine = [
          {
            name: '首次活动发起数量',
            type: 'line',
            data: dataList.firstStartActivityCount
          },
          {
            name: '参加活动助力人数',
            type: 'line',
            data: dataList.joinActivityCount
          },
          {
            name: '活动助力成功数',
            type: 'line',
            data: dataList.activitySuccessCount
          },
          {
            name: '海报分享次数',
            type: 'line',
            data: dataList.shareCount
          },
          {
            name: '助力用户下单数',
            type: 'line',
            data: dataList.orderHelpOrderCount
          },
          {
            name: '助力用户成功订单数',
            type: 'line',
            data: dataList.orderHelpSuccessOrderCount
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      this.getActivityData()
    },
    methods: {
      initFun () {
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        this.initData()
        switch (+this.selectTypeOne) {
          case 1:
            this.nowList = this.titleListOne
            this.drawLineOne()
            break
          case 2:
            this.nowList = this.titleListTwo
            this.getGroupFreeData()
            break
          case 3:
            this.nowList = this.titleListThree
            this.drawLineThree()
            break
        }
      },
      changeTimeThree () {
        if(this.selectTypeThree == 1) {
          this.getActivityData()
        }
      },
      changeTimeTwo () {
        if(this.selectTypeTwo == 1) {
          this.getGroupFreeData()
        }
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.getActivityData()
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.getGroupFreeData()
      },
      getActivityData() {
        this.$api.hkywhdActivity.getActivityData({
          startTime: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          endTime: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime()
        })
          .then(
            response => {
              this.todayInfo = response.data.resultData;
              this.dataInfo = this.todayInfo.list
              this.initFun()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getGroupFreeData() {
        this.$api.hkywhdActivity.getGroupFreeData({
          startTime: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          startTime1: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          endTime: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime(),
          endTime1: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime()
        })
          .then(
            response => {
              this.todayInfo = response.data.resultData;
              this.dataInfo = this.todayInfo.list
              this.drawLineTwo()
            })
      },
      drawLineOne() {
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
                name: '领课成功数',
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
          series: this.optionSeriesLineOne,
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
      drawLineTwo() {
        let myChart = echarts.init(this.$refs.echartTwo);
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          // tooltip: {
          //   trigger: 'item'
          // },
          legend: {
            selectedMode: false,
            data: [
              {
                name: '页面访问人数',
                icon: 'circle'
              },
              {
                name: '参加组队活动人数',
                icon: 'circle'
              },
              {
                name: '海报分享次数',
                icon: 'circle'
              },
              {
                name: '领课成功数',
                icon: 'circle'
              },
              {
                name: '公众号新增关注人数',
                icon: 'circle'
              }
            ],
          },
          series: {
            type: 'funnel',
            minSize: '0%',
            maxSize: '100%',
            gap: 3,
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            label: {
              show: true,
              position: 'center',
              formatter: `{b}: {c}%`
            },
            data: this.optionSeriesLineTwo
          },
          color: ['#FF6F43', '#FFAB40', '#FFD54F', '#80CBC4']
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      drawLineThree() {
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
                name: '首次活动发起数量',
                icon: 'circle'
              },
              {
                name: '参加活动助力人数',
                icon: 'circle'
              },
              {
                name: '活动助力成功数',
                icon: 'circle'
              },
              {
                name: '海报分享次数',
                icon: 'circle'
              },
              {
                name: '助力用户下单数',
                icon: 'circle'
              },
              {
                name: '助力用户成功订单数',
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
          series: this.optionSeriesLineThree,
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
      initData() {
        this.titleListOne = [
          {
            name: '今日领课成功数',
            num: this.todayInfo.shareFreeSuccessCount,
            todayName: '累计领课成功数',
            todayNum: this.todayInfo.allShareFreeSuccessCount
          }
        ]
        this.titleListTwo = [
          {
            name: '今日页面访问人数',
            num: this.todayInfo.firstStartActivityCount,
            todayName: '累计页面访问人数',
            todayNum: this.todayInfo.allFirstStartActivityCount

          },
          {
            name: '今日参加组队活动人数',
            num: this.todayInfo.shareCount,
            todayName: '累计参加组队活动人数',
            todayNum: this.todayInfo.allShareCount
          },
          {
            name: '今日海报分享次数',
            num: this.todayInfo.joinActivityCount,
            todayName: '累计海报分享次数',
            todayNum: this.todayInfo.allJoinActivityCount
          },
          {
            name: '今日领课成功数',
            num: this.todayInfo.newGroupFreeCount,
            todayName: '累计领课成功数',
            todayNum: this.todayInfo.allNewGroupFreeCount
          },
          {
            name: '今日公众号新增关注人数',
            num: this.todayInfo.subscribeUserCount,
            todayName: '累计公众号新增关注人数',
            todayNum: this.todayInfo.allSubscribeUserCount
          }
        ]
        this.titleListThree = [
          {
            name: '今日活动发起数量',
            num: this.todayInfo.firstStartActivityCount,
            todayName: '累计活动发起数量',
            todayNum: this.todayInfo.allFirstStartActivityCount

          },
          {
            name: '今日海报分享次数',
            num: this.todayInfo.shareCount,
            todayName: '累计海报分享次数',
            todayNum: this.todayInfo.allShareCount
          },
          {
            name: '今日活动助力人数',
            num: this.todayInfo.joinActivityCount,
            todayName: '累计活动助力人数',
            todayNum: this.todayInfo.allJoinActivityCount
          },
          {
            name: '今日活动助力成功数',
            num: this.todayInfo.activitySuccessCount,
            todayName: '累计活动助力成功数',
            todayNum: this.todayInfo.allActivitySuccessCount
          },
          {
            name: '今日助力用户下单数',
            num: this.todayInfo.orderHelpOrderCount,
            todayName: '累计助力用户下单数',
            todayNum: this.todayInfo.allOrderHelpOrderCount
          },
          {
            name: '今日助力用户成功订单数',
            num: this.todayInfo.orderHelpSuccessOrderCount,
            todayName: '累计助力用户成功订单数',
            todayNum: this.todayInfo.allOrderHelpSuccessOrderCount
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-activeData {
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
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      text-align: left;
    }

    .-c-tab {
      margin: 20px 0;
    }
    .-search-select-text-two {
      min-width: 80px;
      text-align: left;
    }
    .-s-radio {
      margin-bottom: 26px;
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
      /*background-color: red;*/
      /*overflow: hidden;*/
    }

    .-p-c-contentTwo {
      margin: 0 auto;
      width: 600px;
      height: 331px;
    }

    .-p-d-red {
      color: #fe4758
    }

    .-p-d-green {
      color: #21c45a;
    }

    .-p-d-gray {
      color: #B3B5B8;
    }
  }
</style>
