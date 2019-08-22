<template>
  <Modal
    class="p-jobRecord"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="500"
    title="作业记录">
    <Timeline>
      <TimelineItem v-for="(item,index) of recordList" :key="index">
        <div>{{item.time}}</div>
        <div class="-text" v-if="item.replyText">{{item.replyText}}</div>
        <div class="-audio" v-if="item.audio">
          <audio ref="media"
                 :src="item.audio"
                 controls="controls" preload="auto"></audio>
        </div>
        <div class="g-flex-a-j-center">
          <img class="-img" preview="0" v-for="url of item.img" :src="url"/>
        </div>
      </TimelineItem>
    </Timeline>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
export default {
  name: 'jobRecordTemplate',
  props: ['value', 'dataInfo'],
  data () {
    return {
      isOpenDetail: false,
      recordList: []
    }
  },
  mounted() {

  },
  watch: {
    value (_n) {
      this.isOpenDetail = _n
      _n && this.getJobLogList()
      this.$previewRefresh()
    }
  },
  methods: {
    getJobLogList() {
      this.$api.jsdJob.listHomeWorkLog({
        workId: this.dataInfo.workId,
        system: this.dataInfo.appId || '7',
      }).then(response => {
        this.recordList = response.data.resultData
        for (let item of this.recordList) {
          item.time = dayjs(+item.createTime).format('YYYY-MM-DD HH:mm')
          item.img = item.img ? item.img.split(',') : []
        }
      })
    },
    closeModal () {
      this.isOpenDetail = false
      this.$emit('input', false)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-jobRecord{

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

    .-img {
      cursor: zoom-in;
      margin-top: 20px;
      width: 120px;
      height: 100px;
      margin-right: 10px;
    }

    .-audio {
      margin: 10px 0;
    }

  }
</style>
