<template>
  <div class="p-data" id="dataCenter">
    <Row class="g-search">
      <Col :span="3"  class="g-flex-a-j-center -s-radio">
        <div class="-search-select-text-two">渠道来源：</div>
        <Select v-model="radioType" @on-change="getList(1)" class="-search-selectOne">
          <Option v-for="(item,index) in channelList" :label="item.name" :value="item.id" :key="index"></Option>
        </Select>
      </Col>
      <Col :span="3" class="g-t-left">
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectType" class="-search-selectOne">
            <Option label='自然天' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
        </div>
      </Col>
      <Col :span="8" class="g-flex-a-j-center">
        <Date-picker class="date-time"
                     v-if="selectType===1"
                     placeholder="选择开始日期"
                     :options="dateOptionOne"
                     @on-change="changeDateOne"
                     v-model="selectTime"></Date-picker>
        <date-picker-template v-if="selectType===2" :dataInfo="dateOption"
                              @changeDate="changeDateTwo"></date-picker-template>
      </Col>
    </Row>

    <Row class="g-flex-a-j-center" :gutter="10" style="margin-top: 20px">
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
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'userData2',
    components: {DatePickerTemplate},
    data() {
      return {
        radioType: '1',
        selectType: 1,
        dateOptionOne: {
          disabledDate(date) {
            return date && date.valueOf() > (new Date().getTime() - 24 * 60 * 60 * 1000);
          }
        },
        dateOption: {
          name: '',
          type: 'datetime'
        },
        isFetching: false,
        dataInfo: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTime: '',
        getEndTime: '',
        titleList: [],
        titleListTwo: [],
        titleListThree: [],
        titleListFour: [],
        channelList: []
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
          todayUser: [],
          todayShareUser: [],
          todayShare: [],
          todayUv: []
        }
        for (let item of this.dataInfo.monthData) {
          dataList.todayUser.push(item.todayUser)
          dataList.todayUv.push(item.todayUv)
          dataList.todayShareUser.push(item.todayShareUser)
          dataList.todayShare.push(item.todayShare)
        }
        let optionSeriesLine = [
          {
            name: '页面访问量',
            type: 'line',
            data: dataList.todayUv
          },
          {
            name: '访问用户',
            type: 'line',
            data: dataList.todayUser
          },
          {
            name: '分享用户',
            type: 'line',
            data: dataList.todayShareUser
          },
          {
            name: '分享次数',
            type: 'line',
            data: dataList.todayShare
          }
        ]
        return optionSeriesLine
      },
    },
    mounted() {
      // this.getChannelList()
    },
    methods: {
      changeDateOne(data) {
        this.selectTime = data
        this.getList(1)
      },
      changeDateTwo(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.getList(1)
      },
      getChannelList() {
        this.$api.wzjh.listByChannel({
          current: 1,
          size: 10000
        })
          .then(
            response => {
              this.channelList = response.data.resultData.records;
              this.radioType = this.channelList.length && this.channelList[0].id
              this.channelList.push({
                id: '0',
                name: '其他渠道'
              })
              this.getList()
            })
          .finally(() => {
            this.isFetching = false
          })
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
                name: '分享用户',
                icon: 'circle'
              },
              {
                name: '分享次数',
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
      getList() {
        let myChart = echarts.init(this.$refs.echart);
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.isFetching = true
        this.$api.wzjh.getUserAccessStat({
          chancelId: this.radioType
        })
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
            num: this.dataInfo.totalUv
          },
          {
            name: '累计注册用户',
            num: this.dataInfo.totalUser
          },
          {
            name: '累计分享用户',
            num: this.dataInfo.totalShareUser
          },
          {
            name: '累计分享次数',
            num: this.dataInfo.totalShare
          }
        ]
        this.titleListTwo = [
          {
            name: '今日页面访问量',
            num: this.dataInfo.todayUv
          },
          {
            name: '今日访问用户',
            num: this.dataInfo.todayUser
          },
          {
            name: '今日分享用户',
            num: this.dataInfo.todayShareUser
          },
          {
            name: '今日分享次数',
            num: this.dataInfo.todayShare
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
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .date-time {
      width: 20%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-c-tab {
      margin: 20px 0;
    }
    .-search-select-text-two {
      min-width: 80px;
    }
    .-s-radio {
      min-width: 240px;
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
