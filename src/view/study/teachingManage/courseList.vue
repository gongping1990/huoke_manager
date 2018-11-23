<template>
  <div class="p-course">
    <Row class="-c-wrap">
      <Col :span="3" v-for="(item, index) of dataList" class="-c-item g-t-center" :key="index">
        <div @click="toDetail(item)" class="-c-item-cursor">
          <img src="../../../assets/images/grade-logo.png">
          <h5>{{item.name}}</h5>
        </div>
      </Col>
      <Col :span="24" v-if="isNextChild">
        <div class="-c-margin g-primary-btn" @click="toBack">
          <Icon type="md-return-left"/>
          返回单元列表
        </div>
      </Col>
    </Row>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>

  import Loading from "@/components/loading";

  export default {
    name: 'courseList',
    props: ['pathInfo'],
    components: {Loading},
    data() {
      return {
        dataList: [],
        arrayName: [],
        isFetching: false,
        isNextChild: false,
      };
    },
    mounted() {
      //处理从某个课程反跳回单元下课程列表
      if (this.$route.query.chapterId) {
        this.isNextChild = true
        this.getLessonList(this.$route.query.chapterId)
      } else {
        this.getList()
      }
    },
    methods: {
      toDetail(item) {
        this.arrayName.push(item.name)
        if (this.isNextChild) {
            this.$router.push({
              name: 'courseInfo',
              query: {
                ...this.pathInfo,
                chapterName: this.$route.query.isBack ? this.$route.query.chapterName : this.arrayName[0],
                lessonName: this.$route.query.isBack ? item.name : this.arrayName[1],
                lessonId: item.id,
                chapterId: item.chapterId,
                isBack: false
              }
            })
        } else {
          this.isNextChild = true
          this.getLessonList(item.id)
        }
      },
      toBack() {
        this.arrayName = []
        this.isNextChild = false
        this.$route.query.isBack = false
        this.getList()
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.book.bookChapterList({
          bookId: this.$route.query.bookId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getLessonList(param) {
        this.isFetching = true
        this.$api.book.chapterLessonList({
          chapterId: param
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            }).finally(() => {
          this.isFetching = false
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-course {
    .-c-wrap {
      text-align: left;
    }

    .-c-margin {
      width: 150px;
      margin: 20px auto;
    }

    .-c-item {
      display: inline-block;
      margin: 20px;

      img {
        width: 60px;
      }

      &-cursor {
        cursor: pointer;
      }
    }

  }
</style>
