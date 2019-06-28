<template>
  <Modal v-model="isShow" title="选择课程" width="500" @on-cancel="cancleCourseModal">
    <Row class="g-search -course-search">
      <Col :span="8">
        <div class="-search" style="margin-right: 20px">
          <Select v-model="classificationOfCourses" class="-search-select" @on-change="getCourseList">
            <Option :value="item.id" v-for="(item,index) of typeList" :key="index">{{item.name}}</Option>
          </Select>
        </div>
      </Col>

      <Col :span="15">
        <div class="-search">
          <Select v-model="selectInfo" class="-search-select">
            <Option value="1">课程名称</Option>
          </Select>
          <span class="-search-center">|</span>
          <Input v-model="searchInfo" class="-search-input" placeholder="请输入关键字"
                 @on-change="changeIndex"></Input>
        </div>
      </Col>
    </Row>
    <div class="p-course-modal">
      <div class="-c-item" :label="item.id" v-for="(item,index) in courseList" :key="index" @click="changeCourse(item)"
           v-if="!isRadio">
        <div class="-c-item-border " :class="{'-c-item-active': item.isChecked}">
          <Icon v-if="item.isChecked" type="ios-checkmark" color="#ffffff" size="18"/>
        </div>
        <div class="-c-item-wrap">
          <img :src="item.courseImgUrl" alt="" class="downImg">
          <div class="-c-item-text">
            <span class="-item-text">{{item.courseName}}</span>
            <span class="-item-text">真实销量：{{item.salesVolume}}</span>
          </div>
        </div>
      </div>

      <RadioGroup v-model="radioCourseId" v-else style="width: 100%">
        <Radio class="-c-item" :label="item.id" v-for="(item,index) in courseList" :key="index">
          <div class="-c-item-wrap">
            <img :src="item.courseImgUrl" alt="" class="downImg">
            <span class="-item-text">{{item.courseName}}</span>
          </div>
        </Radio>
      </RadioGroup>
    </div>
    <span slot="footer" class="dialog-footer">
      <Button @click="cancleCourseModal">取 消</Button>
      <Button type="primary" @click="sureCourseModal()">确 定</Button>
    </span>
    <loading v-if="isFetching"></loading>
  </Modal>
</template>

<script>
  import Loading from "./loading";

  export default {
    name: 'checkCourseTwo',
    components: {Loading},
    props: ['isShowModal', 'checkCourseList', 'isUpdate', 'isRadioModal', 'courseType', 'goodsType', 'categoryId'],// 显示，父组件带进列表，是否是编辑，单选/多选，课程类别（单独购接口/课程接口）, 订单类别, 类别ID
    data() {
      return {
        searchInfo: '',
        selectInfo: '1',
        isShow: this.isShowModal,
        isRadio: this.isRadioModal, //是否是单选，默认多选
        isFetching: false,
        isEdit: false,
        courseList: [],
        typeList: [],
        classificationOfCourses: this.categoryId || '',
        radioCourseId: '',
        size: 10000,
        storageList: [],
        checkCourseArray: [],
        storageArray: [],
        urlList: [this.$api.course.courseList, this.$api.goods.aloneList, this.$api.capsule.listByGoods]
      }
    },
    mounted() {
      if (this.checkCourseList.length && !this.isRadio) {
        this.isEdit = true
        for (let item of this.checkCourseList) {
          this.storageArray.push(item)
        }
      } else {
        this.radioCourseId = this.checkCourseList.length && this.checkCourseList[0].id
      }
      console.log(this.classificationOfCourses, 1)
      this.getCourseList()
      this.getCourseTypeList()
    },
    methods: {
      changeCourse(data) {
        if (data.isChecked) {
          this.storageArray.forEach((item, index) => {
            if (item.goodsId === data.goodsId) {
              this.storageArray.splice(index, 1)
            }
          })
        } else {
          this.storageArray.push(data)
        }

        data.isChecked = !data.isChecked
        this.$forceUpdate()
        console.log(this.storageArray, 11)
      },
      changeIndex() {
        let array = []
        this.courseList = []
        if (this.searchInfo) {
          for (let item of this.storageList) {
            if (item.courseName.indexOf(this.searchInfo) > -1) {
              array.push(item)
            }
          }
          this.courseList = array
        } else {
          this.courseList = this.storageList
        }
      },
      getCourseTypeList() {
        this.isFetching = true
        this.$api.course.courseTypeList({
          current: 1,
          size: this.size,
        })
          .then(
            response => {
              this.typeList = response.data.resultData.records;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getCourseList() {
        if (this.isFetching) return
        let routeUrl = ''
        this.isFetching = true
        routeUrl = this.urlList[this.courseType]
        routeUrl({
          current: 1,
          size: this.size,
          name: this.searchInfo,
          type: this.goodsType,
          courseCategory: this.classificationOfCourses,
          saleSort: true  //需要有真实销量 需添加该字段
        }).then(
          res => {
            this.courseList = res.data.resultData.records;

            for (let data of this.courseList) {
              data.courseImgUrl = data.url || data.coverUrl
              data.courseName = data.name
              data.isChecked = false

              if (this.courseType != 0) {
                data.id = data.goodsId
              }

              for (let item of this.storageArray) {
                if (item.goodsId === data.goodsId) {
                  data.isChecked = true
                }
              }
            }

            if (this.isUpdate) {
              for (let item of this.checkCourseList) {
                for (let list of this.courseList) {
                  if ((item.id == list.id) && item.isOldCourse) {
                    list.isEdit = true
                  }
                }
              }
            }
            this.storageList = this.courseList
          })
          .finally(() => {
            this.isFetching = false
          })
      },
      sureCourseModal() {
        this.checkCourseArray = []
        if (this.isRadio) {
          for (let data of this.courseList) {
            if (this.radioCourseId == data.id) {
              this.checkCourseArray.push(data)
            }
          }
        } else {
          this.checkCourseArray = this.storageArray
        }
        console.log(this.courseList, this.checkCourseArray)
        this.$emit('closeCourseModal', this.checkCourseArray)
      },
      cancleCourseModal() {
        this.$emit('cancleCourseModal')
      }
    }
  }
</script>

<style lang="less">
  .p-course-modal {
    .ivu-radio-wrapper {
      margin-right: 0;
    }
  }
</style>

<style lang="less" scoped>
  .-course-search {
    margin-bottom: 20px;
  }

  .p-course-modal {
    height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    border-bottom: 1px solid #F5F5F5;

    .-c-item-wrap {
      display: flex;
      align-items: center;
      width: 80%;
    }

    .-c-item {
      display: flex;
      align-items: center;
      border: 1px solid #F5F5F5;
      border-bottom: none;
      padding: 10px;

      &-border {
        width: 15px;
        height: 15px;
        border: 1px solid #b3b5b8;
      }

      &-active {
        display: flex;
        justify-content: center;
        align-items: center;
        border-color: #2f54eb;
        background-color: #2f54eb;
      }
    }

    .-item-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 200px;
    }
    .downImg {
      margin: 0 20px;
      width: 40%;
      height: 60px;
    }

    .-c-item-text {
      display: flex;
      justify-content: space-between;
      flex-flow: column;
      height: 60px;
    }
  }
</style>
