<template>
  <div class="p-platformData">
    <Row class="g-search">
      <Col :span="3" class="g-flex-a-j-center -s-radio">
        <Radio-group v-model="radioType" type="button" @on-change="getDataInfo">
          <Radio :label=0>用户数据</Radio>
          <Radio :label=1>支出数据</Radio>
        </Radio-group>
      </Col>
    </Row>

    <Card>
      <div class="p-platformData-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon1.png"/>
          <span>数据统计</span>
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

    <Card class="p-platformData-top" v-if="radioType === 1">
      <div class="p-platformData-title">
        <div class="-left">
          <img src="../../../assets/images/icon/icon6.png"/>
          <span>实时数据</span>
        </div>
      </div>
      <div>
        <Row class="p-platformData-flex" :gutter="10" style="margin-top: 20px">
          <Col v-for="(item,index) of titleListThree" :key="index" class="-p-d-col">
            <div class="g-t-left -card-wrap -card-wrap-two">
              <div class="-col-name">{{item.name}}</div>
              <div class="-col-down">{{item.num}}</div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>

    <Card class="p-platformData-top">
      <div class="p-platformData-title -three">
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
        totalInfo: '',
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
          arrayX.push(item.date)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          franchiseeIntroducePv: [],
          franchiseeIntroduceUv: [],
          promoterIntroducePv: [],
          promoterIntroduceUv: [],
          promoterCenterPv: [],
          promoterCenterUv: [],
          franchiseeRegisterCount: [],
          promoterRegisterCount: [],
        }
        for (let item of this.dataInfo) {
          dataList.franchiseeIntroducePv.push(item.franchiseeIntroducePv)
          dataList.franchiseeIntroduceUv.push(item.franchiseeIntroduceUv)
          dataList.promoterIntroducePv.push(item.promoterIntroducePv)
          dataList.promoterIntroduceUv.push(item.promoterIntroduceUv)
          dataList.promoterCenterPv.push(item.promoterCenterPv)
          dataList.promoterCenterUv.push(item.promoterCenterUv)
          dataList.franchiseeRegisterCount.push(item.franchiseeRegisterCount)
          dataList.promoterRegisterCount.push(item.promoterRegisterCount)
        }
        let optionSeriesLine = [
          {
            name: '加盟商访问量',
            type: 'line',
            data: dataList.franchiseeIntroducePv
          },
          {
            name: '加盟商访问用户',
            type: 'line',
            data: dataList.franchiseeIntroduceUv
          },
          {
            name: '推广员访问量',
            type: 'line',
            data: dataList.promoterIntroducePv
          },
          {
            name: '推广员访问用户',
            type: 'line',
            data: dataList.promoterIntroduceUv
          },
          {
            name: '推广中心访问量',
            type: 'line',
            data: dataList.promoterCenterPv
          },
          {
            name: '推广中心访问用户',
            type: 'line',
            data: dataList.promoterCenterUv
          },
          {
            name: '加盟商注册数',
            type: 'line',
            data: dataList.franchiseeRegisterCount
          },
          {
            name: '推广人注册数',
            type: 'line',
            data: dataList.promoterRegisterCount
          }
        ]
        return optionSeriesLine
      },

      optionSeriesLineTwo() {
        let dataList = {
          withdrawCount: [],
          withdrawUserCount: [],
          withdrawAmount: [],
          franchiseeWithdrawCount: [],
          franchiseeWithdrawUserCount: [],
          franchiseeWithdrawAmount: [],
          promoterWithdrawCount: [],
          promoterWithdrawUserCount: [],
          promoterWithdrawAmount: [],
        }
        for (let item of this.dataInfo) {
          dataList.withdrawCount.push(item.withdrawCount)
          dataList.withdrawUserCount.push(item.withdrawUserCount)
          dataList.withdrawAmount.push(item.withdrawAmount)
          dataList.franchiseeWithdrawCount.push(item.franchiseeWithdrawCount)
          dataList.franchiseeWithdrawUserCount.push(item.franchiseeWithdrawUserCount)
          dataList.franchiseeWithdrawAmount.push(item.franchiseeWithdrawAmount)
          dataList.promoterWithdrawCount.push(item.promoterWithdrawCount)
          dataList.promoterWithdrawUserCount.push(item.promoterWithdrawUserCount)
          dataList.promoterWithdrawAmount.push(item.promoterWithdrawAmount)
        }
        let optionSeriesLineTwo = [
          {
            name: '提现笔数',
            type: 'line',
            data: dataList.withdrawCount
          },
          {
            name: '提现人数',
            type: 'line',
            data: dataList.withdrawUserCount
          },
          {
            name: '提现金额',
            type: 'line',
            data: dataList.withdrawAmount
          },
          {
            name: '加盟商提现笔数',
            type: 'line',
            data: dataList.franchiseeWithdrawCount
          },
          {
            name: '加盟商提现人数',
            type: 'line',
            data: dataList.franchiseeWithdrawUserCount
          },
          {
            name: '加盟商提现金额',
            type: 'line',
            data: dataList.franchiseeWithdrawAmount
          },
          {
            name: '推广人提现笔数',
            type: 'line',
            data: dataList.promoterWithdrawCount
          },
          {
            name: '推广人提现人数',
            type: 'line',
            data: dataList.promoterWithdrawUserCount
          },
          {
            name: '推广人提现金额',
            type: 'line',
            data: dataList.promoterWithdrawAmount
          }
        ]
        return optionSeriesLineTwo
      },

      legendData () {
        let dataList = [
          {
            name: '加盟商访问量',
            icon: 'circle'
          },
          {
            name: '加盟商访问用户',
            icon: 'circle'
          },
          {
            name: '推广员访问量',
            icon: 'circle'
          },
          {
            name: '推广员访问用户',
            icon: 'circle'
          },
          {
            name: '推广中心访问量',
            icon: 'circle'
          },
          {
            name: '推广中心访问用户',
            icon: 'circle'
          },
          {
            name: '加盟商注册数',
            icon: 'circle'
          },
          {
            name: '推广人注册数',
            icon: 'circle'
          }
        ]

        let dataListTwo = [
          {
            name: '提现笔数',
            icon: 'circle'
          },
          {
            name: '提现人数',
            icon: 'circle'
          },
          {
            name: '提现金额',
            icon: 'circle'
          },
          {
            name: '加盟商提现笔数',
            icon: 'circle'
          },
          {
            name: '加盟商提现人数',
            icon: 'circle'
          },
          {
            name: '加盟商提现金额',
            icon: 'circle'
          },
          {
            name: '推广人提现笔数',
            icon: 'circle'
          },
          {
            name: '推广人提现人数',
            icon: 'circle'
          },
          {
            name: '推广人提现金额',
            icon: 'circle'
          }
        ]

        return  this.radioType == '0' ? dataList : dataListTwo
      }
    },
    mounted() {
      this.getDataInfo()
    },
    methods: {
      changeTimeTwo () {
        if(this.selectTypeTwo == 1) {
          this.getDataInfo()
        }
      },
      changeTimeThree () {
        if(this.selectTypeThree == 1) {
          this.getDataInfo()
        }
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.getDataInfo()
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.getDataInfo()
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
      getDataInfo() {
        let paramsUrl = this.radioType == '1' ? this.$api.fxglDataCenter.getPlatformOutData : this.$api.fxglDataCenter.getPlatformUserData
        paramsUrl({
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
        let userData = [
          {
            name: '加盟商累计访问量',
            num: this.totalInfo.franchiseeIntroduceTotalPv,
            todayName: '今日加盟商访问量',
            todayNum: this.totalInfo.franchiseeIntroducePv
          },
          {
            name: '加盟商累计访问用户',
            num: this.totalInfo.franchiseeIntroduceTotalUv,
            todayName: '今日加盟商访问用户',
            todayNum: this.totalInfo.franchiseeIntroduceUv
          },
          {
            name: '推广员累计访问量',
            num: this.totalInfo.promoterIntroduceTotalPv,
            todayName: '今日推广员访问量',
            todayNum: this.totalInfo.promoterIntroducePv
          },
          {
            name: '推广员累计访问用户',
            num: this.totalInfo.promoterIntroduceTotalUv,
            todayName: '今日加推广员访问用户',
            todayNum: this.totalInfo.promoterIntroduceUv
          },
          {
            name: '推广中心累计访问量',
            num: this.totalInfo.promoterCenterTotalPv,
            todayName: '今日推广中心访问量',
            todayNum: this.totalInfo.promoterCenterPv
          },
          {
            name: '推广中心累计访问用户',
            num: this.totalInfo.promoterCenterTotalUv,
            todayName: '今日推广中心访问用户',
            todayNum: this.totalInfo.promoterCenterUv
          },
          {
            name: '累计加盟商注册数',
            num: this.totalInfo.franchiseeRegisterTotalCount,
            todayName: '今日加盟商注册数',
            todayNum: this.totalInfo.franchiseeRegisterCount
          },
          {
            name: '累计推广人注册数',
            num: this.totalInfo.promoterRegisterTotalCount,
            todayName: '今日推广人注册数',
            todayNum: this.totalInfo.promoterRegisterCount
          }
        ]

        let payData = [
          {
            name: '累计提现笔数',
            num: this.totalInfo.withdrawTotalCount,
            todayName: '今日提现笔数',
            todayNum: this.totalInfo.withdrawCount
          },
          {
            name: '累计提现金额',
            num: this.totalInfo.withdrawTotalAmount,
            todayName: '今日提现金额',
            todayNum: this.totalInfo.withdrawAmount
          },
          {
            name: '累计提现人数',
            num: '0',
            todayName: '今日提现人数',
            todayNum: this.totalInfo.withdrawUserCount
          },
          {
            name: '加盟商累计提现笔数',
            num: this.totalInfo. franchiseeWithdrawTotalCount,
            todayName: '加盟商今日提现笔数',
            todayNum: this.totalInfo.franchiseeWithdrawCount
          },
          {
            name: '加盟商累计提现金额',
            num: this.totalInfo.franchiseeWithdrawTotalAmount,
            todayName: '加盟商今日提现金额',
            todayNum: this.totalInfo.franchiseeWithdrawAmount
          },
          {
            name: '加盟商累计提现人数',
            num: '0',
            todayName: '加盟商今日提现人数',
            todayNum: this.totalInfo.franchiseeWithdrawUserCount
          },
          {
            name: '推广人累计提现笔数',
            num: this.totalInfo.promoterWithdrawTotalCount,
            todayName: '推广人今日提现笔数',
            todayNum: this.totalInfo.promoterWithdrawCount
          },
          {
            name: '推广人累计提现金额',
            num: this.totalInfo.promoterWithdrawTotalAmount,
            todayName: '推广人今日提现金额',
            todayNum: this.totalInfo.promoterWithdrawAmount
          },
          {
            name: '推广人累计提现人数',
            num: '0',
            todayName: '推广人今日提现人数',
            todayNum: this.totalInfo.promoterWithdrawUserCount
          }
        ]

        this.titleList = this.radioType == '0' ? userData : payData
        this.titleListThree = [
          {
            name: '当前收益余额',
            num: this.totalInfo.nowAllAmount/100
          },
          {
            name: '当前可提现金额',
            num: this.totalInfo.nowAllBalance/100
          },
          {
            name: '当前冻结金额',
            num: this.totalInfo.nowAllBlockingAmount/100
          },
          {
            name: '加盟商当前收益余额',
            num: this.totalInfo.franchiseeNowAllAmount/100
          },
          {
            name: '加盟商当前可提现金额',
            num: this.totalInfo.franchiseeNowAllBalance/100
          },
          {
            name: '加盟商当前冻结金额',
            num: this.totalInfo.franchiseeNowAllBlockingAmount/100
          },
          {
            name: '推广人当前收益余额',
            num: this.totalInfo.promoterNowAllAmount/100
          },
          {
            name: '推广人当前可提现金额',
            num: this.totalInfo.promoterNowAllBalance/100
          },
          {
            name: '推广人当前冻结金额',
            num: this.totalInfo.promoterNowAllBlockingAmount/100
          }
        ]
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
