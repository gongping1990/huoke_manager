<template>
  <div class="p-landingPage">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
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
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Modal>

    <Modal
      class="p-landingPage"
      v-model="isOpenModalChannel"
      @on-cancel="isOpenModalChannel = false"
      footer-hide
      width="750"
      title="渠道排行">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModalChannel" :data="detailChannelList"></Table>

      <Page class="g-text-right" :total="totalDetailChannel" size="small" show-elevator :page-size="tabDetailChannel.pageSize"
            :current.sync="tabDetailChannel.currentPage"
            @on-change="detailCurrentChangeChannel"></Page>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'tbzw_landingPage',
    data() {
      return {
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        tabDetailChannel: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        detailChannelList: [],
        pageId: '',
        copy_url: '',
        dataItem: '',
        totalDetail: 0,
        totalDetailChannel: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalChannel: false,
        herfList: {
          '1': 'http://composition.k12.vip/',
          '2': 'http://composition.k12.vip/one',
          '3': 'http://composition.k12.vip/two',
          '6': 'http://composition.k12.vip/five',
          '7': 'http://composition.k12.vip/try',
          '8': 'http://composition.k12.vip/freeTry',
          // '9': 'http://composition.k12.vip/try',
          '10': 'http://composition.k12.vip/literacy',
        },
        columns: [
          {
            title: '名称',
            key: 'pageName',
            align: 'center'
          },
          {
            title: '落地页地址',
            render: (h, params)=> {
              return h('div', this.herfList[params.row.page])
            },
            align: 'center'
          },

          {
            title: '落地页PV',
            key: 'pv',
            align: 'center'
          },
          {
            title: '落地页UV',
            key: 'uv',
            align: 'center'
          },
          {
            title: '下单数',
            key: 'orderCount',
            align: 'center'
          },
          {
            title: '成功订单数',
            key: 'successOrderCount',
            align: 'center'
          },
          {
            title: '付费转化率',
            key: 'percentConversion',
            render: (h, params) => {
              return h('span', `${(params.row.payConversionPercent*100).toFixed()}%`)
            },
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '查看详情')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },

          {
            title: '落地页PV',
            key: 'pv',
            align: 'center'
          },
          {
            title: '落地页UV',
            key: 'uv',
            align: 'center'
          },
          {
            title: '下单数',
            key: 'orderCount',
            align: 'center'
          },
          {
            title: '成功订单数',
            key: 'successOrderCount',
            align: 'center'
          },
          {
            title: '付费转化率',
            render: (h, params) => {
              return h('span', `${(params.row.payConversionPercent*100).toFixed()}%`)
            },
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModalChannel(params.row)
                    }
                  }
                }, '渠道排行')
              ])
            }
          }
        ],
        columnsModalChannel: [
          {
            title: '渠道名称',
            key: 'channelName',
            align: 'center'
          },

          {
            title: '下单数',
            key: 'orderCount',
            align: 'center'
          },
          {
            title: '成交数',
            key: 'successOrderCount',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '访问用户数',
            key: 'uv',
            align: 'center'
          },
          {
            title: '转化率',
            key: 'conversionRate',
            render: (h, params) => {
              return h('span', `${(params.row.conversionRate * 100).toFixed(2)}%`)
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModalChannel(data) {
        this.dataItem = data
        this.isOpenModalChannel = true
        this.getChannelList()
      },
      closeModal() {
        this.isOpenModal = false
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      detailCurrentChangeChannel(val) {
        this.tabDetailChannel.page = val;
        this.getChannelList();
      },
      openModal(data) {
        this.pageId = data.page
        this.getDetailList()
        this.isOpenModal = true
      },
      getDetailList() {
        this.isFetching = true
        this.$api.tbzwOrder.getDataDetails({
          page: this.pageId,
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(()=>{
          this.isFetching = false
        })
      },
      getChannelList() {
        this.isFetching = true
        this.$api.tbzwInternalChannel.getInternalChannelDataByDate({
          date: dayjs(this.dataItem.date).format('YYYYMMDD'),
          sort: 'successOrderCount',
          current: this.tabDetailChannel.page,
          size: this.tabDetailChannel.pageSize
        }).then(response => {
          this.detailChannelList = response.data.resultData.records;
          this.totalDetailChannel = response.data.resultData.total;
        }).finally(()=>{
          this.isFetching = false
        })
      },
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.tbzwOrder.getTotalData({
          type: 2
        })
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

    .copy-input {
      position: absolute;
      opacity: 0;
    }

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
