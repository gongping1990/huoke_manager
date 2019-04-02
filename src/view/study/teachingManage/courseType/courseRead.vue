<template>
  <div class="p-courseRead">
    <div class="-p-wrap">
      <div>
        <Upload
          :action="baseUrlVa"
          :show-upload-list="false"
          :max-size="204800"
          :before-upload="beforeUpload"
          :on-success="handleSuccessAudio"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <div class="g-primary-btn -t-width">{{playAudioUrl ? '重新上传' : '上传音频'}}</div>
        </Upload>

        <div class="-c-course-wrap" v-if="playAudioUrl">
          <div class="-c-course-item -item-audio">
            <Icon class="-item-icon" type="md-volume-up" size="30"/>
            <audio style="margin-left: 20px;display: flex"
                   ref="media"
                   :src="playAudioUrl"
                   controls="controls" preload="auto"></audio>
            <Icon type="md-close-circle" size="20" class="-item-icon-close g-cursor" @click="closeAudio"/>
          </div>
        </div>

        <div class="-c-tips">音频格式：mp3、wma、arm 音频大小：200M以内</div>
      </div>
    </div>

    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'
  import Loading from "../../../../components/loading";

  export default {
    name: 'courseRead',
    components: {Loading},
    data() {
      return {
        baseUrlVa: `${getBaseUrl()}/common/uploadPrivateFile`, //私有地址 （音视频）
        audioType: ['mp3', 'wma', 'arm'],
        isShowEditor: false,
        isSending: false,
        isFetching: false,
        playAudioUrl: '',
        addInfo: {
          id: this.$route.query.lessonId,
          readAudioUrl: ''
        }
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      closeAudio() {
        this.addInfo.audioUrl = ''
        this.playAudioUrl = ''
      },
      handleSuccessAudio(res, file) {
        if (res.code === 200) {
          this.addInfo.readAudioUrl  = res.resultData.url
          this.getAvUrl(this.addInfo.readAudioUrl)
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        isPass = this.audioType.some(item => {
          return item == fileType[fileType.length - 1]
        })
        this.isFetching = isPass
        if (!isPass) {
          this.$Message.error('上传格式错误')
        }
        return isPass
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
      getAvUrl(data) {
        this.$api.common.getAVUrl({
          key: data
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('上传成功')
                this.playAudioUrl = response.data.resultData
                this.submitInfo()
              }
            });
      },
      getInfo() {

        this.$api.book.getLessonTarget({
          lessonId: this.$route.query.lessonId
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.addInfo = response.data.resultData
                this.playAudioUrl = this.addInfo.authReadAudioUrl
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        this.isSending = true
        this.$api.book.readaudio(this.addInfo)
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
  .p-courseRead {
    height: 100%;

    .-p-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90%;
    }

    .-c-tips {
      margin-top: 40px;
    }

    .-t-width {
      margin: 20px;
      height: 40px;
      width: 200px;
    }

    .-c-color {
      color: #5444E4;
    }

    .-c-course-wrap {
      position: relative;

      .-c-course-item {
        position: relative;
        background-color: #EBEBEB;
        width: 200px;
        margin-top: 20px;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 4px;
        img {
          display: flex;
          width: 100%;
        }
      }
      .-item-audio {
        display: flex;
        align-items: center;
        width: 350px;

        .-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: #ffffff;
          background: rgba(255, 237, 116, 1);
        }

        .-item-icon-close{
          position: absolute;
          right: -10px;
          top: -10px;
        }
      }
    }
  }
</style>
