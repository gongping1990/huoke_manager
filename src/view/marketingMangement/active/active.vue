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
        <FormItem label="优惠金额" prop="couponMoney">
          <Input type="text" v-model="addInfo.couponMoney" placeholder="请输入优惠金额" :disabled="!isShowEdit"></Input>
          <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
        </FormItem>
        <FormItem label="有效期" prop="keepTime">
          <Input type="text" v-model="addInfo.keepTime" placeholder="请输入有效期（小时）" :disabled="!isShowEdit"></Input>
        </FormItem>
        <FormItem label="体验课" prop="url">
          <div class="g-course-add-style" @click="isShowCourseModal=true" v-if="isShowEdit">
            <span>+</span>
            <span>选择课程</span>
          </div>

          <div v-if="isShowCourseModal">
            <check-course :isShowModal="isShowCourseModal" :checkCourseList="courseList" :isUpdate='isShowEdit'
                          :courseType='true'
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
        courseList: [],
        addInfo: {
          courseGoodsIdList: [],
          enable: 0
        },
        ruleValidate: {
          couponMoney: [
            {required: true, message: '请输入优惠金额', trigger: 'blur'},
          ],
          keepTime: [
            {required: true,  message: '请输入有效期', trigger: 'blur'},
          ]
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
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
        this.$api.giftpack.giftPackInfo()
          .then(
            response => {
              if (response.data.resultData) {
                this.addInfo = response.data.resultData;
                this.addInfo.couponMoney = this.addInfo.couponMoney.toString()
                this.addInfo.keepTime = this.addInfo.keepTime.toString()
                this.addInfo.enable = this.addInfo.enable ? 1 : 0
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
        }

        this.addInfo.courseGoodsIdList = []

        for (let item of this.courseList) {
          this.addInfo.courseGoodsIdList.push(item.goodsId || item.id)
        }

        param = {
          couponMoney:  this.addInfo.couponMoney,
          enable: this.addInfo.enable != '0',
          keepTime:  this.addInfo.keepTime,
          courseGoodsIdList:  this.addInfo.courseGoodsIdList,
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
    }
  };
</script>

<style lang="less" scoped>
  .p-active {

    .-c-form {
      width: 50%;

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
          left: 84px;
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
