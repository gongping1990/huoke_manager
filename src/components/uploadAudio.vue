<template>
  <div class="p-uploadAudio">
    <Upload
      v-if="!isDisabled"
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

    <div class="-c-course-wrap" v-if="audioStorageAddress">
      <div class="-c-course-item -item-audio">
        <Icon class="-item-icon" type="md-volume-up" size="30"/>
        <audio style="margin-left: 20px;display: flex"
               ref="media"
               :src="audioPlayAddress"
               controls="controls" preload="auto"></audio>
        <div class="-i-del" @click="audioStorageAddress= ''">删除</div>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'uploadAudio',
    props: ['option', 'childData'],
    data() {
      return {
        baseUrlVa: `http://hkupload.prod.k12.vip/common/uploadPrivateFile`, //私有地址 （音视频）
        audioPlayAddress: '',
        audioStorageAddress: '',
        audioType: this.option.format,
        isFetching: false,
        isDisabled: false
      }
    },
    model: {
      prop: 'childData',
      event: 'changeUrl'
    },
    mounted () {
      if(this.childData){
        this.audioStorageAddress = this.childData
        this.getAvUrl(this.childData)
      }
    },
    watch: {
      childData(_n, _o) {
        this.audioStorageAddress = _n
        this.getAvUrl(_n)
      },

      audioStorageAddress(_n, _o) {
        this.$emit('changeUrl', _n)
      }
    },
    methods: {
      load() {
        this.$refs.media.load()
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
          this.audioStorageAddress = res.resultData.url
          this.getAvUrl(res.resultData.url)
          this.$emit('otherAudioInfo', res.resultData.duration)
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
                this.audioPlayAddress = response.data.resultData
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

      .-i-del {
        position: absolute;
        top: 0;
        right: 0;
        color: #ffff;
        background-color: rgba(0, 0, 0, 0.4);
        line-height: normal;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
      }

      .-item-video {
        margin: 10px 0;
      }
    }
  }
</style>
