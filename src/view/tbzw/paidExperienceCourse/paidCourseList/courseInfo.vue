<template>
  <div class="p-course-info">
    <Card class="p-course-info-card">
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio()">
          <Radio label="1">基础信息</Radio>
          <Radio label="3">作业分享</Radio>
        </Radio-group>
      </Row>
      <div class="p-course-info-wrap">
        <Form v-show="radioType==='1'" ref="addInfo" :model="addInfo" :rules="ruleValidateOne" :label-width="90">
          <FormItem label="关联正式课" prop="linkId">
            <Select v-model="addInfo.linkId" multiple>
              <Option v-for="(item,index) in experienceLessonList" :label="item.name" :value="item.id"
                      :key="index"></Option>
            </Select>
          </FormItem>
          <FormItem label="课程名称" prop="name">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="courseDescribe">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.courseDescribe" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="课时节数" prop="lessonDescribe">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.lessonDescribe" placeholder="请输入课时节数"></Input>
          </FormItem>
          <FormItem label="单独购价格" prop="alonePrice">
            <InputNumber  style="width: 100%;" type="text" :disabled="!isEdit" v-model="addInfo.alonePrice" :min="0"
                         placeholder="请输入单独购价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="开课日期" prop="openTime">
            <TimePicker  style="width: 100%" format="HH:mm" placeholder="选择开课日期" v-model="addInfo.openTime"></TimePicker>
          </FormItem>
          <Form-item label="封面图片" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
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
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessVerticalPhoto"
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
        </Form>
        <Form v-show="radioType==='3'" ref="addInfo" :model="addInfo" :rules="ruleValidateThree" :label-width="90">
          <FormItem label="卡片标题" prop="cardtitle">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.cardtitle" placeholder="请输入卡片标题"></Input>
          </FormItem>
          <FormItem label="回复链接" prop="href">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.href" placeholder="请输入回复链接"></Input>
          </FormItem>
          <FormItem label="链接大标题" prop="bigtitle">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.bigtitle" placeholder="请输入链接大标题"></Input>
          </FormItem>
          <FormItem label="链接小标题" prop="smalltitle">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.smalltitle" placeholder="请输入链接小标题"></Input>
          </FormItem>
          <Form-item label="分享海报" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessShareTemplates"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.shareTemplates">
              <div class="-c-course-item">
                <img :src="addInfo.shareTemplates">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
          <Form-item label="卡片图片" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessCardimgurl"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.cardimgurl">
              <div class="-c-course-item">
                <img :src="addInfo.cardimgurl">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
          <Form-item label="链接配图" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessImgurl"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.imgurl">
              <div class="-c-course-item">
                <img :src="addInfo.imgurl">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
        </Form>
        <div class="-c-flex">
          <Button v-if="isEdit" @click="backCourse('addInfo')" ghost type="primary" class="-c-btn">返 回</Button>
          <div v-if="isEdit" @click="submitInfo('addInfo')" class="g-primary-btn -c-btn">确 认</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import Editor from "@/components/editor";

  export default {
    name: 'tbzw_paid_courseList',
    components: {Editor, Loading},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        addInfo: {
          name: '',
          courseDescribe: '',
          alonePrice: null,
          lessonDescribe: '',
          linkId: '-1',
          openTime: '',
          type: 2,
          coverphoto: "",
          verticalCover: "",
          imgurl: "",
          cardimgurl: "",
          shareTemplates: "",
          smalltitle: "",
          bigtitle: "",
          cardtitle: "",
          href: "",
        },
        experienceLessonList: [],
        radioType: '1',
        isEdit: true,
        isSending: false,
        ruleValidateOne: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          courseDescribe: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
          ],
          lessonDescribe: [
            {required: true, message: '请输入课时节数', trigger: 'blur'},
          ],
          alonePrice: [
            {required: true, type: 'number', message: '请输入单独购价格', trigger: 'blur'},
          ],
        },
        ruleValidateThree: {
          smalltitle: [
            {required: true, message: '请输入链接小标题', trigger: 'blur'},
          ],
          bigtitle: [
            {required: true, message: '请输入链接大标题', trigger: 'blur'},
          ],
          href: [
            {required: true, message: '请输入回复链接', trigger: 'blur'},
          ],
          cardtitle: [
            {required: true, message: '请输入卡片标题', trigger: 'blur'},
          ],
          openTime: [
            {required: true, type: 'date', message: '请选择开课时间', trigger: 'date'},
          ]
        }
      };
    },
    mounted() {
      this.getCourseList()
      if (this.$route.query.courseId) {
        this.getList()
      }
    },
    methods: {
      changeRadio() {
        this.closeEdit('addInfo')
        if (this.$route.query.courseId) {
          this.getList()
        }
      },
      backCourse(name) {
        this.$refs[name].resetFields();
        this.$router.push({
          name: 'tbzw_paid_courseList'
        })
      },
      closeEdit(name) {
        this.$refs[name].resetFields();
        if (this.$route.query.courseId) {
          this.getList()
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
      handleSuccessCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.coverphoto = res.resultData.url
        }
      },
      handleSuccessVerticalPhoto(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.verticalCover = res.resultData.url
        }
      },
      handleSuccessCardimgurl(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.cardimgurl = res.resultData.url
        }
      },
      handleSuccessImgurl(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.imgurl = res.resultData.url
        }
      },
      handleSuccessShareTemplates(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.shareTemplates = res.resultData.url
        }
      },
      getCourseList() {
        this.$api.tbzwCourse.courseQueryPage({
          current: 1,
          size: 1000,
          type: 1
        })
          .then(
            response => {
              this.experienceLessonList = response.data.resultData.records;
            })
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.tbzwCourse.getById(this.$route.query.courseId)
          .then(
            response => {
              this.addInfo = response.data.resultData
              if (this.addInfo.id) {
                this.addInfo.alonePrice = +this.addInfo.alonePrice
                this.addInfo.linkId = this.addInfo.linkId.split(',')
              }
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo(name) {

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.coverphoto && this.radioType === '1') {
              return this.$Message.error('请上传封面图片')
            } else if (!this.addInfo.verticalCover && this.radioType === '1') {
              return this.$Message.error('请上传竖版封面')
            } else if (this.radioType === '3' && !this.addInfo.shareTemplates) {
              return this.$Message.error('请上传分享海报')
            } else if (this.radioType === '3' && !this.addInfo.cardimgurl) {
              return this.$Message.error('请上传卡片图片')
            } else if (this.radioType === '3' && !this.addInfo.imgurl) {
              return this.$Message.error('请上传链接配图')
            }
            this.addInfo.linkId = `${this.addInfo.linkId}`
            let paramsUrl = this.addInfo.id ? this.$api.composition.tbzwCourseUpdate : this.$api.composition.tbzwCourseAdd
            paramsUrl(this.addInfo)
              .then(response => {
                if (response.data.code == '200') {
                  this.$Message.success('操作成功');
                  this.backCourse(name)
                }
              })
          }
        })
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
