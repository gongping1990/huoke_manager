<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="700"
    title="学习分布时间">
    <div class="p-detailModal-echart">
      <div ref="echart" class="-echart-content"></div>
    </div>
  </Modal>
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

  export default {
    name: 'timeEchart',
    props: ['value', 'dataInfo'],
    data () {
      return {
        chartInfo: [],
        isOpenDetail: false,
        isFetching: false,
      }
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.chartInfo) {
          arrayX.push(item.minute)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          outUserCount: [],
        }
        for (let item of this.chartInfo) {
          dataList.outUserCount.push(item.outUserCount)
        }
        let optionSeriesLine = [
          {
            type: 'line',
            data: dataList.outUserCount
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {

    },
    watch: {
      value (_n) {
        this.isOpenDetail = _n
        _n && this.getList()
      },
    },
    methods: {
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
            right: '5%'
          },
          xAxis: {
            name: '跳出时间(分钟)',
            boundaryGap: false,
            axisTick: {
              alignWithLabel: true
            },
            data: this.dateTypesLine
          },
          grid: {
            left: '6%',
            top: '13%',
            right: '15%'
          },
          yAxis: {
            name: '跳出人次'
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
      getList() {
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.$api.tbzwStudyRecordData.getCourseQualityOutData({
          date: this.dataInfo.date,
          lessonId: this.dataInfo.id,
        }).then(response => {
          this.chartInfo = response.data.resultData
          this.drawLine()
        })
      },
      closeModal () {
        this.isOpenDetail = false
        this.$emit('input', false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-detailModal{

    &-echart {
      width: 100%;

      .-echart-content {
        width: 100%;
        height: 450px;
        /*background-color: red;*/
        /*overflow: hidden;*/
      }
    }

    &-radio {
      text-align: center;
      width: 100%;
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

  }
</style>
