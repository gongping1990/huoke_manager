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
      width="650"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'gsw_landingPage',
    data() {
      return {
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        pageId: '',
        copy_url: '',
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '名称',
            key: 'pageName',
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
            title: '访问量',
            key: 'pv',
            align: 'center'
          },
          {
            title: '独立访客',
            key: 'uv',
            align: 'center'
          },
          {
            title: '转化率',
            key: 'percentConversion',
            render: (h, params) => {
              return h('span', `${(params.row.conversionPercent*100).toFixed()}%`)
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 200,
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
                }, '查看详情'),
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
                      this.copyUrl(params.row)
                    }
                  }
                }, '复制链接')
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
            title: '转化率',
            render: (h, params) => {
              return h('span', `${(params.row.conversionPercent*100).toFixed()}%`)
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
      copyUrl(param) {
        if (param.page === 1) {
          this.copy_url = 'http://poem.k12.vip/newDetail'
        } else if (param.page === 2) {
          this.copy_url = 'http://poem.k12.vip/newDetailOne'
        } else if (param.page === 3) {
          this.copy_url = 'http://poem.k12.vip/newDetailTwo'
        }

        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      closeModal() {
        this.isOpenModal = false
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      openModal(data) {
        this.pageId = data.page
        this.getDetailList()
        this.isOpenModal = true
      },
      getDetailList() {
        this.isFetching = true
        this.$api.gswOrder.getDataDetails({
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
      //分页查询
      getList() {
        this.isFetching = true

        this.$api.gswOrder.getTotalData()
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
