<template>
  <Modal
    class="p-classLog"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="500"
    title="上课记录">
    <Timeline>
      <TimelineItem v-for="(item,index) of recordList" :key="index">
        <div>{{item.gmtCreate | timeFormat}} &emsp; 第{{index+1}}次上课</div>
        <div>开始时间：{{item.startTime | timeFormat}}</div>
        <div>退出时间：{{item.endTime | timeFormat}}</div>
        <div>播放时长：{{item.learnTime | secondFormat}}</div>
      </TimelineItem>
    </Timeline>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  import {formatSeconds} from '@/libs/index'
  export default {
    name: 'classLog',
    props: ['value', 'dataInfo'],
    data () {
      return {
        isOpenDetail: false,
        radioType: '',
        recordList: []
      }
    },
    filters: {
      timeFormat (time) {
        return dayjs(+time).format('YYYY-MM-DD HH:mm:ss')
      },
      secondFormat (time) {
        return dayjs(+time).format('mm分ss秒')
      }
    },
    mounted() {},
    watch: {
      value (_n) {
        this.isOpenDetail = _n
        _n && this.getJobLogList()
        console.log(this.dataInfo,111)
      },
    },
    methods: {
      getJobLogList() {
        this.$api.tbzwStudyRecordData.getUserStudyRecordByLessonId({
          lessonId: this.dataInfo.lessonId,
          uid: this.dataInfo.uid,
        }).then(response => {
          this.recordList = response.data.resultData
          this.recordList.forEach(item=>{
            item.learnTime = (+item.endTime) - (+item.startTime)
          })
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

  .p-classLog{

    &-radio {
      text-align: center;
      width: 100%;
    }

    .-text {
      margin: 10px 0;
      font-size: 16px;
    }

  }
</style>
