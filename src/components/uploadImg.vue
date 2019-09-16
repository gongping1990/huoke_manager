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
      <div class="g-course-add-style">
        <span>+</span>
        <span>上传图片</span>
      </div>
    </Upload>
    <div class="-c-course-wrap" v-if="itemUrl">
      <div class="-c-course-item">
        <img :src="itemUrl">
        <div class="-i-del" v-if="!disabled" @click="delImg()">删除</div>
      </div>
    </div>
    <div class="-c-tips">{{option.tipText}}</div>
  </div>
</template>

<script>
  import {getBaseUrl} from '@/libs/index'

  export default {
    name: 'uploadImg',
    props: ['option', 'childData', 'isDisabled'],
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`,
        itemUrl: '',
        disabled: this.isDisabled || false
      }
    },
    model: {
      prop: 'childData',
      event: 'changeUrl'
    },
    watch: {
      childData(_n, _o) {
        this.itemUrl = _n
      },

      itemUrl(_n, _o) {
        this.$emit('changeUrl', _n)
      },

      isDisabled (_n,_o) {
        this.disabled = _n
      }
    },
    methods: {
      delImg() {
        this.itemUrl = ''
      },
      beforeUpload(file) {
        let imgType = ['jpeg', 'png', 'image/gif']
        if (file.type.indexOf(imgType[0]) == -1 && file.type.indexOf(imgType[1]) == -1 && file.type.indexOf(imgType[2]) == -1) {
          this.$Message.error('上传文件类型错误')
          return false;
        }
        return true
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.itemUrl = res.resultData.url
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
