<template>
  <div class="p-user-feedback">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="feedbackType" type="button" @on-change="getList">
          <Radio :label=0>未回复</Radio>
          <Radio :label=1>已回复</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center -date-search">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="feedbackType ? columnsUnanswered : columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-user-feedback"
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
    name: 'aloneBuy',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          nickname: '',
          startTime: '',
          endTime: ''
        },
        dateOption: {
          name: '反馈时间',
          type: 'datetime'
        },
        selectInfo: '1',
        dataList: [],
        total: 0,
        feedbackType: 0,
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
            title: '反馈内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'createUserName',
            align: 'center'
          },
          {
            title: '反馈状态',
            render: (h, params) => {
              return h('div', params.row.replyed ? '已回复' : '未回复')
            },
            align: 'center'
          },
          {
            title: '反馈时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
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
                }, '回复')
              ])
            }
          }
        ],
        columnsUnanswered: [
          {
            title: '反馈内容',
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
            title: '反馈状态',
            render: (h, params) => {
              return h('div', params.row.replyed ? '已回复' : '未回复')
            },
            align: 'center'
          },
          {
            title: '反馈时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.createTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '回复时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.replyTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate(data) {
        this.searchInfo.startTime = data.startTime
        this.searchInfo.endTime = data.endTime
        this.getList(1)
      },
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
        this.$api.wzjh.feedbackList({
          current: num ? num : this.tab.page,
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
            this.$api.wzjh.addReply(this.addInfo)
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
  .p-user-feedback {
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
