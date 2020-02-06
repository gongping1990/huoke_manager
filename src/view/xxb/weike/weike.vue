<template>
  <div class="p-syncLearnList">
    <Card>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-syncLearnList"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      footer-hide
      width="800"
      title="数据详情">

      <Row class="g-search">
        <Col :span="12">
          <div class="g-flex-a-j-center">
            <div class="-search">
              <Select v-model="selectInfo.name" class="-search-select">
                <Option value="1">标题</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="selectInfo.title" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getDetailList(1)"></Input>
            </div>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columnsTwo" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: 'syncLearnList',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        selectInfo: {
          grade: '1',
          subject: '1',
          name: '1',
          title: ''
        },
        dataList: [],
        detailList: [],
        total: 0,
        totalDetail: 0,
        dataItem: '',
        isFetching: false,
        isOpenModal: false,
        gradeList: [
          {
            name: '一年级',
            key: '1'
          },
          {
            name: '二年级',
            key: '2'
          },
          {
            name: '三年级',
            key: '3'
          },
          {
            name: '四年级',
            key: '4'
          },
          {
            name: '五年级',
            key: '5'
          },
          {
            name: '六年级',
            key: '6'
          }
        ],
        columns: [
          {
            title: '学科',
            key: 'teachEdition',
            align: 'center'
          },
          {
            title: '教材名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '教材版本',
            key: 'teachEdition',
            align: 'center'
          },
          {
            title: '适用年级 (学期)',
            key: 'gradeText',
            render: (h, params) => {
              return h('div', `${this.gradeList[params.row.grade - 1].name} (${params.row.semester === 1 ? '上册' : '下册'})`)
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toChapter(params.row)
                    }
                  }
                }, '章节管理')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '标题',
            key: 'name',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sort',
            align: 'center'
          },
          {
            title: '播放量',
            key: 'readTime',
            align: 'center'
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
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      toChapter (data) {
        this.selectInfo.title = ''
        this.isOpenModal = true
        this.dataItem = data
        this.getDetailList()
      },
      getList(num) {
        this.isFetching = true
        // if (num) {
        //   this.tab.currentPage = 1
        // }
        this.$api.xxbMaterial.getMaterialCategory({
          // current: num ? num : this.tab.page,
          // size: this.tab.pageSize,
          grade: this.selectInfo.grade,
          subject: this.selectInfo.subject
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              // this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getDetailList(num) {
        this.isFetching = true
        if (num) {
          this.tabDetail.currentPage = 1
        }

        this.$api.xxbMaterial.getArticleData({
          current: num ? num : this.tabDetail.page,
          size: this.tabDetail.pageSize,
          categoryId: this.dataItem.id,
          name: this.selectInfo.title
        })
          .then(
            response => {
              this.detailList = response.data.resultData.records;
              this.totalDetail = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
    }
  };
</script>


<style lang="less" scoped>
  .p-syncLearnList {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-p-text-right {
      text-align: right;
    }

    .-t-add-icon {
      top: 36px;
    }

    .-g-m-tip {
      color: #b3b5b8;
      display: flex;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }
    .-c-left {
      margin-left: 24px;
    }
  }
</style>
