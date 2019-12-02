<template>
  <div class="p-dubbing">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo"
            :label-width="120">
        <Form-item label="新用户领课" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="初次提醒上交作业" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="提醒上课" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="初次提醒作业要求" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="提醒交作业" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="引导翻阅同学作业" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="提醒查看点评" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="作业提交成功" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="查看点评" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
        <Form-item label="完善用户信息" prop="turn" class=" -c-form-item ">
          <upload-audio v-model="addInfo.sortNum" :option="uploadAudioOption"></upload-audio>
        </Form-item>
      </Form>

      <div class="-c-flex">
        <Button @click="isShowEdit = true" ghost type="primary" class="-c-btn" v-if="!isShowEdit">进入编辑</Button>
        <Button @click="closeEdit" ghost type="primary" class="-c-btn" v-else>取消</Button>
        <div v-if="isShowEdit" @click="submitInfo('addInfo')" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' :
          '确认'}}
        </div>
      </div>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import UploadAudio from "../../../components/uploadAudio";

  export default {
    name: 'customerService',
    components: {UploadAudio, Loading},
    data() {
      return {
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm']
        },
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        addInfo: {
          enable: 0
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      closeEdit() {
        this.isShowEdit = false
        this.getList()
      },
      getList() {
        this.isFetching = true
        this.$api.banner.getTopbar()
          .then(
            response => {
              if (response.data.resultData) {
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
  .p-dubbing {

    .-c-form {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .-c-form-item {
        display: inline-block;
        width: 50%;
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
