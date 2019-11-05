<template>
  <div class="p-timetableAdjustment">
    <Card>
      <Row class="g-search -c-tab">
        <Col class="g-flex-a-j-center" :span="8">
          <div class="g-flex-a-j-center -s-radio">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="radioType" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
          <div class="-search">
            <Select v-model="selectInfo" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">电话号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键词" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
        <Col :span="16" class="g-text-right">
          <Button @click="openModal()" ghost type="primary" style="width: 100px;">调整排课</Button>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
      <Modal
        class="p-timetableAdjustment"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="700"
        title="调整排课">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="用户手机号" prop="phone">
            <Input class="-input" type="text" v-model="addInfo.phone" placeholder="请输入用户手机号"></Input>
            <Button class="-c-tips" type="text" @click="checkPhone">校验</Button>
          </FormItem>
          <FormItem label="用户头像" v-if="userInfo">
            <img class="-img" :src="userInfo.headimgurl"/>
          </FormItem>
          <FormItem label="选择课程" prop="recordTime">
            <Select v-model="addInfo.course" class="-input">
              <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </FormItem>
          <FormItem label="当前排课天数">
            测试
          </FormItem>
          <FormItem label="更改排课天数">
            <CheckboxGroup v-model="addInfo.rules">
              <Checkbox :label="item.id" v-for="(item, index) of weekList" :key="index">{{item.name}}</Checkbox>
            </CheckboxGroup>
            <span class="-c-tips">请选择每周需要排课的天数，新建立即生效，更改5分钟后生效，更改不会影响已经排出的课时</span>
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
    name: 'timetableAdjustment',
    components: {DatePickerTemplate},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        courseList: [],
        selectInfo: '1',
        searchInfo: {},
        userInfo: '',
        radioType: 0,
        total: 0,
        isFetching: false,
        isOpenModal: false,
        addInfo: {
          rules: []
        },
        weekList: [
          {
            id: '1',
            name: '星期一'
          },
          {
            id: '2',
            name: '星期二'
          },
          {
            id: '3',
            name: '星期三'
          },
          {
            id: '4',
            name: '星期四'
          },
          {
            id: '5',
            name: '星期五'
          },
          {
            id: '6',
            name: '星期六'
          },
          {
            id: '7',
            name: '星期天'
          }
        ],
        ruleValidate: {
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ],
          date: [
            {required: true, type: 'date', message: '请选择补卡日期', trigger: 'change'},
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
            title: '调整排课天数',
            key: 'date',
            align: 'center'
          },
          {
            title: '原排课天数',
            key: 'date',
            align: 'center'
          },
          {
            title: '调整时间',
            key: 'createTime',
            align: 'center'
          }
        ],
      };
    },
    mounted() {
      this.getCourseList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
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
        this.addInfo.date = ''
        this.userInfo = ''
      },
      closeModal(name) {
        this.isOpenModal = false
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
              this.radioType = this.courseList[0].id
              this.getList()
            })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickName = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.$api.tbzwStudy.listRepairCard(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records || [];
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.tbzwStudy.repairCard({
              date: dayjs(this.addInfo.date).format('YYYY-MM-DD'),
              phone: this.addInfo.phone
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.closeModal(name)
                    this.getList()
                  }
                })
          }
        })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-timetableAdjustment {

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
      text-align: left;
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
