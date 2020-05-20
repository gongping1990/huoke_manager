<template>
  <div class="p-topBar">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo" :rules="ruleValidate"
            :label-width="100">
        <FormItem label="悬浮框链接" prop="link">
          <Input type="text" v-model="addInfo.link" placeholder="请输入跳转链接" :disabled="!isShowEdit"></Input>
        </FormItem>
        <FormItem>
          <div class="-c-flex">
            <Button @click="isShowEdit = true" ghost type="primary" class="-c-btn" v-if="!isShowEdit">进入编辑</Button>
            <Button @click="closeEdit" ghost type="primary" class="-c-btn" v-else>取消</Button>
            <div v-if="isShowEdit" @click="submitInfo('addInfo')" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' : '确 认'}}</div>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";

  export default {
    name: 'operate',
    components: {Loading},
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        addInfo: {
          enable: 0
        },
        ruleValidate: {
          link: [
            {required: true, message: '请输入跳转链接', trigger: 'blur'},
          ]
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      closeEdit () {
        this.isShowEdit = false
        this.getList()
      },
      getList() {
        this.isFetching = true
        this.$api.xxbCompositionAdmin.getLink()
          .then(
            response => {
              this.addInfo =  {
                link : response.data.resultData || {}
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {

        this.$refs[name].validate((valid, data) => {
          if (valid) {
            this.isSending = true

            this.$api.xxbCompositionAdmin.updateLink({
              link: this.addInfo.link
            })
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.closeEdit()
                    this.$refs[name].resetFields()
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-topBar {

    .-c-form {
      width: 50%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }

    .-c-flex {
      display: flex;
      justify-content: center;
    }

    .-c-btn {
      margin: 20px;
      width: 120px;
    }
  }
</style>
