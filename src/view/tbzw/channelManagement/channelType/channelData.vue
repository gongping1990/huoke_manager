<template>
  <div class="p-channelData">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
    <Card>
      <div class="g-t-left">当前选中：{{$route.query.name}}</div>
      <div class="g-t-left -c-tab p-channelData-title">累计数据</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
      <div class="g-t-left -c-tab p-channelData-title">数据详情</div>
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Card>

    <Modal
      class="p-channelData"
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
        copy_url: '',
        dataItem: '',
        totalDetail: 0,
        totalDetailChannel: 0,
        isFetching: false,
        isOpenModalChannel: false,
        columns: [
          {
            title: '落地页地址',
            key: 'baseLink',
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
            title: '累计转化率',
            render: (h, params) => {
              return h('span', `${(params.row.conversionRate*100).toFixed()}%`)
            },
            align: 'center'
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
              return h('span', `${(params.row.conversionRate*100).toFixed()}%`)
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
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getList();
      },
      detailCurrentChangeChannel(val) {
        this.tabDetailChannel.page = val;
        this.getChannelList();
      },
      getChannelList() {
        this.isFetching = true
        this.$api.tbzwInternalChannel.getInternalChannelDataByDate({
          date: dayjs(this.dataItem.date).format('YYYYMMDD'),
          sort: 'successOrderCount',
          current: this.tabDetailChannel.page,
          size: this.tabDetailChannel.pageSize,
          internalChannelCategoryId: this.$route.query.id
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

        this.$api.tbzwInternalChannel.getInternalChannelCategoryData({
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
          internalChannelCategoryId: this.$route.query.id,
        })
          .then(
            response => {
              let dataObj = response.data.resultData;
              this.dataList = [
                {
                  orderCount: dataObj.orderCount,
                  uv: dataObj.uv,
                  pv: dataObj.pv,
                  successOrderCount: dataObj.successOrderCount,
                  conversionRate: dataObj.conversionRate,
                  baseLink: dataObj.baseLink,
                }
              ]
              this.detailList = dataObj.page.records;
              this.totalDetail = dataObj.page.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-channelData {

    &-title {
      font-size: 18px;
      font-weight: bold;
    }

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
