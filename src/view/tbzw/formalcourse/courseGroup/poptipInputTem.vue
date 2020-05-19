<template>
  <div class="p-poptipInputTem">
    <Poptip placement="right"  @on-popper-show="openShow()">
      <Button class="p-poptipInputTem-btn" type="text" >{{detailInfo.id}}</Button>
      <div slot="content">
        <Input type="text" v-model="priceItem" placeholder="请修改总价"></Input>
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
    name: 'poptipInputTem',
    props: ['dataProp'],
    data() {
      return {
        priceItem: ''
      }
    },
    computed: {
      detailInfo() {
        return this.dataProp
      }
    },
    methods: {
      openShow () {
        this.priceItem = this.detailInfo.id
        console.log(this.addInfo)
      },
      submitInfo() {
        if (!this.priceItem) {
          return this.$Message.error('请输入价格')
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
