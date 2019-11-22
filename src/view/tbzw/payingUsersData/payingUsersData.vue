<template>

  <div class="p-payingUsersData">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.courseId" type="button" @on-change="changeCourse()">
          <Radio :label=1>小语轻作文</Radio>
          <Radio :label=2>乐小狮作文</Radio>
        </Radio-group>
      </Row>

      <div class="p-payingUsersData g-tab">
        <div class="p-payingUsersData-wrap">
          <div class="p-payingUsersData-title">
            <div>上课数据 - 今日数据</div>
            <div>
              <DatePicker type="date" v-model="searchInfo.dateOne" placeholder="请选择日期"
                          @on-change="listSituationOfLearn"></DatePicker>
            </div>
          </div>
          <Table class="g-tab" :loading="isFetching" :columns="columnsOne" :data="dataListOne"></Table>
        </div>
        <div class="p-payingUsersData-wrap">
          <div class="p-payingUsersData-title">
            <div>
              <span class="-text">上课趋势</span>
              <Select v-model="searchInfo.selectTypeThree" class="-search-selectOne"
                      @on-change="listSituationOfLearnLineChart">
                <Option v-for="(item, index) of userNameList" :key="index" :label='item.name' :value="item.id"></Option>
              </Select>
            </div>
            <div class="p-payingUsersData-selectTime">
              <date-picker-template v-if="searchInfo.selectTypeOne===2" :dataInfo="dateOption"
                                    @changeDate="changeDateOne"></date-picker-template>
              <Select v-model="searchInfo.selectTypeOne" class="-search-selectOne">
                <Option label='最近一个月' :value="1"></Option>
                <Option label='自定义' :value="2"></Option>
              </Select>
            </div>
          </div>
          <div class="g-tab p-payingUsersData-echart">
            <div ref="echart" class="-echart-content"></div>
          </div>
        </div>
        <div class="p-payingUsersData-wrap">
          <div class="p-payingUsersData-title">
            <div>未完课用户播放情况 - 今日数据</div>
            <div>
              <DatePicker type="date" v-model="searchInfo.dateTwo" placeholder="请选择日期"
                          @on-change="getUserPlayOfUnfinished"></DatePicker>
            </div>
          </div>
          <Table class="g-tab" :loading="isFetching" :columns="columnsTwo" :data="dataListTwo"></Table>
        </div>
        <div class="p-payingUsersData-wrap">
          <div class="p-payingUsersData-title">
            未完课用户播放时间分布
          </div>
          <div class="g-tab p-payingUsersData-echart">
            <div ref="echartTwo" class="-echart-content"></div>
          </div>
        </div>
        <div class="p-payingUsersData-wrap">
          <div class="p-payingUsersData-title">
            <div>流失情况 - 今日数据</div>
            <div>
              <DatePicker type="date" v-model="searchInfo.dateThree" placeholder="请选择日期"
                          @on-change="getUserLossDataByDay"></DatePicker>
            </div>
          </div>
          <Table class="g-tab" :loading="isFetching" :columns="columnsThree" :data="dataListThree"></Table>
        </div>
        <div class="p-payingUsersData-wrap">
          <div class="p-payingUsersData-title">
            <div>流失情况 - 累计数据</div>
            <div class="g-flex-a-j-center">
              <date-picker-template v-if="searchInfo.selectTypeTwo===2" :dataInfo="dateOption"
                                    @changeDate="changeDateTwo"></date-picker-template>
              <Select v-model="searchInfo.selectTypeTwo" class="-search-selectOne">
                <Option label='全部' :value="1"></Option>
                <!--<Option label='自定义' :value="2"></Option>-->
              </Select>
            </div>
          </div>
          <Table class="g-tab" :loading="isFetching" :columns="columnsThree" :data="dataListFour"></Table>
        </div>
      </div>
    </Card>
  </div>


</template>

