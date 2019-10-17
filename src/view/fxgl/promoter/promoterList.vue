<template>
  <div class="p-promoter">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-flex-a-j-center">
          <Radio-group v-model="radioType" type="button" @on-change="getList">
            <Radio :label=0>推广人列表</Radio>
            <Radio :label=1>加盟商列表</Radio>
          </Radio-group>
        </Col>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="6">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
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

      <Page class="g-t-center" :total="total" show-elevator :page-size="tab.pageSize"
            :current="tab.page" @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-promoter"
      v-model="isOpenModalData"
      @on-cancel="isOpenModalData = false"
      width="900"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columsType[openType]" :data="detailList"></Table>

      <Page class="g-t-center" :total="totalDetail"  show-elevator :page-size="tabDetail.pageSize"
            :current.sync="tabDetail.currentPage"
            @on-change="detailCurrentChange"></Page>
      <div slot="footer" class="p-promoter-btn">
        <div @click="isOpenModalData = false" class="g-primary-btn"> 确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index";
  import DatePickerTemplate from "@/components/datePickerTemplate";

  export default {
    name: 'fxgl_promoter',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          status: '-1',
          type: '-1',
          antistop: ''
        },
        radioType: 0,
        selectInfo: '1',
        dataList: [],
        detailList: [],
        dataItem: '',
        dateOption: {
          name: '注册时间',
          type: 'datetime',
          row: '2'
        },
        statusList: {
          '0': '未知',
          '1': '冻结中',
          '5': '已退款',
          '10': '已获得'
        },
        withdrawStatusList: {
          '0': '未知',
          '1': '处理中',
          '2': '提现成功',
          '3': '提现失败'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModalData: false,
        getStartTime: '',
        getEndTime: '',
        openType: '',
        columnsModalTwo: [
          {
            title: '提现金额',
            render: (h, params) => {
              return h('div', `￥ ${params.row.amount / 100}`)
            },
            align: 'center'
          },
          {
            title: '提现申请时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm"))
            },
            align: 'center'
          },
          {
            title: '提现到账时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.intoAccountTime).format("YYYY-MM-DD HH:mm"))
            },
            align: 'center'
          },
          {
            title: '提现状态',
            render: (h, p)=>{
              return h('div', this.withdrawStatusList[p.row.withdrawStatus])
            },
            align: 'center'
          }
        ]
      };
    },
    computed: {
      columsType() {
        return {
          '1': this.columnsModalOne,
          '2': this.columnsModalTwo,
          '3': this.columnsModalThree
        }
      },
      columns () {
        let storage = []
        if (this.radioType === 0) {
          storage = [
            {
              title: '用户头像/昵称',
              render: (h, params) => {
                return h('div', {
                  style: {
                    'display': 'flex',
                    'align-items': 'center',
                  }
                }, [
                  h('img', {
                    attrs: {
                      src: params.row.headimgurl
                    },
                    style: {
                      width: '36px',
                      height: '36px',
                      margin: '10px',
                      'border-radius': '50%'
                    }
                  }),
                  h('span', params.row.userName)
                ])
              }
            },
            {
              title: '手机号码',
              key: 'phone',
              align: 'center'
            },
            {
              title: '加盟商',
              key: 'franchisee',
              align: 'center'
            },
            {
              title: '注册时间',
              key: 'applyTime',
              align: 'center'
            },
            {
              title: '操作',
              align: 'center',
              width: 320,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModal(params.row,1)
                      }
                    }
                  }, '收益明细'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModal(params.row,2)
                      }
                    }
                  }, '提现明细'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModal(params.row,3)
                      }
                    }
                  }, '邀请明细'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openUrl(params.row)
                      }
                    }
                  }, '数据统计')
                ])
              }
            }
          ]
        } else {
          storage = [
            {
              title: '用户头像/昵称',
              key: 'userName',
              align: 'center'
            },
            {
              title: '手机号码',
              key: 'phone',
              align: 'center'
            },
            {
              title: '注册时间',
              key: 'applyTime',
              align: 'center'
            },
            {
              title: '操作',
              align: 'center',
              width: 320,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModal(params.row,1)
                      }
                    }
                  }, '收益明细'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModal(params.row,2)
                      }
                    }
                  }, '提现明细'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModal(params.row,3)
                      }
                    }
                  }, '邀请明细'),
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#1890FF',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openUrl(params.row)
                      }
                    }
                  }, '数据统计')
                ])
              }
            }
          ]
        }

        return storage
      },
      columnsModalOne () {
        let storage = []
        if (this.radioType === 0) {
          storage = [
            {
              title: '订单号',
              key: 'thirdId',
              tooltip: true,
              align: 'center'
            },
            {
              title: '商品名称',
              key: 'courseName',
              render: (h, params)=> {
                return h('div', (params.row.accountIncomeType ==3 || params.row.accountIncomeType ==4)? '新手任务' : params.row.courseName)
              },
              tooltip: true,
              align: 'center'
            },
            {
              title: '买家昵称',
              key: 'thirdUserNickname',
              align: 'center'
            },
            {
              title: '实付金额',
              render: (h, params) => {
                return h('div', params.row.payAmount ? `￥ ${params.row.payAmount / 100}` : '-')
              },
              align: 'center'
            },
            {
              title: '佣金比例',
              render: (h, params) => {
                return h('div', params.row.distributorProportion ? `${params.row.distributorProportion}%` : '-')
              },
              align: 'center'
            },
            {
              title: '佣金金额',
              render: (h, params) => {
                return h('div', `￥ ${params.row.amount / 100}`)
              },
              align: 'center'
            },
            {
              title: '佣金状态',
              key: 'incomeStatus',
              render: (h, p)=>{
                return h('div', this.statusList[p.row.incomeStatus])
              },
              align: 'center'
            },
            {
              title: '下单时间',
              width: 150,
              render: (h, params) => {
                return h('div', params.row.gmtCreate  ? dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm") : '-')
              },
              align: 'center'
            }
          ]
        } else {
          storage = [
            {
              title: '订单号',
              key: 'thirdId',
              tooltip: true,
              align: 'center'
            },
            {
              title: '商品名称',
              key: 'courseName',
              tooltip: true,
              align: 'center'
            },
            {
              title: '买家昵称',
              key: 'thirdUserNickname',
              align: 'center'
            },
            {
              title: '实付金额',
              render: (h, params) => {
                return h('div', `￥ ${params.row.payAmount / 100}`)
              },
              align: 'center'
            },
            {
              title: '推广人',
              key: 'num',
              align: 'center'
            },
            {
              title: '佣金比例',
              render: (h, params) => {
                return h('div', `${params.row.distributorProportion}%`)
              },
              align: 'center'
            },
            {
              title: '佣金金额',
              render: (h, params) => {
                return h('div', `￥ ${params.row.amount / 100}`)
              },
              align: 'center'
            },
            {
              title: '佣金状态',
              render: (h, p)=>{
                return h('div', this.statusList[p.row.incomeStatus])
              },
              align: 'center'
            },
            {
              title: '下单时间',
              render: (h, params) => {
                return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm"))
              },
              align: 'center'
            }
          ]
        }

        return storage
      },
      columnsModalThree () {
        let storage = []
        if (this.radioType === 0) {
          storage = [
            {
              title: '用户昵称',
              key: 'nickName',
              align: 'center'
            },
            {
              title: '手机号',
              key: 'phone',
              align: 'center'
            },
            {
              title: '邀请时间',
              render: (h, params) => {
                return h('div', dayjs(+params.row.applyTime).format("YYYY-MM-DD HH:mm"))
              },
              align: 'center'
            }
          ]
        } else {
          storage = [
            {
              title: '推广人昵称',
              key: 'nickName',
              align: 'center'
            },
            {
              title: '手机号',
              key: 'phone',
              align: 'center'
            },
            {
              title: '推广人注册时间',
              render: (h, params) => {
                return h('div', dayjs(+params.row.applyTime).format("YYYY-MM-DD HH:mm"))
              },
              align: 'center'
            }
          ]
        }

        return storage
      }
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
      openUrl () {
        this.$router.push({
          name: 'fxgl_promoterData',
          query: {
            type: this.radioType
          }
        })
      },
      openModal (data, num) {
        this.openType = num
        this.dataItem = data
        this.isOpenModalData = true
        this.getDetailList()
      },
      changeDate (data) {
        this.getStartTime = data.startTime
        this.getEndTime = data.endTime
        this.selectChange()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      selectChange() {
        this.tab.page = 1
        this.tab.currentPage = 1
        this.getList(1);
      },
      getDetailList() {
        this.isFetching = true
        let paramUrl = ''
        let params = {
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
        }
        switch (+this.openType) {
          case 1:
            paramUrl = this.$api.jsdDistributorAccount.getAdminUserIncomeRecord({
              ...params,
              userId: this.dataItem.userId
            })
            break
          case 2:
            paramUrl = this.$api.jsdDistributorAccount.getAdminUserWithDrawRecord({
              ...params,
              userId: this.dataItem.userId
            })
            break
          case 3:
            if (this.radioType == 0) {
              paramUrl =  this.$api.jsdDistributie.pageBindingRelationship({
                ...params,
                promoterId: this.dataItem.userId
              })
            } else {
              paramUrl =  this.$api.jsdDistributie.pageByInvitationUser({
                ...params,
                promoterId: this.dataItem.userId
              })
            }
            break
        }
        paramUrl.then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(()=>{
          this.isFetching = false
        })
      },
      paramsInit(num) {
        if (num) {
          this.tab.currentPage = 1
        }

        let params = {
          current:  num ? num : this.tab.page,
          size: this.tab.pageSize,
          applyStart: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          applyEnd: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        }

        if (this.selectInfo == '1' && this.searchInfo.antistop) {
          params.nickName = this.searchInfo.antistop
        } else if (this.selectInfo == '2' && this.searchInfo.antistop) {
          params.phone = this.searchInfo.antistop
        }

        return params
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let paramUrl = this.radioType === 0 ? this.$api.jsdDistributie.listByPromoter : this.$api.jsdDistributie.listByFranchisee
        paramUrl(this.paramsInit(num))
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
  .p-promoter {
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

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

  }
</style>
