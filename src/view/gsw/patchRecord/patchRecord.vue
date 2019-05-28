<template>
  <div class="p-patchRecord">
    <Card>
      <Row class="g-search">
        <Col :span="5">
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">电话号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.phone" class="-search-input" placeholder="请输入电话号码" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Modal
        class="p-patchRecord"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        title="补卡">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="用户手机号" prop="phone">
            <Input class="-input" type="text" v-model="addInfo.phone" placeholder="请输入用户手机号"></Input>
            <Button class="-c-tips" type="text" @click="checkPhone">校验</Button>
          </FormItem>
          <FormItem label="用户头像" v-if="userInfo">
            <img class="-img" :src="userInfo.headimgurl"/>
          </FormItem>
          <FormItem label="补卡日期" prop="recordTime">
            <Date-picker class="date-time" placeholder="选择开始日期" v-model="addInfo.date"></Date-picker>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn ">确认</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'patchRecord',
    components: {DatePickerTemplate},
    data() {
      return {
        dataList: [],
        selectInfo: '1',
        searchInfo: {},
        userInfo: '',
        isFetching: false,
        isOpenModal: false,
        addInfo: {
          date: ''
        },
        ruleValidate: {
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ],
          date: [
            {required: true, type:'date', message: '请选择补卡日期', trigger: 'change'},
          ]
        },
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
                    src: params.row.headimgurl
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
            title: '手机号',
            key: 'phone',
            align: 'center'
          },
          {
            title: '补卡日期',
            key: 'date'
          },
          {
            title: '补卡时间',
            key: 'creatTime'
          }
        ],
      };
    },
    mounted() {
      // this.getList()
    },
    methods: {
      checkPhone() {
        if (!this.addInfo.phone) {
          return this.$Message.error('请输入手机号码')
        }
        this.$api.poem.getUserByPhone({
          phone: this.addInfo.phone
        })
          .then(
            response => {
              if(response.data.resultData) {
                this.userInfo = response.data.resultData;
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
      openModal() {
        this.isOpenModal = true
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },

      //分页查询
      getList() {
        this.isFetching = true
        this.$api.poem.listRepairCard({
          phone: this.searchInfo.phone
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.poem.repairCard({
              date: dayjs(this.addInfo.date).format('YYYY-MM-DD'),
              phone: this.addInfo.phone
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.closeModal(name)
                  }
                })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-patchRecord {

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


    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-p-modal-btn {
      vertical-align: bottom;
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
  }
</style>
