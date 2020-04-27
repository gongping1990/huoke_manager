<template>
  <div class="p-platformData">
    <Row class="g-search">
      <Col :span="3" class="g-flex-a-j-center -s-radio">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio :label=0>分享数据</Radio>
          <Radio :label=1>收益数据</Radio>
        </Radio-group>
      </Col>
    </Row>

    <Card>
      <div class="p-platformData-title">
        <div class="-left">
          <img src="../../../../assets/images/icon/icon1.png"/>
          <span>数据统计</span>
        </div>
      </div>
      <Row class="p-platformData-flex" :gutter="10" style="margin-top: 20px">
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

    <Card class="p-platformData-top">
      <div class="p-platformData-title -three">
        <div class="-left">
          <img src="../../../../assets/images/icon/icon7.png"/>
          <span>趋势数据</span>
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
  import DatePickerTemplate from "@/components/datePickerTemplate";

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
        totalInfo: '',
        allInfo: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTimeThree: '',
        getStartTimeTwo: '',
        getEndTimeThree: '',
        getEndTimeTwo: '',
        titleList: [],
        titleListTwo: [],
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
          pv: [],
          uv: [],
          qrcode: [],
          shared: [],
        }
        for (let item of this.dataInfo) {
          dataList.pv.push(item.pv)
          dataList.uv.push(item.uv)
          dataList.qrcode.push(item.qrcode)
          dataList.shared.push(item.shared)
        }
        let optionSeriesLine = [
          {
            name: '活动页PV',
            type: 'line',
            data: dataList.pv
          },
          {
            name: '活动页UV',
            type: 'line',
            data: dataList.uv
          },
          {
            name: '直接邀请分享次数',
            type: 'line',
            data: dataList.qrcode
          },
          {
            name: '海报保存次数',
            type: 'line',
            data: dataList.shared
          }
        ]
        return optionSeriesLine
      },

      optionSeriesLineTwo() {
        let dataList = {
          dayperson: [],
          daymoney: [],
          takePerson: [],
          takeMoney: [],
        }
        for (let item of this.dataInfo) {
          dataList.dayperson.push(item.dayperson)
          dataList.daymoney.push(item.daymoney)
          dataList.takePerson.push(item.takePerson)
          dataList.takeMoney.push(item.takeMoney)
        }
        let optionSeriesLineTwo = [
          {
            name: '产生收益（人次）',
            type: 'line',
            data: dataList.dayperson
          },
          {
            name: '产生收益（元）',
            type: 'line',
            data: dataList.daymoney
          },
          {
            name: '提现（人次）',
            type: 'line',
            data: dataList.takePerson
          },
          {
            name: '提现（元）',
            type: 'line',
            data: dataList.takeMoney
          }
        ]
        return optionSeriesLineTwo
      },

      legendData () {
        let dataList = [
          {
            name: '活动页PV',
            icon: 'circle'
          },
          {
            name: '活动页UV',
            icon: 'circle'
          },
          {
            name: '直接邀请分享次数',
            icon: 'circle'
          },
          {
            name: '海报保存次数',
            icon: 'circle'
          }
        ]

        let dataListTwo = [
          {
            name: '产生收益（人次）',
            icon: 'circle'
          },
          {
            name: '产生收益（元）',
            icon: 'circle'
          },
          {
            name: '提现（人次）',
            icon: 'circle'
          },
          {
            name: '提现（元）',
            icon: 'circle'
          }
        ]

        return  this.radioType == '0' ? dataList : dataListTwo
      }
    },
    mounted() {
      this.changeRadio()
    },
    methods: {
      changeRadio () {
        this.getDataList()
        this.getDataToday()
        this.getDataTotal()
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
            data: this.legendData,
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
          series: this.radioType == '0' ? this.optionSeriesLine : this.optionSeriesLineTwo,
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
      getDataList() {
        let paramsUrl = this.radioType == '1' ? this.$api.tbzwDistribution.monthEarningsCount : this.$api.tbzwDistribution.monthDistributionCount
        paramsUrl().then(
          response => {
            this.dataInfo = response.data.resultData;
            this.getList()
            this.initData()
          })
      },
      getDataToday() {
        let paramsUrl = this.radioType == '1' ? this.$api.tbzwDistribution.todayEarningsCount : this.$api.tbzwDistribution.todayDistributionCount
        paramsUrl().then(
          response => {
            this.totalInfo = response.data.resultData;
          })
      },
      getDataTotal() {
        let paramsUrl = this.radioType == '1' ? this.$api.tbzwDistribution.totalEarnings : this.$api.tbzwDistribution.allDistributionCount
        paramsUrl().then(
          response => {
            this.allInfo = response.data.resultData;
          })
      },
      initData() {
        let userData = [
          {
            name: '累计活动页PV',
            num: this.allInfo.pv,
            todayName: '今日活动页PV',
            todayNum: this.totalInfo.pv
          },
          {
            name: '累计活动页UV',
            num: this.allInfo.uv,
            todayName: '今日活动页UV',
            todayNum: this.totalInfo.uv
          },
          {
            name: '累计直接邀请分享次数',
            num: this.allInfo.shared,
            todayName: '今日直接邀请分享次数',
            todayNum: this.totalInfo.shared
          },
          {
            name: '累计海报保存次数',
            num: this.allInfo.qrcode,
            todayName: '今日海报保存次数',
            todayNum: this.totalInfo.qrcode
          }
        ]

        let payData = [
          {
            name: '累计产生收益（人次）',
            num:  this.allInfo.dayperson,
            todayName: '今日产生收益（人次）',
            todayNum: this.totalInfo.dayperson
          },
          {
            name: '累计产生收益（元）',
            num: this.allInfo.daymoney,
            todayName: '今日产生收益（元）',
            todayNum: this.totalInfo.daymoney
          },
          {
            name: '累计提现（人次）',
            num:  this.allInfo.takePerson,
            todayName: '今日提现（人次）',
            todayNum: this.totalInfo.takePerson
          },
          {
            name: '累计提现（元）',
            num:  this.allInfo.takeMoney,
            todayName: '今日提现（元）',
            todayNum: this.totalInfo.takeMoney
          },
        ]

        this.titleList = this.radioType == '0' ? userData : payData
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-platformData {
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
          max-width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
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
    }

    .-c-tab {
      margin: 20px 0;
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
  }
</style>
