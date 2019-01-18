<template>
  <Modal title="商品详情"
         class="p-goods"
         v-model="isOpenModal"
         width="900px"
         @on-cancel="closeModal()">
    <Row>
      <Col :span="9">
        <div class="g-flex-a-j-center">
          <div style="width: 100px">当前选中：</div>
          <Select v-model="form.state" placeholder="请选择"
                  @on-change="getList()">
            <Option v-for="item of goodsList" :label="item.courseName" :value="item.goodsId"
                    :key="item.goodsId"></Option>
          </Select>
        </div>
      </Col>
      <Col :span="15" class="g-text-right">
        <Button type="primary" class="-p-modal-btn" ghost @click="toExcel()">数据导出</Button>
      </Col>
    </Row>

    <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="dataList"
           @on-sort-change="changeSort"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChangeRecord"></Page>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'goodsListTemplate',
    props: ['id', 'list'],
    data() {
      return {
        form: {
          state: this.id
        },
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        dataList: [],
        goodsList: this.list,
        total: 0,
        isOpenModal: false,
        isFetching: false,
        sortInfo: '',
        columnsRecord: [
          {
            title: '日期',
            key: 'date',
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
          }
        ],
      }
    },
    mounted() {
      this.isOpenModal = true
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
        let downUrl = `${getBaseUrl()}/dataCenter/exportData?goodsId=${this.form.state}&sort=${this.sortInfo ? this.sortInfo.order : ''}&sortStr=${this.sortInfo ? this.sortInfo.keyNew : ''}`
        window.open(downUrl, '_blank');
      },
      currentChangeRecord(val) {
        this.tab.page = val;
        this.getList();
      },

      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.dataCenter.getGoodsItem({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          goodsId: this.form.state,
          sort: this.sortInfo ? this.sortInfo.order : '',
          sortStr: this.sortInfo ? this.sortInfo.keyNew : '',
        }).then(response => {
          this.dataList = response.data.resultData.records;
          this.total = response.data.resultData.total;
        })
          .finally(() => {
            this.isFetching = false
          })
      },
      closeModal() {
        this.$emit('closeModal')
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-goods {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .date-time {
      width: 100%;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }
  }
</style>
