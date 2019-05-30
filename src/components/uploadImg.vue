<template>
  <div class="p-uploadImg">
    <Upload
      v-if="!itemUrl && !isDisabled"
      :action="baseUrl"
      :show-upload-list="false"
      :max-size="option.size"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-exceeded-size="handleSize"
      :on-error="handleErr">
      <div class="g-course-add-style" >
        <span>+</span>
        <span>上传图片</span>
      </div>
    </Upload>
    <div class="-c-course-wrap" v-if="itemUrl">
      <div class="-c-course-item">
        <img :src="itemUrl">
        <div class="-i-del" @click="delImg()">删除</div>
      </div>
    </div>
    <div class="-c-tips">{{option.tipText}}</div>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'uploadImg',
    props:['option'],
    data() {
      return {
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        itemUrl: this.option.url,
        isDisabled: false
      }
    },
    mounted() {
      console.log(this.option,1)
    },
    watch: {
      'option.url'(_n,_o) {
        this.itemUrl = _n
      }
    },
    methods: {
      init() {
        this.itemUrl = this.option.url
        this.isDisabled = this.option.isDisabled
      },
      delImg() {
        this.itemUrl = ''
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png']
        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.itemUrl = res.resultData.url
          this.$emit('successImgUrl', this.itemUrl)
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-uploadImg {
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
