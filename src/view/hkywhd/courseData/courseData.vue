<template>
  <div class="p-landingPage">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-landingPage"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      footer-hide
      width="800"
      title="数据详情">

      <div>课程名称：{{dataItem.courseName}}</div>

      <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'hkywhd_courseData',
    data() {
      return {
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        radioType: 0,
        pageId: '',
        totalDetail: 0,
        dataItem: {},
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            align: 'center'
          },
          {
            title: '下单数',
            key: 'orderNum',
            align: 'center'
          },
          {
            title: '成功订单数',
            key: 'successOrderNum',
            align: 'center'
          },
          {
            title: '活动发起数量',
            key: 'startActivityNum',
            align: 'center'
          },
          {
            title: '海报分享次数',
            key: 'sharePosterNum',
            align: 'center'
          },
          {
            title: '参与助力人数',
            key: 'joinActivityNum',
            align: 'center'
          },
          {
            title: '助力成功数',
            key: 'activitySuccessNum',
            align: 'center'
          },
          {
            title: '助力用户下单数',
            key: 'orderHelpOrderUserNum',
            align: 'center'
          },
          {
            title: '助力用户成功订单数',
            key: 'orderHelpSuccessOrderUserNum',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '详情')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '日期',
            width: 100,
            key: 'date',
            align: 'center'
          },
          {
            title: '访问量',
            width: 100,
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户',
            width: 100,
            key: 'uv',
            align: 'center'
          },
          {
            title: '下单数',
            width: 100,
            key: 'orderNum',
            align: 'center'
          },
          {
            title: '成功订单数',
            width: 100,
            key: 'successOrderNum',
            align: 'center'
          },
          {
            title: '活动发起数量',
            key: 'startActivityNum',
            width: 100,
            align: 'center'
          },
          {
            title: '海报分享次数',
            width: 100,
            key: 'sharePosterNum',
            align: 'center'
          },
          {
            title: '参与助力人数',
            width: 100,
            key: 'joinActivityNum',
            align: 'center'
          },
          {
            title: '助力成功数',
            width: 100,
            key: 'activitySuccessNum',
            align: 'center'
          },
          {
            title: '助力用户下单数',
            width: 100,
            key: 'orderHelpOrderUserNum',
            align: 'center'
          },
          {
            title: '助力用户成功订单数',
            width: 100,
            key: 'orderHelpSuccessOrderUserNum',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      closeModal() {
        this.isOpenModal = false
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      openModal(data) {
        this.dataItem = data
        this.getDetailList()
        this.isOpenModal = true
      },
      getDetailList() {
        this.isFetching = true
        this.$api.hkywhdBook.getBookDataDetails({
          courseName: this.dataItem.courseName,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.hkywhdBook.getAllBookData()
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-landingPage {
    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
