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
            <Select v-model="searchInfo.orderType" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderTypeList" :label="item.name" :value="item.id" :key="index"></Option>
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
      :title="nowStatus === 1 ? '人数记录' : '订单详情'">
      <Table class="-c-tab" :loading="isFetching" :columns="orderInfo.orderType === 1 ? columnsDetail : columnsDetailTwo" :data="dataListDetail" v-if="nowStatus === 1"></Table>

      <Form ref="orderInfo" :model="orderInfo" :label-width="90" v-else>
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
        <div class="-p-o-title" v-if="orderInfo.refundInfo">
          退款信息
        </div>
        <div class="-p-o-flex" v-if="orderInfo.refundInfo">
          <FormItem label="退款发起时间" class="-p-o-width">{{orderInfo.refundInfo.gmtCreate | timeFormatter}}</FormItem>
          <FormItem label="退款结果" class="-p-o-width">{{orderStatus[orderInfo.orderStatus]}}</FormItem>
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
          orderType: '-1',
          type: '-1',
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
            id: '1'
          },
          {
            name: '组队领课',
            id: '2'
          },
          {
            name: '分享免费领课',
            id: '3'
          }
        ],
        orderType: ['单独购买', '团体拼课', '好友助力','秒杀订单'],
        dataList: [],
        dataListDetail: [],
        dateOption: {
          name: '创建时间',
          type: 'datetime',
          row: '2'
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalRefund: false,
        nowStatus: '',
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
              return h('div', this.orderTypeList[params.row.orderType+1].name)
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm"))
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
                      this.openModal(params.row,2)
                    }
                  }
                }, '订单详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#5444E4',
                    display: (params.row.orderType == '1' || params.row.orderType == '2') ? 'inline-block' : 'none',
                  },
                  on: {
                    click: () => {
                      this.openModal(params.row,1)
                    }
                  }
                }, `${params.row.orderType == '1' ? '助力人数' :'邀请人数'}(${params.row.invitedUserCount || 0})`),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: (params.row.orderStatus == '10' || params.row.orderStatus == '14') ? 'inline-block' : 'none',
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
        columnsDetail: [
          {
            title: '助力人',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center'
          },
          {
            title: '助力时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm"))
            },
            align: 'center'
          },
          {
            title: '助力后是否购买',
            render: (h, params)=> {
              return h('div', params.row.buyed ? '是' : '否')
            },
            align: 'center'
          }
        ],
        columnsDetailTwo: [
          {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '邀请时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm"))
            },
            align: 'center'
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
      openModal(data, num) {
        this.nowStatus = num
        this.isOpenModal = true
        this.orderInfo = data
        num === 1 && this.getOrderHelpUser(data)
      },
      openModalRerund(data) {
        this.isOpenModalRefund = true
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          orderStatus: this.searchInfo.status,
          orderType: this.searchInfo.orderType === '-1' ? '' : this.searchInfo.orderType,
          createStart: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          createEnd: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '0' && this.searchInfo.antistop) {
          params.orderId = this.searchInfo.antistop
        } else if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickName = this.searchInfo.antistop
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.courseName = this.searchInfo.antistop
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
      },
      getOrderHelpUser(data) {
        this.$api.hkywhdOrder.getOrderHelpUser({
          orderId: data.id
        })
          .then(
            response => {
              this.dataListDetail = response.data.resultData;
            })

      },
      submitInfo() {
        if (!this.addInfo.comment) {
          return this.$Message.error('请输入退款备注')
        }
        this.$api.hkywhdOrder.refund({
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
      color: #B3B5B8 ;
      margin: 5px 0;
      font-size: 16px;
    }
    .-p-o-width {
      width: 50%;
    }

    .-title {
      color: #B3B5B8;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
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
