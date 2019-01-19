<template>
  <div class="p-course-list">
    <Card>
      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">课程分类：</div>
            <Select v-model="searchInfo.categoryId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in dataTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.name" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="15" class="g-flex-a-j-center -date-search">
          <Col span="2">时间:</Col>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="searchInfo.startTime"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期" @on-open-change="changeDate"
                           v-model="searchInfo.endTime"></Date-picker>
            </div>
          </Col>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="feedbackType ? columnsUnanswered : columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-course-list"
      v-model="isOpenModalSort"
      @on-cancel="isOpenModalSort = false"
      width="350"
      title="编辑排序值">
      <Form :model="addInfo" :label-width="70" class="ivu-form-item-required">
        <FormItem label="排序值">
          <InputNumber :max="99999" :min="1" v-model="sortNum" placeholder="请输入课程排序"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalSort = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitSort()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: 'courseList',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          name: '',
          categoryId: '',
          startTime: '',
          endTime: ''
        },
        selectInfo: '1',
        dataList: [],
        dataTypeList: [],
        total: 0,
        feedbackType: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalSort: false,
        isSending: false,
        addInfo: {
          content: ''
        },
        sortNum: null,
        ruleValidate: {
          content: [
            {required: true, message: '请输入回复内容', trigger: 'blur'},
          ]
        },
        columns: [
          {
            title: '名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.url
                  },
                  style: {
                    width: '140px',
                    height: '50px',
                    margin: '10px'
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '关键词',
            render: (h,params)=>{
              if(params.row.keywords.length) {
                return h('div',params.row.keywords.map(function (item) {
                  return h('Tag',item)
                }))
              } else {
                return h('span','')
              }
            },
            width: 180,
            align: 'center'
          },
          {
            title: '课时数量',
            key: 'lessionNum',
            align: 'center'
          },
          {
            title: '排序值',
            render: (h, params) => {
              return h('div', {
                style: {
                  color: '#5444E4',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openModalSort(params.row)
                  }
                }
              }, params.row.sortnum)
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '更新时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.modifyTime).format("YYYY-MM-DD HH:mm:ss"))
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
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.toClass(params.row)
                    }
                  }
                }, '课时管理'),
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
        ]
      };
    },
    mounted() {
      this.getList()
      this.getTypeList()
    },
    methods: {
      changeDate (bool) {
        if(!bool) {
          this.getList(1)
        }
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      toClass (data) {
        this.$router.push({
          name: 'classList',
          query:{
            courseId: data.id
          }
        })
      },
      openModal(data) {
        if(data) {
          this.$router.push({
            name: 'editCourse',
            query:{
              id: data.id
            }
          })
        } else {
          this.$router.push({
            name: 'editCourse',
          })
        }
      },
      openModalSort(data) {
        this.isOpenModalSort = true
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.sortNum = +this.addInfo.sortnum
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.course.delCourse({
              id: param.id
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
      //分页查询
      getList(num) {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? dayjs(this.searchInfo.startTime).format("YYYY/MM/DD HH:mm:ss") : ''
        endTime = this.searchInfo.endTime ? dayjs(this.searchInfo.endTime).format("YYYY/MM/DD HH:mm:ss") : ''
        if(num) {
          this.tab.currentPage = 1
        }
        this.$api.course.courseList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          categoryId: this.searchInfo.categoryId,
          name: this.searchInfo.name,
          createBegin: startTime,
          createEnd: endTime
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
      getTypeList() {
        this.$api.course.courseTypeList()
          .then(
            response => {
              this.dataTypeList = response.data.resultData.records;
            })

      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.feedback.addReply(this.addInfo)
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      },
      submitSort() {
        if (!this.sortNum) {
          return this.$Message.error('请输入排序值')
        }
        this.$api.course.changeCourseSort({
          id: this.addInfo.id,
          sortnum: this.sortNum
        }).then(response => {
          if (response.data.code == '200') {
            this.$Message.success('修改成功');
            this.getList()
            this.isOpenModalSort = false
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-course-list {
    .-t-add-icon{
      top:56px
    }
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }


    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
