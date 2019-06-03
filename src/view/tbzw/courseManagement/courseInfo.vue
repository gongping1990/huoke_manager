<template>
  <div class="p-course-info">
    <Card class="p-course-info-card">
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio()">
          <Radio label="1">基础信息</Radio>
          <Radio label="2">帮助信息</Radio>
        </Radio-group>
      </Row>
      <div class="p-course-info-wrap">
        <Form v-if="radioType==='1'" ref="addInfo" :model="addInfo" :rules="ruleValidateOne" :label-width="90">
          <FormItem label="课程名称" prop="name">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="单独购价格" prop="alonePrice">
            <InputNumber type="text" :disabled="!isEdit" v-model="addInfo.alonePrice" :min="0"
                         placeholder="请输入单独购价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课价格" prop="groupPrice">
            <InputNumber type="text" :disabled="!isEdit" v-model="addInfo.groupPrice" :min="0"
                         placeholder="请输入拼课价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课时限" prop="groupTime">
            <InputNumber type="text" :disabled="!isEdit" v-model="addInfo.groupTime" :min="0"
                         placeholder="请输入拼课时限（小时）"></InputNumber>
          </FormItem>
          <FormItem label="咨询电话" prop="consultPhone">
            <InputNumber type="text" :disabled="!isEdit" v-model="addInfo.consultPhone"
                         placeholder="请输入咨询电话"></InputNumber>
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
        </Form>
        <Form v-if="radioType==='2'" ref="addInfo" :model="addInfo" :rules="ruleValidateTwo" :label-width="80">
          <FormItem label="单独购买帮助信息" v-if="isEdit" prop="aloneInfo">
            <Editor v-model="addInfo.aloneInfo" :uploadImgServer="baseUrl"></Editor>
          </FormItem>
          <FormItem label="团购购买帮助信息" v-if="isEdit" prop="groupInfo">
            <Editor v-model="addInfo.groupInfo" :uploadImgServer="baseUrl"></Editor>
          </FormItem>
          <FormItem label="参加团购帮助信息" v-if="isEdit" prop="launchInfo">
            <Editor v-model="addInfo.launchInfo" :uploadImgServer="baseUrl"></Editor>
          </FormItem>
          <div v-if="!isEdit">
            <Card class="-p-card-wrap">
              <div class="g-flex-a-j-center">
                <div class="-p-label">单独购买帮助信息</div>
                <div v-html="addInfo.aloneInfo"></div>
              </div>
            </Card>
            <Card class="-p-card-wrap">
              <div class="g-flex-a-j-center">
                <div class="-p-label">团购购买帮助信息</div>
                <div v-html="addInfo.groupInfo"></div>
              </div>
            </Card>
            <Card class="-p-card-wrap">
              <div class="g-flex-a-j-center">
                <div class="-p-label">参加团购帮助信息</div>
                <div v-html="addInfo.launchInfo"></div>
              </div>
            </Card>
          </div>
        </Form>
        <div class="-c-flex">
          <Button v-if="isEdit" @click="closeEdit('addInfo')" ghost type="primary" class="-c-btn">取 消</Button>
          <div v-if="isEdit" @click="submitInfo('addInfo')" class="g-primary-btn -c-btn">确 认</div>
          <div v-if="!isEdit" @click="isEdit= true" class="g-primary-btn -c-btn">编 辑</div>
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
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        addInfo: {
          name: '',
          alonePrice: null,
          groupPrice: null,
          consultPhone: null,
          aloneInfo: '',
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
          groupPrice: [
            {required: true, type: 'number', message: '请输入拼课价格', trigger: 'blur'},
          ],
          groupTime: [
            {required: true, type: 'number', message: '请输入拼课时限', trigger: 'blur'},
          ],
          consultPhone: [
            {required: true, type: 'number', message: '请输入咨询电话', trigger: 'blur'},
          ]
        },
        ruleValidateTwo: {
          aloneInfo: [
            {required: true, message: '请输入单独购买帮助信息', trigger: 'blur'},
          ],
          groupInfo: [
            {required: true, message: '请输入团购购买帮助信息', trigger: 'blur'},
          ],
          launchInfo: [
            {required: true, message: '请输入参加团购帮助信息', trigger: 'blur'},
          ]
        },
      };
    },
    mounted() {
      this.getList()
    },
    methods: {
      changeRadio() {
        this.closeEdit('addInfo')
        this.getList()
      },
      closeEdit(name) {
        this.$refs[name].resetFields();
        this.isEdit = false
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
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.composition.getDefultCourse()
          .then(
            response => {
              this.addInfo = response.data.resultData
              if (this.addInfo.id) {
                this.addInfo.alonePrice = +this.addInfo.alonePrice
                this.addInfo.groupPrice = +this.addInfo.groupPrice
                this.addInfo.groupTime = +this.addInfo.groupTime
                this.addInfo.consultPhone = +this.addInfo.consultPhone
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
            } else if (this.radioType === '2' && (!this.addInfo.aloneInfo || this.addInfo.aloneInfo == '<p><br></p>')) {
              return this.$Message.error('请输入单独购买帮助信息')
            } else if (this.radioType === '2' && (!this.addInfo.groupInfo || this.addInfo.groupInfo == '<p><br></p>')) {
              return this.$Message.error('请输入团购购买帮助信息')
            } else if (this.radioType === '2' && (!this.addInfo.launchInfo || this.addInfo.launchInfo == '<p><br></p>')) {
              return this.$Message.error('请输入参加团购帮助信息')
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
