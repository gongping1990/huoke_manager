<template>
  <div class="p-poptipInputTem">
    <Poptip placement="right" @on-popper-show="openShow()">
      <Button class="p-poptipInputTem-btn" type="text" >{{detailInfo.id}}</Button>
      <div class="g-t-left" slot="content">
        <DatePicker type="date" v-model="dataItem"  placeholder="请选择" style="width: 100%" ></DatePicker>
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
    props: ['dataProp'],
    data() {
      return {
        dataItem: ''
      }
    },
    computed: {
      detailInfo() {
        return this.dataProp
      }
    },
    methods: {
      openShow () {
        this.dataItem = this.detailInfo.id
        console.log(this.addInfo)
      },
      submitInfo() {
        if (!this.dataItem) {
          return this.$Message.error('请选择时间')
        }
        console.log('确认')
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
