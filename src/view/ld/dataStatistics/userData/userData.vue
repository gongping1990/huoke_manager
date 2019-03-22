<template>
  <div class="p-data" id="dataCenter">
    <Row class="g-flex-a-j-center" :gutter="10" style="width:70%">
      <Col v-for="(item,index) of titleList" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div>{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <Card class="-p-d-col -c-tab">
      <div class="-c-tab -p-d-echart">
        <div ref="echart" class="-p-c-content"></div>
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
    name: 'userData',
    data() {
      return {
        radioType: '1',
        isFetching: false,
        dataInfo: '',
        titleList: [],
      }
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.dataInfo.monthData) {
          arrayX.push(item.date)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          incrPV: [],
          incrUV: []
        }
        for (let item of this.dataInfo.monthData) {
          dataList.incrPV.push(item.incrPV)
          dataList.incrUV.push(item.incrUV)
        }
        let optionSeriesLine = [
          {
            name: 'PV',
            type: 'line',
            data: dataList.incrPV
          },
          {
            name: 'UV',
            type: 'line',
            data: dataList.incrUV
          }
        ]
        return optionSeriesLine
      }
    },
    mounted() {
      // this.getList()
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
                name: 'PV',
                icon: 'circle'
              },
              {
                name: 'UV',
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
            top:'13%',
            right: '5%'
          },
          yAxis: {
            name: '单位（人）'
          },
          series: this.optionSeriesLine,
          color: ['#49a9ee', '#98d87d'],
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
      changeRadio() {
        this.initData()
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
        this.$api.dataStatistics.getStaticToday()
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
        this.titleList = [
          {
            name: '今日访问用户（PV）',
            num: this.dataInfo.allPV
          },
          {
            name: '今日分享次数',
            num: this.dataInfo.allUV
          },
          {
            name: '今日人均分享次数',
            num: this.dataInfo.incrPV
          }
        ]
        this.drawLine()
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

      .-p-d-echart{
        width: 100%;
      }

      .-p-c-content{
        width: 100%;
        height:450px;
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
