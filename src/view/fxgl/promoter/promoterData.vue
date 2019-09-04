<template>
  <div class="p-promoterData">
    <Row class="g-search">
      <Col :span="3" class="g-flex-a-j-center -s-radio">
        <div class="-search-select-text-two">课程名称：</div>
        <Select v-model="searchInfo.name" @on-change="changeChannel" class="-search-selectOne">
          <Option label="全部" value="-1"></Option>
          <Option label="小语轻作文" value="7"></Option>
          <Option label="每日一首古诗词" value="8"></Option>
        </Select>
      </Col>
      <Col :span="3" class="g-flex-a-j-center -s-radio">
        <div class="-search-select-text-two">推广方式：</div>
        <Select v-model="searchInfo.mode" @on-change="changeChannel" class="-search-selectOne">
          <Option label="全部" value="-1"></Option>
          <Option label="直接邀请" value="1"></Option>
          <Option label="开团邀请" value="2"></Option>
          <Option label="海报邀请" value="3"></Option>
        </Select>
      </Col>
    </Row>

    <div class="p-promoterData-title">累计数据</div>

    <Row class="g-search">
      <Col :span="4" class="g-t-left">
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectTypeTwo" class="-search-selectOne" @on-change="changeTimeTwo">
            <Option label='全部' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
        </div>
      </Col>
      <Col :span="8" class="g-flex-a-j-center">
        <date-picker-template v-if="selectTypeTwo===2" :dataInfo="dateOption"
                              @changeDate="changeDateTwo"></date-picker-template>
      </Col>
    </Row>

    <Row class="p-promoterData-flex" :gutter="10" style="margin-top: 20px">
      <Col v-for="(item,index) of titleList" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div class="-col-name">{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <div class="p-promoterData-title">实时数据</div>

    <Row class="p-promoterData-flex" :gutter="10" style="margin-top: 20px">
      <Col v-for="(item,index) of titleListTwo" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div class="-col-name">{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <div class="p-promoterData-title">今日数据</div>

    <Row class="p-promoterData-flex" :gutter="10" style="margin-top: 20px">
      <Col v-for="(item,index) of titleListTwo" :key="index" class="-p-d-col">
        <Card class="g-t-left">
          <div class="-col-name">{{item.name}}</div>
          <div class="-col-num">{{item.num}}</div>
        </Card>
      </Col>
    </Row>

    <div class="p-promoterData-title">趋势数据</div>

    <Row class="g-search">
      <Col :span="4" class="g-t-left">
        <div class="g-flex-a-j-center">
          <div class="-search-select-text">日期查询：</div>
          <Select v-model="selectTypeThree" class="-search-selectOne" @on-change="changeTimeThree">
            <Option label='最近一月' :value="1"></Option>
            <Option label='自定义' :value="2"></Option>
          </Select>
        </div>
      </Col>
      <Col :span="8" class="g-flex-a-j-center">
        <date-picker-template v-if="selectTypeThree===2" :dataInfo="dateOption"
                              @changeDate="changeDateThree"></date-picker-template>
      </Col>
    </Row>

    <Card class="-c-tab">
      <div class="-c-tab -p-d-echart">
        <div ref="echart" class="-p-c-content"></div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'
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
    name: 'fxgl_promoterData',
    components: {DatePickerTemplate},
    data() {
      return {
        searchInfo: {
          name: '-1',
          mode: '-1'
        },
        radioType: '0',
        selectTypeTwo: 1,
        selectTypeThree: 1,
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
        todayInfo: '',
        totalInfo: '',
        selectTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        getStartTimeThree: '',
        getStartTimeTwo: '',
        getEndTimeThree: '',
        getEndTimeTwo: '',
        titleList: [],
        titleListTwo: [],
        titleListThree: [],
        channelList: []
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
      this.getChannelList()
    },
    methods: {
      changeTimeTwo () {
        if(this.selectTypeTwo == 1) {
          this.getTotalInfo()
        }
      },
      changeTimeThree () {
        if(this.selectTypeThree == 1) {
          this.getList()
        }
      },
      changeChannel () {
        this.getTotalInfo()
        this.getTodayInfo()
        this.getList()
      },
      changeDateTwo(data) {
        this.getStartTimeTwo = data.startTime
        this.getEndTimeTwo = data.endTime
        this.getTotalInfo()
      },
      changeDateThree(data) {
        this.getStartTimeThree = data.startTime
        this.getEndTimeThree = data.endTime
        this.getList()
      },
      getChannelList() {
        this.$api.composition.listByChannel({
          current: 1,
          size: 10000
        })
          .then(
            response => {
              this.channelList = response.data.resultData.records;
              this.channelList.unshift({
                id: '0',
                name: '全部'
              })
              this.getList()
              this.getTodayInfo()
              this.getTotalInfo()
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

        this.isFetching = true
        this.$api.composition.userStatisticsLineChart({
          chId: this.radioType,
          begin: this.getStartTimeThree && new Date(this.getStartTimeThree).getTime(),
          end: this.getEndTimeThree && new Date(this.getEndTimeThree).getTime()
        })
          .then(
            response => {
              this.dataInfo = response.data.resultData;
              this.drawLine()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getTodayInfo() {
        this.$api.composition.userStatisticsToday({
          chId: this.radioType
        }).then(
          response => {
            this.todayInfo = response.data.resultData;
            this.initData()
          })
      },
      getTotalInfo() {
        this.$api.composition.userStatisticsTotal({
          chId: this.radioType,
          begin: this.getStartTimeTwo && new Date(this.getStartTimeTwo).getTime(),
          end: this.getEndTimeTwo && new Date(this.getEndTimeTwo).getTime()
        }).then(
          response => {
            this.totalInfo = response.data.resultData;
            this.initData()
          })
      },
      initData() {
        this.titleList = [
          {
            name: '累计页面访问量',
            num: this.totalInfo.pv
          },
          {
            name: '累计访问用户',
            num: this.totalInfo.uv
          },
          {
            name: '累计下单用户',
            num: this.totalInfo.uv
          },
          {
            name: '累计付费用户',
            num: this.totalInfo.uv
          },
          {
            name: '累计付费金额',
            num: this.totalInfo.uv
          },
          {
            name: '直接邀请累计分享次数',
            num: this.totalInfo.uv
          },
          {
            name: '开团邀请累计分享次数',
            num: this.totalInfo.uv
          },
          {
            name: '海报邀请累计分享次数',
            num: this.totalInfo.orderUser
          },
          {
            name: '推广人累计收益',
            num: this.totalInfo.orderUser
          },
          {
            name: '推广人累计提现',
            num: this.totalInfo.orderUser
          }
        ]
        this.titleListTwo = [
          {
            name: '今日页面访问量',
            num: this.todayInfo.pv
          },
          {
            name: '今日访问用户',
            num: this.todayInfo.uv
          },
          {
            name: '今日下单用户',
            num: this.todayInfo.uv
          },
          {
            name: '今日付费用户',
            num: this.todayInfo.uv
          },
          {
            name: '今日付费金额',
            num: this.todayInfo.uv
          },
          {
            name: '今日直接邀请分享次数',
            num: this.todayInfo.uv
          },
          {
            name: '今日开团邀请分享次数',
            num: this.todayInfo.uv
          },
          {
            name: '今日海报邀请分享次数',
            num: this.todayInfo.uv
          },
          {
            name: '推广人今日收益',
            num: this.todayInfo.uv
          },
          {
            name: '推广人今日提现',
            num: this.todayInfo.uv
          }
        ]

        this.titleListThree = [
          {
            name: '推广人当前收益余额',
            num: this.todayInfo.pv
          },
          {
            name: '推广人当前可提现金额',
            num: this.todayInfo.uv
          },
          {
            name: '推广人当前冻结金额',
            num: this.todayInfo.orderUser
          }
        ]
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-promoterData {

    &-flex {
      display: flex;
      flex-flow: wrap;
    }

    &-title {
      font-size: 20px;
      font-weight: bold;
      text-align: left;
      margin: 10px 0;
    }
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
      text-align: left;
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
      text-align: left;
    }
    .-s-radio {
      min-width: 240px;
    }

    .-p-d-col {
      width: 20%;
      margin-bottom: 20px;
      .-col-name {
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
