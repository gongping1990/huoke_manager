<template>
  <div class="p-active">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo" :rules="ruleValidate"
            :label-width="100">
        <Form-item label="是否启用" prop="turn" class=" -c-form-item ">
          <Radio-group v-model="addInfo.enable">
            <Radio :label=0 :disabled="!isShowEdit">不启用</Radio>
            <Radio :label=1 :disabled="!isShowEdit">启用</Radio>
          </Radio-group>
        </Form-item>
        <FormItem label="优惠券面额" prop="couponMoney">
          <Input type="text" v-model="addInfo.couponMoney" placeholder="请输入优惠金额" :disabled="!isShowEdit"></Input>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </FormItem>
        <Form-item label="使用条件" class="ivu-form-item-required">
          <Radio-group v-model="addInfo.useCondition" @on-change="changeUseCondition">
            <Radio :label=0 :disabled="!isShowEdit">无门槛使用</Radio>
            <Radio :label=1 :disabled="!isShowEdit">输入满减金额</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="满减金额" prop="minMoney" v-if="addInfo.useCondition">
          <Input-number style="width: 100%;" :max="1000000" :min="0" :step="1" v-model="addInfo.minMoney"
                        :disabled="!isShowEdit" placeholder="满减金额（元）"></Input-number>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </Form-item>
        <FormItem label="有效期" prop="keepTime">
          <Input type="text" v-model="addInfo.keepTime" placeholder="请输入有效期（小时）" :disabled="!isShowEdit"></Input>
        </FormItem>
        <Form-item label="课程类型" prop="useScope">
          <Radio-group v-model="addInfo.useScope" @on-change="changeUseScope">
            <Radio :label=0 :disabled="!isShowEdit">全部课程通用</Radio>
            <Radio :label=1 :disabled="!isShowEdit">指定课程可用</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="选择课程" v-if="addInfo.useScope">
          <div class="g-course-add-style" @click="isShowCourse=true" v-if="isShowEdit">
            <span>+</span>
            <span>选择课程</span>
          </div>
          <div v-if="isShowCourse">
            <check-course :isShowModal="isShowCourse" :checkCourseList="courseListOne" :isUpdate='isShowEdit'
                          :courseType="1" @cancleCourseModal="isShowCourse = false"
                          @closeCourseModal="checkCourseOne"></check-course>
          </div>
          <div class="-c-course-wrap" v-if="courseListOne.length">
            <div class="-c-course-item" v-for="(item, index) of courseListOne" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <div class="-i-del" v-if="isShowEdit" @click="delCourse(item,index)">删除课程</div>
            </div>
          </div>
        </Form-item>
        <FormItem label="体验课" prop="url">
          <div class="g-course-add-style" @click="isShowCourseModal=true" v-if="isShowEdit">
            <span>+</span>
            <span>选择课程</span>
          </div>

          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isShowEdit'
                          :courseType='1'
                          @closeCourseModal="checkCourse" @cancleCourseModal="isShowCourseModal= false"></check-course>
          </div>

          <div class="-c-course-wrap" v-if="courseList.length">
            <div class="-c-course-item" v-for="(item, index) of courseList" :key="index">
              <img :src="item.courseImgUrl">
              <div class="-i-text">{{item.courseName}}</div>
              <!--<div v-if="isShowEdit" class="-i-del" @click="delCourse(item,index)">删除课程</div>-->
            </div>
          </div>

        </FormItem>
        <Form-item label="封面图" class="-c-form-item ivu-form-item-required">
          <Upload
            v-if="isShowEdit"
            style="display: inline-block"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="500"
            :on-success="handleSuccess"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传图片</Button>
          </Upload>
          <div v-if="isShowEdit" class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          <div class="-c-course-wrap" v-if="addInfo.coverphoto">
            <div class="-c-course-item">
              <img :src="addInfo.coverphoto">
              <div v-if="isShowEdit" class="-i-del" @click="addInfo.coverphoto= ''">删除</div>
            </div>
          </div>
        </Form-item>
        <FormItem label="专区链接">
          http://baidu.com
        </FormItem>
        <FormItem>
          <div class="-c-flex">
            <Button @click="isShowEdit = true" ghost type="primary" class="-c-btn" v-if="!isShowEdit">进入编辑</Button>
            <Button @click="closeEdit" ghost type="primary" class="-c-btn" v-else>取消</Button>
            <div v-if="isShowEdit" @click="submitInfo('addInfo')" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' :
              '确 认'}}
            </div>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import CheckCourse from "../../../components/checkCourse";
  import {pattern} from '@/libs/regexp'

  export default {
    name: 'active',
    components: {CheckCourse, Loading},
    data() {
      return {
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        isShowCourseModal: false,
        isShowCourse: false,
        courseListOne: [],
        courseList: [],
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        addInfo: {
          courseGoodsIdList: [],
          coverphoto: '',
          useCondition: 0,
          useScope: 0,
          type: 0
        },
        ruleValidate: {
          couponMoney: [
            {required: true, message: '请输入优惠金额', trigger: 'blur'},
          ],
          keepTime: [
            {required: true, message: '请输入有效期', trigger: 'blur'},
          ]
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      delCourse(item, index) {
        this.courseListOne.splice(index, 1)
      },
      changeUseScope() {
        if (!this.addInfo.useScope) {
          this.courseListOne = []
        }
        this.$forceUpdate()
      },
      changeUseCondition() {
        if (!this.addInfo.useCondition) {
          this.addInfo.minMoney = null
        }
        this.$forceUpdate()
      },
      checkCourseOne(params) {
        this.isShowCourse = false
        if (this.isEdit) {
          for (let data of this.addInfo.couponCourseObject) {
            for (let item of params) {
              if (data.id == item.id) {
                item.isOldCourse = true
              }
            }
          }
        }
        this.courseListOne = params
      },
      checkCourse(params) {
        if (params.length > 3) {
          return this.$Message.error('最多选择三个课程')
        }
        this.courseList = params
        this.isShowCourseModal = false;
      },
      closeEdit() {
        this.isShowEdit = false
        this.getList()
      },
      getList() {
        this.isFetching = true
        this.courseList = []
        this.courseListOne = []
        this.$api.giftpack.giftPackInfo()
          .then(
            response => {
              if (response.data.resultData) {
                this.addInfo = response.data.resultData;
                this.addInfo.couponMoney = this.addInfo.couponMoney.toString()
                this.addInfo.keepTime = this.addInfo.keepTime.toString()
                this.addInfo.enable = this.addInfo.enable ? 1 : 0
                this.addInfo.useCondition = this.addInfo.minMoney ? 1 : 0
                this.addInfo.useScope = this.addInfo.couponGoodsList.length ? 1 : 0
                this.addInfo.couponCourseObject = this.addInfo.couponGoodsList

                for (let item of this.addInfo.couponCourseObject) {
                  this.courseListOne.push({
                    courseImgUrl: item.coverUrl,
                    courseName: item.name,
                    id: item.goodsId
                  })
                }

                for (let item of this.addInfo.courseGoodsList) {
                  this.courseList.push({
                    courseImgUrl: item.coverUrl,
                    courseName: item.name,
                    id: item.goodsId
                  })
                }
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        let param = {}
        if (!pattern.positive.exec(this.addInfo.couponMoney)) {
          return this.$Message.error('金额保留两位小数')
        } else if (!this.courseList.length) {
          return this.$Message.error('请选择体验课')
        } else if (this.addInfo.useScope && !this.courseListOne.length) {
          return this.$Message.error('请选择课程类型')
        } else if (this.addInfo.useCondition && !this.addInfo.minMoney) {
          return this.$Message.error('满减金额不能为0')
        } else if (!this.addInfo.coverphoto) {
          return this.$Message.error('请上传封面图')
        }

        this.addInfo.courseGoodsIdList = []
        this.addInfo.couponGoodsIds = []

        for (let item of this.courseList) {
          this.addInfo.courseGoodsIdList.push(item.goodsId || item.id)
        }

        for (let item of this.courseListOne) {
          this.addInfo.couponGoodsIds.push(item.goodsId || item.id)
        }

        param = {
          couponMoney: this.addInfo.couponMoney,
          enable: this.addInfo.enable != '0',
          keepTime: this.addInfo.keepTime,
          coverphoto: this.addInfo.coverphoto,
          courseGoodsIdList: this.addInfo.courseGoodsIdList,
          couponGoodsIds: this.addInfo.couponGoodsIds,
          minMoney: this.addInfo.minMoney,
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.isSending = true
            let promiseDate = this.addInfo.id ? this.$api.giftpack.updateGiftPackInfo({
              ...param,
              id: this.addInfo.id
            }) : this.$api.giftpack.addGiftPackInfo(param)
            promiseDate
              .then(
                response => {
                  if (response.data.code == '200') {
                    this.$Message.success('提交成功');
                    this.closeEdit()
                    this.$refs[name].resetFields()
                  }
                })
              .finally(() => {
                this.isSending = false
              })
          }
        })
      },
      handleSuccess(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.coverphoto = res.resultData.url
        }
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      }
    }
  };
</script>

<style lang="less" scoped>
  .p-active {

    .-c-form {
      width: 70%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
    }

    .-c-flex {
      display: flex;
      justify-content: center;
    }

    .-c-btn {
      margin: 20px;
      width: 120px;
    }

    .-c-tips {
      color: #39f
    }
    .-c-course-wrap {
      display: inline-block;
      .-c-course-item {
        position: relative;
        display: inline-block;
        overflow: hidden;
        width: 140px;
        margin: 10px 10px 0 0;
        img {
          width: 100%;
          height: 70px;
        }

        .-i-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          line-height: normal;
          overflow: hidden;
          height: 50px;
        }

        .-i-del {
          position: absolute;
          top: 0;
          right: 0px;
          color: #ffff;
          background-color: rgba(0, 0, 0, 0.4);
          line-height: normal;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }
      }
    }
  }
</style>
