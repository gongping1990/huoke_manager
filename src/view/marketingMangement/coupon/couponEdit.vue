<template>
  <div class="p-couponEdit">
    <Card :bordered="false" class="-c-card">
      <p slot="title">基础信息</p>
      <Form class="-c-form" ref="couponInfo" :model="couponInfo" :label-width="100"
            label-position="right">
        <Form-item label="优惠券名称" prop="name" class="ivu-form-item-required">
          <Input v-model="couponInfo.name" placeholder="请输入优惠券名称" :disabled="isEdit"></Input>
        </Form-item>
        <Form-item label="优惠券面额" prop="denomination" class="ivu-form-item-required">
          <Input-number style="width: 100%;" :min="0" :step="1" v-model="couponInfo.denomination"
                        placeholder="请输入优惠券面额（元）" :disabled="isEdit"></Input-number>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </Form-item>
        <Form-item label="使用条件" prop="useCondition" @on-change="changeUseCondition" class="ivu-form-item-required">
          <Radio-group v-model="couponInfo.useCondition">
            <Radio :label=0 :disabled="isEdit">无门槛使用</Radio>
            <Radio :label=1 :disabled="isEdit">输入满减金额</Radio>
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
                             v-model="useStartTime" :disabled="isEdit" :options="dateStartOption"></Date-picker>
              </Form-item>
            </Col>
            <Col span="1" style="text-align: center">-</Col>
            <Col span="8">
              <Form-item prop="time">
                <Date-picker style="width: 100%" type="date" placeholder="选择结束日期"
                             v-model="useEndTime" :disabled="isEdit" :options="dateEndOption"></Date-picker>
              </Form-item>
            </Col>
          </Row>
        </Form-item>

      </Form>
    </Card>

    <Card :bordered="false" class="-c-card">
      <p slot="title">使用范围</p>
      <Form class="-c-form" ref="couponInfo" :model="couponInfo" :label-width="100">
        <Form-item label="课程类型" prop="useScope">
          <Radio-group v-model="couponInfo.useScope" @on-change="changeUseScope">
            <Radio :label=0 :disabled="isEdit">全部课程通用</Radio>
            <Radio :label=1 :disabled="isEdit">指定课程可用</Radio>
          </Radio-group>
          <div class="-c-tips">* 添加优惠券后，使用范围只能增加，不能减少</div>
        </Form-item>
        <Form-item label="选择课程" v-if="couponInfo.useScope">
          <div class="g-course-add-style" @click="isShowCourseModal=true" v-if="!isEdit">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isEdit'
                          :courseType="1" @cancleCourseModal="isShowCourseModal = false"
                          @closeCourseModal="checkCourse"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <div v-if="!item.isOldCourse" class="-i-del" @click="delCourse(item,index)">删除课程</div>
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
            <Radio :disabled="isEdit" :label=0>用户领取</Radio>
            <Radio :disabled="isEdit" :label=1>主动推送</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="发行量" prop="total" v-if="!couponInfo.releaseType" class="ivu-form-item-required">
          <Input-number style="width: 100%;" :max="1000000" :min="1" :step="1" v-model="couponInfo.total"
                        placeholder="请输入发行量"></Input-number>
          <span class="-c-tips">* 添加优惠券后，发行量只能增加，不能减少，总共不超过1,000,000张</span>
        </Form-item>
        <Form-item label="每人限领" v-if="!couponInfo.releaseType" class="ivu-form-item-required">
          <Input-number style="width: 100%;" :max="10" :min="1" :step="1" v-model="couponInfo.getTimePer"
                        placeholder="限领张数" :disabled="isEdit"></Input-number>
        </Form-item>
        <Form-item label="领取时间" v-if="!couponInfo.releaseType" class="ivu-form-item-required">
          <Row>
            <Col span="8">
              <Form-item prop="date">
                <Date-picker :disabled="isEdit" style="width: 100%" type="date" placeholder="选择开始日期"
                             v-model="getStartTime" :options="dateStartOption"></Date-picker>
              </Form-item>
            </Col>
            <Col span="1" style="text-align: center">-</Col>
            <Col span="8">
              <Form-item prop="time">
                <Date-picker :disabled="isEdit" style="width: 100%" type="date" placeholder="选择结束日期"
                             v-model="getEndTime" :options="dateStartOption"></Date-picker>
              </Form-item>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="是否在课程领取" prop="getInCourse" v-if="!couponInfo.releaseType">
          <Radio-group v-model="couponInfo.getInCourse">
            <Radio :label=1 :disabled="isEdit">是</Radio>
            <Radio :label=0 :disabled="isEdit">否</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="领取摘要" prop="getAbstract" v-if="!couponInfo.releaseType">
          <Input v-model="couponInfo.getAbstract" placeholder="请输入领取摘要" :disabled="isEdit"></Input>
        </Form-item>
        <Form-item label="领取海报" prop="poster" v-if="!couponInfo.releaseType">
          <Upload
            v-if="!couponInfo.poster"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="1024"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <div class="g-course-add-style">
              <span>+</span>
              <span>上传海报</span>
            </div>
          </Upload>
          <div class="-c-course-wrap -upload" v-if="couponInfo.poster">
            <div class="-c-course-item">
              <img :src="couponInfo.poster">
              <div class="-i-del" @click="delPoster()" v-if="!isEdit">删除海报</div>
            </div>
          </div>
          <span class="-c-tips" v-else>* 图片大小1M以内</span>
        </Form-item>
        <Form-item label="选择用户" prop="poster" v-if="couponInfo.releaseType">
          <Button @click="openUserModal">+请添加用户( {{otherInfo.isCheckAllPeople ? '已选择全部用户' : `已选
            ${couponInfo.couponUsers.length} 人`}} )
          </Button>
          <div v-if="isShowUserSelection">
            <user-selection ref="childMethod"
                            @close="closeUserModal"
                            @submitModal="submitUserSelection"
                            :userCheckList="couponInfo.couponUsers"
                            :otherInfo="otherInfo">
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
  import {getBaseUrl} from "@/libs/index";

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
        useStartTime: '',
        useEndTime: '',
        getStartTime: '',
        getEndTime: '',
        oldTotal: '',
        oldCourse: '',
        otherInfo: {
          title: '选择用户',
          isCheckAllPeople: false,
          type: '3'
        },
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`,
        dateStartOption: {
          disabledDate(date) {
            return date && (new Date(date).getTime() <= new Date().getTime() - 24 * 3600 * 1000);
          }
        },
        dateEndOption: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
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
          getInCourse: 1, // 是否在课程详情里领取
          getAbstract: '', // 领取摘要
          poster: '' // 海报连接
        }
      }
    },
    watch: {
      'useStartTime'(_new, _old) {
        this.dateEndOption = {
          disabledDate(date) {
            return date && date.valueOf() < new Date(_new).getTime();
          }
        }
      }
    },
    computed: {
      isEdit() {
        return this.couponInfo.id && this.couponInfo.id != ''
      }
    },
    mounted() {
      this.couponId && this.getInfo()
    },
    methods: {
      checkCourse(params) {
        this.isShowCourseModal = false
        if (this.isEdit) {
          for (let data of this.couponInfo.couponCourseObject) {
            for (let item of params) {
              if (data.id == item.id) {
                item.isOldCourse = true
              }
            }
          }
        }
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
        console.log(params, 'params')
        this.isShowUserSelection = false
        if (params.condition == '1') {
          this.otherInfo.isCheckAllPeople = true
        } else {
          this.otherInfo.isCheckAllPeople = false
          this.couponInfo.couponUsers = params.userIds
        }
      },
      changeUseScope() {
        if (!this.couponInfo.useScope) {
          this.courseList = []
          this.couponInfo.couponCourses = []
        }
      },
      changeUseCondition() {
        if (!this.couponInfo.useCondition) {
          this.couponInfo.moneyOff = null
        }
      },
      delCourse(item, index) {
        this.courseList.splice(index, 1)
      },
      handleReset() {
        this.$router.push({
          name: 'coupon'
        })
      },
      handleSuccess(res, file) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.couponInfo.poster = res.resultData.url
        }
      },
      handleSize() {
        this.$Message.info('文件超过限制')
      },
      beforeUpload() {
        return !this.isEdit
      },
      delPoster() {
        this.couponInfo.poster = ''
      },
      handleErr() {
        this.$Message.error('上传失败，请重新上传')
      },
      getInfo() {
        this.isFetching = true
        this.$api.coupon.couponInfo(this.couponId)
          .then(
            response => {
              this.couponInfo = response.data.resultData;
              for (let item of this.couponInfo.couponCourseObject) {
                this.courseList.push({
                  courseImgUrl: item.courseImgUrl,
                  courseName: item.name,
                  id: item.id,
                  isOldCourse: true
                })
              }

              this.oldTotal = response.data.resultData.total
              this.oldCourse = response.data.resultData.couponCourses
              this.couponInfo.denomination = +(this.couponInfo.denomination / 100);
              this.couponInfo.moneyOff = this.couponInfo.moneyOff != null && +(this.couponInfo.moneyOff / 100);
              this.useStartTime = new Date(this.couponInfo.useStartTime)
              this.useEndTime = new Date(this.couponInfo.useEndTime)
              this.getStartTime = !this.couponInfo.releaseType ? new Date(this.couponInfo.getStartTime) : ''
              this.getEndTime = !this.couponInfo.releaseType ? new Date(this.couponInfo.getEndTime) : ''

            })
          .finally(() => {
            this.isFetching = false
          })
      },
      handleSubmit() {
        if (this.isSending) return
        this.couponInfo.couponCourses = []

        if (!this.couponInfo.name) {
          return this.$Message.error('请输入优惠券名称')
        } else if (this.couponInfo.name.length > 25) {
          return this.$Message.error('优惠券名称不超过25个字')
        } else if (!this.couponInfo.denomination) {
          return this.$Message.error('请输入优惠券面额')
        } else if (this.couponInfo.useCondition && !this.couponInfo.moneyOff) {
          return this.$Message.error('请输入满减金额')
        } else if (this.couponInfo.useScope && !this.courseList.length) {
          return this.$Message.error('请选择指定课程')
        } else if (!this.couponInfo.releaseType && !this.couponInfo.total) {
          return this.$Message.error('请输入发行量')
        } else if (!this.couponInfo.releaseType && !this.couponInfo.getTimePer) {
          return this.$Message.error('请输入每人限领张数')
        } else if (!this.useStartTime || !this.useEndTime) {
          return this.$Message.error('请选择有效期')
        } else if (!this.couponInfo.releaseType && (!this.getStartTime || !this.getEndTime)) {
          return this.$Message.error('请选择领用时间')
        } else if (this.couponInfo.releaseType && !this.otherInfo.isCheckAllPeople && !this.couponInfo.couponUsers.length) {
          return this.$Message.error('请选择推送用户')
        } else if (this.couponInfo.id && this.couponInfo.id != '' && (this.couponInfo.total < this.oldTotal)) {
          return this.$Message.error('发行量只能增加不能减少')
        }

        if (this.courseList.length) {
          for (let item of this.courseList) {
            this.couponInfo.couponCourses.push(item.id)
          }
        }

        this.couponInfo.useStartTime = new Date(this.useStartTime).getTime()
        this.couponInfo.useEndTime = new Date(this.useEndTime).getTime()
        this.couponInfo.getStartTime = !this.couponInfo.releaseType ? new Date(this.getStartTime).getTime() : ''
        this.couponInfo.getEndTime = !this.couponInfo.releaseType ? new Date(this.getEndTime).getTime() : ''

        this.couponInfo.denomination = parseFloat((this.couponInfo.denomination * 100).toPrecision(12))

        this.couponInfo.moneyOff = this.couponInfo.moneyOff != null ? parseFloat((this.couponInfo.moneyOff * 100).toPrecision(12)) : null
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

    .-upload {
      margin: 0;

      .-c-course-item {
        margin: 0;
      }
    }

  }
</style>
