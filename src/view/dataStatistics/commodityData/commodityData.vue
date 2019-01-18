<template>
  <div class="p-commodity">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-text-right">
          <Button type="primary" class="-p-modal-btn" ghost @click="toExcel">数据导出</Button>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"
             @on-sort-change="changeSort"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <div v-if="isOpenModal">
      <goods-list-template :id="goodsId" :list="dataList" @closeModal="closeModal"></goods-list-template>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"
  import GoodsListTemplate from "../../../components/goodsListTemplate";

  export default {
    name: 'bannerList',
    components: {GoodsListTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        searchInfo: {},
        total: 0,
        goodsId: '',
        isFetching: false,
        isOpenModal: false,
        sortInfo: '',
        columns: [
          {
            type: 'index',
            title: '排名',
            align: 'center'
          },
          {
            title: '名称',
            key: 'courseName',
            width: 200,
            align: 'center'
          },
          {
            title: '图片',
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
            title: '付款金额',
            key: 'payAmount',
            align: 'center'
          },
          {
            title: '访问量',
            key: 'pvCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '访问用户',
            key: 'uvCount',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '付费用户',
            key: 'payUser',
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '付费转化率',
            key: 'percentConversion',
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
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeSort(data) {
        switch (data.key) {
          case 'pvCount':
            data.keyNew = 'pv_count'
            break
          case 'uvCount':
            data.keyNew = 'uv_count'
            break
          case 'payUser':
            data.keyNew = 'pay_user'
            break
          case 'percentConversion':
            data.keyNew = 'percent_conversion'
            break
        }
        this.sortInfo = data
        this.getList()
      },
      toExcel() {
        let downUrl = `${getBaseUrl()}/dataCenter/exportData?sort=${this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : ''}&sortStr=${this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.keyNew) : ''}`
        window.open(downUrl, '_blank');
      },
      closeModal() {
        this.isOpenModal = false
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.goodsId = data.goodsId
        this.isOpenModal = true
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.dataCenter.getGoodsList({
          current: this.tab.page,
          sort: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : '',
          sortStr: this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.keyNew) : '',
          size: this.tab.pageSize
        })
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
  .p-commodity {
    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }
    .-date-search {
      margin-left: 20px;
    }
  }
</style>
