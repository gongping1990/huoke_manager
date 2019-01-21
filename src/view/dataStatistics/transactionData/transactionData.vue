<template>
  <div class="p-data" id="dataCenter">
    <Row class="g-flex-a-j-center -c-tab" :gutter="10" style="width:70%">
      <Col v-for="(item,index) of titleListOne" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div>{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
          <div class="-col-flex">
            <div class="-col-ratio">
              <span><span class="-p-d-gray">日环比：</span>{{item.dayRatio}}%</span>
              <Icon :type="item.dayRatio < 0 ? 'md-arrow-dropdown' : 'md-arrow-dropup'" size="18"
                    :class="[item.dayRatio < 0 ? '-p-d-red' : '-p-d-green']"/>
            </div>
            <div class="-col-ratio">
              <span><span class="-p-d-gray">周同比：</span>{{item.weekRatio}}%</span>
              <Icon :type="item.weekRatio < 0 ? 'md-arrow-dropdown' : 'md-arrow-dropup'" size="18"
                    :class="[item.weekRatio < 0 ? '-p-d-red' : '-p-d-green']"/>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <Card class="-p-d-col">
      <div class="-c-tab -p-d-echart">
        <div ref="echart" class="-p-c-content"></div>
      </div>
    </Card>

    <Row class="g-flex-a-j-center -c-tab" :gutter="10" style="width:70%">
      <Col v-for="(item,index) of titleListTwo" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div>{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
          <div class="-col-flex">
            <div class="-col-ratio">
              <span><span class="-p-d-gray">日环比：</span>{{item.dayRatio}}%</span>
              <Icon :type="item.dayRatio < 0 ? 'md-arrow-dropdown' : 'md-arrow-dropup'" size="18"
                    :class="[item.dayRatio < 0 ? '-p-d-red' : '-p-d-green']"/>
            </div>
            <div class="-col-ratio">
              <span><span class="-p-d-gray">周同比：</span>{{item.weekRatio}}%</span>
              <Icon :type="item.weekRatio < 0 ? 'md-arrow-dropdown' : 'md-arrow-dropup'" size="18"
                    :class="[item.weekRatio < 0 ? '-p-d-red' : '-p-d-green']"/>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <Card class="-p-d-col">
      <div class="-c-tab -p-d-echart">
        <div ref="echartTwo" class="-p-c-content"></div>
      </div>
    </Card>

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

  export default {
    name: 'transactionData',
    data() {
      return {
        radioType: '1',
        isFetching: false,
        dataInfo: '',
        titleListOne: [],
        titleListTwo: [],
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
          payUser: []
        }
        for (let item of this.dataInfo.data) {
          dataList.systemAccessUser.push(item.systemAccessUser)
          dataList.goodsAccessUser.push(item.goodsAccessUser)
          dataList.orderUser.push(item.orderUser)
          dataList.payUser.push(item.payUser)
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
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineTwo() {
        let dataList = {
          allPayAmount: [],
          payAmount: [],
          averagePayAmount: []
        }
        for (let item of this.dataInfo.data) {
          dataList.allPayAmount.push(item.allPayAmount)
          dataList.payAmount.push(item.payAmount)
          dataList.averagePayAmount.push(item.averagePayAmount)
        }
        let optionSeriesLineTwo = [
          {
            name: '累计付费金额',
            type: 'line',
            data: dataList.allPayAmount
          },
          {
            name: '付费金额',
            type: 'line',
            data: dataList.payAmount
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
            textStyle:{
              align:'left'
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
            textStyle:{
              align:'left'
            }
          },
          legend: {
            data: [
              {
                name: '累计付费金额',
                icon: 'circle'
              },
              {
                name: '付费金额',
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
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.dataCenter.getData()
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
        this.titleListOne = [
          {
            name: '系统访问用户',
            num: thousandFormatter(this.dataInfo.systemAccessUser),
            dayRatio: this.dataInfo.systemAccessUserChainDay,
            weekRatio: this.dataInfo.systemAccessUserBasisWeek
          },
          {
            name: '商品访问用户',
            num: thousandFormatter(this.dataInfo.goodsAccessUser),
            dayRatio: this.dataInfo.goodsAccessUserChainDay,
            weekRatio: this.dataInfo.goodsAccessUserBasisWeek
          },
          {
            name: '下单用户',
            num: thousandFormatter(this.dataInfo.orderUser),
            dayRatio: this.dataInfo.orderUserChainDay,
            weekRatio: this.dataInfo.orderUserBasisWeek
          },
          {
            name: '付费用户',
            num: thousandFormatter(this.dataInfo.payUser),
            dayRatio: this.dataInfo.payUserChainDay,
            weekRatio: this.dataInfo.payUserBasisWeek
          }
        ]
        this.titleListTwo = [
          {
            name: '累计付费金额',
            num: thousandFormatter(this.dataInfo.allPayAmount),
            dayRatio: this.dataInfo.allPayAmountChainDay,
            weekRatio: this.dataInfo.allPayAmountBasisWeek
          },
          {
            name: '付费金额',
            num: thousandFormatter(this.dataInfo.payAmount),
            dayRatio: this.dataInfo.payAmountChainDay,
            weekRatio: this.dataInfo.payAmountBasisWeek
          },
          {
            name: '客单价',
            num: thousandFormatter(this.dataInfo.averagePayAmount),
            dayRatio: this.dataInfo.averagePayAmountChainDay,
            weekRatio: this.dataInfo.averagePayAmountBasisWeek
          }
        ]
        this.drawLine()
        this.drawLineTwo()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-data {
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
