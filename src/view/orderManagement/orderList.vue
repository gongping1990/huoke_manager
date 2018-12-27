<template>
  <div class="p-help">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">订单类型：</div>
            <Select v-model="searchInfo.type" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">订单状态：</div>
            <Select v-model="searchInfo.status" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderStatusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="0">订单号</Option>
              <Option value="1">用户昵称</Option>
              <Option value="2">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.antistop" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList"></Input>
          </div>
        </Col>
      </Row>
      <Row class="g-search -c-tab">
        <Col :span="18" class="g-flex-a-j-center">
          <div class="-search-select-text">反馈时间：</div>
          <Col span="14" class="g-flex-a-j-center">
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择开始日期"
                           v-model="getStartTime"></Date-picker>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div>
              <Date-picker class="date-time" type="datetime" placeholder="选择结束日期"
                           v-model="getEndTime"></Date-picker>
            </div>
            <div class="-date-search g-flex-j-sa">
              <Button type="primary" class="-p-modal-btn" @click="getList">搜索</Button>
              <Button type="primary" ghost class="-p-modal-btn -date-search" @click="toExcel">导出表格</Button>
            </div>
          </Col>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current="tab.page" @on-change="currentChange" ></Page>
    </Card>

    <Modal
      class="p-help"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="600"
      title="编辑好友助力">
      <Form ref="addInfo" :model="addInfo" :label-width="90">
        <FormItem label="助力人数" prop="frendHelpCount" class="ivu-form-item-required">
          <Input type="text" :disabled="isEdit" v-model="addInfo.frendHelpCount" placeholder="请输入助力人数"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <div @click="closeModal('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index";

  export default {
    name: 'orderList',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          status: '-1',
          type: '-1',
          antistop: ''
        },
        selectInfo: '0',
        orderStatus: {
          'SUCCESS': '已完成',
          'NOTPAY': '待支付',
          'REVOKED': '已取消'
        },
        orderStatusList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '已完成',
            id: 'SUCCESS'
          },
          {
            name: '待支付',
            id: 'NOTPAY'
          },
          {
            name: '已取消',
            id: 'REVOKED'
          }
        ],
        orderType: ['单独购买', '团体拼课', '好友助力'],
        orderTypeList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '单独购',
            id: '0'
          },
          {
            name: '拼课',
            id: '1'
          },
          {
            name: '好友助力',
            id: '2'
          }
        ],
        dataList: [],
        courseList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        isEdit: false,
        getStartTime: '',
        getEndTime: '',
        addInfo: {},
        columns: [
          {
            title: '课程名称',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '课程封面',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.url
                },
                style: {
                  width: '100px',
                  height: '60px',
                  margin: '10px'
                }
              })
            },
            align: 'center'
          },
          {
            title: '订单金额',
            render: (h, params) => {
              return h('div', params.row.price / 100)
            },
            align: 'center'
          },
          {
            title: '优惠金额',
            render: (h, params) => {
              return h('div', params.row.couponAmount / 100)
            },
            align: 'center'
          },
          {
            title: '实际支付',
            render: (h, params) => {
              return h('div', params.row.actualAmount / 100)
            },
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '订单类型',
            render: (h, params) => {
              return h('div', this.orderType[params.row.mode])
            },
            align: 'center'
          },
          {
            title: '订单状态',
            render: (h, params) => {
              return h('div', this.orderStatus[params.row.tradeState])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
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
                }, '订单详情')
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
      toExcel() {
        let params = {
          orderId: '',
          nickname: '',
          userId: '',
          ...this.paramsInit()
        }
        console.log(params)
        let downUrl = `${getBaseUrl()}/order/queryAdminPageDownload?gmtCreateBegin=${params.gmtCreateBegin}&gmtCreateEnd=${params.gmtCreateEnd}&tradeState=${params.tradeState}&mode=${params.mode}&orderId=${params.orderId}&nickname=${params.nickname}&userId=${params.userId}`

        window.open(downUrl, '_blank');
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      selectChange() {
        this.tab.page = 1
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          let _self = this
          this.isEdit = true
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.limit = this.addInfo.activityCount == '-1' ? 0 : 1
          this.getStartTime = new Date(this.addInfo.startTime)
          this.getEndTime = new Date(this.addInfo.endTime)
          this.dateEndOption = {
            disabledDate(date) {
              return date && date.valueOf() < (_self.addInfo.endTime - 24 * 60 * 60 * 1000)
            }
          }
        } else {
          this.getStartTime = ''
          this.getEndTime = ''
          this.isEdit = false
          this.addInfo = {
            limit: 0
          }
        }
      },
      closeModal(name) {
        this.isOpenModal = false
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          mode: this.searchInfo.type == '-1' ? '' : this.searchInfo.type,
          tradeState: this.searchInfo.status == '-1' ? '' : this.searchInfo.status,
          gmtCreateBegin: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          gmtCreateEnd: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '0' && this.searchInfo.antistop) {
          params.orderId = this.searchInfo.antistop
        } else if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickname = this.searchInfo.antistop
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.courseName = this.searchInfo.antistop
        }

        return params
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.order.orderList(this.paramsInit())
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
  .p-help {
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
