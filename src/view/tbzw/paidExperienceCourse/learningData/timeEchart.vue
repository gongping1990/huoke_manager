<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="700"
    title="学习分布时间">
    <Row class="g-search">
      <RadioGroup v-model="detailType" type="button" @on-change="getDetailList(1)">
        <Radio label="1">跳出分布</Radio>
        <Radio label="2">播放时长分布</Radio>
      </RadioGroup>
    </Row>

    <div class="-c-tab p-detailModal-echart">
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
        searchInfo: {},
        detailType: '1',
        chartInfo: '',
        isOpenDetail: false,
        isFetching: false,
      }
    },
    computed: {
      dateTypesLine() {
        let arrayX = []
        for (let item of this.dataInfo) {
          arrayX.push(item.day)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          orderUser: [],
          payedMoney: [],
          payedUser: [],
          pv: [],
          uv: []
        }
        for (let item of this.dataInfo) {
          dataList.orderUser.push(item.orderUser)
          dataList.payedMoney.push(item.payedMoney)
          dataList.payedUser.push(item.payedUser)
          dataList.pv.push(item.pv)
          dataList.uv.push(item.uv)
        }
        let optionSeriesLine = [
          {
            name: '商品页面访问数量',
            type: 'line',
            data: dataList.pv
          },
          {
            name: '商品页面访问用户',
            type: 'line',
            data: dataList.uv
          },
          {
            name: '下单用户',
            type: 'line',
            data: dataList.orderUser
          },
          {
            name: '付费用户',
            type: 'line',
            data: dataList.payedUser
          },
          {
            name: '付费金额',
            type: 'line',
            data: dataList.payedMoney
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
                name: '商品页面访问数量',
                icon: 'circle'
              },
              {
                name: '商品页面访问用户',
                icon: 'circle'
              },
              {
                name: '下单用户',
                icon: 'circle'
              },
              {
                name: '付费用户',
                icon: 'circle'
              },
              {
                name: '付费金额',
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
      getList() {
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.$api.jsdJob.listHomeWorkLog({
          workId: this.dataInfo.workId,
          courseId: this.dataInfo.appId,
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
