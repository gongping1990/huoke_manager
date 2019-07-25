<template>
  <div class="p-topBar">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo" :rules="ruleValidate"
            :label-width="100">
        <Form-item label="是否启用" prop="turn" class=" -c-form-item ">
          <Radio-group v-model="addInfo.enable">
            <Radio :label=0 :disabled="!isShowEdit">不启用</Radio>
            <Radio :label=1 :disabled="!isShowEdit">启用</Radio>
          </Radio-group>
        </Form-item>
        <FormItem label="图片上传">
          <upload-img v-model="addInfo.topImg" :option="uploadOption" :isDisabled="!isShowEdit"></upload-img>
        </FormItem>
        <FormItem label="跳转链接" prop="url">
          <Input type="text" v-model="addInfo.url" placeholder="请输入跳转链接" :disabled="!isShowEdit"></Input>
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
  import UploadImg from "../../../components/uploadImg";

  export default {
    name: 'customerService',
    components: {UploadImg, Loading},
    data() {
      return {
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        addInfo: {
          enable: 0
        },
        ruleValidate: {
          url: [
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
        this.$api.banner.getTopbar()
          .then(
            response => {
              if(response.data.resultData) {
                this.addInfo = response.data.resultData;
                this.addInfo.enable = this.addInfo.enable ? 1 : 0
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

            if (!this.addInfo.topImg) {
              return this.$Message.error('请上传图片')
            }
            this.$api.banner.updateTopbar({
              ...this.addInfo,
              enable: this.addInfo.enable != '0'
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
