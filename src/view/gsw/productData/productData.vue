<template>
  <div class="p-productData">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          总装机量<span>{{0}}</span>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-productData"
      v-model="isOpenModal"
      @on-cancel="closeModal"
      width="500"
      title="数据详情">

      <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

      <Page class="-p-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
      <div slot="footer" class="p-productData-btn">
        <div @click="isOpenModal = false" class="g-primary-btn"> 确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'productData',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
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
            title: '版本号',
            key: 'courseName',
            width: 200,
            align: 'center'
          },
          {
            title: '装机数量',
            key: 'pvCount',
            align: 'center'
          },
          {
            title: '机型分布',
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
            title: '机型',
            key: 'inTime',
            align: 'center'
          },
          {
            title: '装机量',
            key: 'pv',
            align: 'center'
          }
        ],
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
        // this.getDetailList();
      },
      openModal(data) {
        this.isOpenModal = true
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
  .p-productData {
    &-btn {
      display: flex;
      justify-content: flex-end;
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
