<template>
  <div class="p-activeData">
    <Card class="p-activeData-top">
      <div class="p-activeData-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon6.png"/>
          <span>今日数据</span>
        </div>
      </div>
      <div>
        <Row class="p-activeData-flex" :gutter="10" style="margin-top: 20px">
          <Col v-for="(item,index) of titleListThree" :key="index" class="-p-d-col">
            <div class="g-t-left -card-wrap -card-wrap-two">
              <div class="-col-name">{{item.name}}</div>
              <div class="-col-down">{{item.num}}</div>
            </div>
          </Col>
        </Row>
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
        titleListThree: [],
        channelList: []
      }
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.dataInfo) {
          arrayX.push(item.day)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          orderUser: [],
          payedMoney: [],
          payedUser: [],
          pv: [],
          uv: []
        }
        for (let item of this.dataInfo) {
          dataList.orderUser.push(item.orderUser)
          dataList.payedMoney.push(item.payedMoney)
          dataList.payedUser.push(item.payedUser)
          dataList.pv.push(item.pv)
          dataList.uv.push(item.uv)
        }
        let optionSeriesLine = [
          {
            name: '首次活动发起数量',
            type: 'line',
            data: dataList.pv
          },
          {
            name: '首次活动过期数量',
            type: 'line',
            data: dataList.uv
          },
          {
            name: '二次活动发起数量',
            type: 'line',
            data: dataList.orderUser
          },
          {
            name: '参加活动助力人数',
            type: 'line',
            data: dataList.payedUser
          },
          {
            name: '活动助力成功数',
            type: 'line',
            data: dataList.payedMoney
          },
          {
            name: '分享次数',
            type: 'line',
            data: dataList.payedMoney
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
          this.getList()
        }
      },
      changeChannel () {
        this.getTotalInfo()
        this.getTodayInfo()
        this.getList()
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.getTotalInfo()
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.getList()
      },
      getChannelList() {
        this.$api.composition.listByChannel({
          current: 1,
          size: 10000
        })
          .then(
            response => {
              this.channelList = response.data.resultData.records;
              this.channelList.unshift({
                id: '0',
                name: '全部'
              })
              this.getList()
              this.getTodayInfo()
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
                name: '首次活动发起数量',
                icon: 'circle'
              },
              {
                name: '首次活动过期数量',
                icon: 'circle'
              },
              {
                name: '二次活动发起数量',
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
                name: '分享次数',
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

        this.isFetching = true
        this.$api.composition.userStatisticsLineChart({
          chId: this.radioType,
          begin: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          end: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime()
        })
          .then(
            response => {
              this.dataInfo = response.data.resultData;
              this.drawLine()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getTodayInfo() {
        this.$api.composition.userStatisticsToday({
          chId: this.radioType
        }).then(
          response => {
            this.todayInfo = response.data.resultData;
            this.initData()
          })
      },
      getTotalInfo() {
        this.$api.composition.userStatisticsTotal({
          chId: this.radioType,
          begin: this.getStartTimeTwo && new Date(this.getStartTimeTwo).getTime(),
          end: this.getEndTimeTwo && new Date(this.getEndTimeTwo).getTime()
        }).then(
          response => {
            this.totalInfo = response.data.resultData;
            this.initData()
          })
      },
      initData() {
        this.titleListThree = [
          {
            name: '首次活动发起数量',
            num: this.todayInfo.pv
          },
          {
            name: '首次活动过期数量',
            num: this.todayInfo.pv
          },
          {
            name: '二次活动发起数量',
            num: this.todayInfo.uv
          },
          {
            name: '分享次数',
            num: this.todayInfo.orderUser
          },
          {
            name: '参与活动助力人数',
            num: this.todayInfo.orderUser
          },
          {
            name: '活动助力成功数',
            num: this.todayInfo.orderUser
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
      width: 100px;
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
