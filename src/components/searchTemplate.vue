<template>
  <div class="p-searchTemplate">
    <Row class="g-search">
      <Row class="g-t-left g-tab">
        <Col :span="4" class="g-t-left" v-if="option.isAppId">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">产品名称：</div>
            <Select v-model="searchInfo.appId" @on-change="changeEmit(true)" class="-search-selectOne">
              <Option v-for="(item,index) in appList" :label="item.name" :value="item.id" :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" v-if="option.isWorkType">
          <div class="-search">
            <Select v-model="searchInfo.workType" class="-search-select">
              <Option value="1">课时名称</Option>
              <Option value="2">作业要求</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.manner" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="changeInput"></Input>
          </div>
        </Col>
        <Col :span="14" class="g-flex-a-j-center">
          <date-picker-template :dataInfo="dateOption" @changeDate="changeDateTime"></date-picker-template>
          <span class="p-searchTemplate-high" @click="changeMore">
            高级搜索 <Icon :type="!isShowMore ? 'ios-arrow-up' : 'ios-arrow-down'"/>
          </span>
        </Col>
      </Row>

      <Row class="g-t-left g-tab" v-if="isShowMore">
        <Col :span="4" class="g-t-left" v-if="option.isPay">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">是否付费：</div>
            <Select v-model="searchInfo.pay" @on-change="changeEmit()" class="-search-selectOne">
              <Option class="-search-option" v-for="(item,index) in payList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>

        <Col :span="4" v-if="option.isUserType">
          <div class="-search -margin-right">
            <Select v-model="searchInfo.userType" class="-search-select">
              <Option value="1">用户昵称</Option>
              <Option value="2">手机号码</Option>
            </Select>
            <span class="-search-center">|</span>
            <Input v-model="searchInfo.mannerTwo" class="-search-input" placeholder="请输入关键字" icon="ios-search"
                   @on-click="changeInput"></Input>
          </div>
        </Col>

        <Col :span="4" class="g-t-left" v-if="option.isComment">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">是否点评：</div>
            <Select v-model="searchInfo.evaluationed" @on-change="changeEmit()" class="-search-selectOne">
              <Option class="-search-option" v-for="(item,index) in commentList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>

        <Col :span="4" class="g-t-left" v-if="option.isSituation">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">点评情况：</div>
            <Select v-model="searchInfo.evaluation" @on-change="changeEmit()" class="-search-selectOne">
              <Option class="-search-option" v-for="(item,index) in situationList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left" v-if="option.isFeedback">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">是否留言：</div>
            <Select v-model="searchInfo.hasComment" @on-change="changeEmit()" class="-search-selectOne">
              <Option class="-search-option" v-for="(item,index) in payList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left" v-if="option.isTeacher">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">点评老师：</div>
            <Select v-model="searchInfo.teacherId" @on-change="changeEmit()" class="-search-selectOne">
              <Option class="-search-option" v-for="(item,index) in teacherList" :label="item.nickname" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>
        <Col :span="4" class="g-t-left" v-if="option.isExamine">
          <div class="g-flex-a-j-center">
            <div class="-search-select-text">审核状态：</div>
            <Select v-model="searchInfo.reviewStatus" @on-change="changeEmit()" class="-search-selectOne">
              <Option class="-search-option" v-for="(item,index) in examineList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </div>
        </Col>
      </Row>
    </Row>
  </div>
</template>

<script>
  import DatePickerTemplate from "./datePickerTemplate";

  export default {
    name: 'searchTemplate',
    props: ['option'],
    components: {DatePickerTemplate},
    data() {
      return {
        isShowMore: false,
        dateOption: {
          name: '提交时间',
          type: 'datetime'
        },
        searchInfo: {},
        appList: [],
        payList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '是'
          },
          {
            id: '0',
            name: '否'
          }
        ],
        commentList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '已点评'
          },
          {
            id: '0',
            name: '未点评'
          }
        ],
        situationList: [
          {
            id: '-1',
            name: '全部'
          },
          {
            id: '1',
            name: '满意'
          },
          {
            id: '2',
            name: '一般'
          },
          {
            id: '0',
            name: '不满意'
          }
        ],
        examineList: [
          {
            id: '0',
            name: '全部'
          },
          {
            id: '1',
            name: '待审核'
          },
          {
            id: '2',
            name: '已通过'
          },
          {
            id: '3',
            name: '未通过'
          }
        ],
        teacherList: []
      }
    },
    mounted() {
      this.initSearch()
      this.listBase()
    },
    methods: {
      getTeacherList() {
        this.teacherList = []
        this.$api.jsdTeacher.selectTeacher({
          courseId: this.searchInfo.appId,
        }).then(response => {
          this.teacherList = response.data.resultData
          this.teacherList.unshift({
            id: '-1',
            nickname: '全部'
          })
        })
      },
      listBase() {
        this.appList = []
        this.$api.jsdJob.listBase({
          onlyme: true
        })
          .then(response => {
            this.appList = response.data.resultData
            this.searchInfo.appId = this.appList[0].id
            this.searchInfo.system = this.appList[0].system
            this.getTeacherList()
            this.changeEmit()
          })
      },
      initSearch() {
        console.log('重置')
        this.searchInfo = {
          appId: this.searchInfo.appId,
          system: '',
          workType: '1',
          userType: '1',
          getStartTime: '',
          getEndTime: '',
          nickname: '',
          lessonName: '',
          workRequirements: '',
          pay: '-1',
          evaluationed: '-1',
          evaluation: '-1',
          hasComment: '-1',
          teacherId: '-1',
          reviewStatus: '0'
        }
      },
      changeMore() {
        this.isShowMore = !this.isShowMore
      },
      changeDateTime(data) {
        this.searchInfo.getStartTime = data.startTime
        this.searchInfo.getEndTime = data.endTime
        console.log('触发')
        this.changeEmit()
      },
      changeInput() {
        if (this.searchInfo.workType === '1' && this.searchInfo) {
          this.searchInfo.lessonName = this.searchInfo.manner
        } else if (this.searchInfo.workType === '2' && this.searchInfo) {
          this.searchInfo.workRequirements = this.searchInfo.manner
        }

        if (this.searchInfo.userType === '1' && this.searchInfo) {
          this.searchInfo.nickname = this.searchInfo.mannerTwo
        } else if (this.searchInfo.userType === '2' && this.searchInfo) {
          this.searchInfo.phone = this.searchInfo.mannerTwo
        }

        this.changeEmit()
      },
      changeEmit(bool) {
        this.appList.forEach((item)=>{
          if(item.id === this.searchInfo.appId) {
            this.searchInfo.system = item.system
          }
        })
        bool && this.getTeacherList()
        this.$emit('changeSearch', this.searchInfo)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .p-searchTemplate {
    &-high {
      cursor: pointer;
      color: #5444e4;
    }
    .g-search {
      .-search-select-text {
        min-width: 70px;
      }
      .-search-selectOne {
        width: 170px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        margin-right: 20px;
      }

      .-margin-right {
        margin-right: 20px;
      }
      .-search-option {
        width: 150px;
      }
    }

  }
</style>
