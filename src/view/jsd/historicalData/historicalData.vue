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
            title: '日期',
            render: (h,params)=>{
              return h('div',dayjs(params.row.date).format('YYYY-MM-DD'))
            },
            width: 100,
            align: 'center'
          },
          {
            title: '当日总量/已处理',
            key: 'newuser',
            align: 'center',
          },
          {
            title: '当日自动分配/已处理',
            key: 'oneRate',
            align: 'center',
          },
          {
            title: '补批/已处理',
            key: 'twoRate',
            align: 'center',
          },
          {
            title: '调度/已处理',
            key: 'threeRate',
            align: 'center',
          },
          {
            title: '重交/已处理',
            key: 'threeRate',
            align: 'center',
          },
          {
            title: '效率（分钟）',
            key: 'sixRate',
            align: 'center',
          },
          {
            title: '好评率/差评率',
            key: 'threeRate',
            align: 'center',
          }
        ],
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
        this.$api.wzjh.listRetentionRate({
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
