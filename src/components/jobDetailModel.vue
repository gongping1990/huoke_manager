<template>
  <Modal
    class="p-job-model"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="750"
    title="批改详情">
    <Form ref="dataInfo" :model="dataInfo" :label-width="70">
      <FormItem label="教师名称">{{dataInfo.replyTeacher}}</FormItem>
      <FormItem label="批改图片">
        <div v-if="dataInfo.replyImg.length">
          <img  class="-img" preview="0" v-for="(item,index) of dataInfo.replyImg" :key="index" :src="item">
        </div>

        <div v-else>暂无图片~</div>
      </FormItem>
      <FormItem label="批改音频">
        <div class="-c-course-wrap" v-if="dataInfo.replyAudioAuthorUrl">
          <div class="-c-course-item -item-audio">
            <Icon class="-item-icon" type="md-volume-up" size="30"/>
            <audio style="margin-left: 20px;display: flex"
                   ref="media"
                   :src="dataInfo.replyAudioAuthorUrl"
                   controls="controls" preload="auto"></audio>
          </div>
        </div>
        <span v-else>暂无音频~</span>
      </FormItem>
      <FormItem label="批改文案">{{dataInfo.replyText || '暂无文案~'}}</FormItem>
    </Form>
  </Modal>
</template>

<script>
export default {
  name: 'jobDetailModel',
  props: ['value', 'dataInfo'],
  data () {
    return {
      isOpenDetail: false
    }
  },
  mounted() {
    console.log(this.dataInfo,11111)
  },
  watch: {
    value (_n) {
      this.isOpenDetail = _n
      this.$previewRefresh()
    }
  },
  methods: {
    closeModal () {
      this.dataInfo.replyAudioAuthorUrl && this.$refs.media.load()
      this.isOpenDetail = false
      this.$emit('input', false)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-job-model{

    .-img {
      cursor: zoom-in;
      width: 200px;
      height: 100px;
      margin-right: 10px;
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
