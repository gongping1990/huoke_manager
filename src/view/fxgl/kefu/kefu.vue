<template>
  <div class="p-customer">
    <Card>
      <Form class="-c-form g-t-left" ref="addInfo" :model="addInfo" :label-width="130" :rules="ruleValidate">
        <FormItem label="推广指导人微信号" prop="phone" style="width: 400px">
          <Input type="text" v-model="addInfo.kftel" placeholder="请输入微信号" :disabled="!isEdit"></Input>
        </FormItem>
        <Form-item label="推广指导人二维码"  class="ivu-form-item-required -c-form-item ">
          <Upload
            v-if="!addInfo.kfercode"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="100"
            :on-success="handleSuccess"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <div class="g-course-add-style">
              <span>+</span>
              <span>上传客服二维码</span>
            </div>
          </Upload>
          <div class="-c-course-wrap" v-if="addInfo.kfercode">
            <div class="-c-course-item">
              <img :src="addInfo.kfercode">
              <div v-if="isEdit" class="-i-del" @click="addInfo.kfercode= ''">删除</div>
            </div>
          </div>
          <div class="-c-tips">图片大小：500K以内</div>
        </Form-item>
        <Form-item label="加盟商审核人二维码" class="ivu-form-item-required -c-form-item ">
          <Upload
            v-if="!addInfo.kfercode"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="100"
            :on-success="handleSuccess"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <div class="g-course-add-style">
              <span>+</span>
              <span>上传客服二维码</span>
            </div>
          </Upload>
          <div class="-c-course-wrap" v-if="addInfo.kfercode">
            <div class="-c-course-item">
              <img :src="addInfo.kfercode">
              <div v-if="isEdit" class="-i-del" @click="addInfo.kfercode= ''">删除</div>
            </div>
          </div>
          <div class="-c-tips">图片大小：500K以内</div>
        </Form-item>

        <FormItem>
          <div class="-c-flex">
            <Button @click="isEdit = !isEdit" ghost type="primary" class="-c-btn">{{isEdit ? '取消' : '进入编辑'}}</Button>
            <div @click="submitInfo('addInfo')" class="g-primary-btn -c-btn" v-if="isEdit"> {{isSending ? '提交中...' : '确 认'}}</div>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import {pattern} from "@/libs/regexp"
  import Loading from "@/components/loading";

  export default {
    name: 'fxgl_kefu',
    components: {Loading},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        isEdit: false,
        isFetching: false,
        isSending: false,
        addInfo: {
          qrCode: '',
          phone: '',
        },
        ruleValidate: {
          phone: [
            {required: true, message: '请输入电话号码', trigger: 'blur'},
          ]
        },
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      delImg () {
        if(!this.isEdit) return
        this.addInfo.qrCode = ''
      },
      handleSuccess(res) {
        if (res.code === 200) {
          this.addInfo.qrCode = res.resultData.url
        }
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
      getList() {
        this.isFetching = true
        this.$api.common.getService()
          .then(
            response => {
              this.addInfo = response.data.resultData
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {
        if (!this.addInfo.qrCode) {
          return this.$Message.error('请上传客服二维码')
        } else if (this.addInfo.phone && !pattern.phone.exec(this.addInfo.phone)) {
          return this.$Message.error('请输入正确的手机号码')
        }
        this.$refs[name].validate((valid) => {
          console.log(1)
          if (valid) {
            // this.isSending = true
            // let promiseDate = this.addInfo.courseId ? this.$api.course.updateSubject(this.addInfo) : this.$api.course.addSubject(this.addInfo)
            // promiseDate
            //   .then(
            //     response => {
            //       if (response.data.code == '200') {
            //         this.$Message.success('提交成功');
            //         this.getList()
            //         this.closeModal(name)
            //       }
            //     })
            //   .finally(() => {
            //     this.isSending = false
            //   })
          }
        })
        // this.$refs[name].resetFields()
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-customer {

    .-c-form {
      width:50%;

      .-c-form-item {
        padding: 14px 0;
        margin: 0;
      }
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

    .-c-flex {
      display: flex;
    }

    .-c-tips {
      color: #39f
    }

    .-c-btn {
      width: 120px;
      margin-right: 20px;
    }
  }
</style>
