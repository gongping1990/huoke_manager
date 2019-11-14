<template>
  <div class="p-processData">
    <Row class="g-search -c-tab">
      <Col class="p-processData-flex" :span="24">
        <div class="-flex-div g-flex-a-j-center">
          <div class="-search-select-text">课程名称</div>
          <Select class="-search-selectOne" v-model="searchInfo.courseId" @on-change="changeCourse">
            <Option v-for="(item,index) in courseList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </div>
        <div class="-flex-div g-flex-a-j-center">
          <div class="-search-select-text">期数</div>
          <Select class="-search-selectOne" v-model="searchInfo.periodsId" @on-change="changePeriods">
            <Option v-for="(item,index) in periodsList" :label="item.periods" :value="item.id" :key="index"></Option>
          </Select>
        </div>
        <div class="-flex-div -flex-text">开班时间： {{dataInfo.opentime || '暂无开班时间'}}</div>
        <div class="-flex-div -flex-text">当前排课： {{dataInfo.lessonName || '暂无排课'}}</div>
      </Col>
    </Row>

    <Card>
      <Tabs v-model="searchInfo.radioType" @on-click="changTab">
        <TabPane label="申请记录" name="1">
          <tbzw_paid_application-record :propCourseId="searchInfo.courseId"
                                        :propPeriodId="searchInfo.periodsId"
                                        ref="tabOne"
                                        class="-c-tab"></tbzw_paid_application-record>
        </TabPane>
        <TabPane label="学习数据" name="2">
          <tbzw_paid_learning-data :propCourseId="searchInfo.courseId"
                                   :propPeriodId="searchInfo.periodsId"
                                   ref="tabTwo"
                                   class="-c-tab"></tbzw_paid_learning-data>
        </TabPane>
        <TabPane label="转化数据" name="3">
          <tbzw_paid_conversion-data :propCourseId="searchInfo.courseId"
                                     :propPeriodId="searchInfo.periodsId"
                                     ref="tabThree"
                                     class="-c-tab"></tbzw_paid_conversion-data>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import Tbzw_paid_applicationRecord from "../applicationRecord/applicationRecord";
  import Tbzw_paid_conversionData from "../conversionData/conversionData";
  import Tbzw_paid_learningData from "../learningData/learningData";

  export default {
    name: 'processData',
    components: {Tbzw_paid_learningData, Tbzw_paid_conversionData, Tbzw_paid_applicationRecord},
    data() {
      return {
        searchInfo: {
          courseId: this.$route.query.courseId,
          periodsId: this.$route.query.periodsId,
          radioType: '1',
        },
        isFetching: false,
        courseList: [],
        periodsList: [],
        dataInfo: {}
      };
    },
    mounted() {
      this.getCourseList()
    },
    methods: {
      changeCourse() {
        this.listActiveConfig(1)
      },
      changePeriods() {
        this.getActiveDetailsOfToday()
      },
      changTab(name) {
        this.searchInfo.radioType = name
        switch (+this.searchInfo.radioType) {
          case 1:
            setTimeout(() => {
              this.$refs.tabOne.getList()
            }, 0)
            break
          case 2:
            setTimeout(() => {
              this.$refs.tabTwo.getList()
            }, 0)
            break
          case 3:
            setTimeout(() => {
              this.$refs.tabThree.getList()
            }, 0)
            break
        }
      },
      openModal() {
        this.isOpenModal = true
        this.addInfo.date = ''
        this.userInfo = ''
      },
      getCourseList() {
        this.$api.tbzwCourse.courseQueryPage({
          current: 1,
          size: 1000,
          type: 2
        })
          .then(
            response => {
              this.courseList = response.data.resultData.records;
              this.listActiveConfig()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      listActiveConfig(num) {
        this.$api.tbzwActiveconfig.listActiveConfig({
          current: 1,
          size: 1000,
          courseId: this.searchInfo.courseId
        })
          .then(
            response => {
              this.periodsList = response.data.resultData.records;
              this.periodsList.push({
                id: 0,
                periods: '无'
              })
              if (num) {
                this.searchInfo.periodsId = this.periodsList[0].id
              }
              this.getActiveDetailsOfToday()
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getActiveDetailsOfToday() {
        this.$api.tbzwActiveconfig.getActiveDetailsOfToday({
          activeId: this.searchInfo.periodsId
        })
          .then(
            response => {
              switch (+this.searchInfo.radioType) {
                case 1:
                  setTimeout(() => {
                    this.$refs.tabOne.getList()
                  }, 0)
                  break
                case 2:
                  setTimeout(() => {
                    this.$refs.tabTwo.getList()
                  }, 0)
                  break
                case 3:
                  setTimeout(() => {
                    this.$refs.tabThree.getList()
                  }, 0)
                  break
              }
              this.dataInfo = response.data.resultData || {};
            })
      },
      //分页查询
      getList(num) {
        this.isFetching = true
        if (num) {
          this.tab.currentPage = 1
        }
        let params = {
          current: num ? num : this.tab.page,
          size: this.tab.pageSize
        }

        if (this.selectInfo == '1' && this.searchInfo) {
          params.nickName = this.searchInfo.manner
        } else if (this.selectInfo == '2' && this.searchInfo) {
          params.phone = this.searchInfo.manner
        }

        this.$api.tbzwStudy.listRepairCard(params)
          .then(
            response => {
              this.dataList = response.data.resultData.records || [];
              this.total = response.data.resultData.total;
            })
          .finally(() => {
            this.isFetching = false
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-processData {

    &-flex {
      display: flex;
      align-items: center;

      .-flex-div {
        margin-right: 20px;
      }

      .-flex-text {
        color: #08979C;
        font-size: 14px;
        margin-right: 48px;
      }
    }

    .-search-select-text {
      /*min-width: 80px;*/
    }

    .-search-selectOne {
      width: 150px;
      border: 1px solid #dcdee2;
      border-radius: 4px;
      margin: 0 10px;
      text-align: left;
    }

    .-c-tips {
      color: #39f
    }

    .-c-tab {
      margin: 20px 0;
    }
  }
</style>
