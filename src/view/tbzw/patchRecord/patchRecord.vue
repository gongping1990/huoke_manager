<template>
  <div class="p-patchRecord">
    <Card>
      <Row class="g-search">
        <Col :span="5" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">课程名称：</div>
            <Select v-model="searchInfo.courseId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of courseList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="5">
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
      </Row>

      <div class="g-add-btn g-add-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
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
  import dayjs from 'dayjs';
  import {getBaseUrl} from '@/libs/index';
  import DatePickerTemplate from "../../../components/datePickerTemplate";

  export default {
    name: 'patchRecord',
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
        searchInfo: {
          courseId: '-1'
        },
        userInfo: '',
        total: 0,
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
              ]);
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
            key: 'createTime'
          }
        ],
      };
    },
    mounted() {
      this.getCourseList();
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
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
              this.searchInfo.courseId = this.courseList[0].id;
              this.getList();
            });
      },
      checkPhone() {
        if (!this.addInfo.phone) {
          return this.$Message.error('请输入手机号码');
        }
        this.$api.tbzwStudy.getUserByPhone({
          phone: this.addInfo.phone
        })
          .then(
            response => {
              if (response.data.resultData) {
                this.userInfo = response.data.resultData;
              } else {
                this.userInfo = '';
                this.$Message.error('未查询到该手机号码信息');
              }

              this.$forceUpdate();
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      openModal() {
        this.isOpenModal = true;
        this.addInfo.date = '';
        this.userInfo = '';
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },

      //分页查询
      getList(num) {
        this.isFetching = true;
        if (num) {
          this.tab.currentPage = 1;
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          courseId: this.searchInfo.courseId
        };

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickName = this.searchInfo.manner;
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner;
        }

        this.$api.tbzwStudy.listRepairCard(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records || [];
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      submitInfo(name) {
        if (this.isSending) return;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$api.tbzwStudy.repairCard({
              courseId: this.searchInfo.courseId,
              date: dayjs(this.addInfo.date).format('YYYY-MM-DD'),
              phone: this.addInfo.phone
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.closeModal(name);
                    this.getList();
                  }
                });
          }
        });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-patchRecord {

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
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
