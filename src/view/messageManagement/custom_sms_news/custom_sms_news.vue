<!-->
自定义短信模板消息推送管理页面
<-->
<template>
  <div class="p-sms">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">任务状态：</div>
            <Select v-model="form.state" placeholder="请选择" class="-search-selectOne"
                    @on-change="getSmsList(1)">
              <Option label="全部" value="4"></Option>
              <Option label="已完成" value="1"></Option>
              <Option label="未发送" value="3"></Option>
              <Option label="已撤销" value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="18" class="g-flex-a-j-center -date-search">
          <Col span="2">反馈时间:</Col>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="form.startTime"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期"
                           v-model="form.endTime"></Date-picker>
            </div>
            <div class="-date-search">
              <Button type="primary" class="-p-modal-btn" @click="getSmsList(1)">搜索</Button>
            </div>
          </Col>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon g-add-top" @click="openAddModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right"
            :total="total"
            size="small"
            show-elevator
            :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <div v-if="isOpenModal">
      <sms-record-template :isOpen="isOpenModal"
                           :data="nowSmsId"
                           :type="2"
                           @closeModal="closeModalRecord"></sms-record-template>
    </div>

    <div v-if="isAddOpenModal">
      <user-selection ref="childMethod"
                      @close="closeModal"
                      @submitModal="submitMessage"
                      :otherInfo="otherInfo">
      </user-selection>
    </div>

  </div>
</template>

<script>
  import dayjs from "dayjs";
  import UserSelection from "@/components/userSelection";
  import SmsRecordTemplate from "../../../components/smsRecordTemplate";

  export default {
    components: {SmsRecordTemplate, UserSelection},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        form: {
          startTime: "",
          endTime: "",
          state: "4"
        },
        addInfo: {
          userIds: [],
          content: "",
          sendTime: "",
          sendType: ""
        },
        otherInfo: {
          title: '添加自定义短信',
          isCheckAllPeople: false,
          type: '1'
        },
        checkAll: "", // 是否全选
        dataList: [],
        lists: {},
        userList: [],
        userLists: [],
        total: 0,
        isOpenModal: false,
        isAddOpenModal: false,
        isFetching: false,
        nowSmsId: "",
        taskStatus: {
          // "0": "发送失败",
          "1": "已完成",
          "2": "已撤销",
          "3": "未发送"
        },
        columns: [
          {
            title: '接收用户',
            key: 'count',
            align: 'center'
          },
          {
            title: '消息内容',
            key: 'content',
            align: 'center'
          },
          {
            title: '发送成功',
            key: 'successNum',
            align: 'center'
          },
          {
            title: '发送失败',
            key: 'failNum',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'gmtCreate',
            align: 'center'
          },
          {
            title: '发送时间',
            key: 'sendTime',
            align: 'center'
          },
          {
            title: '任务状态',
            render: (h, params) => {
              return h('div', this.taskStatus[params.row.status])
            },
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              if (params.row.status == 1) {
                return h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row.id)
                    }
                  }
                }, '发送记录')
              } else if (params.row.status == 3) {
                return h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row.id)
                    }
                  }
                }, '撤销')
              }
            },
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getSmsList()
    },
    methods: {
      closeModal() {
        this.isAddOpenModal = false;
      },
      closeModalRecord() {
        this.isOpenModal = false;
      },
      currentChange(val) {
        this.tab.page = val;
        this.getSmsList();
      },
      //分页查询
      getSmsList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.user.getSmsSendList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          status: this.form.state,
          sendTimeBegin: this.form.startTime ? dayjs(this.form.startTime).format('YYYY/MM/DD HH:mm:ss') : "",
          sendTimeEnd: this.form.endTime ? dayjs(this.form.endTime).format('YYYY/MM/DD HH:mm:ss') : ""
        })
          .then(response => {
            this.dataList = response.data.resultData.records;
            this.total = response.data.resultData.total;
          }).finally(() => {
          this.isFetching = false
        })
      },
      openModal(wxId) {
        this.nowSmsId = wxId;
        this.isOpenModal = true;
      },
      openAddModal() {
        this.isAddOpenModal = true
        setTimeout(() => {
          this.$refs.childMethod.init()
        }, 0)
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要撤销吗？',
          onOk: () => {
            this.$api.user.cancelSmsTask({
              taskId: param
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getSmsList();
                }
              })
          }
        })
      },
      submitMessage(param) {
        this.addInfo = Object.assign(this.addInfo, param)

        if (this.addInfo.content === "") {
          return this.$Message.error("请输入消息内容");
        } else if (this.addInfo.sendType == "") {
          return this.$Message.error("请选择发送类别");
        } else if (this.addInfo.sendType == "2" && this.addInfo.sendTime == "") {
          return this.$Message.error("请输入定时发送时间");
        } else if (!this.addInfo.userIds.length && !this.addInfo.condition && this.addInfo.radioType != '2') {
          return this.$Message.error("请选择用户");
        }

        delete this.addInfo.radioType
        console.log(this.addInfo, 1)
        this.$api.user.addSmsTask(this.addInfo)
          .then(response => {
            if (response.data.code == "200") {
              this.$Message.success("发送成功");
              this.addInfo = {
                userIds: [],
                content: "",
                sendTime: "",
                sendType: ""
              };
              this.isAddOpenModal = false;
              this.getSmsList();
            }
          })
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-sms {
    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
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

    .-c-tab {
      margin: 20px 0;
    }
    .-p-text-right {
      text-align: right;
    }

    .-float-right {
      float: right;
    }
  }
</style>
