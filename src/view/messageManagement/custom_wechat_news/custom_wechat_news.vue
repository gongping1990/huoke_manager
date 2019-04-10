<!-->
自定义微信模板消息推送管理页面
<-->
<template>
  <div class="p-wx">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
          <Radio label="1">任务列表</Radio>
          <Radio label="2">模板列表</Radio>
          <Radio label="3">黑名单</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search " :class="{'-c-tab': radioType!='3'}">
        <Col :span="5" class="g-t-left" v-if="radioType!='3'">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">公众号：</div>
            <Select v-model="form.appId" @on-change="changeWxAccount" class="-search-selectOne" filterable>
              <Option v-for="(item,index) in wxAccount" :label="item.name" :value="item.appid" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left" v-show="radioType == 1">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">任务状态：</div>
            <Select v-model="form.state" placeholder="请选择" class="-search-selectOne"
                    @on-change="getList(1)">
              <Option label="全部" value="4"></Option>
              <Option label="已完成" value="1"></Option>
              <Option label="未发送" value="3"></Option>
              <Option label="已撤销" value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="15" class="g-flex-a-j-center" v-show="radioType == 1">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <Table v-if="radioType == 1" class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page v-if="radioType == 1" class="g-text-right"
            :total="total"
            size="small"
            show-elevator
            :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <div v-if="radioType == 2">
        <wechat-template-list ref="childTemplate" :type="1" :appId="form.appId"></wechat-template-list>
      </div>

      <div v-if="radioType == 3">
        <black-list :type="1"></black-list>
      </div>
    </Card>

    <div v-if="isOpenModal">
      <wx-record-template :data="nowWxId"
                          :type="2"
                          @closeModal="closeModalRecord">
      </wx-record-template>
    </div>

  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import WxRecordTemplate from "../../../components/wxRecordTemplate";
  import WechatTemplateList from "./wechat_template_list";
  import BlackList from "../../../components/blackList";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    components: {DatePickerTemplate, BlackList, WechatTemplateList, WxRecordTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        form: {
          startTime: '',
          endTime: '',
          state: '4',
          appId: '-1'
        },
        dateOption: {
          name: '发送时间',
          type: 'datetime'
        },
        radioType: '1',
        dataList: [],
        wxAccount: [],
        total: 0,
        isOpenModal: false,
        isFetching: false,
        nowWxId: '',
        taskStatus: {
          // '0': '发送失败',
          '1': '已完成',
          '2': '已撤销',
          '3': '未发送'
        },
        columns: [
          {
            title: '消息内容',
            render: (h, params) => {
              return h('pre', params.row.content)
            },
            width: 300,
          },
          {
            title: '接收用户',
            key: 'count',
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
                return h('div',[
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
                        this.openModal(params.row.id)
                      }
                    }
                  }, '发送记录'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      display: params.row.failNum > 0 ? 'inline' : 'none',
                      color: '#5444E4'
                    },
                    on: {
                      click: () => {
                        this.sendAgain(params.row.id)
                      }
                    }
                  }, '重新发送')
                ])
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
      this.getWxAccountList()
    },
    methods: {
      sendAgain (id) {
        this.$api.user.reSendFailed({
          taskId: id
        })
          .then(response => {
            this.$Message.success("操作成功");
            this.getList()
          })
      },
      changeWxAccount() {
        if (this.radioType == '1') {
          this.getList(1)
        } else {
          setTimeout(() => {
            this.$refs.childTemplate.getWxList(1)
          }, 0)
        }
      },
      changeDate(data) {
        this.form.startTime = data.startTime
        this.form.endTime = data.endTime
        this.getList(1)
      },
      closeModalRecord() {
        this.isOpenModal = false;
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getWxAccountList() {
        this.$api.user.getMessageWxList()
          .then(response => {
            this.wxAccount = response.data.resultData;
            this.form.appId = this.wxAccount[0].appid
            this.getList()
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.user.getWxSendList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          appId: this.form.appId == '-1' ? '' : this.form.appId,
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
        this.nowWxId = wxId
        this.isOpenModal = true
      },
      changeRadio() {
        this.radioType == 1 && this.getList()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要撤销吗？',
          onOk: () => {
            this.$api.user.cancelWxTask({
              taskId: param
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-wx {

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
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }

    .-float-right {
      float: right;
    }

  }
</style>
