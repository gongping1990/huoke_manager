<template>
  <div class="p-conversionData">
    <div class="p-conversionData-wrap">
      <div class="p-conversionData-title">预约情况</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsOne" :data="dataListOne"></Table>
    </div>
    <div class="p-conversionData-wrap">
      <div class="p-conversionData-title">预约后购买情况</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="dataListTwo"></Table>
    </div>
    <div class="p-conversionData-wrap">
      <div class="p-conversionData-title">转化情况</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsThree" :data="dataListThree"></Table>
    </div>
    <div class="p-conversionData-wrap">
      <div class="p-conversionData-title">转化课程分布</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsFour" :data="dataListFour"></Table>
    </div>

    <zhsj_detail v-model="isOpenModal" :type="nowType"></zhsj_detail>
  </div>
</template>

<script>

  import Zhsj_detail from "./zhsj_detail";
  export default {
    name: 'tbzw_paid_conversionData',
    components: {Zhsj_detail},
    props: ['propCourseId', 'propPeriodId'],
    data() {
      return {
        isFetching: false,
        isOpenModal: false,
        nowType: '1',
        dataListOne: [],
        dataListTwo: [],
        dataListThree: [],
        dataListFour: [],
        columnsOne: [
          {
            title: '报名人数',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '访问预约页面人数',
            key: 'phone',
            align: 'center'
          },
          {
            title: '访问率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.useMaPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '预约人数',
            key: 'totalCard',
            align: 'center'
          },
          {
            title: '报名-预约率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.useMaPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '是否到达最高优惠',
            key: 'longerContinueCard',
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
            render: (h, params) => {
              return h('div', [
                h('div', {
                  style: {
                    cursor: 'pointer',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toLookDetail(params.row, 1)
                    }
                  }
                }, '详情')
              ])
            },
            align: 'center'
          }
        ],
        columnsTwo: [
          {
            title: '预约人数',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '访问购买页面人数',
            key: 'phone',
            align: 'center'
          },
          {
            title: '预约-购买到页率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.useMaPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '已预约已购买人数',
            key: 'totalCard',
            align: 'center'
          },
          {
            title: '预约-购买转化率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.useMaPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '预约购买-总购买占比',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.useMaPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 190,
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
        ],
        columnsThree: [
          {
            title: '报名人数',
            key: 'signCount',
            align: 'center'
          },
          {
            title: '正式课购买人数',
            key: 'allFormalCourseBuyCount',
            align: 'center'
          },
          {
            title: '转化率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.formalConversionPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '全部课程到课人数',
            key: 'learnCount',
            align: 'center'
          },
          {
            title: '全部课程到课转化率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.learnPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '全部课程完成人数',
            key: 'finishCount',
            align: 'center'
          },
          {
            title: '全部课程完课转化率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.finishPercent*100}%`)
            },
            align: 'center'
          },
          {
            title: '全部作业完成人数',
            key: 'finishHomeworkCount',
            align: 'center'
          },
          {
            title: '全部完成作业转化率',
            render: (h, params)=> {
              return h('div',{
                style: {
                  color: '#FFB200'
                }
              }, `${params.row.finishHomeworkPercent*100}%`)
            },
            align: 'center'
          }
        ],
        columnsFour: [
          {
            title: '课时名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '正式课报名人数',
            key: 'formalCourseBuyCount',
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      // this.getList()
    },
    methods: {
      toLookDetail(data, num) {
        this.nowType = num
        this.isOpenModal = true
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.tbzwStudyRecordData.getConversionData({
          courseId: this.propCourseId,
          activeConfigId: this.propPeriodId,
        })
          .then(
            response => {
              let info = response.data.resultData
              this.dataListThree = [
                {
                  signCount: info.signCount,
                  allFormalCourseBuyCount: info.allFormalCourseBuyCount,
                  finishCount: info.finishCount,
                  formalConversionPercent: info.formalConversionPercent,
                  finishPercent: info.finishPercent,
                  finishHomeworkCount: info.finishHomeworkCount,
                  finishHomeworkPercent: info.finishHomeworkPercent,
                  learnCount: info.learnCount,
                  learnPercent: info.learnPercent,
                }
              ];
              this.dataListFour = response.data.resultData.formalCourseConversion;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-conversionData {

    &-wrap {
      margin-bottom: 33px;
    }

    &-title {
      text-align: left;
      font-size: 16px;
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
