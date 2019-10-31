<template>
  <Modal
    class="p-jobRecord"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="500"
    title="审核">
    <Timeline>
      <TimelineItem v-for="(item,index) of recordList" :key="index">
        <div>{{item.time}} &emsp; {{'赵老师'}}批改</div>
        <div class="-list-item">
          <div class="-list-item-left">评分情况</div>
          <div class="-list-item-right">
            <div v-for="(item1,index1) of item.scoreList" :key="index1">
              {{item1}}
            </div>
          </div>
        </div>
        <div class="-list-item">
          <div class="-list-item-left">匹配规则</div>
          <div class="-list-item-right">
            <div v-for="(item1,index1) of item.ruleList" :key="index1">
              {{item1}}
            </div>
          </div>
        </div>
        <div class="-list-item">
          <div class="-list-item-left">批改内容</div>
          <div class="-list-item-right">
            {{item.content}}
          </div>
        </div>
      </TimelineItem>
    </Timeline>
    <RadioGroup v-model="radioType">
      <Radio label="2">通过</Radio>
      <Radio label="3">不通过</Radio>
    </RadioGroup>

    <div slot="footer" class="-p-b-flex">
      <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
      <div @click="submitInfo()" class="g-primary-btn ">确认</div>
    </div>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
export default {
  name: 'examineModal',
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
          item.replyText = item.replyText.split('#')
          item.scoreList = item.replyText[0].split(',')
          item.ruleList = item.replyText[1].split(',')
          item.content = item.replyText[3]
        }
      })
    },
    closeModal () {
      this.isOpenDetail = false
      this.$emit('input', false)
    },

    submitInfo() {
      this.$api.jsdJob.reviewReplyHomework({
        courseId: this.dataInfo.courseId,
        reviewStatus: this.radioType,
        workId: this.dataInfo.workId
      })
        .then(response => {
          if(this.radioType === '3') {
            this.$emit('successAudit', this.dataInfo)
          }
          this.closeModal()
        })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-jobRecord{


    &-wrap {
      display: flex;
      margin: 10px 0;

      &-left {
        width: 20%;
        display: flex;
        align-items: center;

        .-left-item {
          margin-bottom: 15px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      &-right {
        width: 80%;

        .-echart {
          width: 300px;
          height: 230px;
        }
      }
    }

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
