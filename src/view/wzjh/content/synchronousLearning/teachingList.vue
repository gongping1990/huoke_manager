<template>
  <div class="p-teach">
    <Card>
      <Row class="g-search">
        <Col :span="24" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="g-flex-a-j-center">
              <div class="-search-select-text">选择年级：</div>
              <RadioGroup v-model="selectInfo.grade" @on-change="getList(1)" type="button">
                <Radio v-for="(item,index) in gradeList" :label="item.key" :key="index">{{item.name}}</Radio>
              </RadioGroup>
            </div>

            <div class="g-flex-a-j-center -c-left">
              <div class="-search-select-text">选择学科：</div>
              <RadioGroup v-model="selectInfo.subject" @on-change="getList(1)" type="button">
                <Radio v-for="(item,index) in subjectList" :label="item.key" :key="index">{{item.name}}</Radio>
              </RadioGroup>
            </div>
          </div>
        </Col>
      </Row>

      <div class="g-add-btn -t-add-icon" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>
    </Card>

    <Modal
      class="p-subject"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="400"
      title="编辑教材">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="教材名称" prop="name">
          <Input type="text" v-model="addInfo.name" placeholder="请输入学科名称"></Input>
        </FormItem>
        <FormItem label="教材版本" prop="teachEdition">
          <Select v-model="addInfo.teachEdition">
            <Option v-for="(item,index) in teachVersion" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用年级" prop="grade">
          <Select v-model="addInfo.grade">
            <Option v-for="(item,index) in gradeList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用学期" prop="term">
          <Select v-model="addInfo.term">
            <Option v-for="(item,index) in semesterList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="适用学科" prop="subject">
          <Select v-model="addInfo.subject">
            <Option v-for="(item,index) in subjectList" :label="item.name" :value="item.key" :key="index"></Option>
          </Select>
        </FormItem>
        <FormItem label="封面图片" prop="img" class="ivu-form-item-required">
          <upload-img v-model="addInfo.img" :option="uploadOption"></upload-img>
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
  import UploadImg from "@/components/uploadImg";
  export default {
    name: 'teachingList',
    components: {UploadImg},
    data() {
      return {
        tab: {
          page: 1,
          currentPage: 1,
          pageSize: 10
        },
        selectInfo: {
          grade: '1',
          subject: '1'
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isSending: false,
        indeterminate: true,
        checkAll: false,
        teachVersion: [],
        gradeList: [
          {
            name: '一年级',
            key: '1'
          },
          {
            name: '二年级',
            key: '2'
          },
          {
            name: '三年级',
            key: '3'
          },
          {
            name: '四年级',
            key: '4'
          },
          {
            name: '五年级',
            key: '5'
          },
          {
            name: '六年级',
            key: '6'
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
        subjectList: [
          {
            name: '语文',
            key: '1'
          },
          {
            name: '数学',
            key: '2'
          },
          {
            name: '英语',
            key: '3'
          }
        ],
        addInfo: {
          name: '',
          teachEdition: '',
          grade: '',
          term: '',
          subject: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入教材名称', trigger: 'blur'}
          ],
          teachEdition: [
            {required: true, message: '请选择教材版本', type: 'number', trigger: 'change'}
          ],
          grade: [
            {required: true, message: '请选择年级', trigger: 'change'}
          ],
          term: [
            {required: true, message: '请选择学期', type: 'number', trigger: 'change'}
          ],
          subject: [
            {required: true, message: '请选择学科', trigger: 'change'}
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
            render: (h, params) => {
              return h('div', this.teachVersion[params.row.teachEdition - 1].name)
            },
            align: 'center'
          },
          {
            title: '适用年级 (学期)',
            key: 'gradeText',
            render: (h, params) => {
              return h('div', `${this.gradeList[params.row.grade - 1].name} (${this.semesterList[params.row.term - 1].name})`)
            },
            align: 'center'
          },
          {
            title: '适用学科',
            render: (h, params) => {
              return h('div', this.subjectList[params.row.subject - 1].name)
            },
            align: 'center'
          },
          {
            title: '封面图片',
            render: (h, params) => {
              return  h('img', {
                attrs: {
                  src: params.row.img
                },
                style: {
                  width: '36px',
                  height: '48px',
                  margin: '10px',
                }
              })
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 200,
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
                      this.toChapter(params.row)
                    }
                  }
                }, '文章管理'),
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
      this.getEditionList()
    },
    methods: {
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal(data) {
        this.isOpenModal = true
        if(data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.grade = this.addInfo.grade.toString()
          this.addInfo.subject = this.addInfo.subject.toString()
        } else {
        }
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields()
      },
      toChapter (data) {
        this.$router.push({
          name: 'articleManager',
          query: {
            teachingId: data.id,
            name: data.name,
            subject: this.subjectList[data.subject - 1].name,
            subjectId: data.subject,
            grade: this.gradeList[data.grade - 1].name,
            term: this.semesterList[data.term - 1].name,
            teachEdition: this.teachVersion[data.teachEdition - 1].name,
            type: '1'
          }
        })
        localStorage.setItem('columnList', JSON.stringify(data.children))
      },
      toJump(data) {
        localStorage.setItem('chapterId', '')
        this.$router.push({
          name: 'teachMain',
          query: {
            teachingId: data.id,
            name: data.name,
            subject: this.subjectList[data.subject - 1].name,
            subjectId: data.subject,
            grade: this.gradeList[data.grade - 1].name,
            term: this.semesterList[data.term - 1].name,
            teachEdition: this.teachVersion[data.teachEdition - 1].name
          }
        })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        this.$api.wzjh.teachingList({
          current: num ? num : this.tab.page,
          size: this.tab.pageSize,
          grade: this.selectInfo.grade,
          subject: this.selectInfo.subject
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
      getEditionList() {
        this.$api.wzjh.teachingVersion()
          .then(
            response => {
              this.teachVersion = response.data.resultData;
            })
      },
      delItem(param) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除该教材吗？',
          onOk: () => {
            this.$api.wzjh.teachingMaterialDelete({
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
            if (!this.addInfo.img) {
              return this.$Message.error('请上传封面图片')
            }
            this.isSending = true
            this.$api.wzjh.teachingMaterialSave(this.addInfo)
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
    .-search-select-text {
      min-width: 70px;
    }
    .-search-selectOne {
      width: 100px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

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
    .-c-left {
      margin-left: 24px;
    }
  }
</style>
