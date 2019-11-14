<template>
  <Modal
    class="p-classLog"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="500"
    title="上课记录">
    <Form ref="addInfo" :label-width="70">
      <FormItem label="操作记录">
        <Timeline>
          <TimelineItem v-for="(item,index) of recordList" :key="index">
            <div>{{item.time}} &emsp; {{'第一次上课'}}</div>
            <div>开始时间：{{item.replyText}}</div>
            <div>退出时间：{{item.replyText}}</div>
            <div>播放时长：{{item.replyText}}</div>
          </TimelineItem>
        </Timeline>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
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
    mounted() {

    },
    watch: {
      value (_n) {
        this.isOpenDetail = _n
        _n && this.getJobLogList()
      },
    },
    methods: {
      getJobLogList() {
        this.$api.jsdJob.listHomeWorkLog({
          workId: this.dataInfo.workId,
          courseId: this.dataInfo.appId,
        }).then(response => {
          this.recordList = response.data.resultData
          for (let item of this.recordList) {
            item.time = dayjs(+item.createTime).format('YYYY-MM-DD HH:mm')
            // item.replyText = item.replyText.split('#')
            // item.scoreList = item.replyText[0].split(',')
            // item.ruleList = item.replyText[1].split(',')
            // item.content = item.replyText[3]
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
