<template>
  <div class="p-data" id="dataCenter">
    <Row class="g-flex-a-j-center -c-tab" :gutter="10" style="width:70%">
      <Col v-for="(item,index) of titleList" :key="index" class="-p-d-col">
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
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio label="1">普通用户</Radio>
          <Radio label="2">付费用户</Radio>
        </Radio-group>
      </Row>

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
        for (let item of this.dataInfo.data) {
          arrayX.push(item.date)
        }
        return arrayX
      },
      optionSeriesLine() {
        let dataList = {
          one: [],
          two: [],
          three: []
        }
        for (let item of this.dataInfo.data) {
          if(this.radioType === '1') {
            dataList.one.push(item.allUser)
            dataList.two.push(item.newUser)
            dataList.three.push(item.activeUser)
          } else {
            dataList.one.push(item.allPayUser)
            dataList.two.push(item.payUser)
            dataList.three.push(item.activePayUser)
          }
        }
        let optionSeriesLine = [
          {
            name: this.radioType === '1' ? '累计用户' : '累计付费用户',
            type: 'line',
            data: dataList.one
          },
          {
            name: this.radioType === '1' ? '新增用户' : '付费用户',
            type: 'line',
            data: dataList.two
          },
          {
            name: this.radioType === '1' ? '活跃用户' : '活跃付费用户',
            type: 'line',
            data: dataList.three
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
            }
          },
          legend: {
            data: [
              {
                name: this.radioType === '1' ? '累计用户' : '累计付费用户',
                icon: 'circle'
              },
              {
                name: this.radioType === '1' ? '新增用户' : '付费用户',
                icon: 'circle'
              },
              {
                name: this.radioType === '1' ? '活跃用户' : '活跃付费用户',
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
        if (this.radioType == '1') {
          this.titleList = [
            {
              name: '累计用户',
              num: thousandFormatter(this.dataInfo.allUser),
              dayRatio: this.dataInfo.allUserChainDay,
              weekRatio: this.dataInfo.allUserBasisWeek
            },
            {
              name: '新增用户',
              num: thousandFormatter(this.dataInfo.newUser),
              dayRatio: this.dataInfo.newUserChainDay,
              weekRatio: this.dataInfo.newUserBasisWeek
            },
            {
              name: '活跃用户',
              num: thousandFormatter(this.dataInfo.activeUser),
              dayRatio: this.dataInfo.activeUserChainDay,
              weekRatio: this.dataInfo.activeUserBasisWeek
            }
          ]

        } else {
          this.titleList = [
            {
              name: '累计付费用户',
              num: thousandFormatter(this.dataInfo.allPayUser),
              dayRatio: this.dataInfo.allPayUserChainDay,
              weekRatio: this.dataInfo.allPayUserBasisWeek
            },
            {
              name: '付费用户',
              num: thousandFormatter(this.dataInfo.payUser),
              dayRatio: this.dataInfo.payUserChainDay,
              weekRatio: this.dataInfo.payUserBasisWeek
            },
            {
              name: '活跃付费用户',
              num: thousandFormatter(this.dataInfo.activePayUser),
              dayRatio: this.dataInfo.activePayUserChainDay,
              weekRatio: this.dataInfo.activePayUserBasisWeek
            }
          ]
        }
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
