<template>
  <div class="p-grade">
    <Card>
      <Row class="-g-wrap">
        <Col :span="4" v-for="(item, index) of 8" class="-g-item" :key="index">
          <img src="../../../assets/images/grade-logo.png">
          <div>{{item}}年级</div>
        </Col>
      </Row>
      <loading v-if="isFetching"></loading>
    </Card>
  </div>
</template>

<script>

  import Loading from "@/components/loading";

  export default {
    name: 'grade',
    components: {Loading},
    data() {
      return {
        dataList: [],
        isFetching: false,
        isAddOpenModal: false,
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      toJump(param) {
        this.$router.push({
          name: 'couponEdit',
          query: {
            id: param.id
          }
        })
      },

      //分页查询
      getList() {
        this.isFetching = true
        this.$api.course.gradeList()
          .then(
            response => {
              this.dataList = response.data.resultData.records;
            }).finally(() => {
          this.isFetching = false
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-grade {
    .-g-wrap {
      text-align: left;
    }
    .-g-item {
      display: inline-block;
      padding: 5%;

      img {
        width: 100%;
      }
    }

  }
</style>
