<template>
  <div class="p-deliverGoods">
    <Card>
      <Row class="g-t-left">
        <Radio-group v-model="courseType" type="button" @on-change="getList(1)">
          <Radio :label=item.id v-for="item of courseList" :key="item.id">{{item.name}}</Radio>
        </Radio-group>
      </Row>

      <Row class="g-t-left -c-tab">
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
        <Col :span="12" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDate"></date-picker-template>
        </Col>
        <Col :span="7" class="g-text-right">
          <Button type="primary" ghost class="-p-modal-btn" @click="openModalTwo()">新增发货单</Button>
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

    <Modal
      class="p-deliverGoods"
      v-model="isOpenModalTwo"
      @on-cancel="closeModal('addInfoTwo')"
      width="500"
      title="新增发货单">
      <Form ref="addInfoTwo" :model="addInfo" :rules="ruleValidateTwo" :label-width="100" class="ivu-form-item-required">
        <FormItem label="用户手机号" prop="phone">
          <Input class="-input" type="text" v-model="addInfo.phone" placeholder="请输入用户手机号"></Input>
          <Button class="-c-tips" type="text" @click="checkPhone">校验</Button>
        </FormItem>
        <FormItem label="用户头像" v-if="userInfo">
          <img class="-img" :src="userInfo.headimgurl"/>
        </FormItem>
        <FormItem label="选择课程" prop="courseId">
          <Select v-model="addInfo.courseId" class="-input">
            <Option v-for="(item,index) in userCourseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input type="text" class="-input" v-model="addInfo.name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="telephone">
          <Input type="text" class="-input" v-model="addInfo.telephone" placeholder="请输入电话"></Input>
        </FormItem>
        <FormItem label="地址" prop="areasId">
          <Cascader :data="addressList" class="-input" v-model="addInfo.areasId" @on-change="changeCascarder"></Cascader>
        </FormItem>
        <FormItem label="详细地址" prop="address">
          <Input type="textarea" class="-input" :rows="4" v-model="addInfo.address" placeholder="请输入详细地址" :maxlength='80'></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="closeModal('addInfoTwo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfoTwo('addInfoTwo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import areaList from '@/libs/area'
  import dayjs from 'dayjs'
  import {getBaseUrl} from "@/libs/index";
  import DatePickerTemplate from "@/components/datePickerTemplate";

  export default {
    name: 'tbzw_deliverGoods',
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
        courseList: [],
        userCourseList: [],
        addressList: areaList.list,
        total: 0,
        radioType: 0,
        courseType: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalTwo: false,
        isSending: false,
        addInfo: {
          areasId: []
        },
        userInfo: '',
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
        ruleValidateTwo: {
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          courseId: [
            {required: true, message: '请选择课程', trigger: 'change'},
          ],
          telephone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
          ],
          areasId: [
            {required: true, type: 'array', min:1, message: '请输入地址', trigger: 'change'},
          ],
          address: [
            {required: true, message: '请输入详细地址', trigger: 'blur'},
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
            title: '发货类型',
            render: (h, params)=>{
              return h('div', params.row.type ? '手动添加' : '用户提交')
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
                      this.openModal(params.row, 2)
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
            title: '发货类型',
            render: (h, params)=>{
              return h('div', params.row.type ? '手动添加' : '用户提交')
            },
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
                h('div',`物流单号：${params.row.sendinfo.logisticsOddNum}`),
                h('div',`物流公司：${params.row.sendinfo.logisticsCompany}`)
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
      this.getCourseList()
    },
    methods: {
      changeCascarder(value, selectedData) {
        this.addInfo.areas = selectedData[2].__label
      },
      checkPhone() {
        if (!this.addInfo.phone) {
          return this.$Message.error('请输入手机号码')
        }
        this.$api.tbzwStudy.getUserByPhone({
          phone: this.addInfo.phone
        })
          .then(
            response => {
              if (response.data.resultData) {
                this.userInfo = response.data.resultData;
                this.listByMyCourseHasgift()
              } else {
                this.userInfo = ''
                this.$Message.error('未查询到该手机号码信息')
              }

              this.$forceUpdate()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      toExcel() {
        let params = {
          send: this.radioType,
          courseId: this.courseType,
          nickName: this.searchInfo.nickname,
          startTime: this.searchInfo.startTime ? new Date(this.searchInfo.startTime).getTime() : '',
          endTime: this.searchInfo.endTime ? new Date(this.searchInfo.endTime).getTime() : ''
        }

        let downUrl = `${getBaseUrl()}/compositionv3/order/downloadExcelByGoods?startTime=${params.startTime}&endTime=${params.endTime}&send=${params.send}&nickName=${params.nickName}&courseId=${params.courseId}`

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
      openModalTwo() {
        this.userInfo =''
        this.isOpenModalTwo = true
      },
      closeModal(name) {
        this.isOpenModal = false
        this.isOpenModalTwo = false
        this.$refs[name].resetFields()
      },
      getCourseList() {
        this.$api.tbzwCourse.courseQueryPage({
          current: 1,
          size: 1000,
          type: 1
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
              this.courseType = this.courseList[0].id
              this.getList()
            })
      },
      listByMyCourseHasgift() {
        this.$api.tbzwCourse.listByMyCourseHasgift({
          userId: this.userInfo.userId
        })
          .then(
            response => {
              this.userCourseList = response.data.resultData;
            })
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
          courseId: this.courseType,
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
      },
      submitInfoTwo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.tbzwOrder.createNewInvoice({
              userId: this.userInfo.userId,
              courseId: this.addInfo.courseId,
              name: this.addInfo.name,
              telephone: this.addInfo.telephone,
              areas: this.addInfo.areas,
              address: this.addInfo.address,
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
    .-p-modal-btn {
      display: inline-block;
    }

    .-c-tips {
      color: #39f
    }

    .-img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    .-input {
      width: 80%;
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

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
