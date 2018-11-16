<template>
  <div class="p-teach">
    <Card>
      <Row>
        <Col :span="3">
          <div>
            <Select v-model="selectInfo" @on-change="getList">
              <Option value='0'>全部年级</Option>
              <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>
      <div class="g-add-btn -t-add-icon" @click="openModal">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-subject"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      title="编辑教材">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="教材名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入学科名称"></Input>
        </FormItem>
        <FormItem label="教材版本" prop="edition">
          <Select v-model="addInfo.edition">
            <Option v-for="(item,index) in teachVersion" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用年级" prop="grade">
          <Select v-model="addInfo.grade">
            <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用学期" prop="semester">
          <Select v-model="addInfo.semester">
            <Option v-for="(item,index) in semesterList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用学科" prop="courseId">
          <Select v-model="addInfo.courseId">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
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
  export default {
    name: 'teachingList',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        selectInfo: '0',
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        indeterminate: true,
        checkAll: false,
        teachVersion: [
          {
            name: '人教版',
            key: 1
          },
          {
            name: '北师大版',
            key: 2
          },
          {
            name: '苏教版',
            key: 3
          }
        ],
        gradeList: [
          {
            name: '一年级',
            key: 1
          },
          {
            name: '二年级',
            key: 2
          },
          {
            name: '三年级',
            key: 3
          },
          {
            name: '四年级',
            key: 4
          },
          {
            name: '五年级',
            key: 5
          },
          {
            name: '六年级',
            key: 6
          }
        ],
        semesterList: [
          {
            name: '上学期',
            key: 1
          },
          {
            name: '下学期',
            key: 2
          }
        ],
        courseList: [],
        addInfo: {
          name: '',
          edition: '',
          grade: '',
          semester: '',
          courseId: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入教材名称',  trigger: 'blur'}
          ],
          edition: [
            {required: true, message: '请选择教材版本', type: 'number', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择年级', type: 'number', trigger: 'blur'}
          ],
          semester: [
            {required: true, message: '请选择学期', type: 'number', trigger: 'blur'}
          ],
          courseId: [
            {required: true, message: '请选择学科', trigger: 'blur'}
          ],

        },
        columns: [
          {
            title: '教材名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '教材版本',
            key: 'editionText',
            align: 'center'
          },
          {
            title: '适用年级',
            key: 'gradeText',
            align: 'center'
          },
          {
            title: '适用学科',
            key: 'courseName',
            align: 'center'
          },
          {
            title: '操作',
            width:200,
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
                      this.toJump(params.row)
                    }
                  }
                }, '章节管理'),
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
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: 'rgb(218, 55, 75)',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
      this.getSubjectList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        console.log(data)
        this.isOpenModal = true
        this.addInfo = JSON.parse(JSON.stringify(data))
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      toJump (data) {
        this.$router.push({
          name: 'teachMain',
          query: {
            bookId: data.id,
            courseName: data.courseName,
            courseId: data.courseId,
            gradeText: data.gradeText,
            grade: data.grade,
            editionText: data.editionText,
            edition: data.edition,
            semesterText: data.semesterText,
            semester: data.semester
          }
        })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.book.teachingList({
          grade: this.selectInfo == '0' ? '' : this.selectInfo
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getSubjectList() {

        this.$api.course.teachSubjectList()
          .then(
            response => {
              this.courseList = response.data.resultData;
            })
          .finally(() => {

          })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该教材吗？',
          onOk: () => {
            this.$api.book.delTeaching({
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
      submitInfo(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            console.log(this.addInfo, 1)
            let promiseDate = this.addInfo.id ? this.$api.book.updateTeaching(this.addInfo) : this.$api.book.addTeaching(this.addInfo)
            promiseDate
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
  .p-teach {
    .-p-text-right {
      text-align: right;
    }

    .-t-add-icon {
      top: 36px;
    }

    .-g-m-tip {
      color: #b3b5b8;
      display: flex;
      justify-content: space-between;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
