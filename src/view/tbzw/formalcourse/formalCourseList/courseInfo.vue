<template>
  <div class="p-course-info">
    <Card class="p-course-info-card">
      <Row class="g-t-left">
        <Radio-group v-model="radioType" type="button" @on-change="changeRadio()">
          <Radio label="1">基础信息</Radio>
          <Radio label="2">帮助信息</Radio>
          <Radio label="3">作业分享</Radio>
          <Radio label="4">打卡分享</Radio>
          <Radio label="5">表扬分享</Radio>
        </Radio-group>
      </Row>
      <div class="p-course-info-wrap">
        <Form v-show="radioType==='1'" ref="addInfo" :model="addInfo" :rules="ruleValidateOne" :label-width="90">
          <FormItem label="课程名称" prop="name">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          <FormItem label="课程描述" prop="courseDescribe">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.courseDescribe" placeholder="请输入课程描述"></Input>
          </FormItem>
          <FormItem label="课时节数" prop="lessonDescribe">
            <InputNumber type="text" :disabled="!isEdit" v-model="addInfo.lessonDescribe"
                         placeholder="请输入课时节数"></InputNumber>
          </FormItem>
          <FormItem label="课程版本" class="ivu-form-item-required">
            <RadioGroup v-model="addInfo.bookType">
              <Radio :label=0 disabled>小语轻作文</Radio>
              <Radio :label=1 :disabled="addInfo.id !=''">乐小狮作文</Radio>
              <Radio :label=2 :disabled="addInfo.id !=''">乐小狮读写</Radio>
              <Radio :label=3 :disabled="addInfo.id !=''">乐小狮写字</Radio>
            </RadioGroup>
            <div class="-c-tips">* 添加后不可更改</div>
          </FormItem>
          <FormItem label="排课规则" class="ivu-form-item-required">
            <RadioGroup v-model="addInfo.wayOfTeach">
              <Radio :label=3 :disabled="addInfo.id !=''" v-if="addInfo.bookType === 3">交作业解锁</Radio>
              <Radio :label=1 :disabled="addInfo.id !=''" v-if="addInfo.bookType !== 3">每周系统排课</Radio>
              <Radio :label=2 :disabled="addInfo.id !=''" v-if="addInfo.bookType !== 3">人工排课</Radio>
            </RadioGroup>
            <div class="-c-tips">* 添加后不可更改</div>
          </FormItem>
          <FormItem label="课程组" v-if="addInfo.wayOfTeach === 2">
            <Select v-model="addInfo.groupId">
              <Option v-for="item of courseGroupList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="关联年级" v-if="addInfo.wayOfTeach === 2">
            <Select v-model="addInfo.grade">
              <Option v-for="item of gradeList" :label=item.name :value=item.id :key="item.id"></Option>
            </Select>
          </FormItem>
          <FormItem label="关联学期" v-if="addInfo.wayOfTeach === 2">
            <Select v-model="addInfo.semester">
              <Option value='1'>上学期</Option>
              <Option value='2'>下学期</Option>
            </Select>
          </FormItem>
          <FormItem label="单独购价格" prop="alonePrice">
            <InputNumber style="width: 100%;" type="text" :disabled="addInfo.id !=''" v-model="addInfo.alonePrice"
                         :min="0"
                         placeholder="请输入单独购价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课价格" prop="groupPrice">
            <InputNumber style="width: 100%;" type="text" :disabled="addInfo.id !=''" v-model="addInfo.groupPrice"
                         :min="0"
                         placeholder="请输入拼课价格（元）"></InputNumber>
            <span class="-c-tips">* 精确到小数点后2位，如99.99</span>
          </FormItem>
          <FormItem label="拼课时限" prop="groupTime">
            <InputNumber style="width: 100%;" type="text" :disabled="!isEdit" v-model="addInfo.groupTime" :min="0"
                         placeholder="请输入拼课时限（小时）"></InputNumber>
          </FormItem>
          <FormItem label="成团时限" prop="formTime">
            <InputNumber style="width: 100%;" type="text" :disabled="!isEdit" v-model="addInfo.formTime" :min="0"
                         placeholder="请输入成团时限（小时）"></InputNumber>
          </FormItem>
          <FormItem label="咨询电话" prop="consultPhone">
            <Input style="width: 100%;" type="text" :min="0" :disabled="!isEdit" v-model="addInfo.consultPhone"
                   placeholder="请输入咨询电话"></Input>
          </FormItem>
          <FormItem label="短信签名" prop="smsSignature">
            <Input style="width: 100%;" type="text" :min="0" :disabled="!isEdit" v-model="addInfo.smsSignature"
                   placeholder="请输入短信签名"></Input>
          </FormItem>
          <FormItem label="实物礼包" class="ivu-form-item-required">
            <RadioGroup v-model="addInfo.hasgift">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="小程序地址" class="ivu-form-item-required" v-if="addInfo.hasgift == 1">
            <Input type="text" :disabled="!isEdit" v-model="addInfo.miniUrl" placeholder="请输入小程序地址"></Input>
          </FormItem>
          <Form-item label="实物图片" v-if="addInfo.hasgift==1" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessGiftShowImg"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.giftShowImg">
              <div class="-c-course-item">
                <img :src="addInfo.giftShowImg">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
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
          <Form-item label="咨询图片" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
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
        </Form>
        <Form v-show="radioType==='2'" :model="addInfo" :label-width="80">
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
        <Form v-show="radioType==='3'" :model="addInfo" :label-width="90">
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
        <Form v-show="radioType==='4'" :model="addInfo" :label-width="90">
          <Form-item label="打卡海报" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessCardTemplates"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.cardTemplates">
              <div class="-c-course-item">
                <img :src="addInfo.cardTemplates">
              </div>
            </div>
            <div class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</div>
          </Form-item>
        </Form>
        <Form v-show="radioType==='5'" :model="addInfo" :label-width="90">
          <Form-item label="表扬海报" class="-c-form-item ivu-form-item-required">
            <Upload
              v-if="isEdit"
              style="display: inline-block"
              :action="baseUrl"
              :show-upload-list="false"
              :max-size="500"
              :on-success="handleSuccessPraiseTemplates"
              :on-exceeded-size="handleSize"
              :on-error="handleErr">
              <Button ghost type="primary">上传图片</Button>
            </Upload>
            <div class="-c-course-wrap" v-if="addInfo.praiseShare">
              <div class="-c-course-item">
                <img :src="addInfo.praiseShare">
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
    name: 'tbzw_forma_courseInfo',
    components: {Editor, Loading},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        addInfo: {
          id: '',
          name: '',
          courseDescribe: '',
          alonePrice: 999,
          groupPrice: 999,
          groupTime: null,
          lessonDescribe: null,
          consultPhone: '',
          formTime: null,
          aloneInfo: '',
          groupInfo: '',
          launchInfo: '',
          smsSignature: '',
          giftShowImg: "",
          coverphoto: "",
          verticalCover: "",
          hasgift: "1",
          wayOfTeach: 1,
          type: 1,
          qrCode: "",
          imgurl: "",
          cardimgurl: "",
          shareTemplates: "",
          cardTemplates: "",
          praiseShare: "",
          smalltitle: "",
          bigtitle: "",
          cardtitle: "",
          href: "",
          bookType: 1,
        },
        radioType: '1',
        isEdit: true,
        isSending: false,
        courseGroupList: [],
        gradeList: [
          {
            id: '1',
            name: '一年级'
          },
          {
            id: '2',
            name: '二年级'
          },
          {
            id: '3',
            name: '三年级'
          },
          {
            id: '4',
            name: '四年级'
          },
          {
            id: '5',
            name: '五年级'
          },
          {
            id: '6',
            name: '六年级'
          }
        ],
        ruleValidateOne: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          courseDescribe: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
          ],
          lessonDescribe: [
            {required: true, type: 'number', message: '请输入课时节数', trigger: 'blur'},
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
          formTime: [
            {required: true, type: 'number', message: '请输入成团时限', trigger: 'blur'},
          ],
          consultPhone: [
            {required: true, message: '请输入咨询电话', trigger: 'blur'},
          ],
          smsSignature: [
            {required: true, message: '请输入短信签名', trigger: 'blur'},
          ]
        }
      };
    },
    mounted() {
      if (this.$route.query.courseId) {
        this.getList();
      }
      this.pageByCourseGroup();
    },
    methods: {
      changeRadio() {
        this.closeEdit('addInfo');
        if (this.$route.query.courseId) {
          this.getList();
        }
      },
      backCourse(name) {
        this.$router.push({
          name: 'tbzw_forma_courseList'
        });
        this.$refs[name].resetFields();
      },
      closeEdit(name) {
        this.$refs[name].resetFields();
        if (this.$route.query.courseId) {
          this.getList();
        }
      },
      handleSize() {
        this.isFetching = false;
        this.$Message.info('文件超过限制');
      },
      handleErr() {
        this.isFetching = false;
        this.$Message.error('上传失败，请重新上传');
      },
      handleSuccessCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.coverphoto = res.resultData.url;
        }
      },
      handleSuccessQrCode(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.qrCode = res.resultData.url;
        }
      },
      handleSuccessVerticalPhoto(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.verticalCover = res.resultData.url;
        }
      },
      handleSuccessGiftShowImg(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.giftShowImg = res.resultData.url;
        }
      },
      handleSuccessCardimgurl(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.cardimgurl = res.resultData.url;
        }
      },
      handleSuccessImgurl(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.imgurl = res.resultData.url;
        }
      },
      handleSuccessShareTemplates(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.shareTemplates = res.resultData.url;
        }
      },
      handleSuccessCardTemplates(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.cardTemplates = res.resultData.url;
        }
      },
      handleSuccessPraiseTemplates(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功');
          this.addInfo.praiseShare = res.resultData.url;
        }
      },
      //分页查询
      getList() {
        this.isFetching = true;
        this.$api.tbzwCourse.getById(this.$route.query.courseId)
          .then(
            response => {
              this.addInfo = response.data.resultData;
              if (this.addInfo.id) {
                this.addInfo.alonePrice = +this.addInfo.alonePrice;
                this.addInfo.groupPrice = +this.addInfo.groupPrice;
                this.addInfo.groupTime = +this.addInfo.groupTime;
                this.addInfo.grade = this.addInfo.grade && this.addInfo.grade.toString();
                this.addInfo.semester = this.addInfo.semester && this.addInfo.semester.toString();
                this.addInfo.hasgift = this.addInfo.hasgift ? '1' : '0';
              }
            })
          .finally(() => {
            this.isFetching = false;
          });
      },
      pageByCourseGroup() {
        this.$api.tbzwGroupConfig.pageByCourseGroup({
          current: 1,
          size: 1000,
        })
          .then(
            response => {
              this.courseGroupList = response.data.resultData.records;
            })
      },
      submitInfo(name) {

        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!this.addInfo.groupId && this.addInfo.wayOfTeach === 2) {
              return this.$Message.error('请选择课程组');
            }  else if (!this.addInfo.grade && this.addInfo.wayOfTeach === 2) {
              return this.$Message.error('请选择关联年级');
            }  else if (!this.addInfo.semester && this.addInfo.wayOfTeach === 2) {
              return this.$Message.error('请选择关联学期');
            } else if (!this.addInfo.coverphoto && this.radioType === '1') {
              return this.$Message.error('请上传封面图片');
            } else if (!this.addInfo.qrCode && this.radioType === '1') {
              return this.$Message.error('请上传咨询图片');
            } else if (!this.addInfo.verticalCover && this.radioType === '1') {
              return this.$Message.error('请上传竖版封面');
            } else if (!this.addInfo.giftShowImg && this.addInfo.hasgift === '1') {
              return this.$Message.error('请上传实物图片');
            } else if (!this.addInfo.miniUrl && this.addInfo.hasgift === '1') {
              return this.$Message.error('请输入小程序地址');
            } else if (this.radioType === '2' && (!this.addInfo.aloneInfo || this.addInfo.aloneInfo == '<p><br></p>')) {
              return this.$Message.error('请输入单独购买帮助信息');
            } else if (this.radioType === '2' && (!this.addInfo.groupInfo || this.addInfo.groupInfo == '<p><br></p>')) {
              return this.$Message.error('请输入团购购买帮助信息');
            } else if (this.radioType === '2' && (!this.addInfo.launchInfo || this.addInfo.launchInfo == '<p><br></p>')) {
              return this.$Message.error('请输入参加团购帮助信息');
            } else if (this.radioType === '3' && !this.addInfo.shareTemplates) {
              return this.$Message.error('请上传分享海报');
            } else if (this.radioType === '3' && !this.addInfo.cardimgurl) {
              return this.$Message.error('请上传卡片图片');
            } else if (this.radioType === '3' && !this.addInfo.imgurl) {
              return this.$Message.error('请上传链接配图');
            } else if (this.radioType === '3' && !this.addInfo.smalltitle) {
              return this.$Message.error('请输入链接小标题');
            } else if (this.radioType === '3' && !this.addInfo.bigtitle) {
              return this.$Message.error('请输入链接大标题');
            } else if (this.radioType === '3' && !this.addInfo.href) {
              return this.$Message.error('请输入回复链接');
            } else if (this.radioType === '3' && !this.addInfo.cardtitle) {
              return this.$Message.error('请输入卡片标题');
            } else if (this.radioType === '4' && !this.addInfo.cardTemplates) {
              return this.$Message.error('请上传打卡海报');
            } else if (this.radioType === '5' && !this.addInfo.praiseShare) {
              return this.$Message.error('请上传表扬海报');
            }
            let paramsUrl = this.addInfo.id ? this.$api.tbzwCourse.tbzwCourseUpdate : this.$api.tbzwCourse.tbzwCourseAdd;
            paramsUrl(this.addInfo)
              .then(response => {
                if (response.data.code == '200') {
                  this.$Message.success('操作成功');
                  this.backCourse(name);
                }
              });
          } else {
            this.$Message.error('请先完善基础信息');
          }
        });
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
