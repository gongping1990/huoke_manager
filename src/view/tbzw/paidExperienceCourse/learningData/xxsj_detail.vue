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
    props: ['value', 'dataInfo', 'lessonList', 'propPeriodId'],
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
            key: 'date',
            align: 'center'
          },
          {
            title: '上课人数',
            key: 'learnTime',
            align: 'center'
          },
          {
            title: '初次上课人数',
            key: 'firstLearnCount',
            align: 'center'
          },
          {
            title: '到课率',
            key: 'firstLearnPercent',
            align: 'center'
          },
          {
            title: '初次完课人数',
            key: 'finishLearnCount',
            align: 'center'
          },
          {
            title: '完课率',
            key: 'finishLearnPercent',
            align: 'center'
          },
          {
            title: '初次交作业人数',
            key: 'submitHomeworkCount',
            align: 'center'
          },
          {
            title: '交作业率',
            key: 'firstSubmitHomeworkPercent',
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
        _n && this.getList()
      },
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getList() {
        this.$api.tbzwStudyRecordData.getStudyDataDetails({
          activeConfigId: this.propPeriodId,
          lessonId: this.dataInfo.lessonId,
        }).then(response => {
          this.dataList = response.data.resultData
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
