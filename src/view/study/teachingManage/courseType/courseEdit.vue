<template>
  <div class="p-courseEdit">
    <Form class="-c-form g-t-left" ref="addInfo" :model="addInfo" :label-width="100">
      <Form-item label="模板样式" prop="operate" class="ivu-form-item-required -c-form-item -c-border" v-if="type == '3'">
        <Radio-group v-model="addInfo.operate " @on-change="changeTemplate">
          <Radio :disabled="addInfo.id ? true : false" :label=1>读课文</Radio>
          <Radio :disabled="addInfo.id ? true : false" :label=2>选择题</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="题干文案" class="-c-form-item -c-border ivu-form-item-required" v-if=" addInfo.operate == '2'">
        <Input class="-s-width" v-model="addInfo.question" placeholder="请输入题干文案" style="width: 300px"/>
      </Form-item>

      <Form-item label="动态图片" class="-c-form-item -c-border" v-if="type=='1' &&  addInfo.operate == '1' ">
        <Upload
          style="display: inline-block"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="500"
          :on-success="handleSuccessGif"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传图片</Button>
        </Upload>
        <span class="-c-tips">图片尺寸不低于285x432px 图片大小：100K以内</span>
        <div class="-c-course-wrap" v-if="addInfo.tipcImgUrl">
          <div class="-c-course-item">
            <img :src="addInfo.tipcImgUrl">
          </div>
          <div class="-i-del" v-if="addInfo.operate == '1'" @click="addInfo.tipcImgUrl= ''">删除图片</div>
        </div>
      </Form-item>

      <Form-item label="题干图片" class="-c-form-item -c-border"
                 v-if="addInfo.operate == '2'">
        <Upload
          style="display: inline-block"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="200"
          :on-success="handleSuccessQuestion"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传图片</Button>
        </Upload>
        <span class="-c-tips">图片尺寸不低于640x238px 图片大小：200K以内</span>
        <div class="-c-course-wrap" v-if="addInfo.questionImgUrl">
          <div class="-c-course-item">
            <img :src="addInfo.questionImgUrl">
          </div>
          <div class="-i-del" v-if="addInfo.operate == '2'" @click="addInfo.questionImgUrl= ''">删除图片</div>
        </div>
      </Form-item>

      <Form-item label="背景图片" prop="poster" class="ivu-form-item-required -c-form-item -c-border"
                 v-if=" addInfo.operate == '1'">
        <Upload
          style="display: inline-block"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="500"
          :on-success="handleSuccessBack"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传图片</Button>
        </Upload>

        <span class="-c-tips">图片尺寸不低于640x1008px 图片大小：200K以内</span>
        <div class="-c-course-wrap" v-if="addInfo.bgImgUrl">
          <div class="-c-course-item">
            <img :src="addInfo.bgImgUrl">
          </div>
        </div>
      </Form-item>

      <Form-item label="上传音频" prop="audioUrl" class="-c-form-item -c-border" :class="{'ivu-form-item-required': this.addInfo.operate == '1'}">
        <Upload
          :action="baseUrlVa"
          :show-upload-list="false"
          :max-size="20480"
          :before-upload="beforeUpload"
          :on-success="handleSuccessAudio"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传音频</Button>
          <span class="-c-tips">音频格式：mp3、wma、arm 音频大小：20M以内</span>
        </Upload>

        <div class="-c-course-wrap" v-if="addInfo.audioUrl">
          <div class="-c-course-item -item-audio">
            <Icon class="-item-icon" type="md-volume-up" size="30"/>
            <audio style="margin-left: 20px;display: flex"
                   ref="media"
                   :src="playAudioUrl"
                   controls="controls" preload="auto"></audio>
            <Icon v-if="this.addInfo.operate == '2'" type="md-close-circle" size="20" class="-item-icon-close g-cursor" @click="closeAudio"/>
          </div>
        </div>
      </Form-item>

      <Form-item label="选择类型" class="ivu-form-item-required -c-form-item"
                 v-if=" addInfo.operate == '2'">
        <Radio-group v-model="singleAnswer">
          <Radio :label=0>单选</Radio>
          <Radio :label=1>多选</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="答案设置" class="ivu-form-item-required -c-form-item -c-border"
                 v-if=" addInfo.operate == '2'">
        <Radio-group v-model="anyAnswer" @on-change="changeAnswer">
          <Radio :label=0>标准答案</Radio>
          <Radio :label=1>任意选择</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="选择选项" class="ivu-form-item-required -c-form-item"
                 v-if=" addInfo.operate == '2'">
        <div v-for="(item,index) of optionList" class="-item-select-wrap">
          <span class="-s-width">选项{{optionLetter[index]}}</span>
          <Input class="-s-width" v-model="item.value" type="textarea" :autosize="true" placeholder="请输入选择题干"
                 :maxlength="40" style="width: 300px"/>
          <span class="-s-width">文字字数不超过40字</span>
          <Checkbox v-if="anyAnswer!='1'" v-model="item.isChecked" @on-change="changeCheck(index)">设为答案
          </Checkbox>
          <span v-if="anyAnswer!='1'" class="-s-width -s-color g-cursor" @click="delOption(index)">删除</span>
        </div>
        <div class="-form-btn g-cursor" v-if="optionList.length < 5" @click="addOption">+ 新增选项</div>
      </Form-item>

      <Form-item label="翻页延时" prop="turnDelay" class="ivu-form-item-required -c-form-item"
                 v-if="addInfo.operate == '1'">
        <Radio-group v-model="addInfo.turnDelay">
          <Radio :label=0>0秒</Radio>
          <Radio :label=1>1秒</Radio>
          <Radio :label=2>2秒</Radio>
          <Radio :label=3>3秒</Radio>
        </Radio-group>
      </Form-item>

      <FormItem>
        <div class="-c-flex">
          <Button @click="closeModal()" ghost type="primary" class="-c-btn">取消</Button>
          <div @click="submitInfo()" class="g-primary-btn -c-btn"> {{isSending ? '提交中...' : '确 认'}}</div>
        </div>
      </FormItem>
    </Form>
    <loading v-if="isFetching"></loading>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "../../../../components/loading";

  export default {
    name: 'courseEdit',
    props: ['type', 'wordType', 'dataObj'],
    components: {Loading},
    data() {
      return {
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        isSwitchTemplate: false,
        dataList: [],
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `${getBaseUrl()}/common/uploadPrivateFile`, //私有地址 （音视频）
        playAudioUrl: '',
        singleAnswer: 0,
        anyAnswer: '',
        optionLetter: ['A', 'B', 'C', 'D', 'E'],
        optionList: [],
        audioType: ['mp3', 'wma', 'arm'],
        addInfo: {
          lessonId: this.$route.query.lessonId,
          contentType: this.type,
          operate: 1,
          question: '', //题干题目
          audioUrl: '', //音频路径
          anyAnswer: '', //答题类型
          turnDelay: 1, //延时
          singleAnswer: '', //选择类型
          answerItem: '', //选择题目
          tipcImgUrl: '', //动态图
          questionImgUrl: '', //题干图
          bgImgUrl: '', //背景图
        }
      }
    },

    mounted() {

      if (this.dataObj) {
        if (this.type == '1') {
          this.dataObj.operate = this.wordType ? (this.wordType == 2 ? 1 : 2) : 1
        }

        if (this.dataObj.operate == '1') {
          this.addInfo = {
            ...this.dataObj.learn
          }
        } else {
          this.addInfo = {
            ...this.dataObj.question
          }

          this.singleAnswer = this.addInfo.singleAnswer ? 0 : 1
          this.anyAnswer = this.addInfo.anyAnswer ? 1 : 0
          this.addInfo.answerItem && (this.optionList = JSON.parse(this.addInfo.answerItem))
          this.addInfo.audioUrl = this.addInfo.questionAudioUrl
          // this.addInfo.tipcImgUrl = this.addInfo.questionImgUrl
          console.log(this.addInfo,1)
        }
        this.addInfo.id = this.dataObj.id
        this.playAudioUrl = this.dataObj.operate == '1' ? this.addInfo.audioPlayUrl : this.addInfo.questionAudioPlayUrl
        this.addInfo.operate = this.dataObj.operate
      }
    },
    methods: {
      changeAnswer () {
        this.optionList.forEach(item=>{
          item.isChecked = false
        })
      },
      closeAudio () {
        this.addInfo.audioUrl = ''
        this.playAudioUrl = ''
      },
      changeTemplate() {
        this.$Modal.confirm({
          title: '提示',
          content: '切换模板，当前模板编辑内容将被清空',
          onOk: () => {

            // this.addInfo.operate = this.addInfo.operate == 1 ? 2 : 1
            localStorage.operate = this.addInfo.operate

            if (this.addInfo.operate == '2') {
              this.addInfo.audioUrl = ''
              this.addInfo.tipcImgUrl = ''
              this.addInfo.bgImgUrl = ''
              this.addInfo.questionImgUrl = ''
            } else {
              this.optionList = []
            }
          },
          onCancel: () => {
            if (this.addInfo.operate == '1') {
              this.addInfo.operate = 2
            } else {
              this.addInfo.operate = 1
            }
          }
        })
      },
      changeCheck(idx) {
        if (this.singleAnswer == '0') {
          this.optionList.forEach((item, index) => {
            if (idx != index) {
              item.isChecked = false
            }
          })
        }
      },
      addOption() {
        this.optionList.push({
          value: '',
          isChecked: false,
          index: this.optionLetter[this.optionList.length]
        })
      },
      delOption(index) {
        this.optionList.splice(index, 1)
      },
      submitInfo() {
        let isCheck = ''
        let checkLength = []
        let isPass = ''
        let paramUrl = ''

        if (this.addInfo.operate == '2' && this.optionList.length) {
          isCheck = this.optionList.some(item => {
            return item.isChecked == true
          })

          this.optionList.forEach(item => {
            if (item.isChecked) {
              checkLength.push(item)
            }
          })

          isPass = this.optionList.every(item => {
            return (item.value != '' && item.value.length <= 40)
          })
        }

        if (!this.addInfo.operate) {
          return this.$Message.error('请选择模板样式')
        } else if (this.addInfo.operate == '2' && !this.addInfo.question) {
          return this.$Message.error('请输入题干文案')
        } else if (this.addInfo.operate == '1' && !this.addInfo.bgImgUrl) {
          return this.$Message.error('请上传背景图片')
        } else if (this.addInfo.operate == '1' && !this.addInfo.audioUrl) {
          return this.$Message.error('请上传音频内容')
        } else if (this.addInfo.operate == '2' && this.singleAnswer === '') {
          return this.$Message.error('请设置选择类型')
        } else if (this.addInfo.operate == '2' && this.anyAnswer === '') {
          return this.$Message.error('请设置答案类型')
        } else if (this.addInfo.operate == '2' && (!this.optionList.length || !isPass)) {
          return this.$Message.error('选择题目不能为空或字数不能超过40字')
        } else if (this.addInfo.operate == '2' && this.singleAnswer == '1' && this.anyAnswer != '1' && checkLength.length < 2) {
          return this.$Message.error('请设置至少2个答案')
        } else if (this.addInfo.operate == '2' && this.singleAnswer == '0' && checkLength.length > 1) {
          return this.$Message.error('只能设置一个答案')
        } else if (this.addInfo.operate == '2' && this.anyAnswer != '1' && !isCheck) {
          return this.$Message.error('请设置正确的单选题答案')
        }

        if (this.addInfo.operate == '2') {
          this.addInfo.answerItem = JSON.stringify(this.optionList)
          this.addInfo.questionAudioUrl = this.addInfo.audioUrl
        }

        this.addInfo.singleAnswer = this.singleAnswer == '0'
        this.addInfo.anyAnswer = this.anyAnswer == '1'

        switch (+this.type) {
          case 1:
            paramUrl = this.addInfo.id ? this.addInfo.operate == '1' ? this.$api.mission.updateWord(this.addInfo) :
              this.$api.mission.updateWordQuestion(this.addInfo) : this.$api.mission.addWord(this.addInfo)
            break
          case 2:
            paramUrl = this.addInfo.id ? this.$api.mission.updateRead(this.addInfo) : this.$api.mission.addRead(this.addInfo)
            break
          case 3:
            paramUrl = this.addInfo.id ? this.$api.mission.updateLecture(this.addInfo) : this.$api.mission.addLecture(this.addInfo)
            break
        }
        paramUrl
          .then(res => {
            if (res.data.code == '200') {
              this.$Message.success(`${this.addInfo.id ? '修改成功' : '创建成功'}`)
              this.$emit('addCourseOk')
            }
          })

      },
      closeModal() {
        this.$emit('addCourseOk')
      },
      beforeUpload(file) {
        let fileType = file.type.split('/')
        let isPass = false
        isPass = this.audioType.some(item => {
          return item == fileType[fileType.length - 1]
        })
        this.isFetching = isPass
        if (!isPass) {
          this.$Message.error('上传格式错误')
        }
        return isPass
      },
      handleSuccessGif(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.tipcImgUrl = res.resultData.url
          console.log(this.addInfo.tipcImgUrl, 'tipcImgUrl')
        }
      },
      handleSuccessQuestion(res) {
        if (res.code === 200) {
          this.$Message.success('上传成功')
          this.addInfo.questionImgUrl = res.resultData.url
          console.log(this.addInfo.questionImgUrl, 'questionImgUrl')
        }
      },
      handleSuccessBack(res) {
        if (res.code === 200) {
          this.addInfo.bgImgUrl = res.resultData.url
          console.log(this.addInfo.bgImgUrl, 'bgImgUrl')
        }
      },

      handleSuccessAudio(res) {
        if (res.code === 200) {
          this.isFetching = false
          this.addInfo.audioUrl = res.resultData.url
          this.getAvUrl(this.addInfo.audioUrl)
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
                this.playAudioUrl = response.data.resultData
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
        position: relative;

        .-c-course-item {
          position: relative;
          background-color: #EBEBEB;
          width: 200px;
          margin-top: 20px;
          border: 1px solid #EBEBEB;
          border-radius: 4px;
          padding: 4px;
          img {
            display: flex;
            width: 100%;
          }
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

          .-item-icon-close{
            position: absolute;
            right: -10px;
            top: -10px;
          }
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
      left: 144px;
      color: #ffff;
      background-color: rgba(0, 0, 0, 0.4);
      line-height: normal;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
  }
</style>
