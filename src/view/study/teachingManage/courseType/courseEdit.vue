<template>
  <div class="p-courseEdit">
    <Form class="-c-form ivu-form-item-required g-t-left" ref="addInfo" :model="addInfo" :label-width="100">
      <Form-item label="模板样式" prop="operate" class="-c-form-item -c-border">
        <Radio-group v-model="addInfo.operate ">
          <Radio :label=1>读课文</Radio>
          <Radio :label=2>单选题</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="动态图片" prop="gifImg" class=" -c-form-item -c-border" v-if="addInfo.operate == '1'">
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
        <span class="-c-tips">图片尺寸不低于285x432px 图片大小：500K以内</span>
        <div class="-c-course-wrap" v-if="gifImgUrl">
          <div class="-c-course-item">
            <img :src="gifImgUrl">
          </div>
        </div>
      </Form-item>

      <Form-item label="背景图片" prop="poster" class="ivu-form-item-required -c-form-item -c-border" v-if="addInfo.operate == '1'">
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

        <span class="-c-tips">图片尺寸不低于640x1008px 图片大小：500K以内</span>
        <div class="-c-course-wrap" v-if="backImgUrl">
          <div class="-c-course-item">
            <img :src="backImgUrl">
          </div>
        </div>
      </Form-item>

      <Form-item label="题干图片" prop="poster" class="ivu-form-item-required -c-form-item -c-border"
                 v-if="addInfo.operate == '2'">
        <Upload
          style="display: inline-block"
          :action="baseUrl"
          :show-upload-list="false"
          :max-size="500"
          :on-success="handleSuccessStem"
          :on-exceeded-size="handleSize"
          :on-error="handleErr">
          <Button ghost type="primary">上传图片</Button>
        </Upload>
        <span class="-c-tips">图片尺寸不低于640x238px 图片大小：200K以内</span>
        <div class="-c-course-wrap" v-if="stemImgUrl">
          <div class="-c-course-item">
            <img :src="stemImgUrl">
          </div>
        </div>
      </Form-item>

      <Form-item label="上传音频" prop="audioUrl" class="ivu-form-item-required -c-form-item">
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
          </div>
        </div>
      </Form-item>

      <Form-item label="自动播放" prop="autoPlay" class="ivu-form-item-required -c-form-item">
        <Radio-group v-model="addInfo.autoPlay">
          <Radio :label=0>否</Radio>
          <Radio :label=1>是</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="音频进度" prop="speed" class="ivu-form-item-required -c-form-item">
        <Radio-group v-model="addInfo.speed">
          <Radio :label=0>不可控制</Radio>
          <Radio :label=1>可控制</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="完成条件" prop="playComplete" class="ivu-form-item-required -c-form-item -c-border">
        <Radio-group v-model="addInfo.playComplete">
          <Radio :label=0>无条件</Radio>
          <Radio :label=1>音频播放完成</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="选择选项" prop="showMode" class="ivu-form-item-required -c-form-item" v-if="addInfo.operate == '2'">
        <div v-for="(item,index) of optionList" class="-item-select-wrap">
          <span class="-s-width">选项{{optionLetter[index]}}</span>
          <Input class="-s-width" v-model="item.value" type="textarea" :autosize="true" placeholder="请输入选择题干"
                 :maxlength="40" style="width: 300px"/>
          <span class="-s-width">文字字数不超过40字</span>
          <Checkbox v-model="item.isChecked" @on-change="changeCheck(index)">设为答案</Checkbox>
          <span class="-s-width -s-color g-cursor" @click="delOption(index)">删除</span>
        </div>
        <div class="-form-btn g-cursor" v-if="optionList.length < 5" @click="addOption">+ 新增选项</div>
      </Form-item>

      <Form-item label="完成条件" prop="answerComplete" class="ivu-form-item-required -c-form-item -c-border"
                 v-if="addInfo.operate == '2'">
        <Radio-group v-model="addInfo.answerComplete">
          <Radio :label=1>无条件</Radio>
          <Radio :label=2>选择任意选项</Radio>
          <Radio :label=3>选择正确选项</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="展示逻辑" prop="showMode" class="ivu-form-item-required -c-form-item -c-border"
                 v-if="addInfo.operate == '2'">
        <Radio-group v-model="addInfo.showMode">
          <Radio :label=1>同时展示</Radio>
          <Radio :label=2>顺序展示（依赖模块完成条件）</Radio>
        </Radio-group>
      </Form-item>

      <Form-item label="翻页逻辑" prop="turn" class="ivu-form-item-required -c-form-item -c-border">
        <Radio-group v-model="addInfo.turn">
          <Radio :label=1>可直接翻页</Radio>
          <Radio :label=2>全部模块完成后可翻页</Radio>
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
    props: ['type', 'dataObj'],
    components: {Loading},
    data() {
      return {
        isID: '',
        isShowEdit: false,
        isSending: false,
        isFetching: false,
        dataList: [],
        baseUrl: `${getBaseUrl()}/common/uploadPublicFile`, // 公有 （图片）
        baseUrlVa: `${getBaseUrl()}/common/uploadPrivateFile`, //私有地址 （音视频）
        playAudioUrl: '',
        gifImgUrl: '',
        backImgUrl: '',
        stemImgUrl: '',
        optionLetter: ['A', 'B', 'C', 'D', 'E'],
        optionList: [],
        audioType: ['mp3', 'wma', 'arm'],
        addInfo: {
          lessonId: this.$route.query.lessonId,
          contentType: this.type,
          operate: 1, //类型（读课文，单选题）
          audioUrl: '', //音频路径
          playComplete: '', //完成条件
          answerComplete: '', //完成条件
          turn: '', //翻译逻辑
          autoPlay: '', //自动播放
          speed: '', //音频进度
          showMode: '', //展示逻辑
          topicOption: '', //选择题目
          content: {
            gifImg: '',
            backImg: '',
            stemImg: ''
          } // 图片存储
        }
      }
    },

    mounted() {
      if (this.dataObj) {

        this.addInfo = {
          ...this.dataObj
        }

        this.addInfo.autoPlay = this.addInfo.autoPlay ? 1 : 0
        this.addInfo.playComplete = this.addInfo.playComplete ? 1 : 0
        this.addInfo.speed = this.addInfo.speed ? 1 : 0
        this.addInfo.topicOption.length && (this.optionList = JSON.parse(this.addInfo.topicOption))
        this.addInfo.content = JSON.parse(this.addInfo.content)
        this.playAudioUrl = this.addInfo.audioPlayUrl
        this.gifImgUrl = this.addInfo.content.gifImg
        this.backImgUrl = this.addInfo.content.backImg
        this.stemImgUrl = this.addInfo.content.stemImg
      }

      console.log(this.addInfo)
    },
    methods: {
      changeCheck(idx) {
        this.optionList.forEach((item, index) => {
          if (idx != index) {
            item.isChecked = false
          }
        })
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
        let isPass = ''
        let paramUrl = ''

        if (this.addInfo.operate == '2' && this.optionList.length) {
          isCheck = this.optionList.some(item => {
            return item.isChecked == true
          })
        }

        if (this.addInfo.operate == '2' && this.optionList.length) {
          isPass = this.optionList.every(item => {
            return (item.value != '' && item.value.length <= 40)
          })
        }

        if (!this.addInfo.operate) {
          return this.$Message.error('请选择模板样式')
        } else if (this.addInfo.operate == '1' && !this.backImgUrl) {
          return this.$Message.error('请上传背景图片')
        } else if (this.addInfo.operate == '2' && !this.stemImgUrl) {
          return this.$Message.error('请上传题干图片')
        } else if (!this.addInfo.audioUrl) {
          return this.$Message.error('请上传音频内容')
        } else if (this.addInfo.autoPlay === '') {
          return this.$Message.error('请选择是否自动播放')
        } else if (this.addInfo.speed === '') {
          return this.$Message.error('请选择音频进度')
        } else if (this.addInfo.playComplete === '') {
          return this.$Message.error('请选择完成条件')
        } else if (this.addInfo.operate == '2' && !this.addInfo.showMode) {
          return this.$Message.error('请选择展示逻辑')
        } else if (this.addInfo.operate == '2' && (!this.optionList.length || !isPass)) {
          return this.$Message.error('选择题目不能为空或字数不能超过40字')
        } else if (this.addInfo.operate == '2' && !isCheck) {
          return this.$Message.error('请设置正确的单选题答案')
        } else if (this.addInfo.operate == '2' && this.addInfo.answerComplete === '') {
          return this.$Message.error('请选择选择题的完成条件')
        } else if (!this.addInfo.turn) {
          return this.$Message.error('请选择翻页逻辑')
        }

        if (this.addInfo.operate == '1') {
          this.addInfo.content.gifImg = this.gifImgUrl
          this.addInfo.content.backImg = this.backImgUrl
        } else {
          this.addInfo.topicOption = JSON.stringify(this.optionList)
          this.addInfo.content.stemImg = this.stemImgUrl
        }

        this.addInfo.content = JSON.stringify(this.addInfo.content)

        paramUrl = this.addInfo.id ? this.$api.slide.updateCheckpoint(this.addInfo) : this.$api.slide.addContent(this.addInfo)
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
          this.gifImgUrl = res.resultData.url
        }
      },
      handleSuccessBack(res) {
        if (res.code === 200) {
          this.backImgUrl = res.resultData.url
        }
      },
      handleSuccessStem(res) {
        if (res.code === 200) {
          this.stemImgUrl = res.resultData.url
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
        .-c-course-item {
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
  }
</style>
