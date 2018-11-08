<template>
  <div class="p-couponEdit">
    <Card :bordered="false" class="-c-card">
      <p slot="title">基础信息</p>
      <Form class="-c-form" ref="couponInfo" :model="couponInfo" :label-width="100"
            label-position="right">
        <Form-item label="优惠券名称" prop="name">
          <Input v-model="couponInfo.name" placeholder="请输入优惠券名称"></Input>
        </Form-item>
        <Form-item label="优惠券面额" prop="denomination">
          <Input-number style="width: 100%;" :min="0" :step="1" v-model="couponInfo.denomination"
                        placeholder="请输入优惠券面额（元）"></Input-number>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </Form-item>
        <Form-item label="使用条件" prop="useCondition" @on-change="changeUseCondition" class="ivu-form-item-required">
          <Radio-group v-model="couponInfo.useCondition">
            <Radio :label=0>无门槛使用</Radio>
            <Radio :label=1>输入满减金额</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="满减金额" prop="moneyOff" v-if="couponInfo.useCondition">
          <Input-number style="width: 100%;" :max="1000000" :min="0" :step="1" v-model="couponInfo.moneyOff"
                        placeholder="满减金额（元）"></Input-number>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </Form-item>
        <Form-item label="有效期" class="ivu-form-item-required">
          <Row>
            <Col span="8">
              <Form-item prop="date">
                <Date-picker style="width: 100%" type="date" placeholder="选择开始日期"
                             v-model="useStartTime"></Date-picker>
              </Form-item>
            </Col>
            <Col span="1" style="text-align: center">-</Col>
            <Col span="8">
              <Form-item prop="time">
                <Date-picker style="width: 100%" type="date" placeholder="选择结束日期"
                             v-model="useEndTime"></Date-picker>
              </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="发行量" prop="total">
          <Input-number style="width: 100%;" :max="1000000" :min="1" :step="1" v-model="couponInfo.total"
                        placeholder="请输入发行量"></Input-number>
          <span class="-c-tips">* 添加优惠券后，发行量只能增加，不能减少，总共不超过1,000,000张</span>
        </Form-item>
        <Form-item label="每人限领">
          <Input-number style="width: 100%;" :max="10" :min="1" :step="1" v-model="couponInfo.getTimePer"
                        placeholder="限领张数"></Input-number>
        </Form-item>
      </Form>
    </Card>

    <Card :bordered="false" class="-c-card">
      <p slot="title">使用范围</p>
      <Form class="-c-form" ref="couponInfo" :model="couponInfo" :label-width="100">
        <Form-item label="课程类型" prop="useScope">
          <Radio-group v-model="couponInfo.useScope" @on-change="changeUseScope">
            <Radio :label=0>全部课程通用</Radio>
            <Radio :label=1>指定课程可用</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="选择课程" v-if="couponInfo.useScope">
          <div class="-c-course-icon" @click="isShowCourseModal=true">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList"
                          @closeCourseModal="checkCourse"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <div class="-i-del" @click="delCourse(item,index)">删除课程</div>
            </div>
          </div>
        </Form-item>
      </Form>
    </Card>

    <Card :bordered="false" class="-c-card">
      <p slot="title">发行方式</p>
      <Form class="-c-form" ref="couponInfo" :model="couponInfo" :label-width="100">
        <Form-item label="推送方式" prop="releaseType">
          <Radio-group v-model="couponInfo.releaseType">
            <Radio :label=0>用户领取</Radio>
            <Radio :label=1>主动推送</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="领取时间" v-if="!couponInfo.releaseType" class="ivu-form-item-required">
          <Row>
            <Col span="8">
              <Form-item prop="date">
                <Date-picker style="width: 100%" type="date" placeholder="选择开始日期"
                             v-model="getStartTime"></Date-picker>
              </Form-item>
            </Col>
            <Col span="1" style="text-align: center">-</Col>
            <Col span="8">
              <Form-item prop="time">
                <Date-picker style="width: 100%" type="date" placeholder="选择结束日期"
                             v-model="getEndTime"></Date-picker>
              </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="是否在课程领取" prop="getInCourse" v-if="!couponInfo.releaseType">
          <Radio-group v-model="couponInfo.getInCourse">
            <Radio :label=1>是</Radio>
            <Radio :label=0>否</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="领取摘要" prop="getAbstract" v-if="!couponInfo.releaseType">
          <Input v-model="couponInfo.getAbstract" placeholder="请输入领取摘要"></Input>
        </Form-item>
        <Form-item label="领取海报" prop="poster" v-if="!couponInfo.releaseType">
          <Upload
            v-if="!couponInfo.poster"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="1024"
            :on-success="handleSuccess"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <div class="-c-course-icon">
              <span>+</span>
              <span>上传海报</span>
            </div>
          </Upload>
          <div class="-c-course-wrap -upload" v-if="couponInfo.poster">
            <div class="-c-course-item">
              <img :src="couponInfo.poster">
              <div class="-i-del" @click="delPoster()">删除海报</div>
            </div>
          </div>
          <span class="-c-tips" v-else>* 图片大小1M以内</span>
        </Form-item>
        <Form-item label="选择用户" prop="poster" v-if="couponInfo.releaseType">
          <Button @click="openUserModal">+请添加用户(已选 {{couponInfo.couponUsers.length}} 人)</Button>
          <div v-if="isShowUserSelection">
            <user-selection ref="childMethod"
                            @close="closeUserModal"
                            @submitModal="submitUserSelection"
                            :title="title"
                            :userCheckList="couponInfo.couponUsers"
                            :type="3">
            </user-selection>
          </div>
        </Form-item>
      </Form>
    </Card>
    <Button size="large" type="primary" @click="handleSubmit()">{{isSending? '提交中...' : '确认保存'}}</Button>
    <Button size="large" @click="handleReset()" style="margin-left: 8px">放弃编辑</Button>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import Loading from "@/components/loading";
  import CheckCourse from "@/components/checkCourse";
  import UserSelection from "@/components/userSelection";
  import { getBaseUrl } from "@/libs/index";

  export default {
    name: 'couponEdit',
    components: {UserSelection, CheckCourse, Loading},
    data() {
      return {
        isFetching: false,
        isSending: false,
        isShowCourseModal: false,
        isShowUserSelection: false,
        couponId: this.$route.query.id || '',
        courseList: [],
        title: '选择用户',
        useStartTime: '',
        useEndTime: '',
        getStartTime: '',
        getEndTime: '',
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        couponInfo: {
          name: '', // 名称
          denomination: null, // 面额
          useCondition: 0, // 使用条件
          moneyOff: null, // 满减金额
          useStartTime: null, // 有效期开始时间
          useEndTime: null, // 有效期结束时间
          total: null, // 发行量
          getTimePer: null, // 每人限领
          useScope: 0, // 课程类型
          couponCourses: [], // 课程数组 id
          couponUsers: [], // 用户 id
          releaseType: 0, // 推送方式
          getStartTime: null, // 领取开始时间
          getEndTime: null, // 领取结束时间
          getInCourse: '', // 是否在课程详情里领取
          getAbstract: '', // 领取摘要
          poster: '' // 海报连接
        }
      }
    },
    mounted() {
      this.couponId && this.getInfo()
    },
    methods: {
      checkCourse(params) {
        this.isShowCourseModal = false
        this.courseList = params
      },
      openUserModal() {
        this.isShowUserSelection = true
        setTimeout(() => {
          this.$refs.childMethod.init()
        }, 0)
      },
      closeUserModal() {
        this.isShowUserSelection = false
      },
      submitUserSelection(params) {
        this.isShowUserSelection = false
        this.couponInfo.couponUsers = params.userIds
      },
      changeUseScope() {
        if (this.couponInfo.useScope == '0') {
          this.courseList = []
          this.couponInfo.couponCourses = []
        }
      },
      changeUseCondition() {
        if (this.couponInfo.useCondition == '0') {
          this.couponInfo.moneyOff = null
        }
      },
      delCourse(item, index) {
        this.courseList.splice(index, 1)
        console.log(this.courseList)
      },
      handleReset() {
        this.$router.push({
          name: 'coupon'
        })
      },
      handleSuccess(res,file) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.couponInfo.poster = res.resultData.url
        }
      },
      handleSize () {
        this.$Message.info('文件超过限制')
      },
      delPoster () {
        this.couponInfo.poster = ''
      },
      handleErr () {
        this.$Message.error('上传失败，请重新上传')
      },
      getInfo() {
        this.isFetching = true
        this.$api.coupon.couponInfo(this.couponId)
          .then(
            response => {
              this.couponInfo = response.data.resultData;
              this.courseList = this.couponInfo.couponCourseObject
              this.couponInfo.denomination = +(this.couponInfo.denomination / 100);
              this.couponInfo.moneyOff = this.couponInfo.moneyOff != null && +(this.couponInfo.moneyOff / 100);
              this.useStartTime = new Date(this.couponInfo.useStartTime)
              this.useEndTime = new Date(this.couponInfo.useEndTime)
              this.getStartTime = this.couponInfo.releaseType == '0' ? new Date(this.couponInfo.getStartTime) : ''
              this.getEndTime = this.couponInfo.releaseType == '0' ? new Date(this.couponInfo.getEndTime) : ''
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      handleSubmit() {
        if (this.isSending) return

        if (!this.couponInfo.name) {
          return this.$Message.error('请输入优惠券名称')
        } else if (!this.couponInfo.denomination) {
          return this.$Message.error('请输入优惠券面额')
        } else if (this.couponInfo.useCondition == '1' && !this.couponInfo.moneyOff) {
          return this.$Message.error('请输入满减金额')
        } else if (this.couponInfo.useScope == '1') {
          if (!this.courseList.length) {
            return this.$Message.error('请选择指定课程')
          } else {
            this.couponInfo.couponCourses = []
            for (let item of this.courseList) {
              this.couponInfo.couponCourses.push(item.id)
            }
          }
        } else if (!this.couponInfo.total) {
          return this.$Message.error('请输入发行量')
        } else if (!this.couponInfo.getTimePer) {
          return this.$Message.error('请输入每人限领张数')
        } else if (!this.useStartTime || !this.useEndTime) {
          return this.$Message.error('请选择有效期')
        } else if (this.couponInfo.releaseType == '0' && (!this.getStartTime || !this.getEndTime)) {
          return this.$Message.error('请选择领用时间')
        } else if (this.couponInfo.releaseType == '1' && !this.couponInfo.couponUsers.length) {
          return this.$Message.error('请选择推送用户')
        }

        this.couponInfo.useStartTime = new Date(this.useStartTime).getTime()
        this.couponInfo.useEndTime = new Date(this.useEndTime).getTime() + 24 * 60 * 60 * 1000 - 1
        this.couponInfo.getStartTime = this.couponInfo.releaseType == '0' ? new Date(this.getStartTime).getTime() : ''
        this.couponInfo.getEndTime = this.couponInfo.releaseType == '0' ? new Date(this.getEndTime).getTime() + 24 * 60 * 60 * 1000 - 1 : ''

        this.couponInfo.denomination = this.couponInfo.denomination * 100
        this.couponInfo.moneyOff = this.couponInfo.moneyOff != null && this.couponInfo.moneyOff * 100
        this.isSending = true

        this.$api.coupon.editCoupon(this.couponInfo)
          .then(
            res => {
              if (res.data.code == '200') {
                this.$Message.success('编辑成功')
                this.$router.push({
                  name: 'coupon'
                })
              }
            })
          .finally(() => {
            this.isSending = false
          })
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-couponEdit {

    .-c-card {
      margin: 20px auto;
      width: 50%;
    }

    .-c-form {
      text-align: left;
    }

    .-c-tips {
      color: #39f
    }

    .-c-course-icon {
      cursor: pointer;
      text-align: center;
      color: #e9e9e9;
      width: 140px;
      height: 70px;
      line-height: 70px;
      border: 2px dashed #e9e9e9;

      span {
        font-size: 16px;
        display: inline-block;
      }
    }

    .-c-course-wrap {
      margin-top: 10px;
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        width: 140px;
        overflow: hidden;
        margin: 10px 10px 10px 0;

        img {
          width: 100%;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          line-height: normal;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }

    .-upload{
      margin: 0;

      .-c-course-item{
        margin: 0;
      }
    }

  }
</style>
