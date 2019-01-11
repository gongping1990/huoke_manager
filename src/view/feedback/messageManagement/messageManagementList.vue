<template>
  <div class="p-message-manager">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="feedbackType" type="button" @on-change="getList">
          <Radio :label=0>待审核</Radio>
          <Radio :label=1>已通过</Radio>
          <Radio :label=2>未通过</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="3" class="g-t-left" v-if="feedbackType=='1'">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">是否回复：</div>
            <Select v-model="selectInfoOne" @on-change="getList" class="-search-selectOne">
              <Option v-for="(item,index) in statusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">留言内容</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList"></Input>
          </div>
        </Col>
        <Col :span="15" class="g-flex-a-j-center -date-search">
          <Col span="2">留言时间:</Col>
          <Col span="7" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择留言时间"
                           v-model="searchInfo.startTime"></Date-picker>
            </div>
            <div class="-date-search">
              <Button type="primary" class="-p-modal-btn" @click="getList">搜索</Button>
            </div>
          </Col>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columnsType[feedbackType]"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
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

  export default {
    name: 'messageManagement',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          nickname: '',
          startTime: ''
        },
        statusList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '0',
            name: '否'
          },
          {
            id: '1',
            name: '是'
          }
        ],
        selectInfo: '1',
        selectInfoOne: '-1',
        dataList: [],
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
        columns: [
          {
            title: '留言内容',
            key: 'content',
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
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '是否通过审核？',
                    'ok-text': '通过',
                    'cancel-text': '不通过'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    'on-ok': () => {
                      console.log(11)
                    },
                    'on-cancel': () => {
                      console.log(22)
                    }
                  }
                }, '审核')
              ])
            }
          }
        ],
        columnsPass: [
          {
            title: '留言内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '回复内容',
            key: 'content',
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
              return h('div', params.row.replyed ? '是' : '否')
            },
            align: 'center'
          },
          {
            title: '操作',
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
                }, '回复'),
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
                }, '置顶'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认该条留言不通过？',
                    'ok-text': '确认',
                    'cancel-text': '取消'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    'on-ok': () => {
                      console.log(11)
                    }
                  }
                }, '不通过')
              ])
            }
          }
        ],
        columnsUnanswered: [
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
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认该条留言通过？',
                    'ok-text': '确认',
                    'cancel-text': '取消'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    'on-ok': () => {
                      console.log(11)
                    }
                  }
                }, '通过'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgb(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '结束')
              ])
            }
          }
        ]
      };
    },
    computed: {
      columnsType() {
        let obj = {
          '0': this.columns,
          '1': this.columnsPass,
          '2': this.columnsUnanswered
        };
        return obj
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify({
          sourceId: data.id,
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
          content: '确认要删除该留言？',
          onOk: () => {
            this.$api.goods.closeFrendHelp({
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
      getList() {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : ''
        endTime = this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''
        this.$api.feedback.feedbackList({
          current: this.tab.page,
          size: this.tab.pageSize,
          replyed: this.feedbackType,
          nickname: this.searchInfo.nickname,
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
