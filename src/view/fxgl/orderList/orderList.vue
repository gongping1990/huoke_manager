<template>
  <div class="p-order">
    <Card>
      <Row class="g-search">
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">订单状态</div>
            <Select v-model="searchInfo.orderMode" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderStatusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">支付状态</div>
            <Select v-model="searchInfo.payStatus" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in payStatusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">推广方式</div>
            <Select v-model="searchInfo.type" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in promoterStatusList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>
      <Row class="g-search -c-tab">
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="0">订单号</Option>
              <Option value="1">用户昵称</Option>
              <Option value="2">手机号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.antistop" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="selectChange"></Input>
          </div>
        </Col>
        <Col :span="10" style="margin-left: 10px" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-center" :total="total"  show-elevator :page-size="tab.pageSize"
            :current="tab.page" @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-order"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      width="600"
      title="订单详情">
      <Form ref="orderInfo" :model="orderInfo" :label-width="90">
        <div class="-p-o-flex">
          <FormItem label="订单号" class="-p-o-width">{{orderInfo.id}}</FormItem>
          <FormItem label="订单金额" class="-p-o-width">{{orderInfo.amount | moneyFormatter}} 元</FormItem>
        </div>
        <div class="-p-o-flex">
          <FormItem label="教材名称" class="-p-o-width">{{orderInfo.courseName}}</FormItem>
          <FormItem label="用户昵称" class="-p-o-width -c-tips g-cursor"><span>{{orderInfo.nickName}}</span></FormItem>
        </div>
        <div class="-p-o-flex">
          <FormItem label="订单状态" class="-p-o-width">{{orderType[orderInfo.orderMode-1]}}</FormItem>
          <FormItem label="三方交易号" class="-p-o-width">{{orderInfo.transactionNo}}</FormItem>
        </div>
        <div class="-p-o-flex">
          <FormItem label="创建时间" class="-p-o-width">{{orderInfo.gmtCreate | timeFormatter}}</FormItem>
          <FormItem label="支付时间" class="-p-o-width">{{orderInfo.timeEnd}}</FormItem>
        </div>
        <div class="-p-o-flex">
          <FormItem label="手机号码" class="-p-o-width">{{orderInfo.phone}}</FormItem>
          <FormItem class="-p-o-width"></FormItem>
        </div>
      </Form>
      <div slot="footer" class="-p-o-footer">
        <div @click="isOpenModal = false" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index";
  import DatePickerTemplate from "@/components/datePickerTemplate";

  export default {
    name: 'fxgl_order',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          payStatus: '-1',
          orderMode: '0',
          type: '-1',
          antistop: ''
        },
        selectInfo: '0',
        orderStatus: {
          '0': '未支付',
          '10': '已支付',
          '20': '已退款'
        },
        orderColor: {
          '0': 'g-error-bg',
          '10': 'g-success-bg',
          '20': 'g-gary-bg'
        },
        payStatusList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '未支付',
            id: '0'
          },
          {
            name: '已支付',
            id: '10'
          },
          {
            name: '已退款',
            id: '20'
          }
        ],
        orderStatusList: [
          {
            name: '全部',
            id: '0'
          },
          {
            name: '单独购买',
            id: '1'
          },
          {
            name: '开团购买',
            id: '2'
          },
          {
            name: '跟团购买',
            id: '3'
          }
        ],
        promoterStatusList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '直接邀请',
            id: '0'
          },
          {
            name: '开团邀请',
            id: '1'
          },
          {
            name: '海报邀请',
            id: '2'
          }
        ],
        orderType: ['单独购买', '开团购买', '跟团购买'],
        promoterType: ['开团邀请', '直接邀请', '海报邀请'],
        dataList: [],
        dateOption: {
          name: '创建时间',
          type: 'datetime',
          row: '2'
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        getStartTime: '',
        getEndTime: '',
        orderInfo: {},
        courseInfo: {},
        columns: [
          {
            title: '订单号',
            key: 'id',
            tooltip: true,
            align: 'center'
          },
          {
            title: '课程名称',
            key: 'courseName',
            tooltip: true,
            align: 'center'
          },
          {
            title: '订单金额',
            render: (h, params) => {
              return h('div', `￥ ${params.row.amount / 100}`)
            },
            align: 'center'
          },
          {
            title: '优惠金额',
            render: (h, params) => {
              return h('div', `￥ ${params.row.couponAmount / 100}`)
            },
            align: 'center'
          },
          {
            title: '实际支付',
            render: (h, params) => {
              return h('div', `￥ ${params.row.payAmount / 100}`)
            },
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '手机号码',
            key: 'phone',
            tooltip: true,
            align: 'center'
          },
          {
            title: '订单状态',
            render: (h, params) => {
              return h('div', this.orderType[params.row.orderMode - 1])
            },
            align: 'center'
          },
          {
            title: '支付状态',
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center'
                }
              },[
                h('div', {
                  class: this.orderColor[params.row.payStatus],
                  style: {
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    marginRight: '8px',
                    borderRadius: '50%',
                  }
                }),
                h('span', this.orderStatus[params.row.payStatus])
              ])
            },
            align: 'center'
          },
          {
            title: '推广方式',
            render: (h, params) => {
              return h('div', this.promoterType[params.row.orderPageSource - 1])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            tooltip: true,
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm"))
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 200,
            render: (h, params) => {
              return h('div', {
                class: 'g-flex-a-j-c-center'
              }, [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#1890FF',
                    marginRight: '15px'
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row)
                    }
                  }
                }, '订单详情'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '您确认要对此订单进行退款操作吗？（只能对购买后7天内的订单进行退款操作）',
                    'ok-text': "确认退款",
                    'cancel-text': "取消"
                  },
                  style: {
                    cursor: 'pointer',
                    color: '#FD9B00',
                    marginRight: '5px'
                  },
                  on: {
                    'on-ok': () => {
                      this.changeAudit(params.row)
                    },
                    'on-cancel': () => {
                    }
                  }
                }, '退款')
              ])
            }
          }
        ],
      };
    },
    filters: {
      moneyFormatter(value) {
        return (value / 100.0).toFixed(2);
      },
      timeFormatter(value) {
        return (dayjs(+value).format('YYYY-MM-DD HH:mm:ss'));
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeAudit(data) {
        this.$api.jsdDistributionOrder.refund({
          id: data.thirdId
        })
          .then(response => {
            this.$Message.success('操作成功')
            })

      },
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.selectChange()
      },
      toExcel() {
        let params = {
          orderId: '',
          nickname: '',
          userId: '',
          ...this.paramsInit()
        }

        let downUrl = `${getBaseUrl()}/order/queryAdminPageDownload?gmtCreateBegin=${params.gmtCreateBegin}&gmtCreateEnd=${params.gmtCreateEnd}&tradeState=${params.tradeState}&mode=${params.mode}&orderId=${params.orderId}&nickname=${params.nickname}&userId=${params.userId}`

        window.open(downUrl, '_blank');
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      selectChange() {
        this.tab.page = 1
        this.tab.currentPage = 1
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        this.orderInfo = data
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          payStatus: this.searchInfo.payStatus === '-1' ? '' : this.searchInfo.payStatus,
          type: this.searchInfo.type === '-1' ? '' : this.searchInfo.type,
          orderMode: this.searchInfo.orderMode,
          startTime: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          endTime: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '0' && this.searchInfo.antistop) {
          params.thirdId = this.searchInfo.antistop
        } else if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickname = this.searchInfo.antistop
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.phone = this.searchInfo.antistop
        }

        return params
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.jsdDistributionOrder.getAdminOrder(this.paramsInit())
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
  .p-order {
    .-title {
      color: #B3B5B8;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .-p-o-width {
      width: 50%;
    }

    .-p-o-footer {
      display: flex;
      justify-content: flex-end;
    }
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
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

    .-p-o-flex {
      display: flex;
      justify-content: space-around;
    }

    .-c-tips {
      color: #39f
    }
  }
</style>
