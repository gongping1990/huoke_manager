<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="850"
    title="上课数据详情">
    <Row class="g-search">
      <Col :span="9">
        <div class="g-flex-a-j-center">
          <div style="width: 80px">选择课时：</div>
          <Select v-model="searchInfo.lessonId" placeholder="请选择" class="-search-selectOne"
                  @on-change="getList(1)">
            <Option v-for="(item, index) of lessonList" :label="item.lessonName" :value="item.lessonId"
                    :key="index"></Option>
          </Select>
        </div>
      </Col>
    </Row>

    <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

    <Page class="g-text-right" :total="total" size="small" show-elevator
          :page-size="tab.pageSize"
          :current.sync="tab.currentPage"
          @on-change="currentChange"></Page>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    name: 'xxsj_detail',
    props: ['value', 'dataInfo', 'lessonList'],
    data () {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {},
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
            title: '上课人数',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '初次上课人数',
            key: 'sex',
            align: 'center'
          },
          {
            title: '到课率',
            key: 'relationText',
            align: 'center'
          },
          {
            title: '初次完课人数',
            key: 'gradeText',
            align: 'center'
          },
          {
            title: '完课率',
            key: 'gradeText',
            align: 'center'
          },
          {
            title: '初次交作业人数',
            key: 'gradeText',
            align: 'center'
          },
          {
            title: '交作业率',
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
        this.searchInfo.lessonId = this.dataInfo.lessonId
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

    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
      text-align: left;
    }

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
