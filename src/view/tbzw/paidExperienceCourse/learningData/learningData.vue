<template>
  <div class="p-learningData">
    <div class="p-learningData-wrap">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsOne" :data="dataListOne"></Table>
    </div>
    <div class="p-learningData-wrap">
      <div class="p-learningData-title">上课情况</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="dataListTwo"></Table>
    </div>
    <div class="p-learningData-wrap">
      <div class="p-learningData-title">阶梯数据</div>

      <div class="g-t-left -c-tab">
        <Radio-group v-model="tabType" type="button" @on-change="formatData()">
          <Radio :label=1>到课率</Radio>
          <Radio :label=2>完课率</Radio>
          <Radio :label=3>完课后交作业率</Radio>
        </Radio-group>
      </div>
      <div>
        <div ref="echartOne" class="p-learningData-echart"></div>
      </div>

      <div class="g-t-left -c-tab">
        <Radio-group v-model="tabTypeTwo" type="button" @on-change="formatDataTwo()">
          <Radio :label=1>连续到课率</Radio>
          <Radio :label=2>连续完课率</Radio>
          <Radio :label=3>完课后连续交作业率</Radio>
        </Radio-group>
      </div>
      <div>
        <div ref="echartTwo" class="p-learningData-echart"></div>
      </div>
    </div>

    <xxsj_detail v-model="isOpenModal" :lessonList="dataListTwo" :dataInfo="dataItem"></xxsj_detail>
  </div>
</template>

