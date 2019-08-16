<template>
  <div class="p-dataBoard">
    <Card class="-p-d-col">
      <Row class="p-dataBoard-notice -c-tab">
        <Col :span="12" class="g-t-left">
          <img class="-img" src="../../../assets/images/index-label-icon-tips.png"/>
          <span>截止2019-7-26  19:53:52，未分配作业累计已达50条，请及时调度分配</span>
        </Col>
        <Col :span="12" class="g-text-right">
          <span class="-text" @click="openModal(1)">预警历史</span>
          <span class="-text" @click="openModal(2)">订阅通知短信</span>
        </Col>
      </Row>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio label="1">今日</Radio>
          <Radio label="2">本周</Radio>
          <Radio label="3">本月</Radio>
        </Radio-group>
      </Row>

      <Row class="p-dataBoard-flex">
        <Col :span="4">
          <Card class="-item-wrap">
            <div class="-item-wrap-top">
              <div class="-name-left">作业总量</div>
            </div>
            <div class="-item-wrap-center">28/23</div>
            <div class="-item-wrap-down">25%</div>
          </Card>
        </Col>

        <Col :span="4">
          <Card class="-item-wrap">
            <div class="-item-wrap-top">
              <div class="-name-left">重交</div>
            </div>
            <div class="-item-wrap-center">28/23</div>
            <div class="-item-wrap-down">25%</div>
          </Card>
        </Col>

      </Row>

      <!--<div class="-c-tab -p-d-echart">-->
        <!--<div ref="echart" class="-p-c-content"></div>-->
      <!--</div>-->
    </Card>

    <Modal
      class="p-dataBoard"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      footer-hide
      width="700"
      :title="'预警历史'">
      <div v-if="modelType === 1">
        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
      </div>

    </Modal>

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
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        totalDetail: 0,
        radioType: '1',
        modelType: '1',
        isFetching: false,
        isOpenModal: false,
        dataInfo: '',
        titleList: [],
        detailList: [],
        columnsModal: [
          {
            title: '时间',
            key: 'date',
            align: 'center'
          },
          {
            title: '消息内容',
            key: 'pv',
            align: 'center'
          },
          {
            title: '接收电话',
            key: 'uv',
            align: 'center'
          }
        ]
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
      openModal (num) {
        this.modelType = +num
        this.isOpenModal = true
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
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
            textStyle:{
              align:'left'
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
              num: this.dataInfo.allUser,
              dayRatio: this.dataInfo.allUserChainDay,
              weekRatio: this.dataInfo.allUserBasisWeek
            },
            {
              name: '新增用户',
              num: this.dataInfo.newUser,
              dayRatio: this.dataInfo.newUserChainDay,
              weekRatio: this.dataInfo.newUserBasisWeek
            },
            {
              name: '活跃用户',
              num: this.dataInfo.activeUser,
              dayRatio: this.dataInfo.activeUserChainDay,
              weekRatio: this.dataInfo.activeUserBasisWeek
            }
          ]

        } else {
          this.titleList = [
            {
              name: '累计付费用户',
              num: this.dataInfo.allPayUser,
              dayRatio: this.dataInfo.allPayUserChainDay,
              weekRatio: this.dataInfo.allPayUserBasisWeek
            },
            {
              name: '付费用户',
              num: this.dataInfo.payUser,
              dayRatio: this.dataInfo.payUserChainDay,
              weekRatio: this.dataInfo.payUserBasisWeek
            },
            {
              name: '活跃付费用户',
              num: this.dataInfo.activePayUser,
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
  .p-dataBoard {
    &-notice {
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid #eaeaeb;
      border-radius: 4px;

      .-img {
        margin-right: 10px;
        width: 20px;
      }

      .-text {
        cursor: pointer;
        padding: 0 5px;
        color: #3399FF;
      }
    }

    &-flex {
      display: flex;
      margin-top: 20px;

      .-item-wrap {
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;

        &-top {
          display: flex;
          justify-content: space-between;

          .-name-left {
            font-size: 16px;
          }

          .-name-right {
            cursor: pointer;
            font-weight: normal;
            color: #5444e4;
          }
        }

        &-center {
          margin: 2px 0;
          font-size: 18px;
          display: flex;
          justify-content: center;
        }
      }
    }

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
