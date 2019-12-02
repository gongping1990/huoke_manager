<template>
  <div class="p-dateData">
    <Card>
      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import {thousandFormatter} from '@/libs/index'

  export default {
    name: 'dateData',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },

        total: 0,
        isFetching: false,
        dataList: [],
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
      }
    },
    mounted() {
      this.viewTeacherDateCount()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.viewTeacherDateCount();
      },
      viewTeacherDateCount(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.jsdJob.viewTeacherDateCount({
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
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-dateData {

  }
</style>
