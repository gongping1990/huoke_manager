<template>
  <div class="p-deliverGoods">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <Radio :label=0>待发货</Radio>
          <Radio :label=10>已发货</Radio>
        </Radio-group>
      </Row>

      <Row class="g-search -c-tab">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.nickname" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="14" class="g-flex-a-j-center -date-search">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>

      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="radioType ? columnsUnanswered : columns"
             :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-deliverGoods"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      title="填写发货信息">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="发货人" prop="sender">
          <Input type="text" v-model="addInfo.sender" placeholder="请输入发货人"></Input>
        </FormItem>
        <FormItem label="物流单号" prop="logisticsOddNum">
          <Input type="text" v-model="addInfo.logisticsOddNum" placeholder="请输入物流单号"></Input>
        </FormItem>
        <FormItem label="物流公司" prop="logisticsCompany">
          <Input type="text" v-model="addInfo.logisticsCompany" placeholder="请输入物流公司"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index";
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'deliverGoods',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        searchInfo: {
          nickname: '',
          startTime: '',
          endTime: ''
        },
        dateOption: {
          name: '创建时间',
          type: 'datetime'
        },
        selectInfo: '1',
        downInfo: {
          data: [],
          errorId: '',
          isSucess: false
        },
        dataList: [],
        total: 0,
        radioType: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          sender: [
            {required: true, message: '请输入发货人', trigger: 'blur'},
          ],
          logisticsOddNum: [
            {required: true, message: '请输入物流单号', trigger: 'blur'},
          ],
          logisticsCompany: [
            {required: true, message: '请输入物流公司', trigger: 'blur'},
          ],
        },
        columns: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '奖品名称',
            key: 'prizeName',
            align: 'center'
          },
          {
            title: '收货信息',
            render: (h,params)=>{
              return h('div',{
                style: {
                  'text-align': 'left'
                }
              },[
                h('div',`名称：${params.row.name}`),
                h('div',`电话：${params.row.telephone}`),
                h('div',`地址：${params.row.areas}`),
                h('div',`详情：${params.row.address}`)
              ])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format('YYYY-MM-DD HH:mm:ss'))
            }
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
                }, '发货')
              ])
            }
          }
        ],
        columnsUnanswered: [
          {
            title: '用户昵称',
            key: 'nickName',
            align: 'center'
          },
          {
            title: '奖品名称',
            key: 'prizeName',
            align: 'center'
          },
          {
            title: '收货信息',
            render: (h,params)=>{
              return h('div',{
                style: {
                  'text-align': 'left'
                }
              },[
                h('div',`名称：${params.row.name}`),
                h('div',`电话：${params.row.telephone}`),
                h('div',`地址：${params.row.areas}`),
                h('div',`详情：${params.row.address}`)
              ])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            render: (h, params) => {
              return h('div', dayjs(+params.row.gmtCreate).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '发货信息',
            render: (h,params)=>{
              return h('div',{
                style: {
                  'text-align': 'left'
                }
              },[
                h('div',`发货人：${params.row.sender}`),
                h('div',`物流单号：${params.row.logisticsOddNum}`),
                h('div',`物流公司：${params.row.logisticsCompany}`)
              ])
            },
            align: 'center'
          },
          {
            title: '发货时间',
            render: (h, params) => {
              return h('div', dayjs(params.row.sendTime).format("YYYY-MM-DD HH:mm:ss"))
            },
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeDate(data) {
        this.searchInfo.startTime = data.startTime
        this.searchInfo.endTime = data.endTime
        this.getList(1)
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify({
          id: data.id
        }))
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        let startTime = ''
        let endTime = ''
        startTime = this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : ''
        endTime = this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.gswPrzie.getAdminConvertOrder({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          send: this.radioType == 10,
          nickName: this.searchInfo.nickname,
          startTime: startTime,
          endTime: endTime
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.dataList.forEach(item => {
                item.recipient = JSON.parse(item.recipient)
                item.sendinfo = JSON.parse(item.sendinfo)
              })
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.gswPrzie.prizeSend({
              ...this.addInfo
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList()
                    this.closeModal(name)
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-deliverGoods {

    .-p-btn-error {
      margin: 16px auto 0;
    }
    .-d-modal {
      justify-content: space-around;
    }

    .-p-d-wrap {
      justify-content: flex-end;
      .-btn {
        margin-right: 16px;
      }
    }

    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-c-tip {
      margin-top: 10px;
      color: #39f
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
