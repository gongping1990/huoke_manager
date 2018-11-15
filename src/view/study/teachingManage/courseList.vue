<template>
  <div class="p-course">
    <Row class="-c-wrap">
      <Col :span="4" v-for="(item, index) of 8" class="-c-item" :key="index">
        <img src="../../../assets/images/grade-logo.png">
        <div>{{item}}年级</div>
      </Col>
    </Row>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>

  import Loading from "@/components/loading";

  export default {
    name: 'courseList',
    components: {Loading},
    data() {
      return {
        dataList: [],
        isFetching: false,
        isAddOpenModal: false,
      };
    },
    mounted() {
      // this.getList()
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
  .p-course {
    margin-top: 20px;
    .-c-wrap {
      text-align: left;
    }
    .-c-item {
      display: inline-block;
      padding: 5%;

      img {
        width: 100%;
      }
    }

  }
</style>
