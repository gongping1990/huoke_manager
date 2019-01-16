<!-->
自定义微信模板消息推送管理页面
<-->
<template>
  <div class="p-wx">

    <Card>
      <Row class="g-t-left">
        <Col :span="6">
          <Radio-group v-model="radioType" type="button" @on-change="changeRadio">
            <Radio label="1">任务列表</Radio>
            <Radio label="2">模板列表</Radio>
            <Radio label="3">黑名单</Radio>
          </Radio-group>
        </Col>
        <Col :span="8">
          <Button @click="syncUserFn" type="primary" class="-p-modal-btn" :disabled="userSync.status == '2'">
            {{syncStatus[userSync.status]}}
          </Button>
          上次同步时间： {{userSync.lastTime}}
        </Col>

      </Row>

      <Row class="g-search -c-tab" v-show="radioType == 1">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">公众号：</div>
            <Select v-model="form.appId" @on-change="getCustomWxList(1)" class="-search-selectOne" filterable>
              <Option v-for="(item,index) in wxAccount" :label="item.name" :value="item.appId" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">任务状态：</div>
            <Select v-model="form.state" placeholder="请选择" class="-search-selectOne"
                    @on-change="getCustomWxList(1)">
              <Option label="全部" value="4"></Option>
              <Option label="已完成" value="1"></Option>
              <Option label="未发送" value="3"></Option>
              <Option label="已撤销" value="2"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="15" class="g-flex-a-j-center -date-search">
          <Col span="2">发送时间:</Col>
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
              <Button type="primary" class="-p-modal-btn" @click="getCustomWxList(1)">搜索</Button>
            </div>
          </Col>
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
        <wechat-template-list :type="2" :appId="form.appId"></wechat-template-list>
      </div>

      <div v-if="radioType == 3">
        <black-list :type="2"></black-list>
      </div>

    </Card>

    <div v-if="isOpenModal">
      <!--type: 1为微信发送 2为自定义微信发送  otherType: 区分第三方微信-->
      <wx-record-template :data="nowWxId"
                          :type="2"
                          :otherType="true"
                          @closeModal="closeModalRecord">
      </wx-record-template>
    </div>

  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import WxRecordTemplate from "../../../components/wxRecordTemplate";
  import BlackList from "../../../components/blackList";
  import WechatTemplateList from "../custom_wechat_news/wechat_template_list";

  export default {
    components: {WechatTemplateList, BlackList, WxRecordTemplate},
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
          appId: ''
        },
        radioType: '1',
        dataList: [],
        wxAccount: [],
        total: 0,
        isOpenModal: false,
        isFetching: false,
        nowWxId: '',
        userSync: '',
        syncStatus: ['同步失败', '同步用户', '同步中...'],
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
      this.getWxAccountList()
      this.getUserSync()
    },
    methods: {
      syncUserFn() {
        this.userSync.status = '2'
        this.$api.custom.pullFansUser()
          .then(response => {
            this.getUserSync()
          })
      },
      getUserSync() {
        this.$api.custom.getInfo()
          .then(response => {
            this.userSync = response.data.resultData
          })
      },
      closeModalRecord() {
        this.isOpenModal = false;
      },
      currentChange(val) {
        this.tab.page = val;
        this.getCustomWxList();
      },
      getWxAccountList() {
        this.$api.custom.getAppList()
          .then(response => {
            this.wxAccount = response.data.resultData;
            this.form.appId = this.wxAccount[0].appId
            this.getCustomWxList()
          })
      },
      //分页查询
      getCustomWxList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.custom.getWxSendList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          appId: this.form.appId,
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
        this.radioType == 1 && this.getCustomWxList()
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要撤销吗？',
          onOk: () => {
            this.$api.custom.cancelWxTask({
              taskId: param
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getCustomWxList();
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
      width: 100px;
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
