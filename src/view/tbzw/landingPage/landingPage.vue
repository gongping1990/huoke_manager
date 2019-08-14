<template>
  <div class="p-landingPage">
    <Card>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-banner"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      width="500"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
      <div slot="footer" class="p-banner-btn">
        <div @click="isOpenModal = false" class="g-primary-btn"> 确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'tbzw_landingPage',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        detailList: [],
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        columns: [
          {
            title: '名称',
            key: 'courseName',
            width: 200,
            align: 'center'
          },
          {
            title: '地址',
            key: 'courseName',
            width: 200,
            align: 'center'
          },
          {
            title: '二维码',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.courseCover
                  },
                  style: {
                    width: '100px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '别名',
            key: 'payAmount',
            render: (h, params) => {
              return h('div', params.row.payAmount / 100)
            },
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pvCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '下单量',
            key: 'uvCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '转化率',
            key: 'percentConversion',
            render: (h, params) => {
              return h('span', `${params.row.percentConversion / 10}%`)
            },
            align: 'center',
            sortable: 'custom'
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
            key: 'uv',
            align: 'center'
          },
          {
            title: '转化率',
            key: 'uv',
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
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      openModal(data) {
        this.goodsId = data.goodsId
        this.isOpenModal = true
      },
      getDetailList(data) {
        this.isFetching = true
        this.$api.gswOperational.getOperationalStatistics({
          operationalId: data.id
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
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize
        }

        this.$api.dataCenter.getGoodsList(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
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
