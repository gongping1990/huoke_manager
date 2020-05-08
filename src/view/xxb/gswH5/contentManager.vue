<template>
  <div class="p-weike">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-weike"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      footer-hide
      width="800"
      :title="dataItem.name + ' - 课时列表'">

      <tree-template ref="childTree" :dataItem="dataItem"></tree-template>

    </Modal>

  </div>
</template>

<script>
  import TreeTemplate from "./treeTemplate";
  export default {
    name: 'syncLearnList',
    components: {TreeTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        radioType: '1',
        searchInfo: {
          grade: '-1',
          edition: '1'
        },
        editionList: [],
        dataList: [],
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
          },
          {
            name: '七年级',
            key: '7'
          },
          {
            name: '八年级',
            key: '8'
          },
          {
            name: '九年级',
            key: '9'
          }
        ],
        subjectList: {
          1: '语文',
          2: '数学',
          3: '英语'
        },
        columns: [
          {
            title: '教材名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '教材版本',
            key: 'teachEdition',
            render: (h, params)=>{
              return h('div', params.row.teachEdition || '-')
            },
            align: 'center'
          },
          {
            title: '适用年级 (学期)',
            key: 'gradeText',
            render: (h, params) => {
              return h('div', params.row.grade ? `${this.gradeList[params.row.grade - 1].name} (${params.row.semester === 1 ? '上册' : '下册'})` : '-')
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
                }, '课时列表')
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toChapter (data) {
        this.isOpenModal = true
        this.dataItem = data
        this.$refs.childTree.getList(data)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1;
        }
        this.$api.xxbPoemAdmin.getPoemSubCategoryList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          poemType: this.$route.query.id
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
  .p-weike {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
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
