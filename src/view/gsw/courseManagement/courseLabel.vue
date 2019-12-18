<template>
  <div class="p-course">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="-p-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            @on-change="currentChange"></Page>

      <Modal
        class="p-course"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑标签' : '创建标签'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="标签名称" prop="name">
            <Input type="text" v-model="addInfo.name" placeholder="请输入标签名称"></Input>
          </FormItem>
          <FormItem label="排序值" prop="sortnum">
            <Input type="text" v-model="addInfo.sortnum" placeholder="请输入排序值"></Input>
          </FormItem>
          <FormItem label="全册价格">
            <InputNumber type="text"  v-model="addInfo.fullPrice" :min="0"
                         placeholder="请输入全册价格"></InputNumber>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-course"
        v-model="isOpenModalCourse"
        @on-cancel="isOpenModalCourse = false"
        width="500"
        title="选择课程">
        <Form ref="addInfo" :model="addInfo" :label-width="90">
          <FormItem label="关联课程" prop="text">
            <Select v-model="addInfo.courseIds" multiple class="-search-selectOne">
              <Option v-for="item of courseList" :label=item.name :value=item.id :key="item.id" ></Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="isOpenModalCourse = false" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitCourse()" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'fxgl_pageType',
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        courseList: [],
        total: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalCourse: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入标签名称', trigger: 'blur'},
          ],
          sortnum: [
            {required: true, message: '请输入排序值', trigger: 'blur'},
          ]
        },
        // ruleValidateTwo: {
        //   name: [
        //     {required: true, message: '请输入标签名称', trigger: 'blur'},
        //   ],
        //   sortnum: [
        //     {required: true, message: '请输入排序值', trigger: 'blur'},
        //   ]
        // },
        columns: [
          {
            title: '标签名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '排序值',
            key: 'sortnum',
            align: 'center'
          },
          {
            title: '绑定课程',
            key: 'courseNames',
            tooltip: true,
            align: 'center'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.disabled ? 'default' : 'success'
                }
              }, params.row.disabled ? '已禁用' : '已启用')
            },
            align: 'center'
          },
          {
            title: '操作',
            width: 300,
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
                      this.toChangeStatus(params.row)
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
                    color: '#5444E4',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.openModalCourse(params.row)
                    }
                  }
                }, '关联课程'),
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
          }
        ],
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toChangeStatus(param) {
        this.$Modal.confirm({
          title: '提示',
          content: param.disabled ? '确认要启用吗？' : '确认要禁用吗' ,
          onOk: () => {
            this.$api.gswTags.disabledTags({
              tagsId: param.id
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
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.fullPrice = +this.addInfo.fullPrice / 100
        } else {
          this.addInfo = {
            fullPrice: null
          }
        }
      },
      openModalCourse (data) {
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
          this.addInfo.courseIds = this.addInfo.courseIds ? JSON.parse(this.addInfo.courseIds) : []
        } else {
          this.addInfo = {
            courseIds: []
          }
        }
        this.isOpenModalCourse = true
        this.listCourseTags()
      },
      closeModal(name) {
        this.isOpenModal = false
        this.isOpenModalCourse = false
        this.$refs[name].resetFields()
      },
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.gswTags.pageByTags({
          current: this.tab.page,
          size: this.tab.pageSize,
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
      listCourseTags() {
        this.isFetching = true
        this.$api.gswCourse.queryPage({
          current: 1,
          size: 1000,
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
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
            this.$api.gswTags.removeTagById({
              tagsId: param.id
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
        if (this.isSending) return

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.gswTags.editTag({
              id: this.addInfo.id,
              name: this.addInfo.name,
              sortnum: this.addInfo.sortnum,
              fullPrice: this.addInfo.fullPrice*100
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
      submitCourse(name) {
        if (this.isSending) return
        if(!this.addInfo.courseIds.length) {
          return this.$Message.error('请选择关联课程')
        }
        this.isSending = true
        this.$api.gswTags.saveCourseTag({
          tagsId: this.addInfo.id,
          courseIds: JSON.stringify(this.addInfo.courseIds)
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('提交成功');
                this.getList()
                this.isOpenModalCourse = false
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-course {
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

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
