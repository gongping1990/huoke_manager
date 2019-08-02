<template>
  <div class="p-customer">
    <Card>
      <Form class="-c-form g-t-left ivu-form-item-required" ref="addInfo" :model="addInfo" :rules="ruleValidate"
            :label-width="100">
        <FormItem label="老师名称" prop="couponMoney">
          <Input type="text" v-model="addInfo.couponMoney" placeholder="请输入老师名称" :disabled="!isShowEdit"></Input>
        </FormItem>
        <FormItem label="微信号" prop="keepTime">
          <Input type="text" v-model="addInfo.keepTime" placeholder="请输入微信号" :disabled="!isShowEdit"></Input>
        </FormItem>

        <Form-item label="头像" class="-c-form-item ivu-form-item-required">
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
        <Form-item label="二维码" class="-c-form-item ivu-form-item-required">
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
  import {pattern} from '@/libs/regexp'

  export default {
    name: 'customer',
    components: {Loading},
    data() {
      return {
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
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
        } else if (!this.addInfo.coverphoto) {
          return this.$Message.error('请上传封面图')
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
  .p-customer {

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
