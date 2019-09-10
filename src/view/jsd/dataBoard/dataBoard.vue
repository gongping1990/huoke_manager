<template>
  <div class="p-dataBoard">
    <Card class="-p-d-col">
      <Row class="p-dataBoard-notice -c-tab">
        <Col :span="12" class="g-t-left">
          <img class="-img" src="../../../assets/images/index-label-icon-tips.png"/>
          <span>{{noticeMessage}}</span>
        </Col>
        <Col :span="12" class="g-text-right">
          <span class="-text" @click="openModal(1)">预警历史</span>
          <span class="-text" @click="openModal(2)">订阅通知短信</span>
        </Col>
      </Row>
      <Row class="g-t-left p-dataBoard-radio">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio label="0">今日</Radio>
          <Radio label="1">本周</Radio>
          <Radio label="2">本月</Radio>
        </Radio-group>

        <span class="-text-wrap" v-if="radioType === '0'">
          <span class="-text" @click="openModal(3)">今日老师数据</span>
          <span class="-text" @click="openModal(4)">每日数据详情</span>
        </span>
      </Row>

      <Row class="p-dataBoard-flex">
        <Col :span="4" v-for="(item,index) of cardList" :key="index">
          <Card class="-item-wrap">
            <div class="-item-wrap-top">
              <div class="-name-left">{{item.name}}</div>
            </div>
            <div class="-item-wrap-center">{{item.all}}/{{item.alone}}</div>
            <div class="-item-wrap-down" v-if="item.parent">{{item.parent}}%</div>
          </Card>
        </Col>
      </Row>

      <div class="p-dataBoard-echart">
        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">效率榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemOne.num === 0}"
                    @click="changeDate(1,0)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemOne.num === 1}"
                    @click="changeDate(1,1)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemOne.num === 2}"
                    @click="changeDate(1,2)">本月</span>
            </div>
          </div>
          <div ref="echartOne" class="-item-echart-down"></div>
        </div>

        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">完成榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemTwo.num === 0}"
                    @click="changeDate(2,0)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemTwo.num === 1}"
                    @click="changeDate(2,1)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemTwo.num === 2}"
                    @click="changeDate(2,2)">本月</span>
            </div>
          </div>
          <div ref="echartTwo" class="-item-echart-down"></div>
        </div>

        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">好评榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemThree.num === 0}"
                    @click="changeDate(3,0)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemThree.num === 1}"
                    @click="changeDate(3,1)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemThree.num === 2}"
                    @click="changeDate(3,2)">本月</span>
            </div>
          </div>
          <div ref="echartThree" class="-item-echart-down"></div>
        </div>

        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">数量榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemFour.num === 0}"
                    @click="changeDate(4,0)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemFour.num === 1}"
                    @click="changeDate(4,1)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemFour.num === 2}"
                    @click="changeDate(4,2)">本月</span>
            </div>
          </div>
          <div ref="echartFour" class="-item-echart-down"></div>
        </div>
      </div>
    </Card>

    <Modal
      class="p-dataBoard-modal"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      :footer-hide="modelType !== 2"
      width="780"
      :title="titleType[modelType]">
      <div v-if="modelType !== 2">
        <Row class="g-search" v-if="modelType === 3">
          <Col :span="10" class="g-flex-a-j-center">
            <div class="-search-select-text">日期查询：</div>
            <Date-picker class="date-time"
                         placeholder="选择日期"
                         @on-change="viewTeacherDateCount(1)"
                         v-model="checkDate"></Date-picker>
          </Col>
        </Row>

        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
      </div>

      <div v-if="modelType === 2">
        <Form ref="addInfo" :label-width="90" class="ivu-form-item-required -phone-form">
          <FormItem label="手机号码" prop="href">
            <div class="-item-wrap" v-for="(item,index) of phoneList" :key="index">
              <Input class="-input" type="text" v-model="item.phone" placeholder="请输入手机号码"></Input>
              <span class="-del" @click="delPhone(index)">删除</span>
            </div>
          </FormItem>
        </Form>

        <div class="-btn-wrap">
          <Button class="-btn" @click="addPhone()" ghost type="primary" style="width: 100px;">添加手机号</Button>
        </div>

      </div>


      <div slot="footer" class="-p-b-flex" v-if="modelType === 2">
        <Button @click="isOpenModal= false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>

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

  export default {
    name: 'userData',
    data() {
      return {
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        totalDetail: 0,
        radioType: '0',
        modelType: 2,
        isFetching: false,
        isOpenModal: false,
        noticeMessage: '',
        dataInfoOne: '',
        dataInfoTwo: '',
        dataInfoThree: '',
        dataInfoFour: '',
        titleList: [],
        titleType: {
          '1': '预警历史',
          '2': '订阅通知短信',
          '3': '今日老师数据',
          '4': '每日数据详情'
        },
        detailList: [],
        cardList: [],
        phoneList: [
          {
            phone: ''
          }
        ],
        echartList: [],
        addInfo: {},
        dataItemOne: {
          num: 0
        },
        dataItemTwo: {
          num: 0
        },
        dataItemThree: {
          num: 0
        },
        dataItemFour: {
          num: 0
        },
        myChartOne: '',
        myChartTwo: '',
        myChartThree: '',
        myChartFour: '',
        checkDate: new Date(),
      }
    },
    computed: {
      dateTypesLineOne() {
        let arrayX = []
        for (let item of this.dataInfoOne) {
          arrayX.push(item.teacherName)
        }
        return arrayX
      },
      dateTypesLineTwo() {
        let arrayX = []
        for (let item of this.dataInfoTwo) {
          arrayX.push(item.teacherName)
        }
        return arrayX
      },
      dateTypesLineThree() {
        let arrayX = []
        for (let item of this.dataInfoThree) {
          arrayX.push(item.teacherName)
        }
        return arrayX
      },
      dateTypesLineFour() {
        let arrayX = []
        for (let item of this.dataInfoFour) {
          arrayX.push(item.teacherName)
        }
        return arrayX
      },
      optionSeriesLineOne() {
        let arrayY = []
        for (let item of this.dataInfoOne) {
          arrayY.push(item.replytime)
        }
        return arrayY
      },
      optionSeriesLineTwo() {
        let arrayY = []
        for (let item of this.dataInfoTwo) {
          arrayY.push(`${(item.totalHandled / 10)}`)
        }
        return arrayY
      },
      optionSeriesLineThree() {
        let arrayY = []
        for (let item of this.dataInfoThree) {
          arrayY.push(item.good)
        }
        return arrayY
      },
      optionSeriesLineFour() {
        let arrayY = []
        for (let item of this.dataInfoFour) {
          arrayY.push(item.totalHandled)
        }
        return arrayY
      },

      columnsModal() {
        let list = []

        switch (this.modelType) {
          case 1:
            list = [
              {
                title: '时间',
                render: (h, params) => {
                  return h('div', dayjs(+params.row.gmtCreate).format('YYYY-DD-MM'))
                },
                align: 'center'
              },
              {
                title: '消息内容',
                key: 'message',
                align: 'center'
              },
              {
                title: '接收电话',
                tooltip: true,
                render: (h, params) => {
                  return h('div', params.row.phones.map((item) => {
                    return h('div', item)
                  }))
                },
                align: 'center'
              }
            ]
            break
          case 3:
            list = [
              {
                title: '老师名称',
                key: 'teacherName',
                align: 'center'
              },
              {
                title: '总量/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.total}/${p.row.totalHandled}`)
                },
                align: 'center',
              },
              {
                title: '自动分配/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.autonum}/${p.row.autoHandled}`)
                },
                align: 'center',
              },
              {
                title: '补批/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.oldnum}/${p.row.oldHandled}`)
                },
                align: 'center',
              },
              {
                title: '调度/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.allotnum}/${p.row.allotHandled}`)
                },
                align: 'center',
              },
              {
                title: '重交/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.resubmitnum}/${p.row.handleResubmit}`)
                },
                align: 'center',
              }
            ]
            break
          case 4:
            list = [
              {
                title: '时间',
                key: 'day',
                align: 'center'
              },
              {
                title: '总量/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.total}/${p.row.totalHandled}`)
                },
                align: 'center'
              },
              {
                title: '自动分配/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.autonum}/${p.row.autoHandled}`)
                },
                align: 'center'
              },
              {
                title: '补批/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.oldnum}/${p.row.oldHandled}`)
                },
                align: 'center'
              },
              {
                title: '调度/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.allotnum}/${p.row.allotHandled}`)
                },
                align: 'center'
              },
              {
                title: '重交/已处理',
                render: (h, p) => {
                  return h('div', `${p.row.resubmitnum}/${p.row.handleResubmit}`)
                },
                align: 'center'
              }
            ]
            break
        }
        return list
      }
    },
    mounted() {
      this.myChartOne = echarts.init(this.$refs.echartOne)
      this.myChartTwo = echarts.init(this.$refs.echartTwo)
      this.myChartThree = echarts.init(this.$refs.echartThree)
      this.myChartFour = echarts.init(this.$refs.echartFour)
      this.topReplytime()
      this.topHandleRate()
      this.topGood()
      this.topHandled()
      this.sumWorkJobCount()
      this.getLastActiveMessage()
    },
    methods: {
      changeDate(type, num) {
        switch (+type) {
          case 1:
            this.dataItemOne.type = type
            this.dataItemOne.num = num
            this.topReplytime()
            break
          case 2:
            this.dataItemTwo.type = type
            this.dataItemTwo.num = num
            this.topHandleRate()
            break
          case 3:
            this.dataItemThree.type = type
            this.dataItemThree.num = num
            this.topGood()
            break
          case 4:
            this.dataItemFour.type = type
            this.dataItemFour.num = num
            this.topHandled()
            break
        }
      },
      openModal(num) {
        this.phoneList = [{
          phone: ''
        }]
        this.modelType = +num
        this.isOpenModal = true
        this.modelType === 1 && this.getHistoryList()
        this.modelType === 3 && this.viewTeacherDateCount()
        this.modelType === 4 && this.listDaySumWorkJobCountByPage()
      },
      addPhone() {
        this.phoneList.push({
          phone: ''
        })
      },
      delPhone(index) {
        this.phoneList.splice(index, 1)
      },
      submitInfo() {
        for (let item of this.phoneList) {
          if (item.phone === '') {
            return this.$Message.error('手机号码不能为空')
          }
        }

        let phoneArray = []

        this.phoneList.forEach(item => {
          phoneArray.push(item.phone)
        })

        this.$api.jsdJob.updatePhones(phoneArray)
          .then(res => {
            this.isOpenModal = false
            this.$Message.success('发送成功')
          })
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      changeRadio() {
        this.sumWorkJobCount()
      },
      drawLineOne() {
        let self = this;
        this.myChartOne.clear();
        this.myChartOne.resize();
        // 绘制图表
        this.myChartOne.setOption({
          tooltip: {},
          xAxis: {
            data: this.dateTypesLineOne
          },
          yAxis: {
            name: '单位（分钟）'
          },
          color: ['#49a9ee'],
          series: {
            type: 'bar',
            data: this.optionSeriesLineOne
          }
        })
        window.addEventListener("resize", () => {
          this.myChartOne.resize();
        });
        this.myChartOne.hideLoading()
      },
      drawLineTwo() {
        let self = this;
        this.myChartTwo.clear();
        this.myChartTwo.resize();
        // 绘制图表
        this.myChartTwo.setOption({
          tooltip: {},
          xAxis: {
            data: this.dateTypesLineTwo
          },
          yAxis: {
            name: '单位（%）'
          },
          color: ['#98d87d'],
          series: {
            type: 'bar',
            data: this.optionSeriesLineTwo
          }
        })
        window.addEventListener("resize", () => {
          this.myChartTwo.resize();
        });
        this.myChartTwo.hideLoading()
      },
      drawLineThree() {
        let self = this;
        this.myChartThree.clear();
        this.myChartThree.resize();
        // 绘制图表
        this.myChartThree.setOption({
          tooltip: {},
          xAxis: {
            data: this.dateTypesLineThree
          },
          yAxis: {
            name: '单位（次）'
          },
          color: ['#ffd86e'],
          series: {
            type: 'bar',
            data: this.optionSeriesLineThree
          }
        })

        window.addEventListener("resize", () => {
          this.myChartThree.resize();
        });
        this.myChartThree.hideLoading()
      },
      drawLineFour() {
        let self = this;
        this.myChartFour.clear();
        this.myChartFour.resize();
        // 绘制图表
        this.myChartFour.setOption({
          tooltip: {},
          xAxis: {
            data: this.dateTypesLineFour
          },
          yAxis: {
            name: '单位（次）'
          },
          series: {
            type: 'bar',
            data: this.optionSeriesLineFour
          }
        })

        window.addEventListener("resize", () => {
          this.myChartFour.resize();
        });
        this.myChartFour.hideLoading()
      },
      getHistoryList(num) {
        this.isFetching = true
        if (num) {
          this.tabDetail.currentPage = 1
        }
        this.$api.jsdJob.listWarnMessagePage({
          current: num ? num : this.tabDetail.page,
          size: this.tabDetail.pageSize
        })
          .then(
            response => {
              this.detailList = response.data.resultData.records;
              this.totalDetail = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listDaySumWorkJobCountByPage(num) {
        this.isFetching = true
        if (num) {
          this.tabDetail.currentPage = 1
        }
        this.$api.jsdJob.listDaySumWorkJobCountByPage({
          current: num ? num : this.tabDetail.page,
          size: this.tabDetail.pageSize
        })
          .then(
            response => {
              this.detailList = response.data.resultData.records;
              this.totalDetail = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      sumWorkJobCount(num) {
        this.isFetching = true

        this.$api.jsdJob.sumWorkJobCount({
          range: this.radioType
        })
          .then(
            response => {
              let countObj = response.data.resultData;
              this.cardList = [
                {
                  name: '作业总量',
                  all: countObj.total,
                  alone: countObj.totalHandled,
                  parent: ''
                },
                {
                  name: '自动分配',
                  all: countObj.autonum,
                  alone: countObj.autoHandled,
                  parent: ''
                },
                {
                  name: '补批',
                  all: countObj.oldnum,
                  alone: countObj.oldHandled,
                  parent: ''
                },
                {
                  name: '调度',
                  all: countObj.allotnum,
                  alone: countObj.allotHandled,
                  parent: ''
                },
                {
                  name: '重交',
                  all: countObj.resubmitnum,
                  alone: countObj.handleResubmit,
                  parent: ''
                }
              ]

            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getLastActiveMessage(num) {
        this.$api.jsdJob.getLastActiveMessage()
          .then(
            response => {
              this.noticeMessage = response.data.resultData || '暂无通知消息';
            })
      },
      viewTeacherDateCount(num) {
        this.isFetching = true
        if (num) {
          this.tabDetail.currentPage = 1
        }
        this.$api.jsdJob.viewTeacherDateCount({
          current: num ? num : this.tabDetail.page,
          date: new Date(this.checkDate).getTime(),
          size: this.tabDetail.pageSize
        })
          .then(
            response => {
              this.detailList = response.data.resultData.records;
              this.totalDetail = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      topReplytime() {
        this.myChartOne.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })
        this.$api.jsdJob.topReplytime({
          range: this.dataItemOne.num
        })
          .then(
            response => {
              this.dataInfoOne = response.data.resultData;
              this.drawLineOne()
            })
      },
      topHandleRate() {
        this.myChartTwo.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.$api.jsdJob.topHandleRate({
          range: this.dataItemTwo.num
        })
          .then(
            response => {
              this.dataInfoTwo = response.data.resultData;
              this.drawLineTwo()
            })

      },
      topGood() {
        this.myChartThree.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.$api.jsdJob.topGood({
          range: this.dataItemThree.num
        })
          .then(
            response => {
              this.dataInfoThree = response.data.resultData;
              this.drawLineThree()
            })
      },
      topHandled() {
        this.myChartFour.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.$api.jsdJob.topHandled({
          range: this.dataItemFour.num
        })
          .then(
            response => {
              this.dataInfoFour = response.data.resultData;
              this.drawLineFour()
            })
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

    &-radio {
      .-text-wrap {
        margin-left: 20px;

        .-text {
          cursor: pointer;
          padding: 0 5px;
          color: #3399FF;
        }
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

    &-modal {

      .-phone-form {
        max-height: 400px;
        overflow: auto;
      }

      .-item-wrap {
        display: flex;
        margin-bottom: 10px;

        .-del {
          display: inline-block;
          cursor: pointer;
          width: 50px;
          text-align: center;
          color: #DA374B;
        }
      }

      .-btn-wrap {
        margin-top: 10px;
        width: 100%;
        text-align: center;
      }

      .-p-b-flex {
        display: flex;
        padding: 0 20px;
        justify-content: space-between;
      }

      .-c-tab {
        margin: 20px 0;
      }

      .date-time {
        width: 20%;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        min-width: 155px;
      }

      .-date-search {
        margin-left: 20px;
      }
    }

    &-echart {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-flow: row wrap;

      .-item-echart {
        padding: 20px;
        margin: 10px 20px 0 0;
        width: 48%;
        height: 300px;
        border: 1px solid #dcdee2;
        border-radius: 4px;

        &-top {
          display: flex;
          justify-content: space-between;

          .-text-center {

            &:after {
              content: '|';
              font-size: 15px;
              padding: 0 10px;
              color: #eaeaeb;
            }

            &:before {
              content: '|';
              font-size: 15px;
              padding: 0 10px;
              color: #eaeaeb;
            }
          }

          .-item-active {
            color: #3399FF;
          }
        }

        &-name {
          font-size: 18px;
          font-weight: bold;
        }

        &-text {
          cursor: pointer;
          color: #b3b5b8;
        }

        &-down {
          width: 90%;
          height: 240px;
        }
      }
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
