<template>
  <Modal
    class="p-detailModal"
    v-model="isOpenDetail"
    @on-cancel="closeModal"
    footer-hide
    width="500"
    title="推荐课程">
    <div>
      <Row class="g-search">
        <Col :span="10" class="g-t-left">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text-two">课程分类：</div>
            <Select v-model="searchInfo.courseType" @on-change="getList()" class="-search-selectOne">
              <Option v-for="item of courseTypeList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="14">
          <div class="-search">
            <Select v-model="searchInfo.selectType" class="-search-select">
              <Option value="1">课程名称</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.courseName" class="-search-input" placeholder="请输入关键字"
                   @on-change="getList()"></Input>
          </div>
        </Col>
      </Row>

      <div class="p-detailModal-modal g-tab">
        <div class="-c-item" :label="item.id" v-for="(item,index) in courseList" :key="index"
             @click="changeCourse(item)">
          <div class="-c-item-border " :class="{'-c-item-active': item.isChecked}">
            <Icon v-if="item.isChecked" type="ios-checkmark" color="#ffffff" size="18"/>
          </div>
          <div class="-c-item-wrap">
            <img :src="item.coverPage" alt="" class="downImg">
            <div class="-c-item-text">
              <span class="-item-text">{{item.name}}</span>
              <span class="-item-text">真实销量：{{item.salesVolume || 0}}</span>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="-p-b-flex">
        <Button @click="closeModal('addInfo')" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="sureCourseModal('addInfo')" class="g-primary-btn ">确认</div>
      </div>

      <loading v-if="isFetching"></loading>
    </div>
  </Modal>
</template>

<script>
  import dayjs from 'dayjs'
  import Loading from "../../../components/loading";

  export default {
    name: 'hkywhd_courseTemplate',
    components: {Loading},
    props: ['value', 'checkList', 'dataItem', 'typeList'],
    data() {
      return {
        tab: {
          page: 1,
          pageSize: 10
        },
        total: 0,
        courseList: [],
        courseTypeList: this.typeList || [],
        storageArray:  [],
        isOpenDetail: false,
        isFetching: false,
        searchInfo: {
          courseType: '-1',
          selectType: '1'
        }
      }
    },
    mounted() {
    },
    watch: {
      value(_n) {
        this.isOpenDetail = _n
        _n && this.listCourseType()
      },
    },
    methods: {
      changeCourse(data) {
        if (data.isChecked) {
          this.storageArray.forEach((item, index) => {
            if (item.id === data.id) {
              this.storageArray.splice(index, 1)
            }
          })
        } else {
          this.storageArray.push(data)
        }

        data.isChecked = !data.isChecked
        this.$forceUpdate()
      },
      listCourseType() {
        this.courseTypeList = []
        this.$api.hkywhdCourse.listAllOn()
          .then(response => {
            let dataInfo = response.data.resultData
            dataInfo.forEach(item=>{
              if (item.disabled) {
                this.courseTypeList.push(item)
              }
            })
            this.courseTypeList.unshift({
              name: '全部',
              id: '-1'
            })
            this.storageArray = JSON.parse(JSON.stringify(this.checkList)) || []
            this.getList()
          })
      },
      getList() {
        this.courseList = []
        this.$api.hkywhdTextbook.listAll({
          tBookId: this.dataItem.id,
          name: this.searchInfo.courseName,
          courseId: this.searchInfo.courseType === '-1' ? '' : this.searchInfo.courseType,
        })
          .then(response => {
            let dataInfo = response.data.resultData

            dataInfo.forEach(item => {
              if (this.dataItem.id !== item.id) {
                this.courseList.push(item)
              }
            })

            this.courseList.forEach(list=>{
              this.storageArray.forEach(item=>{
                if (list.id === item.id) {
                  list.isChecked = true
                }
              })
            })
          })
      },
      sureCourseModal() {
        this.closeModal()
        this.$emit('checkCourseList', this.storageArray)
      },
      closeModal() {
        this.isOpenDetail = false
        this.$emit('input', false)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-detailModal {


    &-modal {
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

        &:last-child {
          border-bottom: 1px solid #F5F5F5;
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

    .-search-select-text-two {
      min-width: 80px;
    }
    .-search-selectOne {
      /*width: 100px;*/
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin-right: 20px;
    }

    &-radio {
      text-align: center;
      width: 100%;
    }

    .-p-b-flex {
      display: flex;
      padding: 0 20px;
      justify-content: space-between;
    }

  }
</style>
