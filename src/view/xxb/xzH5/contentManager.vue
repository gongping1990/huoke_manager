<template>
  <div class="p-weike">
    <Card>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

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
        dataList: [],
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
            title: '教材名称',
            key: 'name',
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
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1;
        }
        this.$api.xxbWriteAdmin.getAllTeachingMaterial()
          .then(
            response => {
              this.dataList = response.data.resultData;
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
