<template>
  <div class="p-dataFunneling">

    <Card>
      <div class="p-dataFunneling-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon5.png"/>
          <span>代理人销售统计</span>
        </div>
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectType" class="-search-selectOne" @on-change="changeTime">
            <Option label='全部' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
          <date-picker-template v-if="selectType===2" :dataInfo="dateOption"
                                @changeDate="changeDate"></date-picker-template>
        </div>
      </div>

      <div class="-p-d-echart">
        <div class="-p-c-tip-wrap">
          <div class="-item" :style="{'color': item.color}" v-for="(item, index) of optionSeriesLine" :key="index">
            <div class="-item-div">
              <div>{{item.name}}</div>
              <div>{{item.text}}</div>
            </div>
          </div>
        </div>
        <div ref="echart" class="-p-c-content"></div>
      </div>
    </Card>

    <Card class="p-dataFunneling-top">
      <div class="p-dataFunneling-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon3.png"/>
          <span>访问支付转化</span>
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

      <div class="-p-d-echart">
        <div class="-p-c-tip-wrap">
          <div class="-item -item-two" :style="{'color': item.color}" v-for="(item, index) of optionSeriesLineTwo" :key="index">
            <div class="-item-div">
              <div>{{item.name}}</div>
              <div>{{item.text}}</div>
            </div>
          </div>
        </div>
        <div ref="echartTwo" class="-p-c-content"></div>
      </div>
    </Card>

    <Card class="p-dataFunneling-top">
      <div class="p-dataFunneling-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon4.png"/>
          <span>代理人活跃度统计</span>
        </div>
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeTimeTwo">
            <Option label='全部' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
          <date-picker-template v-if="selectTypeTwo===2" :dataInfo="dateOption"
                                @changeDate="changeDateThree"></date-picker-template>
        </div>
      </div>

      <div class="-p-d-echart">
        <div class="-p-c-tip-wrap">
          <div class="-item" :style="{'color': item.color}" v-for="(item, index) of optionSeriesLineThree" :key="index">
            <div class="-item-div">
              <div>{{item.name}}</div>
              <div>{{item.text}}</div>
            </div>
          </div>
        </div>
        <div ref="echartThree" class="-p-c-content"></div>
      </div>
    </Card>

  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'
  import echarts from "echarts/lib/echarts";
  import dayjs from 'dayjs'
  // 引入柱状图
  import "echarts/lib/chart/funnel";
  import "echarts/lib/component/title";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/tooltip";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'fxgl_DataFunneling',
    components: {DatePickerTemplate},
    data() {
      return {
        selectType: 1,
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
        getStartTime: '',
        getEndTimeThree: '',
        getEndTimeTwo: '',
        getEndTime: '',
        titleList: []
      }
    },
    computed: {
      optionSeriesLine() {
        let optionSeriesLine = [
          {
            name: '代理人注册人数',
            value: this.dataInfo.disributorRegisterCount,
            color: '#FF6F43',
            text: ''
          },
          {
            name: '完成1阶人数',
            value: this.dataInfo.firstTaskFinishCount,
            color: '#FFAB40',
            text: `注册代理1阶任务完成率${(this.dataInfo.firstTaskFinishCount / this.dataInfo.disributorRegisterCount).toFixed(2)*100}%`
          },
          {
            name: '完成2阶人数',
            value: this.dataInfo.secondTaskFinishCount,
            color: '#FFD54F',
            text: `注册代理2阶任务完成率${(this.dataInfo.secondTaskFinishCount / this.dataInfo.disributorRegisterCount).toFixed(2)*100}%`
          },
          {
            name: '销售五单',
            value: this.dataInfo.saleFiveOrderCount,
            color: '#80CBC4',
            text: `代理人成单率${(this.dataInfo.saleFiveOrderCount / this.dataInfo.disributorRegisterCount).toFixed(2)*100}%`
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineTwo() {
        let optionSeriesLine = [
          {
            name: '访问人数',
            value: 0,
            color: '#FF6F43',
            text: ''
          },
          {
            name: '下单人数',
            value: this.dataInfo.orderUserCount,
            color: '#FFAB40',
            text: `访问下单转化率${(110 / 160).toFixed(2)*100}% / 下单支付转化率${this.dataInfo.orderToPayPer*100}%`
          },
          {
            name: '支付人数',
            value: this.dataInfo.payUserCount,
            color: '#FFD54F',
            text: `访问支付转化率${(80 / 160).toFixed(2)*100}%`
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineThree() {
        let optionSeriesLine = [
          {
            name: '进入系统的代理人人数',
            value: this.dataInfo.promoterCenterUv,
            color: '#FF6F43',
            text: ''
          },
          {
            name: '代理人分享1次人数',
            value: this.dataInfo.shareOneUserCount,
            color: '#FFAB40',
            text: `代理人分享1次比例${(this.dataInfo.shareOneUserCount / this.dataInfo.promoterCenterUv).toFixed(2)*100}%`
          },
          {
            name: '代理人分享2次人数',
            value: this.dataInfo.shareTwoUserCount,
            color: '#FFD54F',
            text: `代理人分享2次比例${(this.dataInfo.shareTwoUserCount / this.dataInfo.promoterCenterUv).toFixed(2)*100}%`
          },
          {
            name: '代理人分享3次人数',
            value: this.dataInfo.shareThreeUserCount,
            color: '#80CBC4',
            text: `代理人分享3次比例${(this.dataInfo.shareThreeUserCount / this.dataInfo.promoterCenterUv).toFixed(2)*100}%`
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      this.getDataFunnel()
    },
    methods: {
      changeTime() {
        if (this.selectType == 1) {
          this.getDataFunnel()
        }
      },
      changeTimeTwo() {
        if (this.selectTypeTwo == 1) {
          this.getDataFunnel()
        }
      },
      changeTimeThree() {
        if (this.selectTypeThree == 1) {
          this.getDataFunnel()
        }
      },
      changeChannel() {
        this.getList()
      },
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getDataFunnel()
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.getDataFunnel()
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.getDataFunnel()
      },
      getDataFunnel() {
        this.$api.fxglDataCenter.getDataFunnel({
          startTime1: this.getStartTime && new Date(this.getStartTime).getTime(),
          startTime2: this.getStartTimeTwo && new Date(this.getStartTimeTwo).getTime(),
          startTime3: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          endTime1: this.getEndTime && new Date(this.getEndTime).getTime(),
          endTime2: this.getEndTimeTwo && new Date(this.getEndTimeTwo).getTime(),
          endTime3: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime()
        })
          .then(
            response => {
              this.dataInfo = response.data.resultData;
              this.getList()
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
            trigger: 'item'
          },
          legend: {
            selectedMode: false,
            data: [
              {
                name: '代理人注册人数'
              },
              {
                name: '完成1阶人数'
              },
              {
                name: '完成2阶人数'
              },
              {
                name: '销售五单'
              }
            ]
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
              formatter: '{c}人'
            },
            data: this.optionSeriesLine
          },
          color: ['#FF6F43', '#FFAB40', '#FFD54F', '#80CBC4']
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      drawLineTwo() {
        let self = this;
        let myChart = echarts.init(this.$refs.echartTwo);
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            selectedMode: false,
            data: [
              {
                name: '访问人数'
              },
              {
                name: '下单人数'
              },
              {
                name: '支付人数'
              }
            ]
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
              formatter: '{c}人'
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
        let myChart = echarts.init(this.$refs.echartThree);
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            selectedMode: false,
            data: [
              {
                name: '进入系统的代理人人数'
              },
              {
                name: '代理人分享1次人数'
              },
              {
                name: '代理人分享2次人数'
              },
              {
                name: '代理人分享3次人数'
              }
            ]
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
              formatter: '{c}人'
            },
            data: this.optionSeriesLineThree
          },
          color: ['#FF6F43', '#FFAB40', '#FFD54F', '#80CBC4']
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
        this.drawLineTwo()
        this.drawLineThree()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-dataFunneling {

    &-top {
      margin-top: 30px;

      .-three {
        padding-bottom: 28px;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
      }
    }

    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .-left {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 400;
        color: rgba(23, 34, 62, 1);
        line-height: 25px;

        img {
          width: 28px;
          height: 28px;
          margin-right: 10px;
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
      font-size: 16px;
      font-weight: 400;
      color: rgba(23, 34, 62, 1);
      line-height: 22px;
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
      position: relative;
      display: flex;
      margin-top: 42px;
      width: 100%;
      .-p-c-content {
        margin: 0 auto;
        width: 600px;
        height: 331px;
      }
      .-p-c-tip-wrap {
        position: absolute;
        left: 70%;
        padding-top: 60px;
        text-align: left;

        .-item {
          display: flex;
          align-items: center;
          height: 58px;

          &:before {
            content: '---';
            margin-right: 10px;
          }
        }

        .-item-two {
          height: 76px;
        }
      }
    }

  }
</style>
