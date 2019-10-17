<template>
  <div class="p-order">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">订单状态：</div>
            <Select v-model="searchInfo.status" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderStatusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">订单类型：</div>
            <Select v-model="searchInfo.status" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderTypeList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="0">订单号</Option>
              <Option value="1">用户昵称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.antistop" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="selectChange"></Input>
          </div>
        </Col>
        <Col :span="7" style="margin-left: 10px" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
        <!--<div class="g-text-right">-->
          <!--<Button type="primary" ghost class="-p-modal-btn -date-search" @click="toExcel">导出表格</Button>-->
        <!--</div>-->
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
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
          <FormItem label="教材名称" class="-p-o-width">{{orderInfo.bookName}}</FormItem>
          <FormItem label="用户昵称" class="-p-o-width -c-tips g-cursor"><span>{{orderInfo.nickName}}</span></FormItem>
        </div>
        <div class="-p-o-flex">
          <FormItem label="订单状态" class="-p-o-width">{{orderStatus[orderInfo.orderStatus]}}</FormItem>
          <FormItem label="三方交易号" class="-p-o-width">{{orderInfo.transactionNo}}</FormItem>
        </div>
        <div class="-p-o-flex">
          <FormItem label="创建时间" class="-p-o-width">{{orderInfo.gmtCreate | timeFormatter}}</FormItem>
          <FormItem label="支付时间" class="-p-o-width">{{orderInfo.timeEnd}}</FormItem>
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
    name: 'orderList',
    components: {DatePickerTemplate},
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
          '0': '未支付',
          '10': '已支付',
          '20': '已取消'
        },
        orderStatusList: [
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
            name: '已取消',
            id: '20'
          }
        ],
        orderTypeList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '直接购买',
            id: '0'
          },
          {
            name: '邀请好友解锁课程',
            id: '10'
          }
        ],
        orderType: ['单独购买', '团体拼课', '好友助力','秒杀订单'],
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
            title: '教材名称',
            key: 'bookName',
            align: 'center'
          },
          {
            title: '订单金额',
            render: (h, params) => {
              return h('div', params.row.amount / 100)
            },
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },

          {
            title: '订单状态',
            render: (h, params) => {
              return h('div', this.orderStatus[params.row.orderStatus])
            },
            align: 'center'
          },
          {
            title: '订单类型',
            render: (h, params) => {
              return h('div', this.orderStatus[params.row.orderStatus])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
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
      changeDate (data) {
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
          orderStatus: this.searchInfo.status,
          createStart: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          createEnd: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '0' && this.searchInfo.antistop) {
          params.orderId = this.searchInfo.antistop
        } else if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickName = this.searchInfo.antistop
        }

        return params
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.hkywhdOrder.hkywOrderList(this.paramsInit())
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

    .-p-o-flex {
      display: flex;
      justify-content: space-around;
    }

    .-c-tips {
      color: #39f
    }

    .-c-red{
      color: rgb(218, 55, 75);
    }

  }
</style>