<script>
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
    name: 'tbzw_payingUsersData',
    components: {DatePickerTemplate},
    data() {
      return {
        isFetching: false,
        isOpenModal: false,
        searchInfo: {
          courseId: 1,
          dateOne: new Date(),
          dateTwo: new Date(),
          dateThree: new Date(),
          dateFour: new Date(),
          selectTypeOne: 1,
          selectTypeTwo: 1,
          selectTypeThree: '3'
        },
        dateOption: {
          name: '',
          type: 'datetime'
        },
        courseList: [
          {
            id: '1',
            name: '小语轻作文'
          },
          {
            id: '2',
            name: '乐小狮作文'
          }
        ],
        userNameList: [
          {
            id: '1',
            name: '今日新增付费用户'
          },
          {
            id: '2',
            name: '7日内新增付费用户'
          },
          {
            id: '3',
            name: '全部付费用户'
          }
        ],
        dataListOne: [],
        dataListTwo: [],
        dataListThree: [],
        dataListFour: [],
        chartOne: [],
        chartTwo: [],
        getStartTimeOne: '',
        getEndTimeOne: '',
        columnsOne: [
          {
            title: '用户',
            render: (h, params)=> {
              return h('div', this.userNameList[params.row.type-1].name)
            },
            key: 'type',
            align: 'center'
          },
          {
            title: '用户数',
            key: 'userNums',
            align: 'center'
          },
          {
            title: '排课人数',
            key: 'arrangeNums',
            align: 'center'
          },
          {
            title: '上课人数',
            key: 'learnNums',
            align: 'center'
          },
          {
            title: '排课当天上课人数',
            key: 'arrangeToLearnNums',
            align: 'center'
          },
          {
            title: '完课人数',
            key: 'completeNums',
            align: 'center'
          },
          {
            title: '排课当天完课人数',
            key: 'arrangeToCompleteNums',
            align: 'center'
          },
          {
            title: '交作业人数',
            key: 'workNums',
            align: 'center'
          },
          {
            title: '完课-交作业比例',
            key: 'ratio',
            align: 'center'
          },
          {
            title: '完课且交作业人数',
            key: 'completeToWorkNums',
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '排课当天上课但未完课用户',
            key: 'userNums',
            align: 'center'
          },
          {
            title: '播放次数',
            key: 'plays',
            align: 'center'
          },
          {
            title: '人均播放次数',
            key: 'avgPlays',
            align: 'center'
          },
          {
            title: '次均播放时长（分钟）',
            key: 'durAvgPlays',
            render: (h, params) => {
              return h('div', params.row.durAvgPlays ? dayjs(+params.row.durAvgPlays).format("mm:ss") : 0)
            },
            align: 'center'
          }
        ],
        columnsThree: [
          {
            title: '流失用户数',
            key: 'lossNums',
            align: 'center'
          },
          {
            title: '人均排课数',
            key: 'avgArranges',
            align: 'center'
          },
          {
            title: '人均上课数',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '提示信息',
                  placement: 'right',
                  transfer: true
                }
              }, [
                h('div', {
                  style: {
                    color: '#3399FF'
                  }
                }, `${params.row.avgLearns}(${params.row.avgLearnsRatio}%)`),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', '百分比分母为“人均排课数”')
                ])
              ])
            },
            align: 'center'
          },
          {
            title: '人均完课数',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '提示信息',
                  placement: 'right',
                  transfer: true
                }
              }, [
                h('div', {
                  style: {
                    color: '#3399FF'
                  }
                }, `${params.row.avgStudyeds}(${params.row.avgStudyedsRatio}%)`),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', '百分比分母为“人均排课数”')
                ])
              ])
            },
            align: 'center'
          },
          {
            title: '人均交作业数',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  title: '提示信息',
                  placement: 'right',
                  transfer: true
                }
              }, [
                h('div', {
                  style: {
                    color: '#3399FF'
                  }
                }, `${params.row.avgWorks}(${params.row.avgWorksRatio}%)`),
                h('div', {
                  slot: 'content'
                }, [
                  h('div', '百分比分母为“人均排课数”')
                ])
              ])
            },
            align: 'center'
          },
          {
            title: '占全部付费用户比',
            render: (h, params) => {
              return h('div', `${params.row.ratio}%`)
            },
            align: 'center'
          }
        ],
      };
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.chartOne) {
          arrayX.push(item.time)
        }
        return arrayX
      },
      dateTypesLineTime() {
        let arrayX = []
        for (let item of this.chartTwo) {
          arrayX.push(item.time)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          userNums: [],
          arrangeNums: [],
          learnNums: [],
          arrangeToLearnNums: [],
          completeNums: [],
          arrangeToCompleteNums: [],
          workNums: [],
          completeToWorkNums: [],
        }
        for (let item of this.chartOne) {
          dataList.userNums.push(item.userNums)
          dataList.arrangeNums.push(item.arrangeNums)
          dataList.learnNums.push(item.learnNums)
          dataList.arrangeToLearnNums.push(item.arrangeToLearnNums)
          dataList.completeNums.push(item.completeNums)
          dataList.arrangeToCompleteNums.push(item.arrangeToCompleteNums)
          dataList.workNums.push(item.workNums)
          dataList.completeToWorkNums.push(item.completeToWorkNums)
        }
        let optionSeriesLine = [
          {
            name: '用户数',
            type: 'line',
            data: dataList.userNums
          },
          {
            name: '排课人数',
            type: 'line',
            data: dataList.arrangeNums
          },
          {
            name: '上课人数',
            type: 'line',
            data: dataList.learnNums
          },
          {
            name: '排课当天上课人数',
            type: 'line',
            data: dataList.arrangeToLearnNums
          },
          {
            name: '完课人数',
            type: 'line',
            data: dataList.completeNums
          },
          {
            name: '排课当天完课人数',
            type: 'line',
            data: dataList.arrangeToCompleteNums
          },
          {
            name: '交作业人数',
            type: 'line',
            data: dataList.workNums
          },
          {
            name: '完课后交作业人数',
            type: 'line',
            data: dataList.completeToWorkNums
          }
        ]
        return optionSeriesLine
      },
      optionSeriesLineTime() {
        let dataList = {
          jumpOuts: []
        }
        for (let item of this.chartTwo) {
          dataList.jumpOuts.push(item.jumpOuts)
        }
        let optionSeriesLine = [
          {
            name: '时间分布',
            type: 'line',
            data: dataList.jumpOuts
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      this.changeCourse()
    },
    methods: {
      changeCourse() {
        this.listSituationOfLearn()
        this.listSituationOfLearnLineChart()
        this.getUserPlayOfUnfinished()
        this.getUserLossDataByDay()
        this.getUserLossData()
      },
      changeDateOne(data) {
        this.getStartTimeOne = data.startTime
        this.getEndTimeOne = data.endTime
        this.listSituationOfLearnLineChart()
      },
      changeDateTwo(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
      },
      //分页查询
      listSituationOfLearn() {
        this.isFetching = true
        this.$api.tbzwStatistics.listSituationOfLearn({
          type: this.searchInfo.courseId,
          date: dayjs(new Date(this.searchInfo.dateOne)).format('YYYY-MM-DD')
        })
          .then(
            response => {
              this.dataListOne = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listSituationOfLearnLineChart() {
        this.isFetching = true
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        this.$api.tbzwStatistics.listSituationOfLearnLineChart({
          state: this.searchInfo.selectTypeThree,
          type: this.searchInfo.courseId,
          begin: this.getStartTimeOne && new Date(this.getStartTimeOne).getTime(),
          end: this.getEndTimeOne && new Date(this.getEndTimeOne).getTime()
        })
          .then(
            response => {
              this.chartOne = response.data.resultData
              this.drawLine()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      drawLine() {
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
                name: '用户数',
                icon: 'circle'
              },
              {
                name: '排课人数',
                icon: 'circle'
              },
              {
                name: '上课人数',
                icon: 'circle'
              },
              {
                name: '排课当天上课人数',
                icon: 'circle'
              },
              {
                name: '完课人数',
                icon: 'circle'
              },
              {
                name: '排课当天完课人数',
                icon: 'circle'
              },
              {
                name: '交作业人数',
                icon: 'circle'
              },
              {
                name: '完课后交作业人数',
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
      getUserPlayOfUnfinished() {
        this.isFetching = true
        this.$api.tbzwStatistics.getUserPlayOfUnfinished({
          type: this.searchInfo.courseId,
          date: dayjs(new Date(this.searchInfo.dateTwo)).format('YYYY-MM-DD')
        })
          .then(
            response => {
              this.chartTwo = response.data.resultData.spreadList
              this.dataListTwo = [response.data.resultData]
              this.drawLineTwo()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      drawLineTwo() {
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
                name: '时间分布',
                icon: 'circle'
              }
            ],
            right: '5%'
          },
          xAxis: {
            name: '跳出时间(分钟)',
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            data: this.dateTypesLineTime
          },
          grid: {
            left: '6%',
            top: '13%',
            right: '12%'
          },
          yAxis: {
            name: '跳出人次'
          },
          series: this.optionSeriesLineTime,
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
      getUserLossDataByDay() {
        this.isFetching = true
        this.$api.tbzwStatistics.getUserLossDataByDay({
          type: this.searchInfo.courseId,
          date: dayjs(new Date(this.searchInfo.dateTwo)).format('YYYY-MM-DD')
        })
          .then(
            response => {
              this.dataListThree = [response.data.resultData]
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getUserLossData() {
        this.isFetching = true
        this.$api.tbzwStatistics.getUserLossData({
          type: this.searchInfo.courseId
        })
          .then(
            response => {
              this.dataListFour = [response.data.resultData]
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-payingUsersData {
    .-search-selectOne {
      width: 180px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      text-align: left;
    }

    &-echart {
      width: 100%;

      .-echart-content {
        width: 100%;
        height: 450px;
      }

    }

    &-wrap {
      margin-bottom: 33px;
    }

    &-selectTime {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-title {
      display: flex;
      justify-content: space-between;
      font-size: 16px;

      .-text {
        display: inline-block;
        margin-right: 10px;
      }
    }

    .-c-tips {
      color: #39f
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
