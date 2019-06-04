<template>
  <div class="p-uploadVideo">
    <Upload
      style="display: inline-block"
      :action="baseUrlVa"
      :show-upload-list="false"
      :max-size="option.size"
      :before-upload="beforeUpload"
      :on-success="handleSuccessPlay"
      :on-exceeded-size="handleSize"
      :on-error="handleErr">
      <Button ghost type="primary" :loading="isFetching">{{isFetching ? '上传中...' : '上传视频'}}</Button>
    </Upload>

    <div class="-c-tips">{{option.tipText}}</div>

    <div class="-c-course-wrap" v-if="videoStorageAddress">
      <div class="-item-video">
        <video style="width: 300px"
               ref="media"
               :src="videoPlayAddress"
               controls="controls" preload="auto"></video>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'uploadVideo',
    props:['option', 'childVideo'],
    data() {
      return {
        baseUrlVa: `http://hkupload.prod.k12.vip/common/uploadPrivateFile`, //私有地址 （音视频）
        videoPlayAddress: '',
        videoStorageAddress: '',
        videoType: this.option.format,
        isFetching: false
      }
    },
    model: {
      prop: 'childVideo',
      event: 'changeVideo'
    },
    watch: {
      childVideo(_n, _o) {
        this.videoStorageAddress = _n
        this.getAvUrl(_n)
      },

      videoStorageAddress(_n, _o) {
        this.$emit('changeVideo', _n)
      }
    },
    methods: {
      load() {
        this.$refs.media.load()
      },
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        isPass = this.videoType.some(item => {
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
          this.videoStorageAddress = res.resultData.url
          this.getAvUrl(res.resultData.url)
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
                this.videoPlayAddress = response.data.resultData
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

  .p-uploadVideo {
    .-c-tips {
      color: #39f
    }
    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        /*height: 70px;*/
        overflow: hidden;

        img {
          width: 140px;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          /*-webkit-line-clamp: 1;*/
          line-height: normal;
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
      }
    }
  }
</style>
