<template>
  <Modal
    class="p-pwd"
    v-model="isOpenModal"
    @on-cancel="closeModal('changePswForm')"
    width="350"
    title="修改密码">
    <Form ref="changePswForm" :model="changePswForm" :rules="ruleValidate" :label-width="70">
      <FormItem label="新密码" prop="password">
        <Input type="text" v-model="changePswForm.password"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="-p-s-footer">
      <Button @click="closeModal('changePswForm')" ghost type="primary" style="width: 100px;">取 消</Button>
      <div @click="submitPwd('changePswForm')" class="g-primary-btn ">确 认</div>
    </div>
  </Modal>
</template>

<script>

  export default {
    name: 'updatePwd',
    data() {
      return {
        isOpenModal: false,
        changePswForm: {
          password: ''
        },
        ruleValidate: {
          password: [
            {required: true, message: '请输入新密码', trigger: 'blur'}
          ]
        },
      }
    },
    mounted() {
      this.isOpenModal = true
    },
    methods: {
      closeModal(name) {
        this.$emit('closePwdModal')
        this.$refs[name].resetFields();
      },
      submitPwd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('emitPwdModal', this.changePswForm)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-pwd {
    .-p-s-footer {
      display: flex;
      justify-content: space-around;
    }

  }
</style>
