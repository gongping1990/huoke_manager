<template>
  <div class="p-cashWithdrawal">
    <Card>
      <Row class="g-search">
        <Col :span="3" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">提现状态：</div>
            <Select v-model="searchInfo.status" @on-change="selectChange" class="-search-selectOne">
              <Option v-for="(item,index) in orderStatusList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>

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
      class="p-cashWithdrawal"
      v-model="isOpenModal"
      width="600"
      title="确认打款">
      <div>您确认已经将提现金额打款到加盟商账户了吗？</div>
      <div>打款是在线下进行的，这里只对金额进行记录</div>
      <Form ref="addInfo" :model="addInfo"  :label-width="100" class="ivu-form-item-required">
        <FormItem label="打款凭证截图">
          <upload-img v-model="addInfo.qrcode" :option="uploadOption"></upload-img>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-v-flex">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index";
  import DatePickerTemplate from "@/components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'fxgl_CashWithdrawal',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        tab: {
          page: 1,
          pageSize: 10
        },
        searchInfo: {
          status: '-1',
          type: '-1',
          antistop: ''
        },
        selectInfo: '1',
        orderStatus: {
          '0': '未支付',
          '10': '已支付'
        },
        orderStatusList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '提现成功',
            id: '0'
          },
          {
            name: '提现失败',
            id: '10'
          },
          {
            name: '处理中',
            id: '20'
          }
        ],
        orderType: ['提现成功', '提现失败', '处理中'],
        dataList: [],
        dateOption: {
          name: '申请时间',
          type: 'datetime',
          row: '2'
        },
        total: 0,
        isFetching: false,
        isOpenModal: false,
        getStartTime: '',
        getEndTime: '',
        addInfo: {},
        columns: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '手机号码',
            key: 'phone',
            align: 'center'
          },
          {
            title: '提现金额',
            key: 'phone',
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
            render: (h, params) => {
              return h('div', this.orderType[params.row.orderPageSource-1])
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
                }, '确认打款')
              ])
            }
          },
          {
            title: '打款凭证截图',
            key: 'phone',
            align: 'center'
          },
          {
            title: '操作人',
            key: 'phone',
            align: 'center'
          },
          {
            title: '操作时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"))
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
      openModal () {
        this.isOpenModal = true
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
      selectChange() {
        this.tab.page = 1
        this.tab.currentPage = 1
        this.getList();
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
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
      submitInfo () {

      }
    }
  };
</script>

<style lang="less" scoped>
  .p-cashWithdrawal {
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

    .-p-v-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

  }
</style>
