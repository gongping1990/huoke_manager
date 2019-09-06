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
          <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeTimeTwo">
            <Option label='全部' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
          <date-picker-template v-if="selectTypeTwo===2" :dataInfo="dateOption"
                                @changeDate="changeDateTwo"></date-picker-template>
        </div>
      </div>

      <div class="-c-tab -p-d-echart">
        <div ref="echart" class="-p-c-content"></div>
        <div class="-p-c-tip-wrap">
          <div class="-item" :style="{'color': item.color}" v-for="item of optionSeriesLine" :key="item.value">
            {{item.name}}
          </div>
        </div>
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
  import "echarts/lib/component/dataZoom";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'fxgl_DataFunneling',
    components: {DatePickerTemplate},
    data() {
      return {
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
        titleList: []
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
          pv: []
        }
        for (let item of this.dataInfo) {
          dataList.orderUser.push(item.orderUser)
          dataList.payedMoney.push(item.payedMoney)
          dataList.payedUser.push(item.payedUser)
          dataList.pv.push(item.pv)
        }
        let optionSeriesLine = [
          {
            name: '代理人注册人数',
            value: 160,
            color: '#FF6F43'
          },
          {
            name: '完成1阶人数',
            value: 140,
            color: '#FFAB40'
          },
          {
            name: '完成2阶人数',
            value: 120,
            color: '#FFD54F'
          },
          {
            name: '销售五单',
            value: 30,
            color: '#80CBC4'
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      this.getChannelList()
    },
    methods: {
      changeTimeTwo() {
        if (this.selectTypeTwo == 1) {
          this.getTotalInfo()
        }
      },
      changeTimeThree() {
        if (this.selectTypeThree == 1) {
          this.getList()
        }
      },
      changeChannel() {
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
            trigger: 'item',
            axisPointer: {
              type: 'funnel'
            },
            textStyle: {
              align: 'left'
            }
          },
          legend: {
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
            label: {
              show: true,
              position: 'center'
            },
            labelLine: {
              show: true,
              length: 20,
              lineStyle: {
                shadowOffsetX: 10,
              }
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
      initData() {
        this.titleList = [
          {
            name: '累计页面访问量',
            num: this.totalInfo.pv,
            todayName: '今日页面访问量',
            todayNum: '100'
          },
          {
            name: '累计访问用户',
            num: this.totalInfo.uv,
            todayName: '今日访问用户',
            todayNum: '100'
          },
          {
            name: '累计下单用户',
            num: this.totalInfo.orderUser,
            todayName: '今日下单用户',
            todayNum: '100'
          },
          {
            name: '累计付费用户',
            num: this.totalInfo.orderUser,
            todayName: '今日付费用户',
            todayNum: '100'
          },
          {
            name: '累计下单数',
            num: this.totalInfo.orderUser,
            todayName: '今日下单数',
            todayNum: '100'
          },
          {
            name: '累计支付成功订单数',
            num: this.totalInfo.orderUser,
            todayName: '今日支付成功订单数',
            todayNum: '100'
          },
          {
            name: '累计付费金额',
            num: this.totalInfo.orderUser,
            todayName: '今日付费金额',
            todayNum: '100'
          }
        ]
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
      display: flex;
      margin-top: 72px;
      width: 100%;
      .-p-c-content {
        margin: 0 auto;
        width: 600px;
        height: 331px;
      }
      .-p-c-tip-wrap {
        padding-top: 50px;
        transform: translateX(-200%);
        text-align: left;

        .-item {
          line-height: 60px;

          &:before{
            content: '---';
            width: 100px;
          }
        }

      }
    }

  }
</style>
