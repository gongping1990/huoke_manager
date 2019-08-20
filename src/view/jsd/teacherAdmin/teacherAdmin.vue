<template>
  <div class="p-adminTeacher">
    <Card>
      <div class="g-add-btn" @click="openModal()">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>

      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>

      <Page class="g-text-right" :total="total" size="small" show-elevator :page-size="tab.pageSize"
            :current.sync="tab.currentPage"
            @on-change="currentChange"></Page>

      <Modal
        class="p-adminTeacher"
        v-model="isOpenModal"
        @on-cancel="closeModal('addInfo')"
        width="500"
        :title="addInfo.id ? '编辑教师' : '创建教师'">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="90">
          <FormItem label="教师名称" prop="nickname">
            <Input type="text" v-model="addInfo.nickname" placeholder="请输入教师名称"></Input>
          </FormItem>
          <Form-item label="教师头像" class="ivu-form-item-required">
            <upload-img  v-model="addInfo.headimgurl" :option="uploadOption"></upload-img>
          </Form-item>
          <FormItem label="教师账号" prop="username">
            <Input type="text" v-model="addInfo.username" :disabled="addInfo.id!=''" placeholder="请输入账号"></Input>
            <span class="-c-tips">* 添加后，账号不可修改</span>
          </FormItem>
          <FormItem label="初始密码" prop="password" v-if="!addInfo.id">
            <Input type="text" v-model="addInfo.password" placeholder="请输入初始密码"></Input>
            <span class="-c-tips">* 添加后，密码可重置为初始密码ju123456</span>
          </FormItem>
          <FormItem label="预估工作量" prop="amount">
            <InputNumber type="text" v-model="addInfo.amount" :min="0"
                         placeholder="请输入预估工作量"></InputNumber>
          </FormItem>
        </Form>
        <div slot="footer" class="-p-b-flex">
          <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
          <div @click="submitInfo('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </Modal>

      <Modal
        class="p-adminTeacher"
        v-model="isOpenModalData"
        @on-cancel="isOpenModalData = false"
        width="1100"
        title="数据详情">
        <Table class="-c-tab" :loading="isFetching" :columns="columnsModal" :data="detailList"></Table>

        <Page class="g-text-right" :total="totalDetail" size="small" show-elevator :page-size="tabDetail.pageSize"
              :current.sync="tabDetail.currentPage"
              @on-change="detailCurrentChange"></Page>
        <div slot="footer" class="p-adminTeacher-btn">
          <div @click="isOpenModalData = false" class="g-primary-btn"> 确 认</div>
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
        searchInfo: {},
        total: 0,
        totalDetail: 0,
        isFetching: false,
        isOpenModal: false,
        isOpenModalData: false,
        isSending: false,
        addInfo: {},
        ruleValidate: {
          nickname: [
            {required: true, message: '请输入教师名称', trigger: 'blur'},
            {type: 'string', max: 20, message: '教师名称长度为20字', trigger: 'blur'}
          ],
          amount: [
            {required: true, type:'number', message: '请输入预估工作量', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入初始密码', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入教师账号', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '教师名称',
            key: 'nickname'
          },
          {
            title: '教师账号',
            key: 'username'
          },
          {
            title: '教师头像',
            render: (h, params) => {
              return h('div', {
                style: {
                  'display': 'flex',
                  'align-items': 'center',
                  'justify-content': 'center'
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
                })
              ])
            },
            align: 'center'
          },
          {
            title: '预计工作量',
            key: 'amount'
          },
          {
            title: '启用/禁用',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: params.row.desabled ? 'default' : 'success'
                }
              }, params.row.desabled ? '已禁用' : '已启用')
            }
          },
          {
            title: '操作',
            width: 320,
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
                }, params.row.desabled ? '启用' : '禁用'),
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
                      this.resultItem(params.row)
                    }
                  }
                }, '重置密码'),
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
                }, '每日数据')
              ])
            }
          }
        ],
        columnsModal: [
          {
            title: '日期',
            key: 'date',
            align: 'center'
          },
          {
            title: '总量/已处理',
            key: 'pv',
            align: 'center'
          },
          {
            title: '自动分配/已处理',
            key: 'pv',
            align: 'center'
          },
          {
            title: '补批/已处理',
            key: 'uv',
            align: 'center'
          },
          {
            title: '调度/已处理',
            key: 'uv',
            align: 'center'
          },
          {
            title: '重交/已处理',
            key: 'uv',
            align: 'center'
          },
          {
            title: '效率（分钟）',
            key: 'uv',
            align: 'center'
          },
          {
            title: '好评率/差评率',
            key: 'uv',
            align: 'center'
          }
        ]
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      openModal(data) {
        this.isOpenModal = true
        if (data) {
          this.addInfo = JSON.parse(JSON.stringify(data))
        } else {
          this.addInfo = {
            id: '',
            amount: null,
            img: ''
          }
        }
      },
      openModalData (data) {
        this.isOpenModalData = true
        this.operationalId = data.id
        this.getDetailList(data)
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
      getDetailList(data) {
        this.isFetching = true
        this.$api.gswOperational.getOperationalStatistics({
          operationalId: data.id
        }).then(response => {
          this.detailList = response.data.resultData.records;
          this.totalDetail = response.data.resultData.total;
        }).finally(()=>{
          this.isFetching = false
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
          content: '禁用该老师后，其“待批改”和“不合格”作业将平均分配给其他启用的老师',
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
          content: '确认要删除吗？',
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
              nickname : this.addInfo.nickname,
              username : this.addInfo.username,
              password : this.addInfo.password,
              headimgurl : this.addInfo.headimgurl,
              amount : this.addInfo.amount
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
  .p-adminTeacher {
    .-c-tips {
      color: #39f
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
