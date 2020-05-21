<template>
  <div class="p-formalOpeningTime">
    <Card>
      <Row class="g-search">
        <Col :span="4" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">课程组：</div>
            <Select v-model="searchInfo.courseId" @on-change="getList(1)" class="-search-selectOne">
              <Option v-for="(item,index) in courseGroupList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn g-add-top" @click="openModalYear()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="g-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-formalOpeningTime"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="500"
      :title="addInfo.id ? '编辑日期' : '添加日期'">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="120">
        <FormItem label='上学期开始时间' prop="upStart">
          <DatePicker type="date" placeholder="请选择" v-model="addInfo.upStart"></DatePicker>
        </FormItem>
        <FormItem label='上学期结束时间' prop="upEnd">
          <DatePicker type="date" placeholder="请选择" v-model="addInfo.upEnd"></DatePicker>
        </FormItem>
        <FormItem label='下学期开始时间' prop="downStart">
          <DatePicker type="date" placeholder="请选择" v-model="addInfo.downStart"></DatePicker>
        </FormItem>
        <FormItem label='下学期结束时间' prop="downEnd">
          <DatePicker type="date" placeholder="请选择" v-model="addInfo.downEnd"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <Modal
      class="p-formalOpeningTime"
      v-model="isOpenModalYear"
      @on-cancel="isOpenModalYear = false"
      width="500"
      title="创建学年">
      <Form  :label-width="100">
        <FormItem label='选择年份'>
          <DatePicker type="year" placeholder="请选择" v-model="dataYear"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-b-flex">
        <Button @click="isOpenModalYear = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitYear()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import dayjs from 'dayjs';
  import PoptipTimeTem from "./poptipTimeTem";

  export default {
    name: 'formalOpeningTime',
    components: {PoptipTimeTem},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        courseGroupList: [],
        dataList: [],
        searchInfo: {},
        addInfo: {},
        total: 0,
        dataYear: '',
        gradeText: {
          '0': '幼儿园',
          '1': '一年级',
          '2': '二年级',
          '3': '三年级',
          '4': '四年级',
          '5': '五年级',
          '6': '六年级',
          '20': '初中',
          '100': '其他',
        },
        isFetching: false,
        isSending: false,
        isOpenModalYear: false,
        isOpenModal: false,
        columns: [
          {
            title: '学年',
            render: (h, params) => {
              return h('div', `${params.row.year}学年`);
            },
            align: 'center'
          },
          {
            title: '年级',
            key: 'grade',
            render: (h, params) => {
              return h('div', this.gradeText[params.row.grade]);
            },
            align: 'center'
          },
          {
            title: '上学期开始时间',
            align: 'center',
            key: 'upStart'
          },
          {
            title: '上学期结束时间',
            align: 'center',
            key: 'upEnd'
          },
          {
            title: '下学期开始时间',
            align: 'center',
            key: 'downStart'
          },
          {
            title: '下学期结束时间',
            align: 'center',
            key: 'downEnd'
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
                      this.openModal(params.row);
                    }
                  }
                }, '修改')
              ]);
            }
          }
        ],
        ruleValidate: {
          upStart: [
            {required: true, type: 'date', message: '请输入上学期开始时间', trigger: 'blur'},
          ],
          upEnd: [
            {required: true, type: 'date', message: '请输入上学期结束时间', trigger: 'blur'},
          ],
          downStart: [
            {required: true, type: 'date', message: '请输入下学期开始时间', trigger: 'blur'},
          ],
          downEnd: [
            {required: true, type: 'date', message: '请输入下学期结束时间', trigger: 'blur'},
          ]
        },
      };
    },
    mounted() {
      this.pageByCourseGroup();
    },
    methods: {
      openModalYear() {
        this.addInfo.year = null;
        this.isOpenModalYear = true;
      },
      openModal(data) {
        this.isOpenModal = true;
        this.addInfo = JSON.parse(JSON.stringify(data));
        console.log(this.addInfo)
      },
      closeModal(name) {
        this.isOpenModal = false;
        this.$refs[name].resetFields();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      pageByCourseGroup() {
        this.$api.tbzwGroupConfig.pageByCourseGroup({
          current: 1,
          size: 1000,
        })
          .then(
            response => {
              this.courseGroupList = response.data.resultData.records;
              this.searchInfo.courseId = this.courseGroupList[0].id;
              this.getList();
            });
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.tbzwOpenTime.pageOpenTimeManage({
          current: this.tab.page,
          size: this.tab.pageSize,
          groupId: this.searchInfo.courseId
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      submitYear() {
        if (!this.dataYear) {
          return this.$Message.error('请选择学年');
        }
        this.$api.tbzwOpenTime.initOpenTimeManageByYear({
          year: dayjs(this.dataYear).format('YYYY'),
          groupId: this.searchInfo.courseId
        })
          .then(
            response => {
              this.$Message.success('提交成功');
              this.getList();
              this.isOpenModalYear = false;
            });
      },
      submitInfo(name) {
        if (this.isSending) return;

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true;
            this.$api.tbzwOpenTime.editOpenTimeManage({
              id: this.addInfo.id,
              upStart: dayjs(this.addInfo.upStart).format('YYYY-MM-DD'),
              upEnd: dayjs(this.addInfo.upEnd).format('YYYY-MM-DD'),
              downStart: dayjs(this.addInfo.downStart).format('YYYY-MM-DD'),
              downEnd: dayjs(this.addInfo.downEnd).format('YYYY-MM-DD')
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.getList();
                    this.closeModal(name);
                  }
                })
              .finally(() => {
                this.isSending = false;
              });
          }
        });
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-formalOpeningTime {

    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    &-left {
      padding-left: 30px;
      display: flex;
      justify-content: left;
    }

    .-c-tips {
      color: #39f
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

    .-p-text-right {
      text-align: right;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
