<template>
  <div class="p-setting">
    <Card>
      <div class="g-add-btn" @click="openModal">
        <Icon class="-btn-icon" color="#fff" type="ios-add" size="24"/>
      </div>
      <Table class="-c-tab" :loading="isFetching" :columns="columns" :data="dataList"></Table>
    </Card>

    <Modal
      class="p-setting"
      v-model="isOpenModal"
      @on-cancel="closeModal('addInfo')"
      width="350"
      title="添加用户">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="账号" prop="username">
          <Input type="text" v-model="addInfo.username"></Input>
        </FormItem>
        <FormItem label="初始密码" prop="password">
          <Input type="password" v-model="addInfo.password"></Input>
        </FormItem>
        <FormItem label="姓名" prop="nickname">
          <Input type="text" v-model="addInfo.nickname"></Input>
        </FormItem>
        <FormItem label="角色" prop="roleId">
          <Select v-model="addInfo.roleId" placeholder="请选择">
            <Option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-s-footer">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitAdmin('addInfo')" class="g-primary-btn "> {{isSending ? '提交中...' : '确 认'}}</div>
      </div>
    </Modal>

    <div v-if="isOpenPasswordModal">
      <update-pwd @emitPwdModal="submitPwd" @closePwdModal="closePwdModal"></update-pwd>
    </div>


  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import UpdatePwd from "../../components/updatePwdTemplate";

  export default {
    name: 'userList',
    components: {UpdatePwd},
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        dataList: [],
        roleList: [],
        userId: '',
        isFetching: false,
        isOpenModal: false,
        isOpenPasswordModal: false,
        isSending: false,
        addInfo: {
          username: '',
          password: '',
          nickname: '',
          roleId: ''
        },
        ruleValidate: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入初始密码', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请选择角色', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '账号',
            key: 'username'
          },
          {
            title: '名字',
            key: 'nickname'
          },
          {
            title: '创建时间',
            key: 'createDate'
          },
          {
            title: '角色',
            key: 'roleName'
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
                    color: '#DA374B'
                  },
                  on: {
                    click: () => {
                      this.openPwdModal(params.row)
                    }
                  }
                }, '重置密码')
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
      currentChange(val) {
        this.tab.page = val;
        this.getList();
      },
      openModal() {
        this.isOpenModal = true
        this.getRoleList()
      },
      openPwdModal(data) {
        this.userId = data.id
        this.isOpenPasswordModal = true
      },
      closePwdModal () {
        this.isOpenPasswordModal = false
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields();
      },
      toChangeStatus(params) {
        this.$api.admin.changeAdminStatus({
          userId: params.id
        }).then(
          response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功')
              this.getList()
            }
          })
      },
      submitAdmin(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.admin.addAdmin(this.addInfo)
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
      submitPwd (params) {
        this.$api.admin.changeOtherAdminPassword({
          userId: this.userId,
          ...params
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('修改成功');
                this.closeModal()
              }
            })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.admin.adminList()
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getRoleList() {
        this.$api.admin.roleList()
          .then(
            response => {
              this.roleList = response.data.resultData;
            })
      },
    },
  }
</script>

<style lang="less" scoped>
  .p-setting {
    .-p-text-right {
      text-align: right;
    }

    .-p-s-footer {
      display: flex;
      /*text-align: center;*/
      justify-content: space-around;
    }

    .-p-modal-btn {
      vertical-align: bottom;
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