<script>
  import Xxsj_detail from "./xxsj_detail";
  import echarts from "echarts/lib/echarts";
  import "echarts/lib/chart/funnel";
  import "echarts/lib/component/title";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/tooltip";

  export default {
    name: 'tbzw_paid_learningData',
    components: {Xxsj_detail},
    props: ['propCourseId', 'propPeriodId'],
    data() {
      return {
        isFetching: false,
        isOpenModal: false,
        isOpenModalTime: false,
        tabType: 1,
        tabTypeTwo: 1,
        dataInfo: '',
        dataItem: '',
        dataListOne: [],
        dataListLearn: [],
        dataListWork: [],
        dataListTwo: [],
        percentData: [],
        percentDataTwo: [],
        percentDataName: [],
        percentDataNameTwo: [],
        columnsTwo: [
          {
            title: '课时名称',
            key: 'lessonName',
            align: 'center'
          },
          {
            title: '课时排课时间',
            key: 'phone',
            align: 'center'
          },
          {
            title: '上课人数',
            key: 'learnUserCount',
            align: 'center'
          },
          {
            title: '到课率',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.learnPercent * 100}%`)
            },
            align: 'center'
          },
          {
            title: '完课人数',
            key: 'finishUserCount',
            align: 'center'
          },
          {
            title: '完课率',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.finishPercent * 100}%`)
            },
            align: 'center'
          },
          {
            title: '交作业人数',
            key: 'submitHomeworkUserCount',
            align: 'center'
          },
          {
            title: '交作业率',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.subHomeworkPercent * 100}%`)
            },
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toLookDetail(params.row, 2)
                    }
                  }
                }, '详情')
              ])
            },
            align: 'center'
          }
        ]
      };
    },
    computed: {
      columnsOne() {
        let array = [
          {
            title: '报名人数',
            key: 'signCount',
            align: 'center'
          }
        ]

        this.dataListLearn.forEach((item, index) => {
          array.push({
            title: `上${index + 1}课人数`,
            key: `learn${index + 1}`,
            align: 'center'
          })
        })

        this.dataListWork.forEach((item, index) => {
          array.push({
            title: `交${index + 1}次作业`,
            key: `work${index + 1}`,
            align: 'center'
          })
        })

        return array
      }
    },
    mounted() {
      // this.getList()
    },
    methods: {
      toLookDetail(data) {
        this.isOpenModal = true
        this.dataItem = data
      },
      drawLine() {
        let self = this;
        let myChart = echarts.init(this.$refs.echartOne);
        myChart.clear();
        myChart.resize();
        // 绘制图表
        myChart.setOption({
          // tooltip: {
          //   trigger: 'item'
          // },
          legend: {
            selectedMode: false,
            data: this.percentDataName
          },
          series: {
            type: 'funnel',
            minSize: '0%',
            maxSize: '100%',
            gap: 3,
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            label: {
              show: true,
              position: 'center',
              formatter: '{b}: {d}%'
            },
            data: this.percentData
          },
          color: ['#FF6F43', '#FFAB40', '#FFD54F', '#80CBC4']
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
          // tooltip: {
          //   trigger: 'item'
          // },
          legend: {
            selectedMode: false,
            data: this.percentDataNameTwo
          },
          series: {
            type: 'funnel',
            minSize: '0%',
            maxSize: '100%',
            gap: 3,
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            label: {
              show: true,
              position: 'center',
              formatter: '{b}: {d}%'
            },
            data: this.percentDataTwo
          },
          color: ['#FF6F43', '#FFAB40', '#FFD54F', '#80CBC4']
        })

        window.addEventListener("resize", () => {
          myChart.resize();
        });
        myChart.hideLoading()
      },
      //分页查询
      getList() {
        this.isFetching = true
        let myChart = echarts.init(this.$refs.echartOne);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.$api.tbzwStudyRecordData.getStudyData({
          courseId: this.propCourseId,
          activeConfigId: this.propPeriodId,
        })
          .then(
            response => {
              let dataStorage = {}
              this.dataListOne = []
              this.dataInfo = response.data.resultData
              this.dataListLearn = this.dataInfo.learnInfo;
              this.dataListWork = this.dataInfo.submitHomeWorkInfo;
              this.dataListTwo = this.dataInfo.learnHomeworkData;

              dataStorage = {
                signCount: this.dataInfo.signCount
              }

              this.dataListLearn.forEach((item, index) => {
                dataStorage[`learn${index + 1}`] = item.userCount
              })

              this.dataListWork.forEach((item, index) => {
                dataStorage[`work${index + 1}`] = item.userCount
              })

              this.dataListOne = [dataStorage]

              this.formatData()
              this.formatDataTwo()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      formatData() {
        this.percentDataName = []
        this.percentData = []
        let attrName = ['learnPercent', 'finishPercent', 'subHomeworkPercent']
        this.dataListTwo.forEach(item => {
          this.percentDataName.push({
            name: item.lessonName
          })
          this.percentData.push({
            name: item.lessonName,
            value: item[attrName[this.tabType - 1]]
          })
        })
        this.drawLine()
        // this.drawLineTwo()
      },
      formatDataTwo() {
        this.percentDataNameTwo = []
        this.percentDataTwo = []
        let attrName = ['continuousLearnCount', 'continuousFinishCount', 'continuousSubmitHomeworkCount']
        this.dataListTwo.forEach((item, index) => {

          if (index === 0) {
            this.percentDataNameTwo.push({
              name: this.tabTypeTwo === 1 ? `上第1节课` : (this.tabTypeTwo === 2 ? '完成1节课' : '交第1节课作业')
            })
            this.percentDataTwo.push({
              name: this.tabTypeTwo === 1 ? `上第1节课` : (this.tabTypeTwo === 2 ? '完成1节课' : '交第1节课作业'),
              value: item[attrName[this.tabTypeTwo - 1]] / (item[attrName[this.tabTypeTwo - 1]] ? item[attrName[this.tabTypeTwo - 1]] : 1)
            })
          }

          if (index >= 1) {
            this.percentDataNameTwo.push({
              name: this.tabTypeTwo === 1 ? `上前${index+1}节课` : (this.tabTypeTwo === 2 ? `完成前${index+1}节课` : `交前${index+1}节课作业`)
            })
            this.percentDataTwo.push({
              name: this.tabTypeTwo === 1 ? `上前${index+1}节课` : (this.tabTypeTwo === 2 ? `完成前${index+1}节课` : `交前${index+1}节课作业`),
              value: item[attrName[this.tabTypeTwo - 1]] / (this.percentDataTwo[index-1].value ? this.percentDataTwo[index-1].value : 1)
            })
          }
        })
        this.drawLineTwo()
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-learningData {

    &-wrap {
      margin-bottom: 33px;
    }

    &-title {
      text-align: left;
      font-size: 16px;
    }

    &-echart {
      margin: 0 auto;
      width: 600px;
      height: 331px;
    }

    .-c-tips {
      color: #39f
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
