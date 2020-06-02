<template>
  <div class="p-exchangeCode">
    <input type="text" v-model="copy_url" class="copy-input" ref="copyInput">
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
        <Col :span="10" style="margin-left: 10px" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
          <Button type="primary" ghost class="-p-modal-btn -date-search" @click="toExcel">导出记录</Button>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()" v-if="userInfo.roleCodes[0] === 'admin'">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current="tab.page" @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-exchangeCode"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      width="500"
      title="退款">
      <Form :model="addInfo" :label-width="90" class="ivu-form-item-required">
        <FormItem label="兑换码数量">
          <Input type="text" v-model="addInfo.comment" placeholder="请输入要生成的兑换码数量"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfoTwo')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>

  </div>
</template>

<script>
  import dayjs from 'dayjs';
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
          status: '-1'
        },
        addInfo: {},
        copy_url: '',
        orderStatusList: [
          {
            name: '全部',
            id: '-1'
          },
          {
            name: '待使用',
            id: '0'
          },
          {
            name: '已使用',
            id: '1'
          }
        ],
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
        userInfo: {
          roleCodes: []
        },
        columns: [
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format("YYYY-MM-DD HH:mm:ss"));
            },
            align: 'center'
          },
          {
            title: '兑换码',
            key: 'code',
            tooltip: true,
            align: 'center'
          },
          {
            title: '状态',
            render: (h, params) => {
              return h('div', params.row.used ? '已使用' : '待使用')
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
                      this.copyUrl(params.row);
                    }
                  }
                }, '复制兑换码'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    display: params.row.used ? 'none' : 'inline-block',
                    color: '#5444E4'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row);
                    }
                  }
                }, '设为已使用')
              ]);
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
      this.getList();
      this.userInfo = JSON.parse(localStorage.userInfo)
      console.log(this.userInfo,1)
    },
    methods: {
      copyUrl(param) {
        this.copy_url = param.code
        setTimeout(() => {
          this.$refs.copyInput.select();
          document.execCommand("copy");
          this.$Message.success('复制成功');
        }, 500);
      },
      changeDate(data) {
        this.getStartTime = data.startTime;
        this.getEndTime = data.endTime;
        this.selectChange();
      },
      toExcel() {
        let params = {
          ...this.paramsInit()
        };

        let downUrl = `${getBaseUrl()}/poem/order/getOrderExcele?startTime=${params.startTime}&endTime=${params.endTime}&payStatus=${params.payStatus}`;
        console.log(downUrl, '导出路径');
        window.open(downUrl, '_blank');
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      selectChange() {
        this.tab.page = 1;
        this.tab.currentPage = 1;
        this.getList();
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要更改为已使用？',
          onOk: () => {
            this.$api.gswCourseCode.useCode({
              id: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功");
                  this.getList();
                }
              })
          }
        })
      },
      openModal(data) {
        this.isOpenModal = true;
      },
      paramsInit() {
        let params = {
          current: this.tab.page,
          size: this.tab.pageSize,
          used: this.searchInfo.status === '-1' ? '' : this.searchInfo.status === '1',
          gmtCreateStart: this.getStartTime ? new Date(this.getStartTime).getTime() : "",
          gmtCreateEnd: this.getEndTime ? new Date(this.getEndTime).getTime() : ""
        };
        return params;
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.gswCourseCode.list(this.paramsInit())
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      submitInfo() {
        if (!this.addInfo.comment) {
          return this.$Message.error('请输入兑换码数量');
        }
        this.$api.gswCourseCode.generateCode({
          num: this.addInfo.comment,
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.isOpenModal = false;
                this.getList();
              }
            });

      }
    }
  };
</script>

<style lang="less" scoped>
  .p-exchangeCode {
    .copy-input {
      position: absolute;
      opacity: 0;
    }
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
