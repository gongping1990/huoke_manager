<template>
  <div class="p-paid-courseList">
    <Card>
      <Row class="g-search g-t-left">
        <Radio-group v-model="searchInfo.categoryId" type="button" @on-change="getList()">
          <Radio :label=3>乐小狮作文</Radio>
          <Radio :label=4>乐小狮读写</Radio>
          <Radio :label=5>乐小狮写字</Radio>
          <Radio :label=1>小语轻作文</Radio>
        </Radio-group>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'tbzw_paid_courseList',
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
        addInfo: {},
        searchInfo: {
          categoryId: 3
        },
        columns: [
          {
            title: '课程名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '课程封面',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.coverphoto
                  },
                  style: {
                    width: '50px',
                    margin: '10px'
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            width: 200,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toCourseContent(params.row)
                    }
                  }
                }, '课时内容'),
                 h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toCourseContent (data) {
        this.$router.push({
          name: 'tbzw_paid_courseContent',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },
      openModal(data) {
        this.$router.push({
          name: 'tbzw_paid_courseInfo',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },

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
        this.$api.tbzwCourse.courseQueryPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: 2
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
  .p-paid-courseList {
    .-c-tips {
      color: #39f
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }

  }
</style>
