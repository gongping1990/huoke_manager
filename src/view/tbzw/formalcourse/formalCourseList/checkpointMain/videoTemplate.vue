<template>
  <div class="p-videoTemplate">
    <Form :model="addInfo" :label-width="80">
      <FormItem label="关卡音频" class="ivu-form-item-required">
        <upload-video v-model="addInfo.contentUrl" :option="uploadVideoOption"></upload-video>
      </FormItem>
    </Form>
    <div class="p-videoTemplate-footer g-flex-j-sa">
      <div @click="submitInfo()" class="g-primary-btn ">确认</div>
    </div>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import UploadVideo from "../../../../../components/uploadVideo";

  export default {
    name: 'videoTemplate',
    components: {UploadVideo},
    data() {
      return {
        uploadVideoOption: {
          tipText: '视频格式：mp4、wmv、rmvb、avi 视频大小：150M以内',
          size: 153600,
          format: ['mp4', 'wmv', 'rmvb', 'avi']
        },
        addInfo: {
          contentUrl: ''
        },
        isShow: false
      }
    },
    mounted() {
    },
    methods: {
      getList(data) {
        data && (this.addInfo = data)
        console.log(this.addInfo,11)
      },
      submitInfo() {
        if (!this.addInfo.contentUrl) {
          return this.$Message.error('请选择页面音频')
        }
        this.$api.tbzwLesson.saveCheckPointVideo({
          id: this.addInfo.id,
          contentUrl: this.addInfo.contentUrl
        })
          .then(response => {
            if (response.data.code == '200') {
              this.$Message.success('操作成功');
            }
          })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-videoTemplate{
    padding: 30px;
    text-align: left;

    &-footer {
      width: 50%;
      margin: 20px 0;
    }
  }
</style>
