<template>
  <Modal title="数据详情"
         class="p-putIn"
         v-model="isOpenModal"
         width="900px"
         @on-cancel="closeModal()">
    <Row>
      <Col :span="24" class="g-text-right">
        <Button type="primary" class="-p-modal-btn" ghost @click="toExcel()">数据导出</Button>
      </Col>
    </Row>

    <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="dataList" border></Table>

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
    props: ['value', 'id'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        dataList: [],
        total: 0,
        putInId: this.id,
        isOpenModal: false,
        isFetching: false,
        sortInfo: '',
        columnsRecord: [
          {
            title: '日期',
            fixed: 'left',
            width: 150,
            key: 'day',
            align: 'center'
          },
          {
            title: '页面访问量',
            key: 'pv',
            width: 120,
            align: 'center'
          },
          {
            title: '访问用户',
            key: 'uv',
            width: 110,
            align: 'center'
          },
          {
            title: '试听申请用户',
            key: 'tryapply',
            width: 150,
            align: 'center'
          },
          {
            title: '试听转化率',
            key: 'tryapplyrate',
            width: 120,
            align: 'center'
          },
          {
            title: '付试听通过用户',
            key: 'trypassed',
            width: 150,
            align: 'center'
          },
          {
            title: '试听通过率',
            key: 'trypassedrate',
            width: 120,
            align: 'center'
          },
          {
            title: '试听后付费用户',
            width: 150,
            key: 'payed',
            align: 'center'
          },
          {
            title: '试听付费率',
            width: 120,
            key: 'payedrate',
            align: 'center'
          },
          {
            title: '付费金额',
            width: 110,
            key: 'payedmoney',
            align: 'center'
          }
        ]
      }
    },
    watch: {
      'id' (_n, _o) {
        this.putInId = _n
      },
      'value' (_n, _o) {
        this.isOpenModal = _n
        this.isOpenModal && this.getList()
      }
    },
    mounted() {
      console.log('调用')
      // this.putInId && this.getList()
    },
    methods: {
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
        this.$api.gswChannel.channerAdDayList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          adId: this.putInId
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
