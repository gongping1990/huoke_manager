<template>
  <div class="p-uploadAudio">
    <Upload
      style="display: inline-block"
      :action="baseUrlVa"
      :show-upload-list="false"
      :max-size="option.size"
      :before-upload="beforeUpload"
      :on-success="handleSuccessPlay"
      :on-exceeded-size="handleSize"
      :on-error="handleErr">
      <Button ghost type="primary" :loading="isFetching">{{isFetching ? '上传中...' : '上传音频'}}</Button>
    </Upload>

    <div class="-c-tips">{{option.tipText}}</div>

    <div class="-c-course-wrap" v-if="itemUrl">
      <div class="-c-course-item -item-audio">
        <Icon class="-item-icon" type="md-volume-up" size="30"/>
        <audio style="margin-left: 20px;display: flex"
               ref="media"
               :src="itemUrl"
               controls="controls" preload="auto"></audio>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'uploadAudio',
    props:['option'],
    data() {
      return {
        baseUrlVa: `http://hkupload.prod.k12.vip/common/uploadPrivateFile`, //私有地址 （音视频）
        itemUrl: this.option.url,
        audioType: this.option.format,
        isFetching: false
      }
    },
    mounted() {
      console.log(this.option,1)
    },
    watch: {
      'option.url'(_n,_o) {
        console.log(_n,111111)
        this.itemUrl = _n
      }
    },
    methods: {
      delImg() {
        this.itemUrl = ''
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
      handleSuccessPlay(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.getAvUrl(res.resultData.url)
          this.$emit('successAudioUrl', res.resultData.url)
        }
      },
      getAvUrl(data) {
        if (this.isFetching) return
        this.isFetching = true
        this.$api.common.getAVUrl({
          key: data
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('上传成功')
                this.itemUrl = response.data.resultData
              }
            })
          .finally(() => {
            this.isFetching = false
          });
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-uploadAudio {
    .-c-tips {
      color: #39f
    }
    .-c-course-wrap {

      .-c-course-item {
        display: inline-block;
        position: relative;
        background-color: #EBEBEB;
        width: 200px;
        height: 90px;
        margin: 10px 10px 10px 0;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 4px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .-code {
        width: 100px;
        height: 100px;
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
      }

      .-item-video {
        margin: 10px 0;
      }
    }
  }
</style>
