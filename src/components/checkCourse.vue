<template>
  <Modal v-model="isShow" title="选择课程" @on-ok="sureCourseModal" @on-cancel="sureCourseModal" width="500">
    <div class="p-course-modal">
      <Checkbox-group v-model="checkCourseIds">
        <Checkbox class="-c-item" :label="item.id" v-for="(item,index) in courseList" :key="index">
          <img :src="item.courseImgUrl" alt="" class="downImg">
          <span>{{item.courseName}}</span>
        </Checkbox>
      </Checkbox-group>
    </div>
    <loading v-if="isFetching"></loading>
  </Modal>
</template>

<script>
  import Loading from "./loading";
  export default {
    name: 'checkCourse',
    components: {Loading},
    props: ['isShowModal', 'checkCourseList'],
    data() {
      return {
        isShow: this.isShowModal,
        isFetching: false,
        courseList: [],
        size: 10000,
        checkCourseIds: [],
        checkCourseArray: []
      }
    },
    mounted() {
      if (this.checkCourseList.length) {
        for (let item of this.checkCourseList) {
          this.checkCourseIds.push(item.id)
        }
      }
      this.getCourseList()
    },
    methods: {
      getCourseList() {
        if (this.isFetching) return
        this.isFetching = true
        this.$api.goods.courseGoodsList({
          current: 1,
          size: this.size
        }).then(
          res => {
            this.courseList = res.data.resultData.records;
          })
          .finally(()=>{
            this.isFetching = false
          })
      },
      sureCourseModal() {
        for (let item of this.checkCourseIds) {
          for (let data of this.courseList) {
            if (item == data.id) {
              this.checkCourseArray.push(data)
            }
          }
        }
        this.$emit('closeCourseModal', this.checkCourseArray)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .p-course-modal {
    height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;

    .-c-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .downImg {
      margin: 0 20px;
      width: 40%;
    }
  }
</style>
