<template>
  <div class="p-customer">
    <Card>
      <Form class="-c-form g-t-left" ref="addInfo" :model="addInfo" :label-width="100" :rules="ruleValidate">
        <Form-item label="客服二维码" prop="turn" class="ivu-form-item-required -c-form-item ">
          <!--<Upload-->
            <!--v-if="!addInfo.kfercode"-->
            <!--:action="baseUrl"-->
            <!--:show-upload-list="false"-->
            <!--:max-size="100"-->
            <!--:on-success="handleSuccess"-->
            <!--:on-exceeded-size="handleSize"-->
            <!--:on-error="handleErr">-->
            <!--<div class="g-course-add-style">-->
              <!--<span>+</span>-->
              <!--<span>上传客服二维码</span>-->
            <!--</div>-->
          <!--</Upload>-->
          <div class="-c-wrap">
            <div class="-c-item">
              <img :src="addInfo.kfercode">
              <!--<div class="-i-del" @click="delImg()">删除</div>-->
            </div>
          </div>
          <!--<span class="-c-tips">* 图片大小100k以内</span>-->
        </Form-item>
        <FormItem label="客服电话" prop="phone" style="width: 400px">
          <Input type="text" v-model="addInfo.kftel" placeholder="请输入电话号码" :disabled="!isEdit"></Input>
        </FormItem>
        <!--<FormItem>-->
          <!--<div class="-c-flex">-->
            <!--<Button @click="isEdit = true" ghost type="primary" class="-c-btn" v-if="!isEdit">进入编辑</Button>-->
            <!--<div @click="submitInfo('addInfo')" class="g-primary-btn -c-btn" v-else> {{isSending ? '提交中...' : '确 认'}}</div>-->
          <!--</div>-->
        <!--</FormItem>-->
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
    name: 'courseEdit',
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

    .-c-wrap {


      .-c-item{
        display: flex;
        img{
          width: 150px;
          height: 150px;
        }

        .-i-del {
          align-self: flex-end;
          color: #5444E4;
          padding: 4px 0;
          cursor: pointer;
          line-height: 16px;
        }
      }
    }

    .-c-flex {
      display: flex;
    }

    .-c-btn {
      width: 120px;
    }
  }
</style>
