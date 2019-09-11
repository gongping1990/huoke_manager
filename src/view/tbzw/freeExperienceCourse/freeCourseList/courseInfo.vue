<template>
  <div class="p-course-info">
    <Card class="p-course-info-card">
      <div class="p-course-info-wrap">
        <Form ref="addInfo" :model="addInfo" :rules="ruleValidateOne" :label-width="90">
          <FormItem label="课程名称" prop="name">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="des">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.des" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="课时节数" prop="lessonDescribe">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.lessonDescribe" placeholder="请输入课时节数"></Input>
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
            <div class="-c-course-wrap" v-if="addInfo.verticalPhoto">
              <div class="-c-course-item">
                <img :src="addInfo.verticalPhoto">
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
    name: 'tbzw_free_courseList',
    components: {Editor, Loading},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        addInfo: {
          name: '',
          des: '',
          lessonDescribe: '',
          coverphoto: "",
          verticalPhoto: ""
        },
        radioType: '1',
        isEdit: true,
        isSending: false,
        ruleValidateOne: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          des: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
          ],
          lessonDescribe: [
            {required: true, message: '请输入课时节数', trigger: 'blur'},
          ]
        }
      };
    },
    mounted() {
      if (this.$route.query.courseId) {
        this.getList()
      }
    },
    methods: {
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
          this.addInfo.verticalPhoto = res.resultData.url
        }
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.composition.getDefultCourse()
          .then(
            response => {
              this.addInfo = response.data.resultData
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
            } else if (!this.addInfo.verticalPhoto && this.radioType === '1') {
              return this.$Message.error('请上传竖版封面')
            }
            let paramsUrl = this.addInfo.id ? this.$api.composition.tbzwCourseUpdate : this.$api.composition.tbzwCourseAdd
            paramsUrl(this.addInfo)
              .then(response => {
                if (response.data.code == '200') {
                  this.$Message.success('修改成功');
                  this.getList()
                  this.closeEdit(name)
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
