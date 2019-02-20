<template>
  <div class="p-data" id="dataCenter">
    <Row class="g-flex-a-j-center" :gutter="10">
      <Col v-for="(item,index) of titleList" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div class="-col-name">{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <Row class="g-flex-a-j-center" :gutter="10" style="margin-top: 20px">
      <Col v-for="(item,index) of titleListTwo" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div class="-col-name">{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <Card class="-p-d-col -c-tab">
      <div class="-c-tab -p-d-echart">
        <div ref="echart" class="-p-c-content"></div>
      </div>
    </Card>

    <Row class="g-flex-a-j-center" :gutter="10" style="margin-top: 20px;width: 70%">
      <Col v-for="(item,index) of titleListThree" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div class="-col-name">{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <Card class="-p-d-col -c-tab">
      <div class="-c-tab -p-d-echart">
        <div ref="echartThree" class="-p-c-content"></div>
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
    name: 'userData2',
    data() {
      return {
        radioType: '1',
        isFetching: false,
        dataInfo: '',
        titleList: [],
        titleListTwo: [],
        titleListThree: []
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
      dateTypesLineThree() {
        let arrayX = []
        for (let item of this.dataInfo.monthDataIncr) {
          arrayX.push(item.date)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          numUser: [],
          numTask: [],
          numNotice: [],
          numCard: [],
          todayPv: []
        }
        for (let item of this.dataInfo.monthData) {
          dataList.numUser.push(item.numUser)
          dataList.todayPv.push(item.todayPv)
          dataList.numTask.push(item.numTask)
          dataList.numNotice.push(item.numNotice)
          dataList.numCard.push(item.numCard)
        }
        let optionSeriesLine = [
          {
            name: '页面访问量',
            type: 'line',
            data: dataList.todayPv
          },
          {
            name: '访问用户',
            type: 'line',
            data: dataList.numUser
          },
          {
            name: '加入计划用户',
            type: 'line',
            data: dataList.numTask
          },
          {
            name: '开启通知用户',
            type: 'line',
            data: dataList.numNotice
          },
          {
            name: '打卡用户',
            type: 'line',
            data: dataList.numCard
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineThree() {
        let dataList = {
          numUser: [],
          numTask: [],
          numNotice: [],
          numCard: [],
          todayPv: []
        }
        for (let item of this.dataInfo.monthDataIncr) {
          dataList.numUser.push(item.numUser)
          dataList.numTask.push(item.numTask)
          dataList.numNotice.push(item.numNotice)
          dataList.numCard.push(item.numCard)
        }
        let optionSeriesLine = [
          {
            name: '今日新增注册用户',
            type: 'line',
            data: dataList.numUser
          },
          {
            name: '今日新增用户中加入计划用户',
            type: 'line',
            data: dataList.numTask
          },
          {
            name: '今日新增用户中开启通知用户',
            type: 'line',
            data: dataList.numNotice
          },
          {
            name: '今日新增用户中打卡用户',
            type: 'line',
            data: dataList.numCard
          }
        ]
        return optionSeriesLine
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
            textStyle: {
              align: 'left'
            }
          },
          legend: {
            data: [
              {
                name: '页面访问量',
                icon: 'circle'
              },
              {
                name: '访问用户',
                icon: 'circle'
              },
              {
                name: '加入计划用户',
                icon: 'circle'
              },
              {
                name: '开启通知用户',
                icon: 'circle'
              },
              {
                name: '打卡用户',
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
      drawLineThree() {
        let self = this;
        let myChart = echarts.init(this.$refs.echartThree);
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
                name: '今日新增注册用户',
                icon: 'circle'
              },
              {
                name: '今日新增用户中加入计划用户',
                icon: 'circle'
              },
              {
                name: '今日新增用户中开启通知用户',
                icon: 'circle'
              },
              {
                name: '今日新增用户中打卡用户',
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
            data: this.dateTypesLineThree
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
      getList() {
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.dataCenter.getPrepStatisticsData()
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
            name: '累计页面访问量',
            num: this.dataInfo.allPV
          },
          {
            name: '累计注册用户',
            num: this.dataInfo.allUV
          },
          {
            name: '累计加入计划用户',
            num: this.dataInfo.taskNum
          },
          {
            name: '累计开启通知用户',
            num: this.dataInfo.noticeNum
          },
          {
            name: '累计打卡人次',
            num: this.dataInfo.cardNum
          }
        ]
        this.titleListTwo = [
          {
            name: '今日页面访问量',
            num: this.dataInfo.todayPV
          },
          {
            name: '今日访问用户',
            num: this.dataInfo.todayUV
          },
          {
            name: '今日访问用户中加入计划用户',
            num: this.dataInfo.taskToday
          },
          {
            name: '今日访问用户中开启通知用户',
            num: this.dataInfo.noticeToday
          },
          {
            name: '今日访问用户中打卡用户',
            num: this.dataInfo.cardToday
          }
        ]
        this.titleListThree = [
          {
            name: '今日新增注册用户',
            num: this.dataInfo.todayNewUV
          },
          {
            name: '今日新增用户中加入计划用户',
            num: this.dataInfo.taskNewToday
          },
          {
            name: '今日新增用户中开启通知用户',
            num: this.dataInfo.noticeNewToday
          },
          {
            name: '今日新增用户中打卡用户',
            num: this.dataInfo.cardNewToday
          }
        ]
        this.drawLine()
        this.drawLineThree()
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

      .-col-name{
        min-width: 100px;
        height: 42px;
      }

      .-col-num {
        font-size: 25px;
        font-weight: bold;
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
