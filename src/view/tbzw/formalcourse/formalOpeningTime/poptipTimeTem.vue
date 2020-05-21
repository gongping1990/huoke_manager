<template>
  <div class="p-poptipInputTem">
    <Poptip placement="right">
      <Button class="p-poptipInputTem-btn" type="text" >{{detailInfo.nowTime || '-'}}</Button>
      <div class="g-t-left" slot="content">
        <DatePicker type="date" v-model="detailInfo.nowTime"  placeholder="请选择日期" style="width: 100%" ></DatePicker>
        <div class="p-poptipInputTem-top g-text-right">
          <!--<Button type="text" size="small">取消</Button>-->
          <Button type="info" size="small" @click="submitInfo()">确认</Button>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
  export default {
    name: 'poptipTimeTem',
    props: ['dataProp', 'showTime'],
    data() {
      return {
        dataItem: ''
      }
    },
    computed: {
      detailInfo() {
        let timeObj = {
          ...this.dataProp,
          nowTime: this.showTime
        }
        return timeObj
      }
    },
    methods: {
      submitInfo() {
        if (!this.detailInfo.nowTime) {
          return this.$Message.error('请选择日期')
        }
        this.$emit('changeInput', this.detailInfo)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .p-poptipInputTem {

    &-top {
      margin-top: 15px;
    }

    &-btn{
      color: #2baee9;
    }
  }
</style>
