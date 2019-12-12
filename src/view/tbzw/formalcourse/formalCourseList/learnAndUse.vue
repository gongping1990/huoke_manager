<template>
  <div class="p-learnAndUse">
    <Card>
      <div class="p-learnAndUse-wrap">
        <div>
          <div class="-c-item" v-for="(item, index) of dataList" :key="index">
            <div class="-c-point" :class="{'g-primary-btn': dataItem.id === item.id}" @click="toCheckBtn(item,index)">
              {{item.name}}
            </div>
            <Icon v-if=" dataItem.id === item.id" class="-c-item-icon g-cursor" size="20" type="md-close-circle"
                  @click="delCheckpoint(item)"/>
          </div>
          <Button @click="openModal(1)" ghost type="primary" class="-c-btn">+添加题目</Button>
          <Button @click="openModal(2)" ghost type="primary" class="-c-btn">题目排序</Button>
        </div>

        <div v-show="isShowFormItem">
          <choice-question-two ref="childOne"
                               :type="modelChildType"
                               :length="dataList.length"
                               :isChildEdit="!isEdit"
                               :childList="choiceList"
                               @submitChoice="submitChoice"
                               @cancelChoice="cancelChoice"></choice-question-two>
        </div>
      </div>
    </Card>

    <Modal
      class="p-learnAndUse"
      v-model="isOpenModal"
      @on-cancel="isOpenModal = false"
      title="拖拽排序">
      <div class="p-learnAndUse-wrap">
        <draggable v-model="sortList">
          <div v-for="(item,index) in sortList" :key="index" class="-c-item">
            <div class="-c-point">
              {{item.name}}
            </div>
          </div>
        </draggable>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <Button @click="isOpenModal = false" ghost type="primary" style="width: 100px;">取 消</Button>
        <div @click="submitSort()" class="g-primary-btn" style="line-height: 40px"> {{isSending ? '提交中...' : '确 认'}}
        </div>
      </div>
    </Modal>

    <Modal
      class="p-learnAndUse"
      v-model="isOpenModalRadio"
      @on-cancel="isOpenModalRadio = false"
      :closable="false"
      :mask-closable="false"
      title="选择题型">
      <div class="p-learnAndUse-modal">
        <Radio-group v-model="modelRadioType" @on-change="changeModelType">
          <Radio class="-modal-radio" :label=1>选择题（题干含图片）</Radio>
          <Radio class="-modal-radio" :label=2>选择题（选项含图片）</Radio>
          <Radio class="-modal-radio" :label=3>组词造句（题干含图片）</Radio>
          <Radio class="-modal-radio" :label=4>组词造句（选项含图片）</Radio>
        </Radio-group>
      </div>
      <div slot="footer" class="g-flex-j-sa">
        <div @click="submitRadio()" class="g-primary-btn" style="line-height: 40px"> {{isSending ? '提交中...' : '确 认'}}
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {getBaseUrl} from "@/libs/index";
  import Loading from "@/components/loading";
  import draggable from 'vuedraggable'
  import ChoiceQuestionTwo from "./choiceQuestionTwo";

  export default {
    name: 'tbzw_formal_learnAndUse',
    components: {ChoiceQuestionTwo, Loading, draggable},
    data() {
      return {
        baseUrl: `${getBaseUrl()}/sch/common/uploadPublicFile`, // 公有 （图片）
        dataList: [],
        dataItem: {},
        addInfo: {},
        choiceList: [],
        sortList: [],
        modelRadioType: '',
        modelChildType: '',
        isEdit: false,
        isOpenModal: false,
        isOpenModalRadio: false,
        isShowFormItem: false,
        isSending: false
      };
    },
    mounted() {
      this.getListByLessonQuestion()
    },
    methods: {
      changeModelType() {
        this.modelChildType = JSON.parse(JSON.stringify(this.modelRadioType))
      },
      toCheckBtn(data) {
        this.dataItem = JSON.parse(JSON.stringify(data))
        this.modelRadioType = ''
        this.modelChildType = data.qetype
        this.isEdit = true
        this.isShowFormItem = true
        this.choiceList = [data];
        this.choiceList.forEach(list => {
          list.answerMinute = parseInt(list.answerPoint / 60)
          list.answerSecond = list.answerPoint % 60
          list.publishMinute = parseInt(list.publishPoint / 60)
          list.publishSecond = list.publishPoint % 60
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
            this.$api.composition.removeLessonQuestion({
              questionId: data.id
            }).then(
              response => {
                if (response.data.code == "200") {
                  this.$Message.success('删除成功')
                  this.getListByLessonQuestion()
                }
              })
          }
        })
      },
      openModal(num) {
        if (num === 2) {
          this.isOpenModal = true
          this.sortList = JSON.parse(JSON.stringify(this.dataList))
        } else {
          this.isOpenModalRadio = true
        }
      },
      backCancel() {
        this.isEdit = !this.isEdit
      },
      submitChoice(data) {
        this.choiceList = data || []
        this.submitInfo()
      },
      submitSort() {
        this.dataItem = {}
        let array = []
        this.sortList.forEach(item=>{
          array.push(item.id)
        })
        this.$api.tbzwLesson.sortByLessonQuestion(array)
          .then(response => {
            if (response.data.code == '200') {
              this.isOpenModal = false
              this.getListByLessonQuestion()
              this.$Message.success('操作成功');
            }
          })
      },
      submitRadio() {
        if (!this.modelRadioType) {
          return this.$Message.error('请选择题型')
        }
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
      getListByLessonQuestion() {
        this.isFetching = true
        this.$api.composition.listByLessonQuestion({
          type: 1,
          lessonId: this.$route.query.lessonId
        })
          .then(
            response => {
              this.dataList = response.data.resultData;
            })
          .finally(() => {
            this.isFetching = false
          })
      },
      submitInfo() {
        let isCheckQuestion = true
        let isCheckName = true
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
        let typeOT = this.modelChildType === 1 || this.modelChildType === 2
        let typeTF = this.modelChildType === 3 || this.modelChildType === 4

        this.choiceList.forEach(item => {
          if (item.answerMinute === '' || item.answerSecond === '' || !item.answerTime || item.publishMinute === '' || item.publishSecond === '') {
            isCheckQuestion = false
          }

          if (!item.name) {
            isCheckName = false
          }

          if (!item.optionJson.length) {
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
              choiceSelectList.push(list.sortNum)
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
            return list === ''
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
        } else if (!isCheckOptionBool && typeOT) {
          return this.$Message.error('请选择一个正确的答案')
        } else if (!isCheckOptionOK) {
          return this.$Message.error('选项不能有空')
        } else if ((this.choiceList[0].optionJson.length !== 2) && typeOT) {
          return this.$Message.error('选择题必须且只能有2个选项')
        } else if (isCheckSelectNull && typeTF) {
          return this.$Message.error('组词造句顺序不能为空')
        } else if (isCheckSelectRepeat && typeTF) {
          return this.$Message.error('组词造句顺序不能重复')
        }

        choiceDataList = JSON.parse(JSON.stringify(this.choiceList))

        choiceDataList.forEach(item => {
          item.answerPoint = (+item.answerMinute * 60) + (+item.answerSecond)
          item.publishPoint = (+item.publishMinute * 60) + (+item.publishSecond)
          item.optionJson = JSON.stringify(item.optionJson)
          delete item.answerMinute
          delete item.answerSecond
          delete item.publishMinute
          delete item.publishSecond
        })

        this.$api.tbzwLesson.editQuestion({
          lessonId: this.$route.query.lessonId,
          type: 1,
          ...choiceDataList[0]
        })
          .then(response => {
            if (response.data.code == '200') {
              this.initChildQuestion()
              this.getListByLessonQuestion()
              this.$Message.success('操作成功');
            }
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .p-learnAndUse {

    &-modal {
      margin-left: 60px;

      .-modal-radio {
        margin: 20px 0;
        width: 48%;
      }
    }

    &-wrap {
      text-align: left;

      .-wrap-title {
        margin: 20px 0;
      }

      .-c-item {
        position: relative;
        /*width: 75px;*/
        display: inline-block;
        margin: 10px 10px 10px 0;

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
          cursor: pointer;
        }
      }

      .-c-btn {
        margin-right: 10px;
      }
    }
    .g-primary-btn {
      height: auto;
      line-height: normal;
    }
  }
</style>
