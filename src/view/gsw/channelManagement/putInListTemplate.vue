<template>
  <Modal title="数据详情"
         class="p-putIn"
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

    <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="dataList" border
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
    name: 'putInListTemplate',
    props: ['value', 'id', 'list'],
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
        sortInfo: ''
      }
    },
    watch: {
      'value' (_n, _o) {
        this.isOpenModal = _n
      }
    },
    computed: {
      columnsRecord() {
        let array = []

        if (this.$route.query.type == '1') {
          array = [
            {
              title: '日期',
              fixed: 'left',
              width: 150,
              key: 'date',
              align: 'center'
            },
            {
              title: '页面访问量',
              key: 'pvCount',
              width: 120,
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '访问用户',
              key: 'uvCount',
              width: 110,
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '试听申请用',
              key: 'uvCount',
              width: 150,
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '试听转化率',
              key: 'uvCount',
              width: 120,
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '付试听通过用户',
              key: 'payUser',
              width: 150,
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '试听通过率',
              key: 'payUser',
              width: 120,
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '试听后付费用户',
              width: 150,
              key: 'payUser',
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '试听付费率',
              width: 120,
              key: 'payUser',
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '付费金额',
              width: 110,
              key: 'percentConversion',
              align: 'center',
              sortable: 'custom'
            }
          ]
        } else {
          array = [
            {
              title: '日期',
              fixed: 'left',
              key: 'date',
              align: 'center'
            },
            {
              title: '页面访问量',
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
              key: 'uvCount',
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '付费金额',
              key: 'percentConversion',
              align: 'center',
              sortable: 'custom'
            },
            {
              title: '付费转化率',
              key: 'uvCount',
              align: 'center',
              sortable: 'custom'
            }
          ]
        }
        return array
      }
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
        let downUrl = `${getBaseUrl()}/sch/dataCenter/exportData?goodsId=${this.form.state}&sort=${this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.order) : ''}&sortStr=${this.sortInfo ? (this.sortInfo.order == 'normal' ? '' : this.sortInfo.keyNew) : ''}`
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
        this.isOpenModal = false
        this.$emit('input')
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-putIn {
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
