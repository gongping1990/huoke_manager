<template>
  <div class="p-franchisorAudit">
    <Card>
      <Row class="g-search">
        <Row class="g-t-left">
          <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
            <Radio :label=0>待审核</Radio>
            <Radio :label=1>已通过</Radio>
            <Radio :label=2>未通过</Radio>
          </Radio-group>
        </Row>

        <Row class="g-t-left" style="margin-top: 30px">
          <Col :span="5">
            <div class="-search">
              <Select v-model="selectInfo" class="-search-select">
                <Option value="1">用户昵称</Option>
                <Option value="2">手机号码</Option>
              </Select>
              <span class="-search-center">|</span>
              <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                     @on-click="getList(1)"></Input>
            </div>
          </Col>
          <Col :span="16" class="g-flex-a-j-center">
            <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          </Col>
        </Row>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="radioType === 0 ? columns : columnsTwo"
             :data="dataList"></Table>

      <Page class="g-t-center" :total="total" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>
  </div>
</template>

<script>
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import dayjs from 'dayjs'

  export default {
    name: 'fxgl_franchisorAudit',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dateOption: {
          name: '申请时间',
          type: 'datetime'
        },
        dataList: [],
        total: 0,
        selectInfo: '1',
        searchInfo: {},
        radioType: 0,
        isFetching: false,
        columns: [
          {
            title: '用户昵称',
            key: 'userName',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center'
          },
          {
            title: '所在城市',
            key: 'area',
            align: 'center'
          },
          {
            title: '职业',
            key: 'occupate',
            align: 'center'
          },
          {
            title: '申请时间',
            key: 'applyTime',
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认要通过审核吗？',
                    'ok-text': "通过",
                    'cancel-text': "不通过"
                  },
                  style: {
                    cursor: 'pointer',
                    color: '#1890FF',
                    marginRight: '5px'
                  },
                  on: {
                    'on-ok': () => {
                      this.changeAudit(params.row, 1)
                    },
                    'on-cancel': () => {
                      this.changeAudit(params.row, 2)
                    }
                  }
                }, '审核')
              ])
            }
          }
        ],
        columnsTwo: [
          {
            title: '用户昵称',
            key: 'userName',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center'
          },
          {
            title: '所在城市',
            key: 'area',
            align: 'center'
          },
          {
            title: '职业',
            key: 'occupate',
            align: 'center'
          },
          {
            title: '预约时间',
            key: 'applyTime',
            align: 'center'
          },
          {
            title: '最新审核时间',
            key: 'auditTime',
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '确认重置为不通过？'
                  },
                  style: {
                    display: this.radioType === 2 ? 'none' : 'inline-block',
                    cursor: 'pointer',
                    color: '#1890FF',
                    marginRight: '5px'
                  },
                  on: {
                    'on-ok': () => {
                      this.changeAudit(params.row, 2)
                    },
                    'on-cancel': () => {
                    }
                  }
                }, '不通过')
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
      changeDate(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        this.getList(1)
      },
      changeAudit(param, num) {
        this.$api.jsdDistributie.audit({
          auditId: param.userId,
          auditStatus: num
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {}
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList(num) {
        this.isFetching = true

        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          status: this.radioType,
          applyStart: this.searchInfo.getStartTime ? new Date(this.searchInfo.getStartTime).getTime() : "",
          applyEnd: this.searchInfo.getEndTime ? new Date(this.searchInfo.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickName = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        if (num) {
          this.tab.currentPage = 1
        }

        this.$api.jsdDistributie.listByApplyFranchisee(params)
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
  .p-franchisorAudit {
    .-c-tips {
      color: #39f
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      margin-top: 20px;
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 29px 0;
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
