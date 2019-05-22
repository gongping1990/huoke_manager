<template>
  <div class="p-message-manager">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="feedbackType" type="button" @on-change="getList(1)">
          <Radio :label=0>非精选</Radio>
          <Radio :label=1>精选</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">展示课程：</div>
            <Select v-model="searchInfo.goodsId" @on-change="getList(1)" class="-search-selectOne" filterable>
              <Option v-for="(item,index) in courseList" :label="item.name" :value="item.goodsId" :key="index"></Option>
            </Select>
          </div>
        </Col>

        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">留言内容</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.keyword" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="12" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="!feedbackType ? columnsUnanswered : columnsPass"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-message-manager"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      title="回复反馈">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="0">
        <FormItem label="" prop="content">
          <Input type="textarea" :rows="5" v-model="addInfo.content" placeholder="请输入回复内容"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'messageManagement',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          keyword: '',
          goodsId: '-1',
          startTime: '',
          endTime: ''
        },
        statusList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: 'false',
            name: '否'
          },
          {
            id: 'true',
            name: '是'
          }
        ],
        dateOption: {
          name: '留言时间',
          type: 'datetime'
        },
        selectInfo: '1',
        selectInfoOne: '-1',
        dataList: [],
        courseList: [],
        total: 0,
        feedbackType: 0,
        isPass: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {
          content: ''
        },
        ruleValidate: {
          content: [
            {required: true, message: '请输入回复内容', trigger: 'blur'},
          ]
        },
        columnsUnanswered: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '评价内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '回复内容',
            key: 'replyContent',
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'createUserName',
            align: 'center'
          },
          {
            title: '留言时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '回复时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.replyTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                  },
                  on: {
                    click: () => {
                      this.changeExamine(params.row,1)
                    }
                  }
                }, '设为精选'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: params.row.replyed ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '回复'),
              ])
            }
          }
        ],
        columnsPass: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '留言内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '回复内容',
            key: 'replyContent',
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'createUserName',
            align: 'center'
          },
          {
            title: '留言时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '回复时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.replyTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '是否置顶',
            render: (h, params) => {
              return h('div', params.row.level ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 220,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                  },
                  on: {
                    click: () => {
                      this.changeExamine(params.row,0)
                    }
                  }
                }, '取消精选'),
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
                      this.changeExamine(params.row, params.row.level === 2 ? 1 : 2)
                    }
                  }
                }, params.row.level === 2 ? '取消置顶' : '置顶'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: params.row.replyed ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '回复')
              ])
            }
          }
        ]
      };
    },
    mounted() {
      this.getList()
      this.getCourseList()
    },
    methods: {
      changeDate(data) {
        this.searchInfo.startTime = data.startTime
        this.searchInfo.endTime = data.endTime
        this.getList(1)
      },
      changeExamine(data,num) {
        this.$api.feedback.changeLevel({
          id: data.id,
          level: num
        })
          .then(res => {
            if (res.data.code == '200') {
              this.$Message.success('提交成功')
              this.getList()
              this.isOpenModal = false
            }
          })
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify({
          id: data.id,
          content: ''
        }))
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除？',
          onOk: () => {
            this.$api.feedback.delCourseMessage({
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
      getCourseList() {
        this.$api.goods.aloneList({
          current: this.tab.page,
          size: 100
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
              this.courseList.unshift({
                name: '全部',
                goodsId: '-1'
              })
            })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : ''
        endTime = this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.feedback.messageManagementList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          recommend: this.feedbackType ? true : false,
          goodsId: this.searchInfo.goodsId == '-1' ? '' : this.searchInfo.goodsId,
          keyword: this.searchInfo.keyword,
          startDate: startTime,
          endDate: endTime
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

      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.feedback.addCourseReply({
              sourceId: this.addInfo.id,
              content: this.addInfo.content
            })
              .then(res => {
                if (res.data.code == '200') {
                  this.$Message.success('操作成功')
                  this.getList()
                }
              })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-message-manager {

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
