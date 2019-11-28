<template>
  <div class="p-dataBoard">
    <Card class="-p-d-col">
      <Row class="g-t-left p-dataBoard-radio">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio label="0">今日</Radio>
          <Radio label="1">本周</Radio>
          <Radio label="2">本月</Radio>
        </Radio-group>
      </Row>

      <Row class="p-dataBoard-flex">
        <Col :span="5" v-for="(item,index) of cardList" :key="index">
          <Card class="-item-wrap">
            <div class="-item-wrap-top">
              <div class="-name-left">{{item.name}}</div>
            </div>
            <div class="-item-wrap-center">{{item.all}}/{{item.alone}}</div>
            <div class="-item-wrap-down" v-if="item.parent">{{item.parent}}%</div>
          </Card>
        </Col>
      </Row>

      <div class="p-dataBoard-wrap g-tab">
        <div class="p-dataBoard-title -titleTwo">
          <div>每日教师数据</div>
          <div><DatePicker type="date" v-model="searchInfo.date" placeholder="请选择" @on-change="viewTeacherDateCount(1)"></DatePicker></div>
        </div>
        <Table class="-c-tab" :loading="isFetching" :columns="columnsOne" :data="dataListOne"></Table>

        <Page class="g-text-right" :total="totalOne" size="small" show-elevator :page-size="tabOne.pageSize"
              :current.sync="tabOne.currentPage"
              @on-change="currentChangeOne"></Page>
      </div>

      <div class="p-dataBoard-wrap">
        <div class="p-dataBoard-title -titleTwo">
          <div>每日数据汇总</div>
        </div>
        <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="dataListTwo"></Table>

        <Page class="g-text-right" :total="totalTwo" size="small" show-elevator :page-size="tabTwo.pageSize"
              :current.sync="tabTwo.currentPage"
              @on-change="currentChangeTwo"></Page>
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

  export default {
    name: 'userData',
    data() {
      return {
        tabOne: {
          page: 1,
          pageSize: 10
        },
        tabTwo: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          date: new Date()
        },
        totalOne: 0,
        totalTwo: 0,
        radioType: '0',
        modelType: 2,
        isFetching: false,
        isOpenModal: false,
        cardList: [],
        dataListOne: [],
        dataListTwo: [],
        columnsOne: [
          {
            title: '老师名称',
            key: 'teacherName',
            align: 'center'
          },
          {
            title: '当日作业总量/批改',
            render: (h, p) => {
              return h('div', `${p.row.total}/${p.row.totalHandled}`)
            },
            align: 'center',
          },
          {
            title: '当日提交/已批改',
            render: (h, p) => {
              return h('div', `${p.row.allotnum}/${p.row.allotHandled}`)
            },
            align: 'center',
          },
          {
            title: '历史堆积/已批该',
            render: (h, p) => {
              return h('div', `${p.row.oldnum}/${p.row.oldHandled}`)
            },
            align: 'center',
          },
          {
            title: '不合格重交/已批该',
            render: (h, p) => {
              return h('div', `${p.row.resubmitnum}/${p.row.handleResubmit}`)
            },
            align: 'center',
          }
        ],
        columnsTwo: [
          {
            title: '时间',
            key: 'day',
            align: 'center'
          },
          {
            title: '当日作业总量/批改',
            render: (h, p) => {
              return h('div', `${p.row.total}/${p.row.totalHandled}`)
            },
            align: 'center',
          },
          {
            title: '当日提交/已批改',
            render: (h, p) => {
              return h('div', `${p.row.allotnum}/${p.row.allotHandled}`)
            },
            align: 'center',
          },
          {
            title: '历史堆积/已批该',
            render: (h, p) => {
              return h('div', `${p.row.oldnum}/${p.row.oldHandled}`)
            },
            align: 'center',
          },
          {
            title: '不合格重交/已批该',
            render: (h, p) => {
              return h('div', `${p.row.resubmitnum}/${p.row.handleResubmit}`)
            },
            align: 'center',
          }
        ]
      }
    },
    mounted() {
      this.viewTeacherDateCount()
      this.listDaySumWorkJobCountByPage()
      this.sumWorkJobCount()
    },
    methods: {
      currentChangeOne(val) {
        this.tabOne.page = val;
        this.viewTeacherDateCount();
      },
      currentChangeTwo(val) {
        this.tabTwo.page = val;
        this.listDaySumWorkJobCountByPage();
      },
      changeRadio() {
        this.sumWorkJobCount()
      },
      sumWorkJobCount(num) {
        this.isFetching = true

        this.$api.jsdJob.sumWorkJobCount({
          range: this.radioType
        })
          .then(
            response => {
              let countObj = response.data.resultData;

              if (this.radioType === '0') {
                this.cardList = [
                  {
                    name: '当日作业总量/批改',
                    all: countObj.total,
                    alone: countObj.totalHandled,
                    parent: ''
                  },
                  {
                    name: '今日提交/已批该',
                    all: countObj.allotnum,
                    alone: countObj.allotHandled,
                    parent: ''
                  },
                  {
                    name: '历史堆积/已批该',
                    all: countObj.oldnum,
                    alone: countObj.oldHandled,
                    parent: ''
                  },
                  {
                    name: '不合格重交/已批改',
                    all: countObj.resubmitnum,
                    alone: countObj.handleResubmit,
                    parent: ''
                  }
                ]
              }  else {
                this.cardList = [
                  {
                    name: this.radioType === '1' ? '本周作业总量/批改' : '本月作业总量/批改',
                    all: countObj.total,
                    alone: countObj.totalHandled,
                    parent: ''
                  },
                  {
                    name: '不合格重交/已批改',
                    all: countObj.resubmitnum,
                    alone: countObj.handleResubmit,
                    parent: ''
                  }
                ]
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      viewTeacherDateCount(num) {
        this.isFetching = true
        if (num) {
          this.tabOne.currentPage = 1
        }
        this.$api.jsdJob.viewTeacherDateCount({
          current: num ? num : this.tabOne.page,
          date: new Date(this.searchInfo.date).getTime(),
          size: this.tabOne.pageSize
        })
          .then(
            response => {
              this.dataListOne = response.data.resultData.records;
              this.totalOne = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listDaySumWorkJobCountByPage(num) {
        this.isFetching = true
        if (num) {
          this.tabTwo.currentPage = 1
        }
        this.$api.jsdJob.listDaySumWorkJobCountByPage({
          current: num ? num : this.tabTwo.page,
          size: this.tabTwo.pageSize
        })
          .then(
            response => {
              this.dataListTwo = response.data.resultData.records;
              this.totalTwo = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-dataBoard {

    &-wrap {
      margin-bottom: 33px;
    }

    &-title {
      text-align: left;
      font-size: 16px;
    }

    .-titleTwo {
      display: flex;
      justify-content: space-between;
    }

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
          justify-content: center;

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
