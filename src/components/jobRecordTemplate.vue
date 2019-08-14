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
        <div class="-text" v-if="item.text">{{item.text}}</div>
        <div class="-audio" v-if="item.audio">
          <audio ref="media"
                 :src="item.audio"
                 controls="controls" preload="auto"></audio>
        </div>
        <div class="g-flex-a-j-center">
          <img class="-img" preview="0" v-for="url of item.imgList" :src="url"/>
        </div>
      </TimelineItem>
    </Timeline>
  </Modal>
</template>

<script>
export default {
  name: 'jobRecordTemplate',
  props: ['value', 'dataInfo'],
  data () {
    return {
      isOpenDetail: false,
      recordList: [
        {
          time: '2017-08-12 12:01:59',
          audio: 'http://huoke-private-1254282420.cos.ap-chengdu.myqcloud.com/2019/08/14/13478097-0702-42ba-8bcc-50790701ffc4.mp3?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDCJG2e67TN6kR3mA5fDve2X0Ndnwz5mV8%26q-sign-time%3D1565772146%3B1565844146%26q-key-time%3D1565772146%3B1565844146%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D7074b97f741a5204cd9eff41776d6485b4638d81',
        },
        {
          time: '2017-08-12 12:01:59',
          text: '努力一点不合格哦',
        },
        {
          time: '2017-08-12 12:01:59',
          audio: 'http://huoke-private-1254282420.cos.ap-chengdu.myqcloud.com/2019/08/14/13478097-0702-42ba-8bcc-50790701ffc4.mp3?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKIDCJG2e67TN6kR3mA5fDve2X0Ndnwz5mV8%26q-sign-time%3D1565772146%3B1565844146%26q-key-time%3D1565772146%3B1565844146%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D7074b97f741a5204cd9eff41776d6485b4638d81',
          text: '非常棒',
          imgList: ['https://pub.file.k12.vip/2019/08/14/1161558598209982465.png','https://pub.file.k12.vip/2019/08/14/1161558598209982465.png']
        },
      ]
    }
  },
  mounted() {
  },
  watch: {
    value (_n) {
      this.isOpenDetail = _n
      this.$previewRefresh()
    }
  },
  methods: {
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
      width: 120px;
      height: 100px;
      margin-right: 10px;
    }

    .-audio {
      margin: 10px 0;
    }

  }
</style>
