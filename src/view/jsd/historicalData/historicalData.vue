<template>
  <div class="p-historicalData">
    <Card>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index"

  export default {
    name: 'jsd_historicalData',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        total: 0,
        isFetching: false,
        columns: [
          {
            title: '时间',
            key: 'day',
            align: 'center'
          },
          {
            title: '当日作业总量/批改',
            render: (h, p) => {
              return h('div', `${p.row.total}/${p.row.totalHandled}`)
            },
            align: 'center',
          },
          {
            title: '当日提交/已批改',
            render: (h, p) => {
              return h('div', `${p.row.allotnum}/${p.row.allotHandled}`)
            },
            align: 'center',
          },
          {
            title: '历史堆积/已批该',
            render: (h, p) => {
              return h('div', `${p.row.oldnum}/${p.row.oldHandled}`)
            },
            align: 'center',
          },
          {
            title: '不合格重交/已批该',
            render: (h, p) => {
              return h('div', `${p.row.resubmitnum}/${p.row.handleResubmit}`)
            },
            align: 'center',
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.jsdJob.listMyWorkJobCountByPage({
          current: num ? num : this.tab.page,
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
  .p-historicalData {
    .-p-text-right {
      text-align: right;
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
