<template>
  <div class="p-data" id="dataCenter">
    <div>
      <div class="g-t-left -title">今日数据</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsToday" :data="dataListToday"></Table>
    </div>
    <div>
      <div class="g-t-left -title">累计数据</div>
      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Select v-model="selectTypeOne" class="-search-selectOne" @on-change="changeSelectData">
              <Option label='全部' :value="1"></Option>
              <Option label='自定义' :value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="21" class="g-flex-a-j-center">
          <date-picker-template v-if="selectTypeOne===2" :dataInfo="dateOption"
                                @changeDate="changeDateOne"></date-picker-template>
        </Col>
      </Row>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsToday" :data="dataListSum"></Table>
    </div>

    <div>
      <div class="g-t-left -title">交易趋势</div>
      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeSelectDataTwo">
              <Option label='最近一月' :value="1"></Option>
              <Option label='自定义' :value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="21" class="g-flex-a-j-center">
          <date-picker-template v-if="selectTypeTwo===2" :dataInfo="dateOption"
                                @changeDate="changeDateTwo"></date-picker-template>
        </Col>
      </Row>

      <div class="-c-tab g-t-left">
        <Radio-group v-model="radioTypeOne" type="button" @on-change="changeRadio(1)">
          <Radio label="3">全部用户</Radio>
          <Radio label="0">当日新增用户</Radio>
          <Radio label="2">老未付费用户</Radio>
          <Radio label="1">老付费用户</Radio>
        </Radio-group>
      </div>


      <Card class="-p-d-col">
        <div class="-c-tab -p-d-echart">
          <div ref="echart" class="-p-c-content"></div>
        </div>
      </Card>
    </div>

    <div>
      <div class="g-t-left -title -c-tab">数据对比</div>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Select v-model="selectTypeThree" class="-search-selectOne" @on-change="changeSelectDataThree">
              <Option label='最近一月' :value="1"></Option>
              <Option label='自定义' :value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="21" class="g-flex-a-j-center">
          <date-picker-template v-if="selectTypeThree===2" :dataInfo="dateOption"
                                @changeDate="changeDateThree"></date-picker-template>
        </Col>
      </Row>

      <div class="-c-tab g-t-left">
        <Radio-group v-model="radioTypeTwo" type="button" @on-change="changeRadio(2)">
          <Radio label="pv">系统页面访问量</Radio>
          <Radio label="uv">系统访问用户</Radio>
          <Radio label="goodsPv">商品页面访问量</Radio>
          <Radio label="goodsUv">商品访问用户</Radio>
          <Radio label="orderuser">下单用户</Radio>
          <Radio label="payeduser">付费用户</Radio>
          <Radio label="totalMoney">付费金额</Radio>
          <Radio label="singleUserMoney">客单价</Radio>
        </Radio-group>
      </div>

      <Card class="-p-d-col">
        <div class="-c-tab -p-d-echart">
          <div ref="echartTwo" class="-p-c-content"></div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'
  import echarts from "echarts/lib/echarts";
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
    name: 'transactionData',
    components: {DatePickerTemplate},
    data() {
      return {
        radioTypeOne: '3',
        radioTypeTwo: 'pv',
        selectTypeOne: 1,
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
        dataInfoTwo: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTime: '',
        getStartTimeTwo: '',
        getStartTimeThree: '',
        getEndTime: '',
        getEndTimeTwo: '',
        getEndTimeThree: '',
        typeList: {
          '0': '今日新增用户',
          '1': '老付费用户',
          '2': '老未付费用户',
          '3': '总计',
        },
        columnsToday: [
          {
            title: '用户',
            key: 'phone',
            render: (h,params)=>{
              return h('div', this.typeList[params.row.type])
            }
          },
          {
            title: '系统页面访问量',
            key: 'pv'
          },
          {
            title: '系统访问用户',
            key: 'uv'
          },
          {
            title: '商品页面访问量',
            key: 'goodsPv'
          },
          {
            title: '商品访问用户',
            key: 'goodsUv'
          },
          {
            title: '下单用户',
            key: 'orderuser'
          },
          {
            title: '付费用户',
            key: 'payeduser'
          },
          {
            title: '已完成订单',
            key: 'orderPayed'
          },
          {
            title: '付费金额',
            key: 'totalMoney'
          },
          {
            title: '客单价',
            key: 'userMoney'
          }
        ],
        dataListToday: [],
        dataListSum: [],
      }
    },
    computed: {
      optionSeriesLine() {
        let optionSeriesLine = [
          {
            name: '系统页面访问量',
            type: 'line',
            data: this.dataInfo.pv
          },
          {
            name: '系统访问用户',
            type: 'line',
            data: this.dataInfo.uv
          },
          {
            name: '商品页面访问量',
            type: 'line',
            data: this.dataInfo.goodsPv
          },
          {
            name: '商品访问用户',
            type: 'line',
            data: this.dataInfo.goodsUv
          },
          {
            name: '下单用户',
            type: 'line',
            data: this.dataInfo.orderuser
          },
          {
            name: '付费用户',
            type: 'line',
            data: this.dataInfo.payeduser
          },
          {
            name: '付费金额',
            type: 'line',
            data: this.dataInfo.totalMoney
          },
          {
            name: '客单价',
            type: 'line',
            data: this.dataInfo.userMoney
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineTwo() {
        let optionSeriesLineTwo = [
          {
            name: '当日新增用户',
            type: 'line',
            data: this.dataInfoTwo.newUsers
          },
          {
            name: '老付费用户',
            type: 'line',
            data:  this.dataInfoTwo.oldBuyer
          },
          {
            name: '老未付费用户',
            type: 'line',
            data: this.dataInfoTwo.oldUNBuyer
          }
        ]
        return optionSeriesLineTwo
      }
    },
    mounted() {
      this.listDayReportByUser()
      this.listDayReportChartByBiz()
      this.listTodayDayReport()
      this.listSumDayReport()
    },
    methods: {
      listTodayDayReport() {
        this.isFetching = true
        this.$api.statistics.listTodayDayReport()
          .then(
            response => {
              this.dataListToday = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listSumDayReport() {
        this.isFetching = true
        this.$api.statistics.listSumDayReport({
          start: this.getStartTime ? new Date(this.getStartTime).getTime() : '',
          end: this.getEndTime ? new Date(this.getEndTime).getTime() : ''
        })
          .then(
            response => {
              this.dataListSum = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      changeRadio (num) {
        switch (num) {
          case 1:
            this.listDayReportByUser()
            break
          case 2:
            this.listDayReportChartByBiz()
            break
        }
      },
      changeSelectData() {
        if (this.selectTypeOne == 1) {
          this.listSumDayReport()
        }
      },
      changeSelectDataTwo() {
        if (this.selectTypeTwo == 1) {
          this.listSumDayReport()
        }
      },
      changeSelectDataThree() {
        if (this.selectTypeThree == 1) {
          this.listDayReportChartByBiz()
        }
      },
      changeDateOne(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.listSumDayReport()
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.listDayReportByUser()
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.listDayReportChartByBiz(data)
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
                name: '系统页面访问量',
                icon: 'circle'
              },
              {
                name: '系统访问用户',
                icon: 'circle'
              },
              {
                name: '商品页面访问量',
                icon: 'circle'
              },
              {
                name: '商品访问用户',
                icon: 'circle'
              },
              {
                name: '下单用户',
                icon: 'circle'
              },
              {
                name: '付费用户',
                icon: 'circle',
              },
              {
                name: '付费金额',
                icon: 'circle',
              },
              {
                name: '客单价',
                icon: 'circle',
              }
            ],
            right: '5%'
          },
          xAxis: {
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            data: this.dataInfo.days
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
      drawLineTwo() {
        let self = this;
        let myChart = echarts.init(this.$refs.echartTwo);
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
                name: '当日新增用户',
                icon: 'circle'
              },
              {
                name: '老付费用户',
                icon: 'circle'
              },
              {
                name: '老未付费用户',
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
            data: this.dataInfoTwo.days
          },
          grid: {
            left: '6%',
            top: '13%',
            right: '5%'
          },
          yAxis: {
            name: '单位（人）'
          },
          series: this.optionSeriesLineTwo,
          color: ['#49a9ee', '#98d87d', '#ffd86e'],
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
      listDayReportByUser() {
        let myChart = echarts.init(this.$refs.echart);
        let params = {}
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.statistics.listDayReportByUser({
          start: this.getStartTimeTwo ? new Date(this.getStartTimeTwo).getTime() : '',
          end: this.getEndTimeTwo ? new Date(this.getEndTimeTwo).getTime() : '',
          type: this.radioTypeOne
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
      listDayReportChartByBiz(dateTime) {
        let myChart = echarts.init(this.$refs.echartTwo);
        let params = {}
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.statistics.listDayReportChartByBiz({
          start: this.getStartTimeThree ? new Date(this.getStartTimeThree).getTime() : '',
          end: this.getEndTimeThree ? new Date(this.getEndTimeThree).getTime() : '',
          filed: this.radioTypeTwo
        })
          .then(
            response => {
              this.dataInfoTwo = response.data.resultData;
              this.drawLineTwo()
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-data {
    .-title {
      font-size: 18px;
      font-weight: bold;
    }
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
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

    .-p-d-col {
      min-width: 280px;
      width: 100%;

      .-col-num {
        font-size: 25px;
        font-weight: bold;
        margin: 10px 0;
      }

      .-col-flex {
        display: flex;
        justify-content: space-between;
      }

      .-col-ratio {
        font-size: 13px;
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

    .-p-d-col-two {
      width: 300px;
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
