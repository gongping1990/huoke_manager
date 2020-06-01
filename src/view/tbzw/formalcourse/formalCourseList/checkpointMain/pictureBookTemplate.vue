<template>
  <div class="p-pictureBookTemplate">

    <div class="p-pictureBookTemplate-tab">
      <Radio-group v-model="levelType" type="button" @on-change="changeRadio">
        <Radio :label=1>音频({{audioNum}})</Radio>
        <Radio :label=2>页面({{questionNum}})</Radio>
      </Radio-group>
    </div>

    <div class="p-pictureBookTemplate-wrap" v-show="levelType===1">
      <Form :model="videoInfo" :label-width="80" class="-wrap-audio">
        <FormItem label="页面音频" class="ivu-form-item-required">
          <upload-audio v-model="videoInfo.contentUrl " :option="uploadAudioOption"></upload-audio>
        </FormItem>
      </Form>

      <div class="-wrap-footer g-flex-j-sa">
        <div @click="submitAudio()" class="g-primary-btn ">确认</div>
      </div>
    </div>

    <div class="p-pictureBookTemplate-wrap" v-show="levelType===2">
      <div class="-wrap-top">
        <div class="-c-item" v-for="(item, index) of dataList" :key="index">
          <div class="-c-point" :class="{'g-primary-btn': dataItem.id === item.id}" @click="toCheckBtn(item,index)">
            [{{item.answerMinute}}: {{item.answerSecond}}]
          </div>
          <Icon v-if=" dataItem.id === item.id" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                @click="delCheckpoint(item)"/>
        </div>
        <Button @click="openModal()" ghost type="primary" class="-c-btn">添加页面</Button>
      </div>

      <div class="-wrap-down" v-show="isShowFormItem">
        <Form :model="addInfo" :label-width="120">
          <FormItem label="展示时间" class="ivu-form-item-required">
            <Input class="-s-b-width" v-model="addInfo.answerMinute" type="text" placeholder="请输入答题时间（分）"/>分&ensp;
            <Input class="-s-b-width" v-model="addInfo.answerSecond" type="text" placeholder="请输入答题时间（分）"/>秒
          </FormItem>
          <Form-item label="页面图片" class="ivu-form-item-required">
            <upload-img v-model="addInfo.imgUrl" :option="uploadOption"></upload-img>
          </Form-item>
        </Form>
      </div>

      <div class="-wrap-footer g-flex-j-sa" v-show="isShowFormItem">
        <Button @click="closeModal()" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitInfo()" class="g-primary-btn ">确认</div>
      </div>

    </div>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import ChoiceQuestionTwo from "../choiceQuestionTwo";
  import UploadImg from "../../../../../components/uploadImg";
  import UploadAudio from "../../../../../components/uploadAudio";

  export default {
    name: 'pictureBookTemplate',
    components: {UploadAudio, UploadImg, ChoiceQuestionTwo, Loading},
    data() {
      return {
        uploadAudioOption: {
          tipText: '音频格式：mp3、wma、arm 音频大小：150M以内',
          size: 153600,
          format: ['mp3', 'wma', 'arm', 'mpeg']
        },
        uploadOption: {
          tipText: '只能上传jpg/png文件，且不超过500kb',
          size: 500
        },
        dataList: [],
        dataItem: {},
        addInfo: {},
        videoInfo: {},
        audioNum: 0,
        questionNum: 0,
        levelType: 1,
        pointId: '',
        isShowFormItem: false,
        isFetching: false,
        isSending: false
      };
    },
    mounted() {
    },
    methods: {
      initData (data) {
        data && (this.pointId = data.id)
        this.videoInfo = data
        this.audioNum = data.contentUrl ? 1 : 0
        this.questionNum = data.problemNum
        this.levelType = 1
      },
      changeRadio() {
        this.levelType === 2 && this.getList()
        this.closeModal()
      },
      closeModal() {
        this.dataItem = ''
        this.isShowFormItem = false
      },
      toCheckBtn(data) {
        this.dataItem = data
        this.addInfo = JSON.parse(JSON.stringify(data))
        this.addInfo.answerMinute = parseInt(this.addInfo.answerPoint / 60)
        this.addInfo.answerSecond = this.addInfo.answerPoint % 60
        this.isShowFormItem = true
        this.$forceUpdate()
      },
      delCheckpoint(data) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwLesson.removeIllustrationBookById({
              ibookId: data.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success('删除成功')
                  this.getList()
                  this.openModal()
                }
              })
          }
        })
      },
      openModal() {
        this.dataItem = ''
        this.isShowFormItem = true
        this.addInfo = {
          pointId: this.pointId,
          imgUrl: '',
          vfUrl: ''
        }
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.tbzwLesson.listIllustrationBook({
          pointId: this.pointId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.dataList.forEach(item=>{
                item.answerMinute = parseInt(item.answerPoint / 60) > 9 ? parseInt(item.answerPoint / 60) : `0${parseInt(item.answerPoint / 60)}`
                item.answerSecond = (item.answerPoint % 60) > 9 ? item.answerPoint % 60 : `0${item.answerPoint % 60}`
              })
              this.questionNum = this.dataList.length
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitAudio () {
        if (!this.videoInfo.contentUrl) {
          return this.$Message.error('请上传页面音频')
        }

        this.$api.tbzwLesson.saveCheckPointVideo({
          id: this.videoInfo.id,
          contentUrl: this.videoInfo.contentUrl
        })
          .then(response => {
            if (response.data.code == '200') {
              // this.getList()
              // this.openModal()
              this.audioNum = 1
              this.$Message.success('操作成功');
            }
          })
      },
      submitInfo() {
        if (!this.addInfo.answerMinute || !this.addInfo.answerSecond) {
          return this.$Message.error('请输入完整展示时间')
        } else if (!this.addInfo.imgUrl) {
          return this.$Message.error('请选择页面图片')
        }
        this.addInfo.answerPoint = (+this.addInfo.answerMinute * 60) + (+this.addInfo.answerSecond)
        this.$api.tbzwLesson.saveIllustrationBook({
          answerPoint: this.addInfo.answerPoint,
          id: this.addInfo.id,
          imgUrl: this.addInfo.imgUrl,
          pointId: this.addInfo.pointId
        })
          .then(response => {
            if (response.data.code == '200') {
              this.getList()
              this.openModal()
              this.$emit('updateNav')
              this.$Message.success('操作成功');
            }
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-pictureBookTemplate {
    padding: 30px 0;

    &-tab {
      padding: 0 30px 30px;
      text-align: left;
      border-bottom: 1px solid #ebebeb;
    }

    &-modal {
      margin-left: 60px;

      .-modal-radio {
        margin: 20px 0;
        width: 48%;
      }
    }

    &-wrap {
      text-align: left;

      .-wrap-audio {
        padding: 30px 30px 0 30px;
      }

      .-wrap-top {
        display: flex;
        align-items: center;
        padding: 30px;
        border-bottom: 1px solid #ebebeb;
      }

      .-wrap-down {
        margin: 40px 0 20px;

        .-s-b-width {
          margin-right: 10px;
          width: 27%
        }
      }

      .-c-item {
        position: relative;
        /*width: 75px;*/
        display: inline-block;
        margin: 0px 10px 10px 0;

        &-icon {
          color: #5444E4;
          position: absolute;
          top: -12px;
          right: -10px;
        }

        .-c-point {
          padding: 5px 15px 6px;
          border-radius: 4px;
          text-align: center;
          border: 1px solid #EBEBEB;
          width: 100%;
          height: inherit;
          line-height: inherit;
          cursor: pointer;
        }
      }

      .-c-btn {
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .-wrap-footer {
        width: 50%;
        margin: 20px 0;
      }
    }
  }
</style>
