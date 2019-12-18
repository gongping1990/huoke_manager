<template>
  <div class="p-course-info">
    <Card class="p-course-info-card">
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio()">
          <Radio label="1">基础信息</Radio>
          <Radio label="2">帮助信息</Radio>
          <Radio label="3">优惠信息</Radio>
        </Radio-group>
      </Row>
      <div class="p-course-info-wrap">
        <Form v-if="radioType==='1'" ref="addInfo" :model="addInfo" :rules="ruleValidateOne" :label-width="90">
          <FormItem label="课程名称" prop="name">
            <Input type="text"  v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="单独购价格" prop="alonePrice">
            <InputNumber type="text"  v-model="addInfo.alonePrice" :min="0"  class="g-width"
                         placeholder="请输入单独购价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课是否启用">
            <Radio-group v-model="addInfo.useGroup">
              <Radio :label=0 >不启用</Radio>
              <Radio :label=1 >启用</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="拼课人数" prop="groupNum">
            <InputNumber type="text"  v-model="addInfo.groupNum" :min="0"  class="g-width"
                         placeholder="请输入拼课人数"></InputNumber>
          </FormItem>
          <FormItem label="拼课价格" prop="groupPrice">
            <InputNumber type="text"  v-model="addInfo.groupPrice" :min="0"  class="g-width"
                         placeholder="请输入拼课价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课时限" prop="deadline">
            <InputNumber type="text"  v-model="addInfo.deadline" :min="0"  class="g-width"
                         placeholder="请输入拼课时限（小时）"></InputNumber>
            <span class="-c-tips">* 小时</span>
          </FormItem>
          <FormItem label="咨询电话" prop="consultPhone">
            <InputNumber type="text"  v-model="addInfo.consultPhone"  class="g-width"
                         placeholder="请输入咨询电话"></InputNumber>
          </FormItem>
          <Form-item label="课程封面" class="-c-form-item ivu-form-item-required">
            <Upload

              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessCover"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.coverphoto">
              <div class="-c-course-item">
                <img :src="addInfo.coverphoto">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
          <Form-item label="竖版封面" class="-c-form-item ivu-form-item-required">
            <Upload

              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessVerticalCover"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.verticalCover">
              <div class="-c-course-item">
                <img :src="addInfo.verticalCover">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
          <Form-item label="咨询图片" class="-c-form-item ivu-form-item-required">
            <Upload

              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessQrCode"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.qrCode">
              <div class="-c-course-item">
                <img :src="addInfo.qrCode">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
          <Form-item label="试听banner" class="-c-form-item">
            <Upload

              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessBannerpic"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.bannerpic">
              <div class="-c-course-item">
                <img :src="addInfo.bannerpic">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
          <FormItem label="小程序链接" prop="appletlinks">
            <Input type="text"  v-model="addInfo.appletlinks" placeholder="请输入小程序链接"></Input>
          </FormItem>
        </Form>
        <Form v-if="radioType==='2'" ref="addInfo" :model="addInfo" :label-width="80">
          <FormItem label="单独购买帮助信息"  prop="aloneInfo">
            <Editor ref="childEditorOne" v-model="addInfo.aloneInfo" :uploadImgServer="baseUrl"></Editor>
          </FormItem>
          <FormItem label="团购购买帮助信息"  prop="groupInfo">
            <Editor ref="childEditorTwo" v-model="addInfo.groupInfo" :uploadImgServer="baseUrl"></Editor>
          </FormItem>
          <FormItem label="参加团购帮助信息"  prop="launchInfo">
            <Editor ref="childEditorThree" v-model="addInfo.launchInfo" :uploadImgServer="baseUrl"></Editor>
          </FormItem>
        </Form>
        <Form v-if="radioType==='3'" ref="addInfo" :model="addInfo" :label-width="90" class="ivu-form-item-required">
          <FormItem label="是否启用">
            <Radio-group v-model="addInfo.enabled">
              <Radio :label=0 >不启用</Radio>
              <Radio :label=1 >启用</Radio>
            </Radio-group>
          </FormItem>
          <FormItem label="优惠券面额">
            <InputNumber type="text"  v-model="addInfo.couponAmount" :min="0"
                         placeholder="请输入优惠券面额（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="有效期">
            <InputNumber type="text"  v-model="addInfo.expiredTimeHour" :min="0"
                         placeholder="请输入有效期（小时）"></InputNumber>
          </FormItem>
        </Form>
        <div class="-c-flex">
          <Button @click="closeEdit('addInfo')" ghost type="primary" class="-c-btn">取 消</Button>
          <div  @click="submitInfo('addInfo')" class="g-primary-btn -c-btn">确 认</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "../../../components/loading";
  import Editor from "../../../components/editor";

  export default {
    name: 'contentList',
    components: {Editor, Loading},
    props: ['open'],
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        addInfo: {
          id: '',
          name: '',
          alonePrice: null,
          groupPrice: null,
          consultPhone: null,
          aloneInfo: '',
          qrCode: '',
          verticalCover: '',
          bannerpic: '',
          groupInfo: '',
          launchInfo: '',
          coverphoto: ""
        },
        radioType: '1',
        isEdit: false,
        isSending: false,
        ruleValidateOne: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          alonePrice: [
            {required: true, type: 'number', message: '请输入单独购价格', trigger: 'blur'},
          ],
          appletlinks: [
            {required: true, message: '请输入小程序链接', trigger: 'blur'},
          ],
          groupPrice: [
            {required: true, type: 'number', message: '请输入拼课价格', trigger: 'blur'},
          ],
          consultPhone: [
            {required: true, type: 'number', message: '请输入咨询电话', trigger: 'blur'},
          ]
        }
      };
    },
    mounted() {
      this.$route.query.courseId && this.getList()
    },
    methods: {
      changeRadio() {
        if (this.radioType == 3) {
          this.getCouponConfig()
        } else {
          this.getList()
          this.$forceUpdate()
        }
      },
      closeEdit(name) {
        // this.getList()
        // this.$refs[name].resetFields();
        // this.isEdit = false
        this.$router.push({
          name: 'gsw_courseList',
          query: {}
        })
      },
      handleSize() {
        this.isFetching = false
        this.$Message.info('文件超过限制')
      },
      handleErr() {
        this.isFetching = false
        this.$Message.error('上传失败，请重新上传')
      },
      handleSuccessCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.coverphoto = res.resultData.url
        }
      },
      handleSuccessVerticalCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.verticalCover = res.resultData.url
        }
      },
      handleSuccessQrCode(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.qrCode = res.resultData.url
        }
      },
      handleSuccessBannerpic(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.bannerpic = res.resultData.url
        }
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.gswCourse.getById(this.$route.query.courseId)
          .then(
            response => {
              this.addInfo = response.data.resultData
              if (this.addInfo.id) {
                this.addInfo.alonePrice = +this.addInfo.alonePrice
                this.addInfo.groupPrice = +this.addInfo.groupPrice
                this.addInfo.consultPhone = +this.addInfo.consultPhone
                this.addInfo.useGroup = this.addInfo.useGroup ? 1 : 0
                this.$refs.childEditorOne && this.$refs.childEditorOne.setHtml(this.addInfo.aloneInfo)
                this.$refs.childEditorTwo && this.$refs.childEditorTwo.setHtml(this.addInfo.groupInfo)
                this.$refs.childEditorThree && this.$refs.childEditorThree.setHtml(this.addInfo.launchInfo)

              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      getCouponConfig(id) {
        this.$api.poem.getCouponConfig({
          courseId: id || this.addInfo.id
        })
          .then(
            response => {
              this.addInfo = response.data.resultData
              this.addInfo.couponAmount = +this.addInfo.couponAmount / 100
              this.addInfo.expiredTimeHour = +this.addInfo.expiredTimeHour
              this.addInfo.enabled =  this.addInfo.enabled ? 1 : 0
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {

        if (this.radioType == 3) {
          if (this.radioType === '3' &&  !this.addInfo.couponAmount) {
            return this.$Message.error('请输入优惠券面额')
          } else if (this.radioType === '3' && !this.addInfo.expiredTimeHour) {
            return this.$Message.error('请输入有效期')
          }
          this.$api.poem.setCouponConfig({
            couponAmount: this.addInfo.couponAmount * 100,
            courseId: this.addInfo.courseId,
            expiredTimeHour: this.addInfo.expiredTimeHour,
            enabled: this.addInfo.enabled === 1,
          })
            .then(response => {
              this.$Message.success('修改成功');
              this.getCouponConfig(this.addInfo.courseId)
              this.isEdit = false
            })
            .finally(() => {
              this.isFetching = false
            })
        } else {
          this.$refs[name].validate((valid) => {
            if (valid) {
              if (!this.addInfo.coverphoto && this.radioType === '1') {
                return this.$Message.error('请上传封面图片')
              } else if (!this.addInfo.qrCode && this.radioType === '1') {
                return this.$Message.error('请上传咨询二维码图片')
              } else if (!this.addInfo.verticalCover && this.radioType === '1') {
                return this.$Message.error('请上传竖版封面')
              } else if (!this.addInfo.groupNum && this.radioType === '1' && this.addInfo.useGroup == 1) {
                return this.$Message.error('请输入拼课人数')
              } else if (!this.addInfo.deadline && this.radioType === '1' && this.addInfo.useGroup == 1) {
                return this.$Message.error('请输入拼课时限')
              } else if (this.radioType === '2' && (!this.addInfo.aloneInfo || this.addInfo.aloneInfo == '<p><br></p>')) {
                return this.$Message.error('请输入单独购买帮助信息')
              } else if (this.radioType === '2' && (!this.addInfo.groupInfo || this.addInfo.groupInfo == '<p><br></p>')) {
                return this.$Message.error('请输入团购购买帮助信息')
              } else if (this.radioType === '2' && (!this.addInfo.launchInfo || this.addInfo.launchInfo == '<p><br></p>')) {
                return this.$Message.error('请输入参加团购帮助信息')
              }

              let paramsUrl = this.addInfo.id ? this.$api.poem.poemCourseUpdate : this.$api.poem.poemCourseAdd
              paramsUrl({
                ...this.addInfo,
                type: 2,
                useGroup: this.addInfo.useGroup === 1
              })
                .then(response => {
                  if (response.data.code == '200') {
                    this.$Message.success('修改成功');
                    // this.getList()
                    this.closeEdit(name)
                  }
                })
            }
          })
        }
      }
    }
  };
</script>


<style lang="less" scoped>
  .p-course-info {
    text-align: left;

    .-c-btn {
      margin-left: 20px;
      height: 40px;
      width: 120px;
    }

    .-p-card-wrap {
      margin-bottom: 20px;
      .-p-label {
        width: 65px;
        margin-right: 20px;
      }
    }

    .-c-flex {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .-c-tips {
      color: #39f;
    }

    &-card {
      min-height: 90vh;
    }

    &-wrap {
      margin-top: 24px;
      width: 60%;
      min-width: 600px;
    }

    .-c-course-wrap {

      .-c-course-item {
        display: inline-block;
        position: relative;
        background-color: #EBEBEB;
        width: 200px;
        height: 90px;
        margin: 10px 10px 10px 0;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        padding: 4px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .-code {
        width: 100px;
        height: 100px;
      }
      .-item-audio {
        display: flex;
        align-items: center;
        width: 350px;

        .-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: #ffffff;
          background: rgba(255, 237, 116, 1);
        }
      }

      .-item-video {
        margin: 10px 0;
      }
    }
  }
</style>
