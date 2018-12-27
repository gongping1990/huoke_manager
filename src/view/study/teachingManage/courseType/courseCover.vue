<template>
  <div class="p-courseCover">
    <div class="-p-wrap">
      <div>
        <div class="-p-wrap-img" v-if="addInfo.coverImgUrl">
          <img :src="addInfo.coverImgUrl">
        </div>
        <Upload
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="200"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <div class="g-primary-btn -t-width">{{addInfo.coverImgUrl ? '编辑图片' : '上传图片'}}</div>
        </Upload>
        <span class="-c-tips">只能上传jpg/png文件，且不超过200kb，图片尺寸为960px*360px</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'courseCover',
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        isShowEditor: false,
        isSending: false,
        isFetching: false,
        optionList: [],
        addInfo: {
          id: this.$route.query.lessonId,
          coverImgUrl: ''
        }
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      delImg() {
        this.addInfo.coverImgUrl = ''
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.coverImgUrl = res.resultData.url
          this.submitInfo()
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      beforeUpload() {
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
      getInfo() {
        this.isFetching = true
        this.$api.book.getLessonTarget({
          lessonId: this.$route.query.lessonId
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.addInfo = response.data.resultData
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        this.isSending = true
        this.$api.book.updateCover(this.addInfo)
          .then(
            response => {
              if (response.data.code == '200') {
                this.getInfo()
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
  .p-courseCover {
    height: 100%;

    .-p-wrap-img{

      img{
        width: 250px;
      }
    }

    .-t-width {
      margin: 20px;
      height: 40px;
      width: 200px;
    }

    .-c-color {
      color: #5444E4;
    }
  }
</style>
