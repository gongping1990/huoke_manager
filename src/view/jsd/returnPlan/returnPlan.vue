<template>
  <div class="p-returnPlan">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-returnPlan"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="650"
        :title="addInfo.id ? '编辑计划' : '创建计划'">
        <Form ref="addInfo" :model="addInfo"  :label-width="60">
          <FormItem label="时间触发" prop="courses">
            <div>
              <Checkbox v-model="addInfo.weekCheck">每周</Checkbox>
              <Input type="text" v-model="addInfo.name" placeholder="请输入"></Input>
            </div>
            <div class="g-tips">* 请输入星期序号，多天用“，”隔开，最大7，最小1。例如：每周一、三、五，应该输入：1,3,5</div>
            <div>
              <Checkbox v-model="addInfo.monthCheck">每月</Checkbox>
              <Input type="text" v-model="addInfo.name" placeholder="请输入"></Input>
            </div>
            <div class="g-tips">* 请输入日期序号，多天用“，”隔开，最大31，最小1。例如：每月一、三、五，应该输入：1,3,5</div>
          </FormItem>
          <FormItem label="事件触发" prop="courses">
            <div>
              <Checkbox v-model="addInfo.weekCheck">连续多次没上课</Checkbox>
              <Input type="text" v-model="addInfo.name" placeholder="请输入缺课次数"></Input>
            </div>

            <div>
              <Checkbox v-model="addInfo.monthCheck">连续多次没完课</Checkbox>
              <Input type="text" v-model="addInfo.name" placeholder="请输入缺课次数"></Input>
            </div>

            <div>
              <Checkbox v-model="addInfo.monthCheck">连续多次没交作业</Checkbox>
              <Input type="text" v-model="addInfo.name" placeholder="请输入作业次数"></Input>
            </div>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-returnPlan"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        title="所属课程">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="所属课程" prop="courses">
            <CheckboxGroup v-model="addInfo.courses">
              <Checkbox v-for="item of appList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'
  import DatePickerTemplate from "../../../components/datePickerTemplate";
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'jsd_adminTeacher',
    components: {UploadImg, DatePickerTemplate},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        tabDetail: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        detailList: [],
        operationalId: '',
        selectInfo: '1',
        oldSystemsLength: [],
        appList: [],
        searchInfo: {},
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          courses: [
            {required: true, type: 'array', min: 1, message: '请选择所属课程', trigger: 'change'}
          ]
        },
        columns: [
          {
            title: '计划名称',
            key: 'nickname',
            align: 'center'
          },
          {
            title: '计划',
            key: 'username',
            align: 'center'
          },
          {
            title: '应用课程',
            key: 'systemTexts',
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModalData(params.row)
                    }
                  }
                }, '应用'),
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
                      this.openModal(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgba(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除'),

              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '日期',
            key: 'day',
            width: 100,
            align: 'center'
          },
          {
            title: '总量/已处理',
            render: (h, p) => {
              return h('div', `${p.row.total}/${p.row.totalHandled}`)
            },
            align: 'center',
          },
          {
            title: '自动分配/已处理',
            render: (h, p) => {
              return h('div', `${p.row.autonum}/${p.row.autoHandled}`)
            },
            align: 'center',
          },
          {
            title: '补批/已处理',
            render: (h, p) => {
              return h('div', `${p.row.oldnum}/${p.row.oldHandled}`)
            },
            align: 'center',
          },
          {
            title: '调度/已处理',
            render: (h, p) => {
              return h('div', `${p.row.allotnum}/${p.row.allotHandled}`)
            },
            align: 'center',
          },
          {
            title: '重交/已处理',
            render: (h, p) => {
              return h('div', `${p.row.resubmitnum}/${p.row.handleResubmit}`)
            },
            align: 'center',
          },
          {
            title: '效率（分钟）',
            key: 'replytime',
            align: 'center',
          },
          {
            title: '好评率/差评率',
            render: (h, p) => {
              return h('div', `${p.row.good}/${p.row.bad}`)
            },
            align: 'center',
          }
        ]
      };
    },
    mounted() {
      this.getList()
      this.listBase()
    },
    methods: {
      toStudent (data) {
        this.$router.push({
          name: 'tbzw_studentListTwo',
          query: {
            name: data.nickname,
            teacherId: data.id
          }
        })
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.courses = this.addInfo.courses || []
          this.oldSystemsLength = JSON.parse(JSON.stringify(data)).courses || []
        } else {
          this.addInfo = {
            id: '',
            // amount: null,
            courses: [],
            img: ''
          }
        }
      },
      openModalData(data) {
        this.isOpenModalData = true
        this.operationalId = data.id
        this.getDetailList()
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      detailCurrentChange(val) {
        this.tabDetail.page = val;
        this.getDetailList();
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      getDetailList() {
        this.isFetching = true

        this.$api.jsdJob.listWorkJobCountByPage({
          current: this.tabDetail.page,
          size: this.tabDetail.pageSize,
          teacherId: this.operationalId
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(() => {
          this.isFetching = false
        })
      },
      listBase() {
        this.appList = []
        this.$api.jsdJob.listBase()
          .then(response => {
            this.appList = response.data.resultData
          })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.jsdTeacher.listTeachByPage({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          type: 0
        })
          .then(
            response => {
              this.dataList = response.data.resultData.records;
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      toChangeStatus(param) {
        this.$Modal.confirm({
          title: '提示',
          content: param.desabled ? '确认要启用该老师吗？' : param.students ? '当前老师还有绑定学生，需将老师全部所属课程的绑定学生移交才能禁用' : '确认要禁用吗',
          onOk: () => {
            this.$api.jsdTeacher.changeStatusTeacher({
              userId: param.id
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
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: param.students!='0' ? '当前老师还有绑定学生，需将老师全部所属课程的绑定学生移交后删除！' : '确认要删除吗？',
          onOk: () => {
            this.$api.jsdTeacher.removeTeacher({
              userId: param.id
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
      resultItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要重置密码吗？(重置后密码为初始密码：ju123456)',
          onOk: () => {
            this.$api.jsdTeacher.updatePasswordTeacher({
              userId: param.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success("操作成功，请重新登录");
                  this.getList();
                }
              })
          }
        })
      },
      submitInfo(name) {
        this.teacherEdit(name)
      },
      teacherEdit(name) {
        if (this.isSending) return
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.headimgurl) {
              return this.$Message.error('请上传老师头像')
            }
            this.isSending = true
            let param = ''
            param = this.addInfo.id ? this.$api.jsdTeacher.updateTeacher : this.$api.jsdTeacher.addTeacher
            param({
              id: this.addInfo.id,
              nickname: this.addInfo.nickname,
              username: this.addInfo.username,
              password: this.addInfo.password,
              headimgurl: this.addInfo.headimgurl,
              // amount: this.addInfo.amount,
              courses: `${this.addInfo.courses}`
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
  .p-returnPlan {

    &-input {
      width: 80%;
    }

    &-btn {
      display: flex;
      justify-content: flex-end;
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
