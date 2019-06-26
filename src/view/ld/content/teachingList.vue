<template>
  <div class="p-column">
    <Card>
      <Row class="g-t-left -p-bottom">
        <Radio-group v-model="gradeType" type="button" @on-change="getList(1)">
          <Radio v-for="(item,index) of gradeList" :label=item.id :key="index">{{item.name}}</Radio>
        </Radio-group>
      </Row>

      <Row class="g-t-left ">
        <Radio-group v-model="radioType" type="button" @on-change="getList(1)">
          <Radio v-for="(item,index) of semesterList" :label=item.id :key="index">{{item.name}}</Radio>
        </Radio-group>
      </Row>

      <div class="g-add-btn g-add-top -p-top" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-column"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑课文' : '创建课文'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="课文名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入课文名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortnum">
            <InputNumber type="text" v-model="addInfo.sortnum" placeholder="请输入排序值" class="g-width"></InputNumber>
          </FormItem>
          <FormItem label="所属学期" prop="semester">
            <Select v-model="addInfo.semester" placeholder="请选择">
              <Option value="1">上学期</Option>
              <Option value="2">下学期</Option>
            </Select>
          </FormItem>
          <FormItem label="所属年级" prop="grade">
            <Select v-model="addInfo.grade" placeholder="请选择">
              <Option v-for="(item, index) of gradeList" :key="index" :label=item.name :value=item.id></Option>
            </Select>
          </FormItem>
          <FormItem label="所属教师" prop="teacherId">
            <Select v-model="addInfo.teacherId" placeholder="请选择">
              <Option v-for="(item, index) of teacherTypeList" :key="index" :label=item.teacherName :value=item.id></Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>

    <div v-if="isOpenModalContent">
      <text-edit :isOpen="isOpenModalContent" :info="dataItem" @closeEditModal="closeModalContent"></text-edit>
    </div>
  </div>
</template>

<script>
  import TextEdit from "./textEdit";
  export default {
    name: 'teacherList',
    components: {TextEdit},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        semesterList: [
          {
            id: 1,
            name: '上学期'
          },
          {
            id: 2,
            name: '下学期'
          }
        ],
        gradeList: [],
        teacherTypeList: [],
        radioType: 1,
        gradeType: 1,
        total: 0,
        dataItem: '',
        isFetching: false,
        isOpenModal: false,
        isOpenModalContent: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入课文名称', trigger: 'blur'},
          ],
          sortnum: [
            {required: true, type: 'number', message: '请输入排序值', trigger: 'blur'},
          ],
          semester: [
            {required: true, message: '请选择学期', trigger: 'change'},
          ],
          grade: [
            {required: true, type: 'number', message: '请选择年级', trigger: 'change'},
          ],
          teacherId: [
            {required: true, message: '请选择教师', trigger: 'change'},
          ]
        },
        columns: [
          {
            title: '课文名称',
            key: 'name'
          },
          {
            title: '排序值',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '教师',
            key: 'teacherName',
            align: 'center'
          },
          {
            title: '范读人数（完成率）',
            render: (h,params)=>{
              return h('div',`${params.row.normReading} ( ${params.row.normReadingComplRate} )`)
            },
            align: 'center'
          },
          {
            title: '朗读人数（完成率）',
            render: (h,params)=>{
              return h('div',`${params.row.aloudReading} ( ${params.row.aloudReadingComplRate} )`)
            },
            align: 'center'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.isdisabled ? 'default' : 'success'
                }
              }, params.row.isdisabled ? '已禁用' : '已启用')
            },
            align: 'center'
          },
          {
            title: '栏目建设',
            width: 190,
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
                      this.changeStatus(params.row)
                    }
                  }
                }, params.row.isdisabled ? '启用' : '禁用'),
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
                }, '删除')
              ])
            }
          },
          {
            title: '内容建设',
            width: 190,
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
                      this.toJump(params.row)
                    }
                  }
                }, '课文内容'),
              ])
            }
          }
        ],
      };
    },
    mounted() {
      this.getList()
      this.getGradeList()
      this.getTeacherList()
    },
    methods: {
      toJump(data) {
        this.dataItem = data
        this.isOpenModalContent = true
      },
      closeModalContent () {
        this.isOpenModalContent = false
        this.getList(1)
      },
      delImg() {
        this.addInfo.url = ''
      },
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.sortnum = +this.addInfo.sortnum
          this.addInfo.semester = this.addInfo.semester.toString()
        } else {
          this.addInfo = {
            sortnum: null,
            grade: '',
            teacherId: '',
            semester: '',
            name: ''
          }
        }
      },

      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getGradeList() {
        this.isFetching = true
        this.$api.config.gradeList()
          .then(
            response => {
              this.gradeList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getTeacherList() {
        this.isFetching = true
        this.$api.teacher.teacherList()
          .then(
            response => {
              this.teacherTypeList = response.data.resultData.records;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.ldCourse.ldCourseList({
          current: this.tab.page,
          size: this.tab.pageSize,
          grade: this.gradeType,
          semester : this.radioType
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

      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.ldCourse.ldDelList({
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
      changeStatus(data) {
        this.$api.ldCourse.ldChangeStatus({
          id: data.id,
          disable: data.isdisabled == 0 ? 1 : 0
        }).then(
          response => {
            if (response.data.code == "200") {
              this.$Message.success("操作成功");
              this.getList();
            }
          })
      },
      submitInfo(name) {
        if (this.addInfo.sortnum && (this.addInfo.sortnum < 1 || this.addInfo.sortnum > 99999)) {
          return this.$Message.error('排序值范围1-99999')
        }

        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.ldCourse.ldUpdateList(this.addInfo) : this.$api.ldCourse.ldAddCourse(this.addInfo)
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
  .p-column {
    .-c-tips {
      color: #39f
    }

    .-p-bottom {
      margin-bottom: 16px;
    }

    .-p-top{
      top: 84px;
    }

    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
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
