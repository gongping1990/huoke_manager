<!-->
微信模板消息推送管理页面
<-->
<template>
  <div class="p-wx">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">公众号：</div>
            <Select v-model="form.appId" @on-change="selectChange" class="-search-selectOne" filterable>
              <Option v-for="(item,index) in wxAccount" :label="item.name" :value="item.appid" :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="wxListTotal" size="small" show-elevator
            :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal title="发送记录" v-model="isOpenModal" width="900px" class="p-wx">

      <Row>
        <Col :span="5">发送状态：
          <Select style="width: 100px;" v-model="form.state" placeholder="请选择"
                  @on-change="getWxMessageList(1)">
            <Option label="全部" value="3"></Option>
            <Option label="发送成功" value="1"></Option>
            <Option label="发送失败" value="0"></Option>
          </Select>
        </Col>
        <Col :span="16" class="g-flex-a-j-center -date-search">
          <Col span="3">发送时间：</Col>
          <Col span="7" class="g-flex-a-j-center">
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
              <Button type="primary" class="-p-modal-btn" @click="getWxMessageList(1)">搜索</Button>
            </div>
          </Col>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columnsRecord" :data="wxRecordList"></Table>

      <Page class="g-text-right" :total="wxRecordListTotal" size="small" show-elevator
            :page-size="tabRecord.pageSize"
            :current.sync="tabRecord.currentPage"
            @on-change="currentChangeRecord"></Page>
    </Modal>

  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        tabRecord: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        form: {
          appId: '-1',
          startTime: '',
          endTime: '',
          state: '3'
        },
        dataList: [],
        wxRecordList: [],
        wxAccount: [],
        wxListTotal: 0,
        wxRecordListTotal: 0,
        isOpenModal: false,
        isFetching: false,
        nowWxId: '',
        columns: [
          {
            title: '模板ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '触发条件',
            key: 'triggering',
            align: 'center'
          },
          {
            title: '模板参数',
            render: (h, params) => {
              return h('pre', params.row.param)
            },
          },
          {
            title: '内容示例',
            render: (h, params) => {
              return h('pre', params.row.content)
            },
          },
          {
            title: '链接地址',
            key: 'url',
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
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
                    this.openModal(params.row.templateId)
                  }
                }
              }, '发送记录')
            },
            align: 'center'
          }
        ],
        columnsRecord: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '用户电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '发送内容',
            render: (h, params) => {
              return h('pre', params.row.content)
            },
            align: 'center'
          },
          {
            title: '发送状态',
            render: (h, params) => {
              return h('div', params.row.status ? '发送成功' : '发送失败')
            },
            align: 'center'
          },
          {
            title: '发送时间',
            key: 'creatTime',
            align: 'center'
          },
          {
            title: '链接地址',
            key: 'url',
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getWxList()
      this.getWxAccountList()
    },
    methods: {
      selectChange() {
        this.tab.page = 1
        this.getWxList()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getWxList();
      },
      currentChangeRecord(val) {
        this.tabRecord.page = val;
        this.getWxMessageList();
      },

      //分页查询
      getWxList() {
        this.isFetching = true
        this.$api.user.getWxTemplateList({
          current: this.tab.page,
          size: this.tab.pageSize,
          appid: this.form.appId == '-1' ? '' : this.form.appId
        })
          .then(response => {
            this.dataList = response.data.resultData.records;
            this.wxListTotal = response.data.resultData.total;
          }).finally(() => {
          this.isFetching = false
        })
      },
      getWxAccountList() {
        this.$api.user.getWxList()
          .then(response => {
            this.wxAccount = response.data.resultData;
            this.wxAccount.unshift({
              name: '全部',
              appid: '-1'
            })
          })
      },
      openModal(wxId) {
        this.nowWxId = wxId
        this.isOpenModal = true
        this.form = {
          startTime: '',
          endTime: '',
          state: '3'
        }
        this.getWxMessageList()
      },
      getWxMessageList() {
        this.isFetching = true
        if (num) {
          this.tabRecord.currentPage = 1
        }

        this.$api.user.getWxMessageList({
          current: num ? num : this.tabRecord.page,
          size: this.tabRecord.pageSize,
          id: this.nowSmsId,
          status: this.form.state,
          sendTimeBegin: this.form.startTime ? dayjs(this.form.startTime).format('YYYY/MM/DD HH:mm:ss') : "",
          sendTimeEnd: this.form.endTime ? dayjs(this.form.endTime).format('YYYY/MM/DD HH:mm:ss') : ""
        })
          .then(response => {
            this.wxRecordList = response.data.resultData.records;
            this.wxRecordListTotal = response.data.resultData.total;
          })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>
<style lang="less" scoped>
  .p-wx {
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }
    .-p-tab {
      font-size: 12px;
    }
    .-p-time {
      display: inline-block;
      width: 190px;
      overflow: hidden;
    }
    .-p-span-text {
      display: inline-block;
      vertical-align: super;
    }
    .-p-modal-tab {
      overflow-y: scroll;
      height: 400px;
    }
    .-p-modal-btn {
      vertical-align: bottom;
    }
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      background-color: #F5F5F5;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 4px rgba(234, 234, 234, .3);
      background-color: #555;
    }
    .-c-tab {
      margin: 20px 0;
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

  }
</style>
