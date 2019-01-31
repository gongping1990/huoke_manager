<template>
  <Modal v-model="isShow" title="选择课程" width="500" @on-cancel="cancleCourseModal">
    <Row class="g-search -course-search">
      <Col :span="24">
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
      <Checkbox-group v-model="checkCourseIds" v-if="!isRadio">
        <Checkbox class="-c-item" :label="item.id" v-for="(item,index) in courseList" :key="index"
                  :disabled="item.isEdit">
          <div class="-c-item-wrap">
            <img :src="item.courseImgUrl" alt="" class="downImg">
            <span class="-item-text">{{item.courseName}}</span>
          </div>
        </Checkbox>
      </Checkbox-group>

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
    name: 'checkCourse',
    components: {Loading},
    props: ['isShowModal', 'checkCourseList', 'isUpdate', 'isRadioModal', 'courseType'],// 显示，父组件带进列表，是否是编辑，单选/多选，课程类别（单独购接口/课程接口）,多选课程限制
    data() {
      return {
        searchInfo: '',
        selectInfo: '1',
        isShow: this.isShowModal,
        isRadio: this.isRadioModal, //是否是单选，默认多选
        isFetching: false,
        isEdit: false,
        courseList: [],
        radioCourseId: '',
        size: 10000,
        checkCourseIds: [],
        storageList: [],
        checkCourseArray: []
      }
    },
    mounted() {
      if (this.checkCourseList.length && !this.isRadio) {
        this.isEdit = true
        for (let item of this.checkCourseList) {
          this.checkCourseIds.push(item.id)
        }
      } else {
        this.radioCourseId = this.checkCourseList.length && this.checkCourseList[0].id
      }
      this.getCourseList()
    },
    methods: {
      changeIndex(params) {
        let array = []
        this.courseList = []
        if (params.data) {
          for (let item of this.storageList) {
            if (item.courseName.indexOf(params.data) > -1) {
              array.push(item)
            }
          }
          this.courseList = array
        } else {
          this.courseList = this.storageList
        }
      },
      getCourseList() {
        if (this.isFetching) return
        let routeUrl = ''
        this.isFetching = true
        routeUrl = this.courseType ? this.$api.goods.aloneList : this.$api.course.courseList
        routeUrl({
          current: 1,
          size: this.size,
          name: this.searchInfo
        }).then(
          res => {
            this.courseList = res.data.resultData.records;

            for (let data of this.courseList) {
              data.courseImgUrl = data.url || data.coverUrl
              data.courseName = data.name

              if (this.courseType == 1) {
                data.id = data.goodsId
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
          for (let item of this.checkCourseIds) {
            for (let data of this.storageList) {
              if (item == data.id) {
                this.checkCourseArray.push(data)
              }
            }
          }
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
    }

    .-c-item {
      display: flex;
      align-items: center;
      border: 1px solid #F5F5F5;
      border-bottom: none;
      padding: 10px;
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
    }
  }
</style>
