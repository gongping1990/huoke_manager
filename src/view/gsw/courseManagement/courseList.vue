<template>
  <div class="p-courseList">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">课程标签：</div>
            <Select v-model="searchInfo.tagsId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of tagList" :label=item.name :value=item.id :key="item.id" ></Option>
            </Select>
          </div>
        </Col>
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
    name: 'gsw_courseList',
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          tagsId: '-1'
        },
        dataList: [],
        tagList: [],
        total: 0,
        isFetching: false,
        addInfo: {},
        columns: [
          {
            title: '课程名称',
            key: 'name',
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.toCourseContent(params.row)
                    }
                  }
                }, '课程内容'),
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.listByTags()
    },
    methods: {
      toCourseContent (data) {
        this.$router.push({
          name: 'gsw_new_courseContent',
          query: {
            courseId: data ? data.id : '',
            type: data.type
          }
        })
      },
      openModal(data) {
        this.$router.push({
          name: 'gsw_new_courseInfo',
          query: {
            courseId: data ? data.id : ''
          }
        })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.gswCourse.removeCourseById({
              courseId: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
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
        this.$api.gswCourse.queryPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          tagsId: this.searchInfo.tagsId === '-1' ? '' : this.searchInfo.tagsId
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listByTags() {
        this.$api.gswTags.listByTags()
          .then(
            response => {
              this.tagList = response.data.resultData;
              this.tagList.unshift({
                name: '全部',
                id: '-1'
              })
              this.getList()
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-courseList {

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }
    
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
