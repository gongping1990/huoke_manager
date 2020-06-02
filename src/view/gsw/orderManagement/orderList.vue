<template>
  <div class="p-order">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">支付状态：</div>
            <Select v-model="searchInfo.status" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderStatusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">订单类型：</div>
            <Select v-model="searchInfo.orderMode" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderListTwo" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
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
        <Col :span="8" style="margin-left: 10px" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
        <div class="g-text-right">
          <Button type="primary" ghost class="-p-modal-btn -date-search" @click="toExcel">导出表格</Button>
        </div>
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
        <div class="-p-o-title" v-if="orderInfo.refundInfo">
          退款信息
        </div>
        <div class="-p-o-flex" v-if="orderInfo.refundInfo">
          <FormItem label="退款发起时间" class="-p-o-width">{{orderInfo.refundInfo.gmtCreate | timeFormatter}}</FormItem>
          <FormItem label="退款结果" class="-p-o-width">{{orderStatus[orderInfo.payStatus]}}</FormItem>
        </div>
        <div class="-p-o-flex" v-if="orderInfo.refundInfo">
          <FormItem label="退款结果时间" class="-p-o-width">{{orderInfo.refundInfo.successTime}}</FormItem>
          <FormItem label="退款备注" class="-p-o-width">{{orderInfo.refundInfo.comment}}</FormItem>
        </div>
      </Form>
      <div slot="footer" class="-p-o-footer">
        <div @click="isOpenModal = false" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>

    <Modal
      class="p-order"
      v-model="isOpenModalRefund"
      @on-cancel="isOpenModalRefund = false"
      width="500"
      title="退款">
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="退款备注">
          <Input type="textarea" :rows="4" v-model="addInfo.comment" placeholder="请输入退款备注" :maxlength='80'></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalRefund = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfoTwo')" class="g-primary-btn ">确 认</div>
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
          orderMode: '-1',
          antistop: ''
        },
        selectInfo: '0',
        addInfo: {},
        orderStatus: {
          '0': '未支付',
          '10': '已支付',
          '13': '退款中',
          '14': '退款失败',
          '15': '已退款',
          '20': '已取消',
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
            name: '退款中',
            id: '13'
          },
          {
            name: '退款失败',
            id: '14'
          },
          {
            name: '已退款',
            id: '15'
          },
          {
            name: '已取消',
            id: '20'
          }
        ],
        orderListTwo: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '单独购买',
            id: '1'
          },
          {
            name: '跟团购买',
            id: '3'
          },
          {
            name: '打包购买',
            id: '5'
          },
          {
            name: '课程兑换',
            id: '6'
          }
        ],
        orderType: ['单独购买', '开团购买', '跟团购买', '手动开通', '打包购买', '课程兑换'],
        orderPageType: ['玖桔成都', '社群', '公众号投放'],
        dataList: [],
        dateOption: {
          name: '创建时间',
          type: 'datetime',
          row: '2'
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalRefund: false,
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
            render: (h, params) => {
              return h('div', params.row.orderMode === 5 ? params.row.tagName : params.row.courseName)
            },
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
            title: '优惠金额',
            render: (h, params) => {
              return h('div', params.row.couponAmount / 100)
            },
            align: 'center'
          },
          {
            title: '实际支付',
            render: (h, params) => {
              return h('div', params.row.payAmount / 100)
            },
            align: 'center'
          },
          {
            title: '用户昵称',
            key: 'nickName',
            tooltip: true,
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
              return h('div', this.orderStatus[params.row.payStatus])
            },
            align: 'center'
          },
          {
            title: '落地页面',
            render: (h, params) => {
              return h('div', this.orderPageType[params.row.orderPageSource - 1])
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
                }, '订单详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: ((params.row.payStatus == '10' || params.row.payStatus == '14') && params.row.orderMode !== 6) ? 'inline-block' : 'none',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.openModalRerund(params.row)
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
      changeDate(data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.selectChange()
      },
      toExcel() {
        let params = {
          id: '',
          nickname: '',
          userId: '',
          phone: '',
          ...this.paramsInit()
        }

        let downUrl = `${getBaseUrl()}/poem/order/getOrderExcele?startTime=${params.startTime}&endTime=${params.endTime}&payStatus=${params.payStatus}&nickName=${params.nickname}&id=${params.id}&phone=${params.phone}`
        console.log(downUrl, '导出路径')
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
      openModalRerund(data) {
        this.isOpenModalRefund = true
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          payStatus: this.searchInfo.status,
          orderMode: this.searchInfo.orderMode,
          startTime: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          endTime: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '0' && this.searchInfo.antistop) {
          params.id = this.searchInfo.antistop
        } else if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickName = this.searchInfo.antistop
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.phone = this.searchInfo.antistop
        }

        return params
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.gswOrder.gswOrderList(this.paramsInit())
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        if (!this.addInfo.comment) {
          return this.$Message.error('请输入退款备注')
        }
        this.$api.gswOrder.refund({
          orderId: this.addInfo.id,
          comment: this.addInfo.comment,
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.isOpenModalRefund = false
                this.getList()
              }
            })

      }
    }
  };
</script>

<style lang="less" scoped>
  .p-order {
    .-p-o-title {
      color: #B3B5B8;
      margin: 5px 0;
      font-size: 16px;
    }
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

    .-c-red {
      color: rgb(218, 55, 75);
    }

  }
</style>
