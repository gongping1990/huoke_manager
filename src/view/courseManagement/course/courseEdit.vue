<template>
  <div class="p-courseEdit">
    <Card>
      <Form class="-c-form g-t-left" ref="addInfo" :model="addInfo" :rules="ruleValidate" :label-width="100">
        <Form-item label="课程名称" class="-c-form-item" prop="name">
          <Input class="-s-width" v-model="addInfo.name" placeholder="请输入课程名称" style="width: 300px"/>
        </Form-item>

        <Form-item label="课程描述" class="-c-form-item" prop="description">
          <Input class="-s-width" v-model="addInfo.description" placeholder="请输入课程描述" style="width: 300px"/>
        </Form-item>

        <Form-item label="课程关键字" class="-c-form-item ">
          <div class="-p-c-flex" style="width: 300px">
            <Input type="text" v-model="keywordItem" class="-p-form-input" placeholder="请输入关键字"
                   style="width: 230px"></Input>
            <Button @click="addContent()" ghost type="primary" class="-p-form-btn-left"
                    :class="{'-p-form-btn-bottom': addInfo.keywords.length}">添加
            </Button>
          </div>
          <div>
            <Tag v-for="(item, index) in addInfo.keywords" :key="index" :name="item" closable
                 @on-close="delContent(index)">{{item}}
            </Tag>
          </div>
        </Form-item>

        <Form-item label="课时总数" class="-c-form-item" prop="lessonNum">
          <InputNumber :max="999" :min="1" v-model="addInfo.lessonNum" placeholder="请输入课时总数"  style="width: 300px"></InputNumber>
        </Form-item>

        <Form-item label="课程排序" class="-c-form-item " prop="sortnum">
          <InputNumber :max="99999" :min="1" v-model="addInfo.sortnum" placeholder="请输入课程排序"  style="width: 300px"></InputNumber>
        </Form-item>

        <Form-item label="课时分类" class="-c-form-item" prop="categoryId">
          <Select v-model="addInfo.categoryId" style="width: 300px">
            <Option v-for="(item,index) in dataTypeList" :label="item.name" :value="item.id" :key="index"></Option>
          </Select>
        </Form-item>

        <Form-item label="首播时间" class="-c-form-item ">
          <Date-picker class="date-time" type="date" placeholder="选择首播时间"
                       v-model="addInfo.firstpayTime"></Date-picker>
        </Form-item>

        <Form-item label="适合年龄" class="-c-form-item -c-border ivu-form-item-required">
          <Radio-group v-model="ageType">
            <Radio :label=1>年龄不限</Radio>
            <Radio :label=2>填写年龄段</Radio>
          </Radio-group>
          <div v-if="ageType=='2'" class="-p-c-flex" style="width: 300px">
            <Input class="-s-width" v-model="addInfo.ageHead" placeholder="请输入最小年龄"/>&ensp;-&ensp;
            <Input class="-s-width" v-model="addInfo.ageFoot" placeholder="请输入最大年龄"/>
          </div>
        </Form-item>

        <Form-item label="封面图片" class="-c-form-item ivu-form-item-required">
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
          <span class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</span>
          <div class="-c-course-wrap" v-if="coverImgUrl">
            <div class="-c-course-item">
              <img :src="coverImgUrl">
              <div class="-i-del" @click="coverImgUrl= ''">删除</div>
            </div>
          </div>
        </Form-item>

        <Form-item label="详情图册" class="-c-form-item ivu-form-item-required">
          <Upload
            style="display: inline-block"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="500"
            :on-success="handleSuccessAtlas"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传图片</Button>
          </Upload>
          <span class="-c-tips">图片尺寸不低于960px*360px 图片大小：500K以内</span>
          <div class="-c-course-wrap" v-if="atlasImgUrl">
            <div class="-c-course-item" v-for="(item, index) of atlasImgUrl" :key="index">
              <img :src="item">
              <div class="-i-del" @click="delCourse(item,index)">删除</div>
            </div>
          </div>
        </Form-item>

        <Form-item label="课程简介" class="-c-form-item -c-border">
          <editor v-model="addInfo.introduction" :uploadImgServer="baseUrl" style="width: 900px"></editor>
        </Form-item>

        <Form-item label="分享海报" prop="poster" class="-c-form-item ivu-form-item-required">
          <Upload
            style="display: inline-block"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="1024"
            :on-success="handleSuccessShare"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传图片</Button>
          </Upload>

          <span class="-c-tips">图片尺寸不低于640x1008px 图片大小：1M以内</span>
          <div class="-c-course-wrap" v-if="addInfo.sharedimgUrl">
            <div class="-c-course-item">
              <img :src="addInfo.sharedimgUrl">
              <div class="-i-del" @click="sharedimgUrl= ''">删除</div>
            </div>
          </div>
        </Form-item>

        <Form-item label="学习二维码" prop="poster" class="-c-form-item">
          <Upload
            style="display: inline-block"
            :action="baseUrl"
            :show-upload-list="false"
            :max-size="100"
            :on-success="handleSuccessCode"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">上传图片</Button>
          </Upload>

          <span class="-c-tips">图片大小：100K以内</span>
          <div class="-c-course-wrap" v-if="addInfo.ercodeimgResUrl">
            <div class="-c-course-item -code">
              <img :src="addInfo.ercodeimgResUrl">
            </div>
          </div>
        </Form-item>

        <Form-item label="课程预告" class="-c-form-item">
          <Radio-group v-model="addInfo.type" @on-change="changePlayType">
            <Radio :label=1>音频</Radio>
            <Radio :label=2>视频</Radio>
          </Radio-group>
        </Form-item>

        <Form-item label="上传音视频" class="-c-form-item">
          <Upload
            style="display: inline-block"
            :action="baseUrlVa"
            :show-upload-list="false"
            :max-size="153600"
            :before-upload="beforeUpload"
            :on-success="handleSuccessPlay"
            :on-exceeded-size="handleSize"
            :on-error="handleErr">
            <Button ghost type="primary">{{addInfo.type==1 ? '上传音频' : '上传视频'}}</Button>
          </Upload>

          <span v-if="addInfo.type=='1'" class="-c-tips">音频格式：mp3、wma、arm 音频大小：150M以内</span>
          <span v-else class="-c-tips">视频格式：mp4、wmv、rmvb、avi 视频大小：150M以内</span>

          <div class="-c-course-wrap" v-if="addInfo.trailerResUrl">
            <div class="-c-course-item -item-audio" v-if="addInfo.type == '1'" >
              <Icon class="-item-icon" type="md-volume-up" size="30"/>
              <audio style="margin-left: 20px;display: flex"
                     ref="media"
                     :src="playUrl"
                     controls="controls" preload="auto"></audio>
            </div>
            <div class="-item-video" v-else>
              <video style="width: 300px"
                     ref="media"
                     :src="playUrl"
                     controls="controls" preload="auto"></video>
            </div>
          </div>
        </Form-item>

        <FormItem>
          <div class="-c-flex">
            <Button @click="closeModal('addInfo')" ghost type="primary" class="-c-btn">返回</Button>
            <div @click="submitInfo('addInfo')" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' : '确 认'}}</div>
          </div>
        </FormItem>
      </Form>
    </Card>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "../../../components/loading";
  import dayjs from 'dayjs'
  import Editor from "../../../components/editor";

  export default {
    name: 'courseEdit',
    components: {Editor, Loading},
    data() {
      return {
        isSending: false,
        isFetching: false,
        dataList: [],
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `${getBaseUrl()}/common/uploadPrivateFile`, //私有地址 （音视频）
        playUrl: '',
        keywordItem: '',
        coverImgUrl: '', //封面图片
        atlasImgUrl: [], //图册
        ageType: 1,
        dataTypeList: [],
        audioType: ['mp3', 'wma', 'arm'],
        videoType: ['mp4', 'wmv', 'rmvb', 'avi'],
        addInfo: {
          name: '', //名称·
          description: '', //描述·
          lessonNum: null, //课程课时数·
          categoryId: '', //课程分类id·
          firstpayTime: '', //首播·
          sortnum: null, //排序值·
          keywords: [], //关键字·
          ageHead: '', //年龄小·
          ageFoot: '', //年龄大·
          introduction: '', //课程简介·
          ercodeimgResUrl: '', //二维码·
          sharedimgUrl: '', //分享海报维码url·
          trailerResUrl: '', //课程预告·
          albumList: [], //图册（包括封面图，详情图册）·
          type: 1, //1音频 2视频
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {type: 'string', max: 80, message: '课程名称最多80字', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入课程描述', trigger: 'blur'},
            {type: 'string', max: 100, message: '课程描述最多100字', trigger: 'blur'}
          ],
          lessonNum: [
            {required: true, type: 'number', message: '请输入课时总数', trigger: 'blur'},
          ],
          sortnum: [
            {required: true, type: 'number', message: '请输入排序值', trigger: 'blur'},
          ],
          categoryId: [
            {required: true, message: '请选择课程分类', trigger: 'change'},
          ]
        },
      }
    },

    mounted() {
      this.getTypeList()
      this.$route.query.id && this.getDetail()
    },
    methods: {
      changePlayType() {
        this.addInfo.trailerResUrl = ''
        this.playUrl = ''
      },
      delCourse(item, index) {
        this.atlasImgUrl.splice(index, 1)
      },
      getTypeList() {
        this.$api.course.courseTypeList()
          .then(
            response => {
              this.dataTypeList = response.data.resultData.records;
            })

      },
      addContent() {
        if (!this.keywordItem) {
          return this.$Message.error('请输入关键词')
        } else if (this.keywordItem.length > 8) {
          return this.$Message.error('关键字字数最多8位')
        }
        this.addInfo.keywords.push(this.keywordItem)
        this.keywordItem = ""
      },
      delContent(index) {
        this.addInfo.keywords.splice(index, 1)
      },
      submitInfo(name) {
        let paramUrl = ''
        this.addInfo.albumList = []

        this.addInfo.firstpayTime = this.addInfo.firstpayTime ? dayjs(this.addInfo.firstpayTime).format("YYYY/MM/DD") : ''
        if (this.ageType == '1') {
          this.addInfo.ageHead = '0'
          this.addInfo.ageFoot = '99'
        }

        if(this.ageType == '2' && (this.addInfo.ageHead === '' || this.addInfo.ageFoot=='')) {
          return this.$Message.error('请输入限制年龄区间')
        } else if (!this.coverImgUrl) {
          return this.$Message.error('请上传封面图')
        } else if (!this.atlasImgUrl.length) {
          return this.$Message.error('请上传详情图册')
        } else if (!this.addInfo.sharedimgUrl) {
          return this.$Message.error('请上传分享海报')
        }

        this.addInfo.albumList.push({
          cover: 1,
          sortnum: 1,
          url: this.coverImgUrl
        })

        this.atlasImgUrl.forEach((item, index) => {
          this.addInfo.albumList.push({
            cover: 0,
            sortnum: index + 1,
            url: item
          })
        })

        if(this.addInfo.id) {
          delete this.addInfo.courseAlbumBeanVOS
          delete this.addInfo.canAccess
          delete this.addInfo.existLesson
          delete this.addInfo.isbuy
          delete this.addInfo.goodsId
          delete this.addInfo.playUrl
          delete this.addInfo.sharedtext
        }
        console.log(this.addInfo, 1)
        this.$refs[name].validate((valid) => {
          if (valid) {
            paramUrl = this.addInfo.id ? this.$api.course.updateCourse(this.addInfo) : this.$api.course.addCourse(this.addInfo)

            paramUrl
              .then(res => {
                if (res.data.code == '200') {
                  this.$Message.success(`${this.addInfo.id ? '修改成功' : '创建成功'}`)
                  this.closeModal(name)
                }
              })
          }
        })
      },
      closeModal(name) {
        this.$router.push('/courseList')
        this.$refs[name].resetFields()
      },
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        if (this.addInfo.type=='1') {
          isPass = this.audioType.some(item => {
            return item == fileType[fileType.length - 1]
          })
        } else {
          isPass = this.videoType.some(item => {
            return item == fileType[fileType.length - 1]
          })
        }

        this.isFetching = isPass
        if (!isPass) {
          this.$Message.error('上传格式错误')
        }
        return isPass
      },
      handleSuccessCover(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.coverImgUrl = res.resultData.url
        }
      },
      handleSuccessAtlas(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.atlasImgUrl.push(res.resultData.url)
        }
      },
      handleSuccessCode(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.ercodeimgResUrl = res.resultData.url
        }
      },
      handleSuccessShare(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.sharedimgUrl = res.resultData.url
        }
      },
      handleSuccessPlay(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.addInfo.trailerResUrl = res.resultData.url
          this.getAvUrl(this.addInfo.trailerResUrl)
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
      getAvUrl(data) {
        this.$api.common.getAVUrl({
          key: data
        })
          .then(
            response => {
              if (response.data.code == '200') {
                this.$Message.success('上传成功')
                this.playUrl = response.data.resultData
              }
            });
      },
      getDetail() {
        this.$api.course.courseInfo(this.$route.query.id)
          .then(
            response => {
              if (response.data.code == '200') {
                let getPass = false
                this.addInfo = response.data.resultData
                this.playUrl = this.addInfo.playUrl
                this.addInfo.sortnum = +this.addInfo.sortnum
                this.addInfo.lessonNum = +this.addInfo.lessonNum
                this.addInfo.firstpayTime = this.addInfo.firstpayTime && new Date(this.addInfo.firstpayTime)
                if(this.addInfo.ageFoot == '99' && this.addInfo.ageHead=='0') {
                  this.ageType = 1
                } else {
                  this.ageType = 2
                }

                this.addInfo.courseAlbumBeanVOS.forEach(item=>{
                  if(item.cover) {
                    this.coverImgUrl = item.url
                  } else {
                    this.atlasImgUrl.push(item.url)
                  }
                })
              }
            });
      }
    }
  };
</script>

<style lang="less">
  .p-courseEdit {
    .ivu-form-item-label {
      color: #B3B5B8;
    }
  }
</style>

<style lang="less" scoped>
  .p-courseEdit {

    .-c-form {

      .-p-c-flex {
        display: flex;
        justify-content: space-between;
      }
      .-c-form-item {
        padding: 14px 0;
        margin: 0;

        .-c-tips {
          margin-left: 10px;
        }

        .-item-select-wrap {
          padding: 10px 0;

          .-s-width {
            padding-right: 10px;
          }

          .-s-color {
            color: rgb(218, 55, 75);
          }
        }

        .-form-btn {
          margin: 10px 0 0 0;
          width: 333px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 5px;
          border: 1px dashed #5444E4;
          color: #5444E4;
        }
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

    .-c-flex {
      display: flex;
    }

    .-c-btn {
      margin: 20px;
      width: 120px;
    }

    .-c-border {
      border-bottom: 1px solid #EBEBEB;
    }

    .-i-del {
      position: absolute;
      top: 0;
      right: 0;
      color: #ffff;
      background-color: rgba(0, 0, 0, 0.4);
      line-height: normal;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
  }
</style>
