<template>
  <div class="p-product-table">
    <Row class="expand-row" v-for="(item,index) of dataList" :key="index">
      <Col span="5" class="-p-left">
        <span>{{item.name}}</span>
      </Col>
      <Col span="4">
        <div>生字：<span class="-p-span">{{item.openNum[0]||0}}</span></div>
        <div>朗读：<span class="-p-span">{{item.openNum[1]||0}}</span></div>
        <div>精读：<span class="-p-span">{{item.openNum[2]||0}}</span></div>
      </Col>
      <Col span="4">
        <div>生字：<span class="-p-span">{{item.finishNum[0]||0}}</span></div>
        <div>朗读：<span class="-p-span">{{item.finishNum[1]||0}}</span></div>
        <div>精读：<span class="-p-span">{{item.finishNum[2]||0}}</span></div>
      </Col>
      <Col span="4">
        <div>生字：<span class="-p-span">{{item.avgTime[0]||0}}s</span></div>
        <div>朗读：<span class="-p-span">{{item.avgTime[1]||0}}s</span></div>
        <div>精读：<span class="-p-span">{{item.avgTime[2]||0}}s</span></div>
      </Col>
      <Col span="4">
        <div>生字：<span class="-p-span">{{item.finishRate[0]||0}}%</span></div>
        <div>朗读：<span class="-p-span">{{item.finishRate[1]||0}}%</span></div>
        <div>精读：<span class="-p-span">{{item.finishRate[2]||0}}%</span></div>
      </Col>
      <Col span="3">
        <Button type="text" size="small" class="-p-btn" @click="openModal(item.id)">查看详情</Button>
      </Col>
    </Row>

    <div v-if="isOpenModal">
      <product-detail :id="goodsId" :list="dataList" @closeModal="closeModal"></product-detail>
    </div>

  </div>
</template>

<script>

  import ProductDetail from "./productDetail";
  export default {
    components: {ProductDetail},
    props: ['row'],
    data() {
      return {
        isOpenModal: false,
        goodsId: '',
        dataList: []
      }
    },
    mounted() {
      this.row.forEach(item => {
        this.dataList.push({
          id: item.id,
          name: item.name,
          avgTime: item.lessonReport ? JSON.parse(item.lessonReport.avgTime) : '',
          openNum: item.lessonReport ? JSON.parse(item.lessonReport.openNum) : '',
          finishNum: item.lessonReport ? JSON.parse(item.lessonReport.finishNum) : '',
          finishRate: item.lessonReport ? JSON.parse(item.lessonReport.finishRate) : ''
        })
      })
    },
    methods: {
      closeModal() {
        this.isOpenModal = false
      },
      openModal (data) {
        this.goodsId = data
        this.isOpenModal = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-product-table {
    .expand-row {
      display: flex;
      align-items: center;
      border: 1px solid #eeeeee;
      border-bottom: none;
      margin-left: 13%;
    }

    .expand-row:last-child{
      border-bottom: 1px solid #eeeeee;
    }

    .-p-left {
      padding-left: 2%;
    }

    .-p-span {
      margin-left: 10px;
      line-height: 20px;
      color: #2baee9;
    }

    .-p-btn {
      color: #5444E4
    }
  }
</style>
