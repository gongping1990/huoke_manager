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
                                @changeDate="changeDateTwo"></date-picker-template>
        </Col>
      </Row>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsToday" :data="dataListToday"></Table>
    </div>

    <div>
      <div class="g-t-left -title">交易趋势</div>
      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeSelectData">
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
          <Radio label="1">全部用户</Radio>
          <Radio label="2">当日新增用户</Radio>
          <Radio label="3">老付费用户</Radio>
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
            <Select v-model="selectTypeThree" class="-search-selectOne" @on-change="changeSelectData">
              <Option label='最近一月' :value="1"></Option>
              <Option label='自定义' :value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="21" class="g-flex-a-j-center">
          <date-picker-template v-if="selectTypeThree===2" :dataInfo="dateOption"
                                @changeDate="changeDateTwo"></date-picker-template>
        </Col>
      </Row>

      <div class="-c-tab g-t-left">
        <Radio-group v-model="radioTypeOne" type="button" @on-change="changeRadio(2)">
          <Radio label="1">系统页面访问量</Radio>
          <Radio label="2">系统访问用户</Radio>
          <Radio label="3">商品页面访问量</Radio>
          <Radio label="4">商品访问用户</Radio>
          <Radio label="5">下单用户</Radio>
          <Radio label="6">付费用户</Radio>
          <Radio label="7">付费金额</Radio>
          <Radio label="8">客单价</Radio>
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
        radioTypeOne: '1',
        radioTypeTwo: '1',
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
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTime: '',
        getEndTime: '',
        columnsToday: [
          {
            title: '用户',
            key: 'phone'
          },
          {
            title: '系统页面访问量',
            key: 'phone'
          },
          {
            title: '系统访问用户',
            key: 'phone'
          },
          {
            title: '商品页面访问量',
            key: 'phone'
          },
          {
            title: '商品访问用户',
            key: 'phone'
          },
          {
            title: '下单用户',
            key: 'phone'
          },
          {
            title: '付费用户',
            key: 'phone'
          },
          {
            title: '付费金额',
            key: 'phone'
          },
          {
            title: '客单价',
            key: 'phone'
          }
        ],
        dataListToday: []
      }
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.dataInfo.data) {
          arrayX.push(item.date)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          systemAccessUser: [],
          goodsAccessUser: [],
          orderUser: [],
          payUser: [],
          payAmount: []
        }
        for (let item of this.dataInfo.data) {
          dataList.systemAccessUser.push(item.systemAccessUser)
          dataList.goodsAccessUser.push(item.goodsAccessUser)
          dataList.orderUser.push(item.orderUser)
          dataList.payUser.push(item.payUser)
          dataList.payAmount.push(item.payAmount / 100)
        }
        let optionSeriesLine = [
          {
            name: '系统访问用户',
            type: 'line',
            data: dataList.systemAccessUser
          },
          {
            name: '商品访问用户',
            type: 'line',
            data: dataList.goodsAccessUser
          },
          {
            name: '下单用户',
            type: 'line',
            data: dataList.orderUser
          },
          {
            name: '付费用户',
            type: 'line',
            data: dataList.payUser
          },
          {
            name: '付费金额',
            type: 'line',
            data: dataList.payAmount
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineTwo() {
        let dataList = {
          allPayAmount: [],

          averagePayAmount: []
        }
        for (let item of this.dataInfo.data) {
          dataList.allPayAmount.push(item.allPayAmount / 100)
          dataList.averagePayAmount.push(item.averagePayAmount / 100)
        }
        let optionSeriesLineTwo = [
          {
            name: '累计付费金额',
            type: 'line',
            data: dataList.allPayAmount
          },
          {
            name: '客单价',
            type: 'line',
            data: dataList.averagePayAmount
          }
        ]
        return optionSeriesLineTwo
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeRadio (num) {

      },
      changeSelectData() {
        if (this.selectType == 1) {
          this.getList()
        }
      },
      changeDateTwo(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList()
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
                name: '系统访问用户',
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
          color: ['#49a9ee', '#98d87d', '#ffd86e', '#ff6600'],
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
                name: '累计付费金额',
                icon: 'circle'
              },
              {
                name: '客单价',
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
            name: '单位（元）'
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
      getList() {
        let myChart = echarts.init(this.$refs.echart);
        let params = {}
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        if (this.selectType === 2) {
          params.startDate = new Date(this.getStartTime).getTime()
          params.endDate = new Date(this.getEndTime).getTime()
        }

        this.isFetching = true
        this.$api.dataCenter.getData(params)
          .then(
            response => {
              this.dataInfo = response.data.resultData;
              this.initData()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      initData() {
        this.drawLine()
        this.drawLineTwo()
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
