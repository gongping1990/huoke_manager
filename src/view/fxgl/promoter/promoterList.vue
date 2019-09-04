<template>
  <div class="p-promoter">
    <Card>
      <Row class="g-search">
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

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current="tab.page" @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-promoter"
      v-model="isOpenModalData"
      @on-cancel="isOpenModalData = false"
      width="800"
      title="数据详情">
      <Table class="-c-tab" :loading="isFetching" :columns="columsType[openType]" :data="detailList"></Table>

      <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
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
        selectInfo: '1',
        dataList: [],
        detailList: [],
        dateOption: {
          name: '注册时间',
          type: 'datetime',
          row: '2'
        },
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModalData: false,
        getStartTime: '',
        getEndTime: '',
        openType: '',
        columns: [
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
                    src: params.row.headImgUrl
                  },
                  style: {
                    width: '36px',
                    height: '36px',
                    margin: '10px',
                    'border-radius': '50%'
                  }
                }),
                h('span', params.row.nickname)
              ])
            }
          },
          {
            title: '手机号码',
            key: 'phone',
            align: 'center'
          },
          {
            title: '注册时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
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
                    color: '#5444E4',
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
                    color: '#5444E4',
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
                    color: '#5444E4',
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
                    color: '#5444E4',
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
        ],
        columnsModalOne: [
          {
            title: '订单号',
            key: 'phoneModel',
            align: 'center'
          },
          {
            title: '商品名称',
            key: 'num',
            align: 'center'
          },
          {
            title: '买家昵称',
            key: 'num',
            align: 'center'
          },
          {
            title: '实付金额',
            key: 'num',
            align: 'center'
          },
          {
            title: '佣金比例',
            key: 'num',
            align: 'center'
          },
          {
            title: '佣金金额',
            key: 'num',
            align: 'center'
          },
          {
            title: '佣金状态',
            key: 'num',
            align: 'center'
          },
          {
            title: '下单时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          }
        ],
        columnsModalTwo: [
          {
            title: '提现金额',
            key: 'phoneModel',
            align: 'center'
          },
          {
            title: '提现申请时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '提现到账时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          },
          {
            title: '提现状态',
            key: 'num',
            align: 'center'
          }
        ],
        columnsModalThree: [
          {
            title: '用户昵称',
            key: 'phoneModel',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'num',
            align: 'center'
          },
          {
            title: '类型',
            key: 'num',
            align: 'center'
          },
          {
            title: '邀请时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
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
          name: 'fxgl_promoterData'
        })
      },
      openModal (data, num) {
        this.openType = num
        this.isOpenModalData = true
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
      getDetailList(data) {
        this.isFetching = true
        this.$api.gswOperational.getOperationalStatistics({
          operationalId: data.id
        }).then(response => {
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
          payStatus: this.searchInfo.status,
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
      getList(num) {
        this.isFetching = true
        this.$api.gswOrder.gswOrderList(this.paramsInit(num))
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

    &-btn {
      display: flex;
      justify-content: flex-end;
    }

  }
</style>
