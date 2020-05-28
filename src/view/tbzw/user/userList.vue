<template>
  <div class="p-user">
    <Card>
      <Row class="g-search">
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">注册来源：</div>
            <Select v-model="searchInfo.appId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of appList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">电话号码：</div>
            <Select v-model="searchInfo.hasPhone" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of phoneList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">是否付费：</div>
            <Select v-model="searchInfo.payed" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of payedList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">公众号：</div>
            <Select v-model="searchInfo.subscripbe" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="item of subscripbeList" :label=item.name :value=item.id :key="item.id"></Option>
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
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="getList(1)"></Input>
          </div>
        </Col>
      </Row>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

    </Card>

    <Modal
      class="p-user"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="600"
      title="开通课程">
      <Form ref="addInfo" :model="addInfo" :label-width="90">
        <FormItem label="课程类别">
          <RadioGroup v-model="addInfo.radioType">
            <Radio label="1">单个课程</Radio>
            <Radio label="2">课程组</Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="addInfo.radioType === '1'">
          <FormItem label="开通课程" prop="courseId" class="ivu-form-item-required">
            <Select v-model="addInfo.courseId">
              <Option v-for="item of courseList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="电话号码" prop="phone" class="ivu-form-item-required">
            <Input type="text" v-model="addInfo.phone" placeholder="请输入电话号码" :disabled="addInfo.isPhone"></Input>
          </FormItem>
          <FormItem label="支付金额" prop="amount" class="ivu-form-item-required">
            <Input-number class="g-width" :min="0" :step="1" v-model="addInfo.amount"
                          placeholder="请输入支付金额（元）"></Input-number>
          </FormItem>
          <FormItem label="开课日期" prop="time" class="ivu-form-item-required">
            <Date-picker style="width: 100%" type="date" placeholder="选择开课日期" :options="dateOption"
                         v-model="addInfo.time"></Date-picker>
          </FormItem>
          <FormItem label="备注" prop="remarks" class="ivu-form-item-required">
            <Input type="textarea" :rows="4" v-model="addInfo.remarks" placeholder="请输入备注"></Input>
          </FormItem>
        </div>
        <div v-if="addInfo.radioType === '2'">
          <FormItem label="电话号码">
            <Input type="text" v-model="addInfo.phone" placeholder="请输入电话号码"></Input>
          </FormItem>
          <FormItem label="课程组" class="ivu-form-item-required">
            <Select v-model="addInfo.groupId" @on-change="listByGroupYear()">
              <Option v-for="item of courseGroupList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="入学学年" class="ivu-form-item-required">
            <Select v-model="addInfo.year">
              <Option v-for="item of yearList" :label=item.text :value=item.value :key="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="入学年级" class="ivu-form-item-required">
            <Select v-model="addInfo.grade">
              <Option v-for="item of gradeList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="入学学期" class="ivu-form-item-required">
            <Select v-model="addInfo.semester">
              <Option v-for="item of semesterList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="课程数量" class="ivu-form-item-required">
            <Input type="text"
                   v-model="addInfo.buynum"
                   style="width: 80%"
                   placeholder="请输入课程数量"></Input>
            <span class="g-tips g-cursor" @click="getUserBuyCourseInfo" style="margin-left: 10px">获取课程价格</span>
          </FormItem>
          <FormItem label="课程价格" class="ivu-form-item-required">
            <div class="g-flex-a-c-j-sb" style="margin-bottom: 10px" v-for="(item, index) of priceInfo.courseList" :key="index">
              <div>{{item.name}} ({{item.buyed ? '已购买' : '未购买'}})</div>
              <Input type="text"
                     v-model="item.price"
                     style="width: 40%; margin-left: 10px;"
                     placeholder="请输入课程价格"></Input>
            </div>
          </FormItem>
          <FormItem label="开课日期">
            <Date-picker style="width: 100%" type="date" disabled v-model="priceInfo.openTime" disabled></Date-picker>
            <span class="g-tips">* 自动计算</span>
          </FormItem>
        </div>

      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import Operation from "iview/src/components/transfer/operation";

  export default {
    name: 'zlkUserList',
    components: {Operation},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10,
          currentPage: 1
        },
        searchInfo: {
          hasPhone: '-1',
          subscripbe: '-1',
          payed: '-1',
          appId: '',
        },
        dateOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        phoneList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '有',
          },
          {
            id: '0',
            name: '无',
          }
        ],
        gradeList: [
          {
            id: '1',
            name: '一年级'
          },
          {
            id: '2',
            name: '二年级',
          },
          {
            id: '3',
            name: '三年级',
          },
          {
            id: '4',
            name: '四年级',
          },
          {
            id: '5',
            name: '五年级',
          },
          {
            id: '6',
            name: '六年级',
          }
        ],
        semesterList: [
          {
            id: '1',
            name: '上学期'
          },
          {
            id: '2',
            name: '下学期',
          }
        ],
        subscripbeList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '是',
          },
          {
            id: '0',
            name: '否',
          }
        ],
        payedList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '是',
          }
        ],
        appList: [],
        courseGroupList: [],
        yearList: [],
        selectInfo: '1',
        courseList: [],
        dataList: [],
        total: 0,
        addInfo: {},
        priceInfo: {},
        isFetching: false,
        isOpenModal: false,
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
              ]);
            },
            align: 'center'
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center'
          },
          {
            title: '关注公众号',
            render: (h, params) => {
              return h('div', params.row.subscripbe ? '是' : '否');
            },
            align: 'center'
          },
          {
            title: '是否付费',
            render: (h, params) => {
              return h('div', params.row.payed ? '是' : '否');
            },
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'creatTime',
            align: 'center'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.disabled ? 'default' : 'success'
                }
              }, params.row.disabled ? '已禁用' : '已启用');
            },
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
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
                      this.toChangeStatus(params.row);
                    }
                  }
                }, params.row.disabled ? '启用' : '禁用'),
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
                      this.toDetail(params.row);
                    }
                  }
                }, '详情'),
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
                      this.openModal(params.row);
                    }
                  }
                }, '开通课程')
              ]);
            }
          }
        ]
      };
    },
    mounted() {
      this.listUserSource();
      this.pageByCourseGroup();
    },
    methods: {
      getUserBuyCourseInfo () {
        if (!this.addInfo.buynum || !this.addInfo.grade || !this.addInfo.groupId || !this.addInfo.semester || !this.addInfo.year ) {
          return this.$Message.error('请填写相关信息')
        }
        this.$api.tbzwOpenTime.getUserBuyCourseInfo({
          userId: this.addInfo.userId,
          buynum: this.addInfo.buynum,
          grade: this.addInfo.grade,
          groupId: this.addInfo.groupId,
          semester: this.addInfo.semester,
          year: this.addInfo.year
        }).then(
          response => {
            if (response.data.code == '200') {
              this.priceInfo = response.data.resultData;
              this.priceInfo.courseList.forEach(item=>{
                item.price = item.price / 100
              })
            }
          });
      },
      openModal(data) {
        this.getCourseList();
        this.isOpenModal = true;
        if (data) {
          this.addInfo =  {
            ...JSON.parse(JSON.stringify(data)),
            radioType: '1',
            amount: null,
            isPhone: data.phone !== null
          };
          console.log(this.addInfo);
        } else {
          this.addInfo = {
            id: '',
            amount: null,
            playbill: ''
          };
        }
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.priceInfo.courseList = []
      },
      toDetail(param) {
        this.$router.push({
          name: 'tbzw_userInfo',
          query: {
            id: param.userId
          }
        });
      },
      toChangeStatus(params) {
        this.$api.tbzwUser.TbzwChangeStatus({
          userId: params.userId,
          disabled: !params.disabled
        }).then(
          response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
              this.getList();
            }
          });
      },
      pageByCourseGroup() {
        this.$api.tbzwGroupConfig.pageByCourseGroup({
          current: 1,
          size: 1000,
        })
          .then(
            response => {
              this.courseGroupList = response.data.resultData.records;
            });
      },
      listByGroupYear() {
        this.addInfo.year = ''
        this.$api.tbzwOpenTime.listByGroupYear({
          groupId: this.addInfo.groupId,
        })
          .then(
            response => {
              this.yearList = response.data.resultData;
            });
      },
      listUserSource(params) {
        this.$api.tbzwUser.listUserSource()
          .then(
            response => {
              if (response.data.code == '200') {
                this.appList = response.data.resultData;
                this.searchInfo.appId = this.appList[0].id;
                this.getList();
              }
            });
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getCourseList() {
        this.$api.tbzwCourse.listNoGroupCourse()
          .then(
            response => {
              this.courseList = response.data.resultData;
            });
      },
      getList(num) {
        if (num) {
          this.tab.currentPage = 1;
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          appid: this.searchInfo.appId,
          hasPhone: this.searchInfo.hasPhone != '-1' ? (this.searchInfo.hasPhone == '1') : '',
          subscribe: this.searchInfo.subscripbe != '-1' ? (this.searchInfo.subscripbe == '1') : '',
          payed: this.searchInfo.payed != '-1' ? (this.searchInfo.payed == '1') : ''
        };

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickname = this.searchInfo.manner;
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner;
        }

        this.isFetching = true;
        this.$api.tbzwUser.getTbzwUserList(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      submitInfo(name) {
        if (this.addInfo.radioType === '1') {
          if (!this.addInfo.courseId) {
            return this.$Message.error('请选择开通课程');
          } else if (!this.addInfo.phone) {
            return this.$Message.error('请输入电话号码');
          } else if (this.addInfo.amount == null) {
            return this.$Message.error('请输入支付金额');
          } else if (!this.addInfo.time) {
            return this.$Message.error('请输入开课日期');
          } else if (!this.addInfo.remarks) {
            return this.$Message.error('请输入备注');
          }
        }


        if (this.addInfo.radioType === '1' ) {
          this.$api.tbzwOrder.newManualOpenOrder({
            userId: this.addInfo.userId,
            courseId: this.addInfo.courseId,
            amount: this.addInfo.amount * 100,
            remarks: this.addInfo.remarks,
            time: dayjs(this.addInfo.time).format('YYYY-MM-DD'),
            phone: this.addInfo.phone
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  this.$Message.success('提交成功');
                  this.getList();
                  this.closeModal(name);

                }
              });
        } else {

          let isPass = true
          let arrayList = JSON.parse(JSON.stringify(this.priceInfo.courseList))
          arrayList.forEach(item=>{
            item.price = item.price * 100
          })

          isPass = arrayList.every(item=>{
            return item.buyed === false
          })

          if (!isPass) {
            return this.$Message.error('开通课程里已包含有购买课程，无法开通课程组')
          }

          this.$api.tbzwOrder.createGroupOrder({
            groupId: this.addInfo.groupId,
            userId: this.addInfo.userId,
            phone: this.addInfo.phone,
            courseList: arrayList
          })
            .then(
              response => {
                if (response.data.code == '200') {
                  this.$Message.success('提交成功');
                  this.getList();
                  this.closeModal(name);
                }
              });
        }
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-user {
    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
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

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }
  }
</style>
