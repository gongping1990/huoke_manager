<template>
  <div class="p-deliverGoods">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <Radio :label=0>待发货</Radio>
          <Radio :label=1>已发货</Radio>
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
        <Col :span="15" class="g-flex-a-j-center -date-search">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
        <Col :span="3" class="g-text-right">
          <Button type="primary" ghost class="-p-modal-btn" @click="toExcel">导出表格</Button>
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
        <FormItem label="发货信息" prop="sendinfo">
          <Input type="text" v-model="addInfo.sendinfo" placeholder="请输入发货信息"></Input>
        </FormItem>
        <FormItem label="发货时间" prop="sendTime">
          <Date-picker style="width: 100%" type="datetime" placeholder="选择发货时间" v-model="addInfo.sendTime"></Date-picker>
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
          sendinfo: [
            {required: true, message: '请输入发货信息', trigger: 'blur'},
          ],
          sendTime: [
            {required: true, type: 'date', message: '请选择发货时间', trigger: 'change'},
          ],
        },
        columns: [
          {
            title: '用户昵称',
            key: 'nickName',
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
                h('div',`名称：${params.row.recipient.name}`),
                h('div',`电话：${params.row.recipient.telephone}`),
                h('div',`地址：${params.row.recipient.areas}`),
                h('div',`详情：${params.row.recipient.address}`)
              ])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'sendGmtCreate',
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
            title: '收货信息',
            render: (h,params)=>{
              return h('div',{
                style: {
                  'text-align': 'left'
                }
              },[
                h('div',`名称：${params.row.recipient.name}`),
                h('div',`电话：${params.row.recipient.telephone}`),
                h('div',`地址：${params.row.recipient.areas}`),
                h('div',`详情：${params.row.recipient.address}`)
              ])
            },
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'sendGmtCreate',
            align: 'center'
          },
          {
            title: '发货信息',
            render: (h,params)=>{
              return h('div',{
                style: {
                  'text-align': 'left'
                }
              },[
                h('div',`发货人：${params.row.sendinfo.sender}`),
                h('div',`发货信息：${params.row.sendinfo.sendinfo}`),
                h('div',`发货时间：${params.row.sendinfo.sendTime}`)
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
      toExcel() {
        let params = {
          send: this.radioType,
          nickName: this.searchInfo.nickname,
          startTime: this.searchInfo.startTime,
          endTime: this.searchInfo.endTime
        }

        let downUrl = `${getBaseUrl()}/composition/order/downloadExcelByGoods?startTime=${params.startTime}&endTime=${params.endTime}&send=${params.send}&nickName=${params.nickName}`

        window.open(downUrl, '_blank');
      },
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
        this.$api.composition.tbzwGoodsList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          send: this.radioType,
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
            this.$api.composition.sendOutGoods({
              ...this.addInfo,
              sendTime: dayjs(this.addInfo.sendTime).format('YYYY/MM/DD HH:mm:ss')
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
    .date-time {
      width: 100%;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      min-width: 155px;
    }

    .-date-search {
      margin-left: 20px;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
