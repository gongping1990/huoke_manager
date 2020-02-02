<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="800"
    title="报名数据详情">
    <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    name: 'sqjl_detail',
    props: ['value', 'dataInfo'],
    data () {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        total: 0,
        dataList: [],
        isOpenDetail: false,
        isFetching: false,
        radioType: '',
        columns: [
          {
            title: '日期',
            key: 'phone',
            align: 'center'
          },
          {
            title: '报名人数',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '公众号关注人数',
            key: 'sex',
            align: 'center'
          },
          {
            title: '公众号关注率',
            key: 'relationText',
            align: 'center'
          },
          {
            title: '小程序打开人数',
            key: 'gradeText',
            align: 'center'
          },
          {
            title: '小程序打开率',
            key: 'gradeText',
            align: 'center'
          }
        ],
      }
    },
    mounted() {

    },
    watch: {
      value (_n) {
        this.isOpenDetail = _n
        // _n && this.getList()
      },
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getList() {
        this.$api.jsdJob.listHomeWorkLog({
          workId: this.dataInfo.workId,
          courseId: this.dataInfo.appId,
        }).then(response => {
          this.recordList = response.data.resultData
          for (let item of this.recordList) {
            item.time = dayjs(+item.createTime).format('YYYY-MM-DD HH:mm')
            // item.replyText = item.replyText.split('#')
            // item.scoreList = item.replyText[0].split(',')
            // item.ruleList = item.replyText[1].split(',')
            // item.content = item.replyText[3]
          }
        })
      },
      closeModal () {
        this.isOpenDetail = false
        this.$emit('input', false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-detailModal{

    &-radio {
      text-align: center;
      width: 100%;
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

  }
</style>
