<template>
  <div class="p-dataStatistics">
    <div class="p-dataStatistics-tab">
      <Tabs v-model="tabType" @on-click="changeTab(0)">
        <TabPane label="概览"></TabPane>
        <TabPane label="家长"></TabPane>
        <TabPane label="老师"></TabPane>
        <TabPane label="学生"></TabPane>
      </Tabs>
    </div>

    <div class="p-dataStatistics-wrap">
      <Card class="p-dataStatistics-card">
        <div class="p-dataStatistics-title">
          活动完成情况统计
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartThree" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card">
        <div class="p-dataStatistics-title">
          活动完成情况统计
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartThree" class="-p-c-content"></div>
        </div>
      </Card>
      <Card class="p-dataStatistics-card">
        <div class="p-dataStatistics-title">
          活动完成情况统计
        </div>
        <div class="p-dataStatistics-echart">
          <div ref="echartThree" class="-p-c-content"></div>
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'
  import echarts from 'echarts'
  import dayjs from 'dayjs'
  // 引入柱状图
  import 'echarts/src/chart/pie';
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
        tabType: 0,
        isFetching: false,
        dataInfo: '',
        dataInfoThree: '',
        todayInfo: '',
        searchInfo: '',
        titleList: [],
        titleListAll: [],
        appList: []
      }
    },
    computed: {
      // dateTypesLine() {
      //   let arrayX = []
      //   for (let item of this.dataInfo) {
      //     arrayX.push(item.date)
      //   }
      //   return arrayX
      // },
      dateTypesLineTwo() {
        let arrayX = []
        for (let item of this.dataInfo) {
          arrayX.push(item.day)
        }
        return arrayX
      },
      // optionSeriesLine() {
      //   let dataList = {
      //     subscribe: [],
      //     total: [],
      //     unsubscribe: [],
      //     newadd: [],
      //   }
      //   for (let item of this.dataInfo) {
      //     dataList.subscribe.push(item.subscribe)
      //     dataList.total.push(item.total)
      //     dataList.unsubscribe.push(item.unsubscribe)
      //     dataList.newadd.push(item.newadd)
      //   }
      //   let optionSeriesLine = [
      //     {
      //       name: '新关注人数',
      //       type: 'line',
      //       data: dataList.subscribe
      //     },
      //     {
      //       name: '取消关注人数',
      //       type: 'line',
      //       data: dataList.unsubscribe
      //     },
      //     {
      //       name: '净增关注人数',
      //       type: 'line',
      //       data: dataList.newadd
      //     },
      //     {
      //       name: '累积关注人数',
      //       type: 'line',
      //       data: dataList.total
      //     }
      //   ]
      //   return optionSeriesLine
      // },
      optionSeriesLineTwo() {
        let dataList = {
          alldayStep: [],
          dayScanSubscribe: [],
          dayjoinuser: []
        }
        for (let item of this.dataInfo) {
          dataList.alldayStep.push(item.alldayStep)
          dataList.dayScanSubscribe.push(item.dayScanSubscribe)
          dataList.dayjoinuser.push(item.dayjoinuser)
        }
        let optionSeriesLine = [
          {
            name: '新关注人数',
            type: 'line',
            data: dataList.dayScanSubscribe
          },
          {
            name: '参与人数',
            type: 'line',
            data: dataList.dayjoinuser
          },
          {
            name: '完成任务人数',
            type: 'line',
            data: dataList.alldayStep
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      this.initFun()
    },
    methods: {
      changeTab(num) {
        if (this.tabType === 1) {
          this.listAuthorizer(num)
        } else if (this.tabType === 2) {
          this.listGroupWithCount(num)
        } else {
          this.initFun()
        }
      },
      initFun() {
        // this.getList()
        this.getListTwo()
        this.subscribeCount()
        this.countActivityCompletePieChart()
      },
      // drawLine() {
      //   let self = this;
      //   let myChart = echarts.init(this.$refs.echart);
      //   myChart.clear();
      //   myChart.resize();
      //   // 绘制图表
      //   myChart.setOption({
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'line'
      //       },
      //       textStyle: {
      //         align: 'left'
      //       }
      //     },
      //     legend: {
      //       data: [
      //         {
      //           name: '新关注人数',
      //           icon: 'circle'
      //         },
      //         {
      //           name: '取消关注人数',
      //           icon: 'circle'
      //         },
      //         {
      //           name: '净增关注人数',
      //           icon: 'circle'
      //         },
      //         {
      //           name: '累积关注人数',
      //           icon: 'circle'
      //         }
      //       ],
      //       right: '5%'
      //     },
      //     xAxis: {
      //       boundaryGap: false,
      //       axisTick: {
      //         alignWithLabel: true
      //       },
      //       data: this.dateTypesLine
      //     },
      //     grid: {
      //       left: '6%',
      //       top: '13%',
      //       right: '5%'
      //     },
      //     yAxis: {
      //       name: '单位（人）'
      //     },
      //     series: this.optionSeriesLine,
      //     color: ['#1890FF', '#F5222D', '#FAAD14', '#52C41A'],
      //     dataZoom: [
      //       {
      //         type: "slider"
      //       }
      //     ],
      //   })
      //
      //   window.addEventListener("resize", () => {
      //     myChart.resize();
      //   });
      //   myChart.hideLoading()
      // },
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
                name: '新关注人数',
                icon: 'circle'
              },
              {
                name: '参与人数',
                icon: 'circle'
              },
              {
                name: '完成任务人数',
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
          color: ['#1890FF', '#F5222D', '#FAAD14'],
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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: ['推广未完成', '已完成', '参与推广']
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              data: [
                {value: this.dataInfoThree.noStage,name: '推广未完成'},
                {value: this.dataInfoThree.complete, name: '已完成'},
                {value: this.dataInfoThree.noInvite, name: '参与推广'}
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#1890FF', '#FAAD14', '#52C41A'],
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      listGroupWithCount(num) {
        this.$api.weixin.listGroupWithCount()
          .then(
            response => {
              let dataInfo = response.data.resultData
              this.appList = dataInfo.groups
              if (!num) {
                this.searchInfo = this.appList[0].id
              }
              this.initFun()
            })
      },
      listAuthorizer(num) {
        this.$api.weixin.listAuthorizer()
          .then(
            response => {
              this.appList = response.data.resultData
              this.appList.forEach(item => {
                item.name = item.nickName
              })
              if (!num) {
                this.searchInfo = this.appList[0].id
              }
              this.initFun()
            })

      },
      // getList() {
      //   let myChart = echarts.init(this.$refs.echart);
      //   myChart.showLoading({
      //     text: '图表加载中...',
      //     color: '#20a0ff',
      //     textColor: '#000',
      //     zlevel: 0
      //   })
      //
      //   this.isFetching = true
      //   this.$api.weixin.subscribeCountList({
      //     appConfigId: this.tabType === 1 ? this.searchInfo : '',
      //     planId: this.$route.query.planId,
      //     gid: this.tabType === 2 ? this.searchInfo : ''
      //   })
      //     .then(
      //       response => {
      //         this.dataInfo = response.data.resultData;
      //         this.drawLine()
      //       })
      //     .finally(() => {
      //       this.isFetching = false
      //     })
      // },
      getListTwo() {
        let myChart = echarts.init(this.$refs.echartTwo);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.activity.listActivityUserCount({
          appConfigId: this.tabType === 1 ? this.searchInfo : '',
          planId: this.$route.query.planId,
          gid: this.tabType === 2 ? this.searchInfo : ''
        })
          .then(
            response => {
              this.dataInfo = response.data.resultData;
              this.drawLineTwo()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      countActivityCompletePieChart() {
        let myChart = echarts.init(this.$refs.echartTwo);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.activity.countActivityCompletePieChart({
          appConfigId: this.tabType === 1 ? this.searchInfo : '',
          planId: this.$route.query.planId,
          gid: this.tabType === 2 ? this.searchInfo : ''
        })
          .then(
            response => {
              this.dataInfoThree = response.data.resultData;
              this.drawLineThree()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      subscribeCount() {
        this.$api.activity.getActivityUserCount({
          appConfigId: this.tabType === 1 ? this.searchInfo : '',
          planId: this.$route.query.planId,
          gid: this.tabType === 2 ? this.searchInfo : ''
        })
          .then(
            response => {
              this.todayInfo = response.data.resultData;
              this.initData()
            })
      },
      initData() {
        this.titleList = [
          {
            name: '新关注人数',
            num: this.todayInfo.dayScanSubscribe || 0,
            ratio: Math.abs(this.todayInfo.dayScanSubscribePer),
            type: this.todayInfo.dayScanSubscribe > 0,
            color: 'rgba(24,144,255,0.1)'
          },
          {
            name: '参与人数',
            num: this.todayInfo.dayjoinuser || 0,
            ratio: Math.abs(this.todayInfo.dayjoinuserPer),
            type: this.todayInfo.dayjoinuser > 0,
            color: 'rgba(245,34,45,0.1)'
          },
          {
            name: '完成任务人数',
            num: this.todayInfo.alldayStep || 0,
            ratio: Math.abs(this.todayInfo.alldayStepPer),
            type: this.todayInfo.alldayStep > 0,
            childList: [
              {
                num: this.todayInfo.dayStepOne,
                name: '一阶'
              },
              {
                num: this.todayInfo.dayStepTwo,
                name: '二阶'
              },
              {
                num: this.todayInfo.dayStepThree,
                name: '三阶'
              }
            ],
            color: 'rgba(250,173,20,0.1)'
          }
        ]
        this.titleListAll = [
          {
            name: '新关注人数',
            num: this.todayInfo.scanSubscribe || 0,
            ratio: Math.abs(this.todayInfo.scanSubscribePer),
            type: this.todayInfo.scanSubscribe > 0,
            color: 'rgba(24,144,255,0.1)'
          },
          {
            name: '参与人数',
            num: this.todayInfo.joinuser || 0,
            ratio: Math.abs(this.todayInfo.joinuserPer),
            type: this.todayInfo.joinuser > 0,
            color: 'rgba(245,34,45,0.1)'
          },
          {
            name: '完成任务人数',
            num: this.todayInfo.allstep || 0,
            ratio: Math.abs(this.todayInfo.allstepPer),
            type: this.todayInfo.allstep > 0,
            childList: [
              {
                num: this.todayInfo.stepOne,
                name: '一阶'
              },
              {
                num: this.todayInfo.stepTwo,
                name: '二阶'
              },
              {
                num: this.todayInfo.stepThree,
                name: '三阶'
              }
            ],
            color: 'rgba(250,173,20,0.1)'
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-dataStatistics {
    &-tab {
      /*background-color: #ffffff;*/
    }

    &-title {
      display: flex;
      align-items: center;
      text-align: left;
      height: 22px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;

      &::before {
        margin-right: 16px;
        content: "";
        display: inline-block;
        background: #1890FF;
        width: 4px;
        height: 16px;
        border-radius: 2px;
      }
    }

    &-wrap {
      display: flex;
      margin-top: 25px;
    }

    &-echart {
      width: 100%;

      .-p-c-content {
        width: 100%;
        height: 450px;
        /*background-color: red;*/
        /*overflow: hidden;*/
      }
    }

    &-card {
      margin-right: 20px;
    }
  }
</style>
