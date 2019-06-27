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
      title="创建角色">
      <Form ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="70">
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="addInfo.name"></Input>
        </FormItem>
        <FormItem label="角色码" prop="name">
          <Input type="text" v-model="addInfo.code"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="-p-s-footer">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitAdmin('addInfo')" class="g-primary-btn ">确 认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'use-role',
    data() {
      return {
        dataList: [],
        isFetching: false,
        isOpenModal: false,
        addInfo: {},
        ruleValidate: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        columns: [
          {
            title: '角色名',
            key: 'name'
          },
          {
            title: '授权人数',
            key: 'countnum'
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
      openModal(data) {
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.isOpenModal = true
      },
      closeModal(name) {
        this.isOpenModal = false
        this.$refs[name].resetFields();
      },
      getList() {
        this.isFetching = true
        this.$api.admin.roleListCount()
          .then(
            response => {
              this.dataList = response.data.resultData;
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
            this.$api.admin.removeRole({
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
      submitAdmin(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            this.$api.admin.addRole(this.addInfo)
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
    },
  }
</script>

<style lang="less" scoped>
  .p-setting {
    .-p-s-footer {
      display: flex;
      /*text-align: center;*/
      justify-content: space-around;
    }
    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
