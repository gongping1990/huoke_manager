<template>
  <div class="p-levelSetting">
    <div class="p-levelSetting-top">
      <Radio-group v-model="levelType" type="button" @on-change="changeRadio">
        <Radio :label=1>视频({{audioNum}})</Radio>
        <Radio :label=2>题目({{questionNum}})</Radio>
      </Radio-group>
    </div>
    <div class="p-levelSetting-wrap" v-show="levelType===1">
      <video-template ref="childTwo"></video-template>
    </div>
    <div class="p-levelSetting-wrap" v-show="levelType===2">
      <div class="-wrap-top">
        <div class="-c-item" v-for="(item, index) of dataList" :key="index">
          <div class="-c-point" :class="{'g-primary-btn': dataItem.id === item.id}" @click="toCheckBtn(item,index)">
            [{{item.answerMinute}}: {{item.answerSecond}}] {{item.subject}}
          </div>
          <img class="-c-item-tip" :src="tipObj[item.type]"/>
          <Icon v-if=" dataItem.id === item.id" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                @click="delCheckpoint(item)"/>
        </div>
        <Button @click="openModal(1)" ghost type="primary" class="-c-btn">添加题目</Button>
      </div>

      <div class="-wrap-down" v-show="isShowFormItem">
        <choice-question-three ref="childOne"
                               :type="modelChildType"
                               :childList="choiceList"
                               @submitChoice="submitChoice"
                               @cancelChoice="cancelChoice">
        </choice-question-three>
      </div>
    </div>

    <Modal
      class="p-levelSetting"
      v-model="isOpenModalRadio"
      @on-cancel="isOpenModalRadio = false"
      title="选择题型">
      <div class="p-levelSetting-modal">
        <Radio-group v-model="modelRadioType">
          <Radio class="-modal-radio" :label=1>录音题</Radio>
          <Radio class="-modal-radio" :label=2>选择题（选项含图片）</Radio>
          <Radio class="-modal-radio" :label=3>连线题（选项含图片）</Radio>
        </Radio-group>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModalRadio = false" ghost type="primary" style="width: 100px;">取消</Button>
        <div @click="submitRadio()" class="g-primary-btn" style="line-height: 40px">确认</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import UploadVideo from "../../../../../components/uploadVideo";
  import VideoTemplate from "./videoTemplate";
  import ChoiceQuestionThree from "./choiceQuestionThree";

  export default {
    name: 'videoInteractionTemplate',
    components: {ChoiceQuestionThree, VideoTemplate, UploadVideo, Loading},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        levelType: 1,
        dataList: [],
        tipObj: {
          '1': require('@/assets/images/guanka/lu1.png'),
          '2': require('@/assets/images/guanka/x1.png'),
          '3': require('@/assets/images/guanka/l1.png')
        },
        dataItem: {},
        addInfo: {},
        queryInfo: '',
        choiceList: [],
        modelRadioType: '',
        modelChildType: '',
        audioNum: 0,
        questionNum: 0,
        isEdit: false,
        isOpenModalRadio: false,
        isShowFormItem: false
      };
    },
    mounted() {},
    methods: {
      initData (data) {
        this.queryInfo = data
        this.audioNum = this.queryInfo.contentUrl ? 1 : 0
        this.questionNum = this.queryInfo.problemNum
        this.levelType = 1
        this.$refs.childTwo.getList(data)
      },
      changeRadio () {
        this.levelType === 2 && this.getList()
      },
      // changeModelType () {
      //   localStorage.setItem('modelChildChoice', this.modelRadioType)
      //
      // },
      toCheckBtn(data) {
        this.dataItem = JSON.parse(JSON.stringify(data))
        this.modelChildType = data.type
        this.modelRadioType = ''
        this.isEdit = true
        this.isShowFormItem = true
        this.choiceList = [this.dataItem];
        this.choiceList.forEach(list => {
          list.answerMinute = parseInt(list.answerPoint / 60)
          list.answerSecond = list.answerPoint % 60
        })
        setTimeout(() => {
          this.$refs.childOne.init()
        }, 0)

        this.$forceUpdate()
      },
      delCheckpoint(data) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认要删除吗？',
          onOk: () => {
            this.$api.tbzwLesson.removeProblemById({
              problemId: data.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success('删除成功')
                  this.getList()
                  this.$emit('updateNav')
                }
              })
          }
        })
      },
      openModal() {
        this.isOpenModalRadio = true
        this.modelRadioType = ''
      },
      backCancel() {
        this.isEdit = !this.isEdit
      },
      submitChoice(data) {
        this.choiceList = data || []
        this.submitInfo()
      },
      submitRadio() {
        if (!this.modelRadioType) {
          return this.$Message.error('请选择题型')
        }
        this.modelChildType = this.modelRadioType
        this.isEdit = true
        this.isShowFormItem = true
        this.isOpenModalRadio = false
        this.initChildQuestion()
      },
      initChildQuestion() {
        this.dataItem = {}
        this.choiceList = []
        setTimeout(() => {
          this.$refs.childOne.init()
        }, 0)
      },
      cancelChoice () {
        this.isEdit = false
        this.isShowFormItem = false
        this.initChildQuestion()
      },
      //分页查询
      getList() {
        this.isFetching = true
        this.$api.tbzwLesson.listProblem({
          pointId: this.queryInfo.id
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
              this.questionNum = this.dataList.length
              this.dataList.forEach(item=>{
                item.answerMinute = parseInt(item.answerPoint / 60) > 9 ? parseInt(item.answerPoint / 60) : `0${parseInt(item.answerPoint / 60)}`
                item.answerSecond = (item.answerPoint % 60) > 9 ? item.answerPoint % 60 : `0${item.answerPoint % 60}`
              })
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        let isCheckQuestion = true
        let isCheckName = true
        let isCheckImgUrl = true
        let isCheckOptionBool = false
        let isCheckoptionJsonLength = true
        let isCheckOptionOK = false
        let checkOptionStatus = []
        let checkOptionBoolStatus = []
        let choiceDataList = []
        let choiceSelectList = []
        let isCheckRightAudio = true
        let isCheckErrorAudio = true
        let isCheckSelectRepeat = false // 检测组词造句选项是否有重复的
        let isCheckSelectNull = false // 检测组词造句选项是否有空的
        this.choiceList.forEach(item => {
          if (item.answerMinute === '' || item.answerSecond === '' || !item.answerTime) {
            isCheckQuestion = false
          }

          if (!item.subject) {
            isCheckName = false
          }

          if (!item.imgUrl) {
            isCheckImgUrl = false
          }

          if (!item.optionJson.length && this.modelChildType !== 1) {
            isCheckoptionJsonLength = false
          }

          if (item.optionJson.length) {
            isCheckOptionBool = item.optionJson.some(list => {
              return list.checked == true
            })

            isCheckOptionOK = item.optionJson.every(list => {
              return list.value != ''
            })

            item.optionJson.forEach(list => {
              choiceSelectList.push(list.links)
            })
            console.log(choiceSelectList)
            checkOptionStatus.push(isCheckOptionOK)
            checkOptionBoolStatus.push(isCheckOptionBool)
          }

          isCheckOptionBool = checkOptionBoolStatus.every(list => {
            return list
          })

          isCheckOptionOK = checkOptionStatus.every(list => {
            return list
          })

          if (!item.rightAudio) {
            isCheckRightAudio = false
          }

          if (!item.errorAudio) {
            isCheckErrorAudio = false
          }

          isCheckSelectNull = choiceSelectList.some(list => {
            return !list
          })

          if (new Set(choiceSelectList).size !== choiceSelectList.length) {
            isCheckSelectRepeat = true
          }

        })

        if (!isCheckName) {
          return this.$Message.error('请输入题目')
        } else if (!this.choiceList.length) {
          return this.$Message.error('请新增题目')
        } else if (!isCheckQuestion) {
          return this.$Message.error('请填写完整的答题字段')
        } else if (!isCheckoptionJsonLength) {
          return this.$Message.error('请新增选项')
        } else if (!isCheckOptionBool && this.modelChildType === 2) {
          return this.$Message.error('请选择一个正确的答案')
        } else if (!isCheckOptionOK && this.modelChildType !== 1) {
          return this.$Message.error('选项不能有空')
        } else if (this.choiceList[0].optionJson.length < 2 && this.modelChildType === 2) {
          return this.$Message.error('选择题选项不少于2个')
        } else if (this.choiceList[0].optionJson.length < 2 && this.modelChildType === 3) {
          return this.$Message.error('连线题选项不少于4个')
        } else if (!isCheckImgUrl && this.modelChildType === 1) {
          return this.$Message.error('请上传录音提示')
        } else if (isCheckSelectNull && this.modelChildType === 3) {
          return this.$Message.error('请选择相应连线题关联')
        } else if (isCheckSelectRepeat && this.modelChildType === 3) {
          return this.$Message.error('连线题关联不能重复')
        }

        choiceDataList = JSON.parse(JSON.stringify(this.choiceList))

        choiceDataList.forEach(item => {
          item.answerPoint = (+item.answerMinute * 60) + (+item.answerSecond)
          item.optionJson = JSON.stringify(item.optionJson.concat(item.optionJsonTwo))
          delete item.answerMinute
          delete item.answerSecond
          delete item.duration
          delete item.authVfUrl
          delete item.optionJsonTwo
          delete item.leftJson
          delete item.rigthJson

          if (this.modelChildType === 1 ) {
            delete item.optionJson
          }

          if (this.modelChildType !== 1) {
            delete item.imgUrl
          }
        })

        this.$api.tbzwLesson.saveProblem({
          id: this.dataItem.id,
          pointId: this.queryInfo.id,
          type: this.modelChildType,
          ...choiceDataList[0]
        })
          .then(response => {
            if (response.data.code == '200') {
              this.initChildQuestion()
              this.getList()
              this.$emit('updateNav')
              this.$Message.success('操作成功');
            }
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-levelSetting {
    padding-top: 30px;

    &-top {
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

      .-wrap-top {
        display: flex;
        align-items: center;
        flex-flow: wrap;
        padding: 30px 0 20px 30px;
        border-bottom: 1px solid #ebebeb;
      }

      .-wrap-down {
        padding: 0 20px;
      }

      .-c-item {
        position: relative;
        /*width: 75px;*/
        display: inline-block;
        margin: 8px 20px 20px 0;

        &-icon {
          color: #5444E4;
          position: absolute;
          top: -12px;
          right: -10px;
        }

        &-tip {
          text-align: center;
          position: absolute;
          top: -10px;
          left: -10px;
          font-size: 12px;
          width: 18px;
          height: 18px;
        }

        .-c-point {
          padding: 5px 15px 6px;
          border-radius: 4px;
          text-align: center;
          border: 1px solid #EBEBEB;
          width: 100%;
          cursor: pointer;
        }
      }

      .-c-btn {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
    .g-primary-btn {
      height: auto;
      line-height: normal;
    }
  }
</style>
