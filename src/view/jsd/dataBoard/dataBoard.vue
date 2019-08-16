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
      <Row class="g-t-left p-dataBoard-radio">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio label="1">今日</Radio>
          <Radio label="2">本周</Radio>
          <Radio label="3">本月</Radio>
        </Radio-group>

        <span class="-text-wrap" v-if="radioType === '1'">
          <span class="-text" @click="openModal(3)">今日老师数据</span>
          <span class="-text" @click="openModal(4)">每日数据详情</span>
        </span>
      </Row>

      <Row class="p-dataBoard-flex">
        <Col :span="4" v-for="(item,index) of cardList">
          <Card class="-item-wrap">
            <div class="-item-wrap-top">
              <div class="-name-left">{{item.name}}</div>
            </div>
            <div class="-item-wrap-center">{{item.all}}/{{item.alone}}</div>
            <div class="-item-wrap-down">{{item.parent}}%</div>
          </Card>
        </Col>
      </Row>

      <div class="p-dataBoard-echart">
        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">效率榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemOne.num === 1}"
                    @click="changeDate(1,1)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemOne.num === 2}"
                    @click="changeDate(1,2)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemOne.num === 3}"
                    @click="changeDate(1,3)">本月</span>
            </div>
          </div>
          <div ref="echartOne"></div>
        </div>

        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">完成榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemTwo.num === 1}"
                    @click="changeDate(2,1)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemTwo.num === 2}"
                    @click="changeDate(2,2)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemTwo.num === 3}"
                    @click="changeDate(2,3)">本月</span>
            </div>
          </div>
          <div ref="echartTwo"></div>
        </div>

        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">好评榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemThree.num === 1}"
                    @click="changeDate(3,1)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemThree.num === 2}"
                    @click="changeDate(3,2)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemThree.num === 3}"
                    @click="changeDate(3,3)">本月</span>
            </div>
          </div>
          <div ref="echartThree"></div>
        </div>

        <div class="-item-echart">
          <div class="-item-echart-top">
            <div class="-item-echart-name">数量榜</div>
            <div>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemFour.num === 1}"
                    @click="changeDate(4,1)">今日</span>
              <span class="-item-echart-text -text-center"
                    :class="{'-item-active' : dataItemFour.num === 2}"
                    @click="changeDate(4,2)">本周</span>
              <span class="-item-echart-text"
                    :class="{'-item-active' : dataItemFour.num === 3}"
                    @click="changeDate(4,3)">本月</span>
            </div>
          </div>
          <div ref="echartFour"></div>
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
        modelType: 2,
        isFetching: false,
        isOpenModal: false,
        dataInfo: '',
        titleList: [],
        titleType: {
          '1': '预警历史',
          '2': '订阅通知短信',
          '3': '今日老师数据',
          '4': '每日数据详情'
        },
        detailList: [],
        cardList: [
          {
            name: '作业总量',
            all: '24',
            alone: '20',
            parent: '20'
          },
          {
            name: '作业总量',
            all: '24',
            alone: '20',
            parent: '20'
          },
          {
            name: '作业总量',
            all: '24',
            alone: '20',
            parent: '20'
          }
        ],
        phoneList: [
          {
            phone: ''
          }
        ],
        echartList: [],
        addInfo: {},
        dataItemOne: {
          num: 1
        },
        dataItemTwo: {
          num: 1
        },
        dataItemThree: {
          num: 1
        },
        dataItemFour: {
          num: 1
        }
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
          if (this.radioType === '1') {
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
      },
      columnsModal() {
        let list = []

        switch (this.modelType) {
          case 1:
            list = [
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
            break
          case 3:
            list = [
              {
                title: '老师名称',
                key: 'date',
                align: 'center'
              },
              {
                title: '总量/已处理',
                key: 'pv',
                align: 'center'
              },
              {
                title: '自动分配/已处理',
                key: 'uv',
                align: 'center'
              },
              {
                title: '补批/已处理',
                key: 'uv',
                align: 'center'
              },
              {
                title: '调度/已处理',
                key: 'uv',
                align: 'center'
              },
              {
                title: '重交/已处理',
                key: 'uv',
                align: 'center'
              }
            ]
            break
          case 4:
            list = [
              {
                title: '时间',
                key: 'date',
                align: 'center'
              },
              {
                title: '总量/已处理',
                key: 'pv',
                align: 'center'
              },
              {
                title: '自动分配/已处理',
                key: 'uv',
                align: 'center'
              },
              {
                title: '补批/已处理',
                key: 'uv',
                align: 'center'
              },
              {
                title: '调度/已处理',
                key: 'uv',
                align: 'center'
              },
              {
                title: '重交/已处理',
                key: 'uv',
                align: 'center'
              }
            ]
            break
        }
        return list
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate(type, num) {
        switch (+type) {
          case 1:
            this.dataItemOne.type = type
            this.dataItemOne.num = num
            break
          case 2:
            this.dataItemTwo.type = type
            this.dataItemTwo.num = num
            break
          case 3:
            this.dataItemThree.type = type
            this.dataItemThree.num = num
            break
          case 4:
            this.dataItemFour.type = type
            this.dataItemFour.num = num
            break
        }
      },
      openModal(num) {
        this.phoneList = [{
          phone: ''
        }]
        this.modelType = +num
        this.isOpenModal = true
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
        console.log(this.phoneList)
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },

      changeRadio() {
        // this.initData()
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
            top: '13%',
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
      }
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
