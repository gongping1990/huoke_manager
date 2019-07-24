<template>
  <div class="p-file">
    <Upload
      style="display: inline-block"
      :action="baseUrlVa"
      :show-upload-list="false"
      :max-size="option.size || 500"
      :before-upload="beforeUpload"
      :on-success="handleSuccessPlay"
      :on-exceeded-size="handleSize"
      :on-error="handleErr">
      <Button ghost type="primary" class="-btn" v-if="!fileDownUrl" :loading="isFetching">{{isFetching ? '上传中...' : '上传文件'}}</Button>
      <div v-else class="g-primary-btn ">重新上传</div>
    </Upload>

    <span class="-c-tips" v-if="fileDownUrl">已上传文件：{{fileName}}</span>

  </div>
</template>

<script>

  export default {
    name: 'uploadFile',
    props: ['option', 'childData'],
    data() {
      return {
        baseUrlVa: `http://hkupload.prod.k12.vip/common/uploadPrivateFile`, //私有地址 （音视频）
        audioPlayAddress: '',
        fileDownUrl: '',
        fileType: this.option.format,
        fileName: '',
        isFetching: false
      }
    },
    model: {
      prop: 'childData',
      event: 'changeUrl'
    },
    watch: {
      childData(_n, _o) {
        this.fileDownUrl = _n
        this.getAvUrl(_n)
      },

      fileDownUrl(_n, _o) {
        this.$emit('changeUrl', _n)
      }
    },
    methods: {
      beforeUpload(file) {
        let fileType = file.name.split('.')
        let isPass = false
        this.fileName = file.name

        isPass = this.fileType.some(item => {
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
          this.fileDownUrl = res.resultData.url
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

  .p-file {
    .-btn {
      width: 100px;
    }
    .-c-tips {
      position: absolute;
      right: 62px;
      bottom: 98px;
      color: #39f
    }
    .-c-course-wrap-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px dashed #e1e1e1;
      /*background: #f7f7f7;*/
    }
  }
</style>
